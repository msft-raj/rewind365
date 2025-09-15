# 📘 Hackathon Digest Teams App – Frontend (React/Node)

## 🔹 Overview
This Teams app provides a **daily AI-powered digest** of:
- Important **Teams channel conversations**  
- Important **Outlook folders/emails**  

Users can **select which channels and folders matter to them**, and the app displays a summarized digest in a **Teams Tab**.

---

## 🔹 Tech Stack
- **React** (UI inside Teams Tab)  
- **TypeScript (optional but recommended)**  
- **Teams JS SDK** (to integrate tab into Teams client)  
- **Axios/Fetch** (to call Python backend APIs)  
- **Adaptive Cards** (for chat/bot notifications – optional stretch)  

---

## 🔹 App Structure
```
/frontend
  ├── public/                 # Static assets
  ├── src/
  │   ├── components/
  │   │   ├── ChannelPicker.tsx       # UI to select Teams channels
  │   │   ├── FolderPicker.tsx        # UI to select Outlook folders
  │   │   ├── DigestView.tsx          # Displays daily digest summary
  │   │   └── Loader.tsx              # Common loading spinner
  │   │
  │   ├── pages/
  │   │   ├── ConfigPage.tsx          # First-time setup (pick channels/folders)
  │   │   ├── HomePage.tsx            # Main digest display
  │   │   └── AboutPage.tsx           # Info/help
  │   │
  │   ├── services/
  │   │   ├── api.ts                  # Axios wrapper to talk to Python backend
  │   │   └── teamsContext.ts         # Teams SDK context helpers
  │   │
  │   ├── App.tsx                     # Root component with routing
  │   ├── index.tsx                   # Entry point
  │   └── theme.css / tailwind.css    # Styling
  │
  ├── package.json
  ├── tsconfig.json
  └── README.md
```

---

## 🔹 Pages & UX Flow

### 1. **Config Page** (`/config`)
- Shown when user opens the tab for the first time.  
- Two sections:  
  - **Teams Channel Picker** → list of Teams + channels (fetched via backend → Graph API). User selects checkboxes.  
  - **Outlook Folder Picker** → list of mail folders. User selects checkboxes.  
- “Save Preferences” → POST to backend (`/api/preferences`).  

### 2. **Home Page** (`/home`)
- Displays today’s digest:
  - 🔥 Urgent items first  
  - ✅ Action items  
  - 💬 General info  
- Data pulled from backend (`/api/digest`).  

### 3. **About Page** (`/about`)
- Explains what the app does, privacy note, etc.

---

## 🔹 Components

### `ChannelPicker.tsx`
- Checkbox list of Teams channels.
- Props: `channels[]`, `onSelect(channelIds[])`.

### `FolderPicker.tsx`
- Checkbox list of Outlook folders.
- Props: `folders[]`, `onSelect(folderIds[])`.

### `DigestView.tsx`
- Render list of digest items (grouped by 🔥/✅/💬).  
- Props: `digestData`.

---

## 🔹 Backend API Integration (Python)
Your React app will call backend APIs like:
- `GET /api/teams/channels` → list of channels user can pick.  
- `GET /api/outlook/folders` → list of mail folders.  
- `POST /api/preferences` → save selected channels + folders.  
- `GET /api/digest` → return summarized digest for display.  

---

## 🔹 Hackathon Demo Flow
1. User adds the Teams app (Tab).  
2. On first load → Config Page → select channels + folders.  
3. Click “Save” → preferences stored.  
4. Home Page shows “Daily Digest” pulled from Python backend.  
5. (Stretch) App sends Adaptive Card in chat with daily summary.  
