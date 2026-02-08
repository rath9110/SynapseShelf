/**
 * Main Application Controller
 * Manages routing, state, and view rendering
 */

window.App = {
    // Current view state
    currentView: 'home',
    currentFolderId: null,
    currentFolderName: null,

    /**
     * Initialize the application
     */
    async init() {
        // Initialize storage
        await Storage.initializeStorage();

        // Initialize note editor
        NoteEditor.init();

        // Render initial view
        this.navigateToHome();
    },

    /**
     * Navigate to home (folder list)
     */
    navigateToHome() {
        this.currentView = 'home';
        this.currentFolderId = null;
        this.currentFolderName = null;
        this.updateBreadcrumb(['Home']);
        this.renderCurrentView();
    },

    /**
     * Navigate to folder (paper list)
     * @param {string} folderId - The folder ID
     * @param {string} folderName - The folder name
     */
    navigateToFolder(folderId, folderName) {
        this.currentView = 'folder';
        this.currentFolderId = folderId;
        this.currentFolderName = folderName;
        this.updateBreadcrumb(['Home', folderName]);
        this.renderCurrentView();
    },

    /**
     * Open note editor for a paper
     * @param {string} folderId - The folder ID
     * @param {string} folderName - The folder name
     * @param {string} paperId - The paper ID
     * @param {string} paperTitle - The paper title
     */
    openPaperNotes(folderId, folderName, paperId, paperTitle) {
        // Don't change the current view, just open the slide-over
        NoteEditor.open(folderId, paperId, paperTitle);
    },

    /**
     * Update breadcrumb navigation
     * @param {Array<string>} items - Breadcrumb items
     */
    updateBreadcrumb(items) {
        const breadcrumb = document.getElementById('breadcrumb');

        breadcrumb.innerHTML = items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isHome = index === 0;

            if (isLast) {
                return `<span class="breadcrumb-item active">${this.escapeHtml(item)}</span>`;
            } else {
                return `
          <span class="breadcrumb-item" data-nav="${isHome ? 'home' : 'folder'}">${this.escapeHtml(item)}</span>
          <span class="breadcrumb-separator">/</span>
        `;
            }
        }).join('');

        // Attach click listeners to breadcrumb items
        breadcrumb.querySelectorAll('.breadcrumb-item:not(.active)').forEach(item => {
            item.addEventListener('click', () => {
                const navType = item.dataset.nav;
                if (navType === 'home') {
                    this.navigateToHome();
                } else if (navType === 'folder') {
                    this.navigateToFolder(this.currentFolderId, this.currentFolderName);
                }
            });
        });
    },

    /**
     * Render the current view
     */
    async renderCurrentView() {
        const mainContent = document.getElementById('mainContent');

        switch (this.currentView) {
            case 'home':
                await FolderView.render(
                    mainContent,
                    (folderId, folderName) => this.navigateToFolder(folderId, folderName)
                );
                break;

            case 'folder':
                await PaperList.render(
                    mainContent,
                    this.currentFolderId,
                    this.currentFolderName,
                    (folderId, folderName, paperId, paperTitle) =>
                        this.openPaperNotes(folderId, folderName, paperId, paperTitle)
                );
                break;

            default:
                console.error('Unknown view:', this.currentView);
        }
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
