/**
 * NoteEditor Component - Slide-over panel for editing paper notes
 */

const NoteEditor = {
    currentFolderId: null,
    currentPaperId: null,
    currentPaperTitle: null,
    autoSaveTimeout: null,

    /**
     * Open the note editor for a paper
     * @param {string} folderId - The folder ID
     * @param {string} paperId - The paper ID
     * @param {string} paperTitle - The paper title
     */
    async open(folderId, paperId, paperTitle) {
        this.currentFolderId = folderId;
        this.currentPaperId = paperId;
        this.currentPaperTitle = paperTitle;

        const paper = await Storage.getPaper(folderId, paperId);

        if (!paper) {
            console.error('Paper not found');
            return;
        }

        // Update slide-over title
        const slideoverTitle = document.getElementById('slideoverTitle');
        slideoverTitle.textContent = this.truncateTitle(paperTitle);

        // Load notes into editor (contenteditable uses innerHTML)
        const noteEditor = document.getElementById('noteEditor');
        noteEditor.innerHTML = paper.notes || '';

        // Show the slide-over
        const overlay = document.getElementById('slideoverOverlay');
        const panel = document.getElementById('slideoverPanel');

        overlay.classList.add('active');
        panel.classList.add('active');

        // Focus the editor
        setTimeout(() => noteEditor.focus(), 300);

        // Set up auto-save and image paste
        this.setupAutoSave();
        this.setupImagePaste();
    },

    /**
     * Close the note editor
     */
    close() {
        const overlay = document.getElementById('slideoverOverlay');
        const panel = document.getElementById('slideoverPanel');

        overlay.classList.remove('active');
        panel.classList.remove('active');

        // Clear auto-save timeout
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Save one last time before closing
        this.saveNotes(false); // Don't show toast on close

        // Reset state
        this.currentFolderId = null;
        this.currentPaperId = null;
        this.currentPaperTitle = null;
    },

    /**
     * Set up auto-save functionality with debouncing
     */
    setupAutoSave() {
        const noteEditor = document.getElementById('noteEditor');

        // Remove existing listener if any
        const newEditor = noteEditor.cloneNode(true);
        noteEditor.parentNode.replaceChild(newEditor, noteEditor);

        // Add input listener with debouncing
        newEditor.addEventListener('input', () => {
            // Clear existing timeout
            if (this.autoSaveTimeout) {
                clearTimeout(this.autoSaveTimeout);
            }

            // Set new timeout (3000ms = 3 seconds after user stops typing)
            this.autoSaveTimeout = setTimeout(() => {
                this.saveNotes(true);
            }, 3000);
        });
    },

    /**
     * Set up image paste functionality
     */
    setupImagePaste() {
        const noteEditor = document.getElementById('noteEditor');

        noteEditor.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            // Check if clipboard contains an image
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault(); // Prevent default paste behavior

                    const blob = items[i].getAsFile();
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        // Create an image element
                        const img = document.createElement('img');
                        img.src = event.target.result; // base64 data URL
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';

                        // Insert the image at cursor position
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(img);

                            // Move cursor after the image
                            range.setStartAfter(img);
                            range.setEndAfter(img);
                            selection.removeAllRanges();
                            selection.addRange(range);

                            // Add a line break after image for better UX
                            const br = document.createElement('br');
                            range.insertNode(br);
                        } else {
                            // If no selection, append to end
                            noteEditor.appendChild(img);
                            noteEditor.appendChild(document.createElement('br'));
                        }

                        // Trigger auto-save
                        if (this.autoSaveTimeout) {
                            clearTimeout(this.autoSaveTimeout);
                        }
                        this.autoSaveTimeout = setTimeout(() => {
                            this.saveNotes(true);
                        }, 3000);
                    };

                    reader.readAsDataURL(blob);
                    break; // Only handle first image
                }
            }
        });
    },

    /**
     * Save notes to storage
     * @param {boolean} showToast - Whether to show the "Saved!" toast
     */
    async saveNotes(showToast = true) {
        if (!this.currentFolderId || !this.currentPaperId) {
            return;
        }

        const noteEditor = document.getElementById('noteEditor');
        const notes = noteEditor.innerHTML;

        try {
            await Storage.updatePaperNotes(this.currentFolderId, this.currentPaperId, notes);

            if (showToast) {
                this.showToast('Saved!');
            }
        } catch (error) {
            console.error('Error saving notes:', error);
            if (showToast) {
                this.showToast('Failed to save');
            }
        }
    },

    /**
     * Initialize the note editor (attach close button listener)
     */
    init() {
        const closeBtn = document.getElementById('closeSlideoverBtn');
        const overlay = document.getElementById('slideoverOverlay');

        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
    },

    /**
     * Truncate title for display
     * @param {string} title - The title to truncate
     */
    truncateTitle(title) {
        if (title.length > 50) {
            return title.substring(0, 47) + '...';
        }
        return title;
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     */
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
};
