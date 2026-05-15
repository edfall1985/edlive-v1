# Live Stream Tools Skill

## Description
Skill untuk integrasi streaming dan overlay management.

## TikTok Live Integration

### Embed
```html
<iframe src="https://www.tiktok.com/embed/live/{streamId}"></iframe>
```

### Data Fetch
- Viewer count: TikTok API
- Comments: WebSocket connection
- Stream status: Polling API

## OBS Integration

### WebSocket Connection
- Protocol: obs-websocket v5
- Port: 4444
- Password: from config

### Scene Management
- Main Scene: Full debate dashboard
- Timer Scene: Timer only
- Speaker Scene: Speaker cards only
- Minimal Scene: Clean overlay

### Sources
- Browser Source (local HTTP)
- Image/Video sources
- Text sources (GDI+)
- Media source

## Overlay Components

### Timer Overlay
- Large centered display
- Progress bar
- Phase indicator

### Speaker Info Overlay
- Speaker name
- Position (PRO/KONTRA)
- Active indicator
- Avatar

### Vote Bars Overlay
- Pro bar (blue)
- Kontra bar (red)
- Percentage labels
- Total votes count

### AI Summary Popup
- Triggered on key moments
- Shows fallacy detection
- Summary highlight

### Typing Challenge Widget
- Challenge text
- Emoji spam animation
- Participation counter

## Local Server
```javascript
// Simple HTTP server for browser source
const express = require('express');
const app = express();

app.get('/overlay/timer', (req, res) => {
  res.json(timerData);
});

app.get('/overlay/speaker', (req, res) => {
  res.json(speakerData);
});

app.listen(3000);
```

## OBS WebSocket Events
```javascript
// Connect
obs.connect('ws://localhost:4444', 'password');

// Set scene
obs.call('SetCurrentProgramScene', { sceneName: 'Main' });

// Set source visibility
obs.call('SetSourceVisible', { sourceName: 'Timer', visible: true });
```

## Stream Tools
- OBS Studio
- Streamlabs
- vMix
- Wirecast

## Monitoring
- Stream health check
- Viewer count tracking
- Chat sync status
- Overlay sync status