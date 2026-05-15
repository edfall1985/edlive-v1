# Debate Flow System Skill

## Description
Skill untuk management flow debat, sesi, dan timer secara real-time.

## Session Structure

### Session 1: Viewer Session
- **Purpose**: Membangun engagement dan energi live
- **Character**: Ramai, santai, cepat, provokatif
- **Activities**: Typing challenge, polling, spam challenge, viewer attack, komentar panas
- **Goal**: Meningkatkan retention, comment rate, emotional engagement

### Session 2: Education Session  
- **Purpose**: Mengubah debat menjadi pembelajaran publik
- **Character**: Serius, mendalam, argumentatif, berbasis data
- **Activities**: Opening statement, pemaparan data, logical analysis, AI summary, crossfire

### Session 3: Enjoy Session
- **Purpose**: Membangun kedekatan komunitas
- **Character**: Cair, reflektif, filosofis, humor
- **Activities**: Ngobrol bebas, cerita pengalaman, kritik sosial, insight personal

## Debate Flow

### 1. Opening
- Perkenalan host/moderator
- Pembacaan mosi
- Perkenalan participant

### 2. Opening Statement
- 5 menit per pihak
- Timer realtime
- Pro speak first, then Kontra

### 3. Crossfire
- Bebas saling potong
- Semi chaos
- MC turun jika tidak kondusif
- Duration: 10-15 menit

### 4. Viewer Challenge
- Viewer dapat:
  - Menyerang argumen
  - Mengirim pertanyaan
  - Memberi challenge

### 5. Final Statement
- Penutupan argumen
- 2-3 menit per pihak
- Timer realtime

### 6. Voting
- Kategori voting:
  - Paling logis
  - Paling emosional
  - Paling meyakinkan
  - Paling berbasis data

## Timer System
```javascript
{
  session: "viewer | education | enjoy",
  phase: "opening | statement | crossfire | challenge | final | voting",
  currentSpeaker: "speakerId",
  timeRemaining: "number (seconds)",
  isPaused: "boolean"
}
```

## Functions
- `startDebate(config)` - Inisiasi debat baru
- `switchSession(sessionName)` - Pindah sesi
- `startPhase(phaseName)` - Mulai fase
- `nextSpeaker()` - Rotate speaker
- `pause()` / `resume()` - Pause timer
- `getStatus()` - Get current status
- `endDebate()` - Selesaikan debat

## State Management
- State disimpan di Firebase Realtime / Supabase
- Update real-time ke semua clients
- Sync dengan OBS overlay