# Synapse Shelf 📚

A lightweight Chrome extension for capturing, categorizing, and annotating academic papers without leaving your active tab.

## Features

- **📁 Domain Organization**: Create custom folders for different research areas (e.g., Quantum Computing, Neuroscience)
- **🔖 One-Click Capture**: Instantly save papers from any tab with automatic URL and title extraction
- **📝 Inline Notes**: Take notes with auto-save and slide-over panel interface
- **💾 Local Storage**: All data persists in chrome.storage.local - no backend required
- **🎨 Beautiful Design**: Clean UI following modern SaaS design principles

## Installation

### Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `SynapseShelf` folder: `c:\Users\46700\PycharmProjects\SynapseShelf`
5. The extension should now appear in your extensions list

### Open the Extension

1. Click the Synapse Shelf icon in your Chrome toolbar
2. If you don't see it, click the puzzle piece icon and pin Synapse Shelf
3. Click the extension icon to open the side panel

## Usage

### Creating Research Domains

1. Click **"Create Domain"** button
2. Enter a name (e.g., "Machine Learning", "Climate Science")
3. Click **"Create"**

### Adding Papers

1. Navigate to an academic paper in your browser (e.g., on arXiv, Nature, IEEE)
2. Open Synapse Shelf side panel
3. Click into a domain/folder
4. Click **"Add Paper"** - the current tab's URL and title will be captured

### Taking Notes

1. Click on any paper in your list
2. A slide-over panel will open on the right
3. Type your notes (Markdown supported)
4. Notes auto-save 500ms after you stop typing
5. You'll see a "Saved!" notification when notes are persisted

### Managing Folders

- **Rename**: Hover over a folder and click the pencil icon
- **Delete**: Hover over a folder and click the trash icon (this deletes all papers in that folder)

## Design Philosophy

Built with the principles from *The Alien Design*, Synapse Shelf prioritizes:

- **Information Architecture**: Clear hierarchy with breadcrumb navigation
- **Visual Hierarchy**: Primary actions use Deep Scholastic Indigo (#4F46E5)
- **Consistency**: Uniform button styles and interactions throughout
- **Feedback**: Toast notifications for user actions
- **Efficiency**: Slide-over panels keep you in context

## Technology Stack

- **Framework**: Vanilla JavaScript (lightweight, no build process)
- **Storage**: Chrome Storage API (chrome.storage.local)
- **UI**: Semantic HTML5 + Modern CSS
- **Typography**: Inter font family
- **Manifest**: Chrome Extension Manifest V3

## Project Structure

```
SynapseShelf/
├── manifest.json           # Extension configuration
├── sidepanel.html          # Main HTML structure
├── styles.css              # Complete styling system
├── js/
│   ├── storage.js          # Data persistence layer
│   ├── app.js              # Main application controller
│   └── components/
│       ├── FolderView.js   # Folder grid component
│       ├── PaperList.js    # Paper list component
│       └── NoteEditor.js   # Note-taking component
└── icons/
    ├── icon16.png          # Extension icon (16x16)
    ├── icon48.png          # Extension icon (48x48)
    └── icon128.png         # Extension icon (128x128)
```

## Data Structure

Your research data is stored locally in the following JSON structure:

```json
{
  "folders": [
    {
      "id": "1234567890",
      "name": "Neuroscience",
      "papers": [
        {
          "id": "1234567891",
          "title": "Mapping the Connectome",
          "url": "https://nature.com/...",
          "notes": "Key takeaway: connectivity is non-linear..."
        }
      ]
    }
  ]
}
```

## Browser Compatibility

- ✅ Chrome 114+ (required for Side Panel API)
- ✅ Edge 114+ (Chromium-based)
- ✅ Brave (latest)
- ❌ Firefox (uses different extension APIs)
- ❌ Safari (uses different extension APIs)

## Troubleshooting

### Side panel doesn't open
- Make sure you're using Chrome 114 or later
- Check that the extension is enabled in `chrome://extensions/`
- Try reloading the extension

### "Add Paper" doesn't work
- Make sure you're not on a Chrome system page (`chrome://` URLs can't be saved)
- Check that the extension has the `tabs` permission

### Notes aren't saving
- Check the browser console for errors
- Ensure the extension has the `storage` permission
- Try reloading the extension

## Future Enhancements

Potential features for future versions:
- 🔍 Full-text search across notes
- 🏷️ Tags for papers
- 📊 Export to BibTeX/CSV
- 🔗 Paper relationship mapping
- ☁️ Optional cloud sync
- 📱 Mobile companion app

## License

MIT License - Feel free to modify and distribute

---

**Built with ❤️ for researchers who love clean design**
