/**
 * PaperList Component - Displays papers within a folder
 */

const PaperList = {
    /**
     * Render the paper list view
     * @param {HTMLElement} container - The container to render into
     * @param {string} folderId - The folder ID
     * @param {string} folderName - The folder name
     * @param {Function} onPaperClick - Callback when a paper is clicked
     */
    async render(container, folderId, folderName, onPaperClick) {
        const folder = await Storage.getFolder(folderId);

        if (!folder) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-title">Folder not found</div></div>';
            return;
        }

        container.innerHTML = `
      <div class="paper-list-view">
        <div class="paper-header">
          <h1 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">${this.escapeHtml(folderName)}</h1>
          <button class="btn btn-primary" id="addPaperBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Paper
          </button>
        </div>
        ${folder.papers.length === 0 ? this.renderEmptyState() : this.renderPaperList(folder.papers)}
      </div>
    `;

        // Add paper button
        const addPaperBtn = container.querySelector('#addPaperBtn');
        addPaperBtn.addEventListener('click', async () => {
            await this.addCurrentTabAsPaper(folderId);
        });

        // Paper click listeners
        folder.papers.forEach(paper => {
            const paperItem = container.querySelector(`[data-paper-id="${paper.id}"]`);
            if (paperItem) {
                paperItem.addEventListener('click', (e) => {
                    // Don't trigger if clicking delete button or URL
                    if (!e.target.closest('.delete-button') && !e.target.closest('.paper-url')) {
                        onPaperClick(folderId, folderName, paper.id, paper.title);
                    }
                });
            }
        });

        // Delete button listeners
        container.querySelectorAll('.delete-button').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const paperId = btn.dataset.paperId;
                await Storage.deletePaper(folderId, paperId);
                // Re-render the current view
                window.App.renderCurrentView();
            });
        });
    },

    /**
     * Render empty state
     */
    renderEmptyState() {
        return `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
        <div class="empty-state-title">No Papers Yet</div>
        <div class="empty-state-description">
          Click "Add Paper" to capture the current tab, or navigate to an academic paper and add it
        </div>
      </div>
    `;
    },

    /**
     * Render paper list
     * @param {Array} papers - Array of paper objects
     */
    renderPaperList(papers) {
        return `
      <div class="paper-list">
        ${papers.map(paper => `
          <div class="paper-item" data-paper-id="${paper.id}">
            <div class="paper-info">
              <div class="paper-title">${this.escapeHtml(paper.title)}</div>
              <a href="${this.escapeHtml(paper.url)}" class="paper-url" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                ${this.truncateUrl(paper.url)}
              </a>
            </div>
            <button class="delete-button" data-paper-id="${paper.id}" title="Delete paper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    `;
    },

    /**
     * Add current browser tab as a paper
     * @param {string} folderId - The folder ID to add the paper to
     */
    async addCurrentTabAsPaper(folderId) {
        try {
            // Query the current active tab
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tabs.length === 0) {
                this.showToast('No active tab found');
                return;
            }

            const currentTab = tabs[0];
            const title = currentTab.title || 'Untitled';
            const url = currentTab.url || '';

            // Don't add chrome:// or extension pages
            if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
                this.showToast('Cannot add Chrome system pages');
                return;
            }

            await Storage.addPaper(folderId, title, url);
            this.showToast('Paper added!');

            // Re-render the current view
            window.App.renderCurrentView();
        } catch (error) {
            console.error('Error adding paper:', error);
            this.showToast('Failed to add paper');
        }
    },

    /**
     * Truncate URL for display
     * @param {string} url - The URL to truncate
     */
    truncateUrl(url) {
        if (url.length > 60) {
            return url.substring(0, 57) + '...';
        }
        return url;
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
