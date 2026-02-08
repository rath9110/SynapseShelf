/**
 * Storage Module - Handles all chrome.storage.local interactions
 */

const Storage = {
  /**
   * Load all data from chrome.storage
   * @returns {Promise<Object>} The application data
   */
  async loadData() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['synapseData'], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.synapseData || { folders: [] });
        }
      });
    });
  },

  /**
   * Save data to chrome.storage
   * @param {Object} data - The data to save
   * @returns {Promise<void>}
   */
  async saveData(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ synapseData: data }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Initialize storage with default structure if empty
   */
  async initializeStorage() {
    const data = await this.loadData();
    if (!data.folders) {
      await this.saveData({ folders: [] });
    }
    return data;
  },

  /**
   * Create a new folder
   * @param {string} name - Folder name
   * @returns {Promise<Object>} The created folder
   */
  async createFolder(name) {
    const data = await this.loadData();
    const newFolder = {
      id: Date.now().toString(),
      name: name,
      papers: []
    };
    data.folders.push(newFolder);
    await this.saveData(data);
    return newFolder;
  },

  /**
   * Rename a folder
   * @param {string} folderId - Folder ID
   * @param {string} newName - New folder name
   */
  async renameFolder(folderId, newName) {
    const data = await this.loadData();
    const folder = data.folders.find(f => f.id === folderId);
    if (folder) {
      folder.name = newName;
      await this.saveData(data);
    }
  },

  /**
   * Delete a folder
   * @param {string} folderId - Folder ID
   */
  async deleteFolder(folderId) {
    const data = await this.loadData();
    data.folders = data.folders.filter(f => f.id !== folderId);
    await this.saveData(data);
  },

  /**
   * Get a folder by ID
   * @param {string} folderId - Folder ID
   * @returns {Promise<Object|null>} The folder or null
   */
  async getFolder(folderId) {
    const data = await this.loadData();
    return data.folders.find(f => f.id === folderId) || null;
  },

  /**
   * Add a paper to a folder
   * @param {string} folderId - Folder ID
   * @param {string} title - Paper title
   * @param {string} url - Paper URL
   * @returns {Promise<Object>} The created paper
   */
  async addPaper(folderId, title, url) {
    const data = await this.loadData();
    const folder = data.folders.find(f => f.id === folderId);
    if (folder) {
      const newPaper = {
        id: Date.now().toString(),
        title: title,
        url: url,
        notes: ''
      };
      folder.papers.push(newPaper);
      await this.saveData(data);
      return newPaper;
    }
    throw new Error('Folder not found');
  },

  /**
   * Delete a paper
   * @param {string} folderId - Folder ID
   * @param {string} paperId - Paper ID
   */
  async deletePaper(folderId, paperId) {
    const data = await this.loadData();
    const folder = data.folders.find(f => f.id === folderId);
    if (folder) {
      folder.papers = folder.papers.filter(p => p.id !== paperId);
      await this.saveData(data);
    }
  },

  /**
   * Update paper notes
   * @param {string} folderId - Folder ID
   * @param {string} paperId - Paper ID
   * @param {string} notes - New notes content
   */
  async updatePaperNotes(folderId, paperId, notes) {
    const data = await this.loadData();
    const folder = data.folders.find(f => f.id === folderId);
    if (folder) {
      const paper = folder.papers.find(p => p.id === paperId);
      if (paper) {
        paper.notes = notes;
        await this.saveData(data);
      }
    }
  },

  /**
   * Get a paper by ID
   * @param {string} folderId - Folder ID
   * @param {string} paperId - Paper ID
   * @returns {Promise<Object|null>} The paper or null
   */
  async getPaper(folderId, paperId) {
    const folder = await this.getFolder(folderId);
    if (folder) {
      return folder.papers.find(p => p.id === paperId) || null;
    }
    return null;
  }
};
