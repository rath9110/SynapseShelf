/**
 * FolderView Component - Manages the folder grid display and interactions
 */

const FolderView = {
  /**
   * Render the folder view
   * @param {HTMLElement} container - The container to render into
   * @param {Function} onFolderClick - Callback when a folder is clicked
   */
  async render(container, onFolderClick) {
    const data = await Storage.loadData();

    container.innerHTML = `
      <div class="folder-view">
        <div class="paper-header">
          <h1 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">Your Research Domains</h1>
          <button class="btn btn-primary" id="createFolderBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Create Domain
          </button>
        </div>
        ${data.folders.length === 0 ? this.renderEmptyState() : this.renderFolderGrid(data.folders)}
      </div>
    `;

    // Attach event listeners
    const createBtn = container.querySelector('#createFolderBtn');
    createBtn.addEventListener('click', () => this.showCreateFolderModal());

    // Attach folder click listeners
    data.folders.forEach(folder => {
      const folderCard = container.querySelector(`[data-folder-id="${folder.id}"]`);
      if (folderCard) {
        folderCard.addEventListener('click', (e) => {
          // Don't trigger if clicking action buttons
          if (!e.target.closest('.folder-actions')) {
            onFolderClick(folder.id, folder.name);
          }
        });
      }
    });

    // Attach action button listeners
    container.querySelectorAll('.rename-folder-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = btn.dataset.folderId;
        const folderName = btn.dataset.folderName;
        this.showRenameFolderModal(folderId, folderName);
      });
    });

    container.querySelectorAll('.delete-folder-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = btn.dataset.folderId;
        const folderName = btn.dataset.folderName;
        this.showDeleteFolderModal(folderId, folderName);
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
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <div class="empty-state-title">No Research Domains Yet</div>
        <div class="empty-state-description">
          Create your first domain to start organizing your academic papers
        </div>
      </div>
    `;
  },

  /**
   * Render folder grid
   * @param {Array} folders - Array of folder objects
   */
  renderFolderGrid(folders) {
    return `
      <div class="folder-grid">
        ${folders.map(folder => `
          <div class="folder-card" data-folder-id="${folder.id}">
            <div class="folder-card-header">
              <svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <div class="folder-name">${this.escapeHtml(folder.name)}</div>
            </div>
            <div class="folder-count">${folder.papers.length} paper${folder.papers.length !== 1 ? 's' : ''}</div>
            <div class="folder-actions">
              <button class="icon-button rename-folder-btn" data-folder-id="${folder.id}" data-folder-name="${this.escapeHtml(folder.name)}" title="Rename" aria-label="Rename folder ${this.escapeHtml(folder.name)}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="icon-button delete-folder-btn" data-folder-id="${folder.id}" data-folder-name="${this.escapeHtml(folder.name)}" title="Delete" aria-label="Delete folder ${this.escapeHtml(folder.name)}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Show create folder modal
   */
  showCreateFolderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Create Research Domain</h3>
        </div>
        <div class="modal-body">
          <input type="text" class="form-input" id="folderNameInput" placeholder="e.g., Quantum Computing" autofocus>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="createBtn">Create</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#folderNameInput');
    const createBtn = modal.querySelector('#createBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');

    const closeModal = () => modal.remove();

    const handleCreate = async () => {
      const name = input.value.trim();
      if (name) {
        // Set loading state
        createBtn.classList.add('btn-loading');
        createBtn.disabled = true;

        try {
          await Storage.createFolder(name);
          closeModal();
          // Re-render the current view
          window.App.renderCurrentView();
        } catch (error) {
          console.error('Error creating folder:', error);
          createBtn.classList.remove('btn-loading');
          createBtn.disabled = false;
        }
      }
    };

    createBtn.addEventListener('click', handleCreate);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCreate();
    });
  },

  /**
   * Show rename folder modal
   */
  showRenameFolderModal(folderId, currentName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Rename Domain</h3>
        </div>
        <div class="modal-body">
          <input type="text" class="form-input" id="folderNameInput" value="${this.escapeHtml(currentName)}" autofocus>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="renameBtn">Rename</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#folderNameInput');
    const renameBtn = modal.querySelector('#renameBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');

    input.select();

    const closeModal = () => modal.remove();

    const handleRename = async () => {
      const newName = input.value.trim();
      if (newName && newName !== currentName) {
        await Storage.renameFolder(folderId, newName);
        closeModal();
        window.App.renderCurrentView();
      } else {
        closeModal();
      }
    };

    renameBtn.addEventListener('click', handleRename);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleRename();
    });
  },

  /**
   * Show delete folder confirmation modal
   */
  showDeleteFolderModal(folderId, folderName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Delete Domain</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>"${this.escapeHtml(folderName)}"</strong>?</p>
          <p style="color: var(--text-secondary); font-size: 13px; margin-top: 8px;">This will permanently delete all papers and notes in this domain.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
          <button class="btn btn-primary" id="deleteBtn" style="background-color: var(--error-color);">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const deleteBtn = modal.querySelector('#deleteBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');

    const closeModal = () => modal.remove();

    deleteBtn.addEventListener('click', async () => {
      await Storage.deleteFolder(folderId);
      closeModal();
      window.App.renderCurrentView();
    });

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
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
