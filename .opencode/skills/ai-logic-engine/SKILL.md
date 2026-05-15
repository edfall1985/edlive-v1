# AI Logic Engine Skill

## Description
Skill untuk AI logic dalam analisis debat, fallacies detection, dan summarization.

## Features

### 1. Argument Analysis
- Parse argument text
- Identify claims and evidence
- Evaluate logical structure
- Rate strength (1-100)

### 2. Fallacy Detection
Menggunakan pattern matching dan NLP untuk mendeteksi:
- Ad Hominem: "Orang itu tidak bisa dipercaya karena..."
- Strawman: Memposisikan argumen yang tidak sejalan
- False Dilemma: "Kita harus memilih A atau B"
- Circular Reasoning: Penyebab sama dengan akibat
- Whataboutism: Mengalihkan ke topik lain
- Red Herring: Mengalihkan perhatian
- Slippery Slope: "Kalau A maka Z"
- Appeal to Authority: Hanya mengandalkan otoritas
- Bandwagon: "Semua orang setuju"

### 3. AI Summary Generation
Generate ringkasan yang mencakup:
- Poin pro utama
- Poin kontra utama
- Fallacies yang terdeteksi
- Kesimpulan netral
- Key data points

### 4. Sentiment Analysis
Analisis sentiment komentar:
- Positive / Negative / Neutral
- Intensity score
- Key emotions

## Usage
```python
from ai_logic import analyze, detect_fallacy, summarize

# Analyze argument
result = analyze("Indonesia perlu keluar WTO karena...")

# Detect fallacy
fallacy = detect_fallacy("Anda tidak bisa dipercaya, jadi argumen Anda salah")

# Generate summary
summary = summarize(arguments)
```

## Provider Integration
- OpenAI (GPT-4)
- Gemini Pro
- Groq (Llama)

## API Schema
```json
{
  "analyze": {
    "input": "string",
    "output": {"strength": "number", "claims": [], "evidence": []}
  },
  "detect-fallacy": {
    "input": "string", 
    "output": {"fallacy": "string|null", "confidence": "number"}
  },
  "summarize": {
    "input": "arguments[]",
    "output": {"pro": [], "kontra": [], "fallacies": [], "conclusion": "string"}
  }
}
```