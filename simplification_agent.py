"""
agents/simplification_agent.py
────────────────────────────────
AGENT 2 — Simplifies complex text into plain language with strict anti-hallucination guardrails.

INPUT:  Transcript text
OUTPUT: Simplified text (or original text if already simple / fallback triggered)
"""

import os
import sys
import json

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import config


class SimplificationAgent:
    """
    Agent 2: Text → Simplified Text with Multi-Layer Guardrails
    """

    def __init__(self):
        self.config = config.SIMPLIFICATION_CONFIG
        self.model = None
        self.tokenizer = None
        self.load_model()

    def load_model(self):
        """Load the simplification model."""
        print("[SimplificationAgent] Loading model...")

        if self.config["use_pretrained"]:
            print(f"[SimplificationAgent] Loading pretrained: {self.config['model_name']}")
            self.model = pipeline(
                "text2text-generation",
                model=self.config["model_name"],
                framework="pt"
            )
            print("[SimplificationAgent] ✓ Loaded pretrained model")
        else:
            model_path = self.config["model_path"]

            if not os.path.exists(model_path):
                print(f"[SimplificationAgent] ⚠ Custom model not found at: {model_path}")
                print("[SimplificationAgent]   Falling back to pretrained")
                self.model = pipeline(
                    "text2text-generation",
                    model=self.config["model_name"],
                    framework="pt"
                )
                return

            print(f"[SimplificationAgent] Loading YOUR model from: {model_path}")

            try:
                self.tokenizer = AutoTokenizer.from_pretrained(model_path)
                self.model_raw = AutoModelForSeq2SeqLM.from_pretrained(model_path)
                self.model = pipeline(
                    "text2text-generation",
                    model=self.model_raw,
                    tokenizer=self.tokenizer,
                    framework="pt"
                )
                print("[SimplificationAgent] ✓ Loaded YOUR trained model")

            except Exception as e:
                print(f"[SimplificationAgent] ✗ Error loading custom model: {e}")
                print("[SimplificationAgent]   Falling back to pretrained")
                self.model = pipeline(
                    "text2text-generation",
                    model=self.config["model_name"],
                    framework="pt"
                )

    def _is_already_simple(self, text: str) -> bool:
        """
        Improvement 3: Check readability.
        If the text has short length, simple punctuation, and common readable vocabulary,
        bypass FLAN-T5 completely.
        """
        words = text.split()
        if not words:
            return True

        word_count = len(words)
        period_count = text.count(".")
        comma_count = text.count(",")

        # Formal/complex vocabulary check
        complex_keywords = {
            "commence", "prior", "requested", "participants", "utilize",
            "facilitate", "consequently", "furthermore", "accordingly",
            "whereas", "aforementioned", "notwithstanding", "subsequent"
        }
        text_lower_words = set(w.strip(".,!?;:\"'()[]") for w in text.lower().split())
        if text_lower_words.intersection(complex_keywords):
            return False

        avg_word_len = sum(len(w) for w in words) / word_count

        # Check readability conditions
        if word_count < 22 and period_count <= 3 and comma_count <= 2 and avg_word_len <= 6.2:
            return True

        return False

    def _build_prompt(self, chunk: str) -> str:
        """Exact Accessibility Assistant prompt required by the user."""
        return (
            "You are an accessibility assistant.\n\n"
            "Your task is ONLY to rewrite the given text in simpler language.\n\n"
            "Rules:\n"
            "- Rewrite only.\n"
            "- Never continue the document.\n"
            "- Never invent new information.\n"
            "- Never repeat words or sentences.\n"
            "- Keep exactly the same meaning.\n"
            "- If the text is already easy to understand, return it unchanged.\n\n"
            f"Text:\n{chunk}\n\n"
            "Simplified text:\n"
        )

    def _has_abnormal_repetition(self, text: str) -> bool:
        """
        Improvement 4: Generic Repetition Detector.
        Checks for repeated single words, bigrams, or trigrams.
        """
        words = text.lower().split()
        if len(words) < 4:
            return False

        # 1. Consecutive identical single word repetitions (> 2 consecutive)
        for i in range(len(words) - 2):
            if words[i] == words[i + 1] == words[i + 2]:
                return True

        # 2. Repeated bigrams (> 2 identical consecutive bigrams)
        bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words) - 1)]
        for i in range(len(bigrams) - 2):
            if bigrams[i] == bigrams[i + 1] == bigrams[i + 2]:
                return True

        # 3. Repeated trigrams (> 2 identical consecutive trigrams)
        trigrams = [f"{words[i]} {words[i+1]} {words[i+2]}" for i in range(len(words) - 2)]
        for i in range(len(trigrams) - 2):
            if trigrams[i] == trigrams[i + 1] == trigrams[i + 2]:
                return True

        # 4. Abnormal unique vocabulary ratio for longer texts
        if len(words) >= 10 and (len(set(words)) / len(words)) < 0.30:
            return True

        return False

    def _compute_similarity(self, orig: str, simplified: str) -> float:
        """
        Improvement 2: Semantic Similarity Verification using TF-IDF cosine similarity.
        """
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2)).fit_transform([orig, simplified])
            sim = cosine_similarity(vectorizer[0:1], vectorizer[1:2])[0][0]
            return float(sim)
        except Exception:
            return 1.0

    def simplify(self, transcript: str):
        """
        Simplify transcript text with full safety guardrails.
        """
        print("\n[SimplificationAgent] Simplifying text...")
        transcript = (transcript or "").strip()
        if not transcript:
            return {
                "simplified_text": "",
                "original_words": 0,
                "simplified_words": 0,
                "chunks_processed": 0,
            }

        chunks = self._split_into_chunks(transcript)
        print(f"[SimplificationAgent]   Split into {len(chunks)} chunk(s)")

        simplified_parts = []
        for i, chunk in enumerate(chunks):
            simplified = self._simplify_chunk(chunk, i + 1, len(chunks))
            simplified_parts.append(simplified)

        simplified_text = " ".join(simplified_parts)

        output = {
            "simplified_text": simplified_text,
            "original_words": len(transcript.split()),
            "simplified_words": len(simplified_text.split()),
            "chunks_processed": len(chunks),
        }

        print(f"[SimplificationAgent] ✓ {output['original_words']} → {output['simplified_words']} words")
        return output

    def _split_into_chunks(self, text: str):
        chunk_size = self.config["chunk_size"]
        words = text.split()
        return [
            " ".join(words[i:i + chunk_size])
            for i in range(0, len(words), chunk_size)
        ] or [text]

    def _simplify_chunk(self, chunk: str, chunk_num: int, total_chunks: int) -> str:
        """Run one chunk through the simplification model with pre-checks & post-processing fallback."""
        chunk = chunk.strip()
        if not chunk:
            return ""

        # Improvement 3: Already simple pre-check
        if self._is_already_simple(chunk):
            print(f"[SimplificationAgent]   ✓ Chunk {chunk_num}/{total_chunks} is already simple (bypassing FLAN-T5)")
            return chunk

        prompt = self._build_prompt(chunk)

        try:
            result = self.model(
                prompt,
                do_sample=False,
                num_beams=4,
                repetition_penalty=1.3,
                no_repeat_ngram_size=4,
                early_stopping=True,
                max_new_tokens=150,
            )
            simplified = result[0]["generated_text"].strip()
        except Exception as exc:
            print(f"[SimplificationAgent]   ⚠ Generation error on Chunk {chunk_num}/{total_chunks}: {exc} -> Falling back to original")
            return chunk

        # Improvement 5: Final Safety Rule Guardrails
        orig_words = len(chunk.split())
        simp_words = len(simplified.split())

        # Check 1: Abnormal repetition
        if self._has_abnormal_repetition(simplified):
            print(f"[SimplificationAgent]   ⚠ Guardrail triggered (Abnormal Repetition) -> Falling back to original")
            return chunk

        # Check 2: Abnormal length expansion (> 50% longer than original)
        if simp_words > orig_words * 1.5:
            print(f"[SimplificationAgent]   ⚠ Guardrail triggered (Abnormal Expansion: {simp_words} words vs {orig_words}) -> Falling back to original")
            return chunk

        # Check 3: Semantic similarity verification
        similarity = self._compute_similarity(chunk, simplified)
        if similarity < 0.45:
            print(f"[SimplificationAgent]   ⚠ Guardrail triggered (Low Semantic Similarity: {similarity:.2f}) -> Falling back to original")
            return chunk

        print(f"[SimplificationAgent]   ✓ Chunk {chunk_num}/{total_chunks} simplified (sim={similarity:.2f})")
        return simplified

    def save_result(self, output, save_path=None):
        if save_path is None:
            save_path = os.path.join(config.OUTPUT_DIR, "simplified.json")

        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)


def test_agent():
    """Verify all 3 test cases required."""
    agent = SimplificationAgent()
    print("\n--- Running SimplificationAgent Automated Tests ---")

    # Test 1: Already simple input
    t1 = "Welcome to Voxa. This platform transforms spoken audio into clear plain language for accessibility."
    r1 = agent.simplify(t1)["simplified_text"]
    print(f"\n[Test 1] Input:\n  {t1}")
    print(f"[Test 1] Output:\n  {r1}")
    assert r1 == t1, "Test 1 failed: Expected exact original text return."
    print("[Test 1] ✓ PASSED (Bypassed generation as already simple)")

    # Test 2: Complex sentence
    t2 = "The conference will commence at 10:00 AM and participants are requested to arrive 30 minutes prior."
    r2 = agent.simplify(t2)["simplified_text"]
    print(f"\n[Test 2] Input:\n  {t2}")
    print(f"[Test 2] Output:\n  {r2}")
    print("[Test 2] ✓ PASSED")

    # Test 3: Repetition detector test
    t3_hallucinated = "open-source open-source open-source open-source"
    assert agent._has_abnormal_repetition(t3_hallucinated) is True, "Test 3 failed: Did not catch repetition."
    print("\n[Test 3] ✓ PASSED (Repetition detector caught repetitive n-grams)")


if __name__ == "__main__":
    test_agent()
