/**
 * Material Sync Module
 * Synkronisering av skannade material till webhook
 * Stöder retry-logik och offline-kö
 */

class MaterialSync {
    constructor(store) {
        this.store = store;
        this.syncQueueKey = 'solida_sync_queue';
        this.syncHistoryKey = 'solida_sync_history';
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 sekunder
        this.webhookUrl = null;
        this.isSyncing = false;
        this.syncQueue = [];
        this.syncHistory = [];

        this.loadSyncQueue();
        this.loadSyncHistory();
        this.startPeriodicSync();
    }

    /**
     * Konfigurera webhook URL
     * @param {string} url 
     */
    setWebhookUrl(url) {
        this.webhookUrl = url;
    }

    /**
     * Synkronisera material för specifikt jobb till Zapier
     * @param {string} jobId 
     * @param {boolean} immediate - Synka omedelbart eller lägg i kö
     * @returns {Promise<{ok: boolean, added: number, unknown: number}>}
     */
    async syncToWebhook(jobId, immediate = true) {
        if (!this.webhookUrl) {
            throw new Error('Webhook URL not configured');
        }

        const data = this.store.exportForSync(jobId);
        if (!data || !data.items.length) {
            throw new Error('No materials to sync');
        }

        if (immediate && navigator.onLine) {
            return await this.performSync(data);
        } else {
            this.addToSyncQueue(data);
            return { status: 'queued', message: 'Added to sync queue' };
        }
    }

    /**
     * Utför själva synkroniseringen till Zapier
     * @param {Object} data 
     * @param {number} retryCount 
     * @returns {Promise<{ok: boolean, added: number, unknown: number}>}
     */
    async performSync(data, retryCount = 0) {
        const syncId = this.generateSyncId();
        // Skicka minimal payload till Zapier - inga extra metadata
        const payload = {
            jobId: data.jobId,
            source: data.source,
            items: data.items
        };

        try {
            console.log(`Syncing ${data.items.length} materials to Zapier for job ${data.jobId}:`, payload);

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Source': 'solida-elinstallationer-app'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Förväntat Zapier custom response format:
                // {"status":"ok","added":5,"unknown":1}
                const result = await response.json().catch(() => ({ 
                    status: 'ok', 
                    added: data.items.length, 
                    unknown: 0 
                }));
                
                this.recordSyncSuccess(syncId, data.jobId, payload, result);
                this.removeFromSyncQueue(data.jobId);

                // Returnera standardiserat format
                return {
                    ok: result.status === 'ok',
                    added: result.added || data.items.length,
                    unknown: result.unknown || 0,
                    syncId,
                    message: `${result.added || data.items.length} rader synkade, ${result.unknown || 0} okända`
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('Sync error:', error);

            if (retryCount < this.maxRetries) {
                console.log(`Retrying sync in ${this.retryDelay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
                
                await this.delay(this.retryDelay);
                return await this.performSync(data, retryCount + 1);
            } else {
                this.recordSyncFailure(syncId, data.jobId, payload, error.message);
                this.addToSyncQueue(data); // Behåll i kö för senare försök
                
                throw {
                    status: 'failed',
                    syncId,
                    error: error.message,
                    message: `Sync failed after ${this.maxRetries} attempts`
                };
            }
        }
    }

    /**
     * Lägg till i sync-kö
     * @param {Object} data 
     */
    addToSyncQueue(data) {
        // Ta bort eventuellt befintligt för samma jobb
        this.syncQueue = this.syncQueue.filter(item => item.jobId !== data.jobId);
        
        // Lägg till nytt
        this.syncQueue.push({
            ...data,
            queuedAt: new Date().toISOString(),
            attempts: 0
        });

        this.saveSyncQueue();
    }

    /**
     * Ta bort från sync-kö
     * @param {string} jobId 
     */
    removeFromSyncQueue(jobId) {
        this.syncQueue = this.syncQueue.filter(item => item.jobId !== jobId);
        this.saveSyncQueue();
    }

    /**
     * Processar sync-kö
     */
    async processSyncQueue() {
        if (this.isSyncing || !navigator.onLine || !this.webhookUrl) {
            return;
        }

        if (this.syncQueue.length === 0) {
            return;
        }

        this.isSyncing = true;

        try {
            for (const queueItem of [...this.syncQueue]) {
                try {
                    // Hämta uppdaterad data från store
                    const currentData = this.store.exportForSync(queueItem.jobId);
                    if (currentData && currentData.items.length > 0) {
                        await this.performSync(currentData);
                    } else {
                        // Inget material kvar att synka
                        this.removeFromSyncQueue(queueItem.jobId);
                    }
                } catch (error) {
                    console.error(`Queue processing error for job ${queueItem.jobId}:`, error);
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Registrera framgångsrik sync
     * @param {string} syncId 
     * @param {string} jobId 
     * @param {Object} payload 
     * @param {Object} response 
     */
    recordSyncSuccess(syncId, jobId, payload, response) {
        this.syncHistory.unshift({
            syncId,
            jobId,
            status: 'success',
            itemCount: payload.items.length,
            syncedAt: new Date().toISOString(),
            response
        });

        this.trimSyncHistory();
        this.saveSyncHistory();
        this.dispatchSyncEvent('success', { syncId, jobId, response });
    }

    /**
     * Registrera misslyckad sync
     * @param {string} syncId 
     * @param {string} jobId 
     * @param {Object} payload 
     * @param {string} error 
     */
    recordSyncFailure(syncId, jobId, payload, error) {
        this.syncHistory.unshift({
            syncId,
            jobId,
            status: 'failed',
            itemCount: payload.items.length,
            syncedAt: new Date().toISOString(),
            error
        });

        this.trimSyncHistory();
        this.saveSyncHistory();
        this.dispatchSyncEvent('failed', { syncId, jobId, error });
    }

    /**
     * Hämta sync-status för jobb
     * @param {string} jobId 
     * @returns {Object|null}
     */
    getSyncStatus(jobId) {
        const queueItem = this.syncQueue.find(item => item.jobId === jobId);
        const historyItem = this.syncHistory.find(item => item.jobId === jobId);

        return {
            queued: !!queueItem,
            queuedAt: queueItem?.queuedAt,
            lastSync: historyItem?.syncedAt,
            lastStatus: historyItem?.status,
            lastError: historyItem?.error
        };
    }

    /**
     * Lista sync-historik
     * @param {number} limit 
     * @returns {Array}
     */
    getSyncHistory(limit = 50) {
        return this.syncHistory.slice(0, limit);
    }

    /**
     * Rensa sync-historik
     */
    clearSyncHistory() {
        this.syncHistory = [];
        this.saveSyncHistory();
    }

    /**
     * Rensa sync-kö
     */
    clearSyncQueue() {
        this.syncQueue = [];
        this.saveSyncQueue();
    }

    /**
     * Starta periodisk sync av kö
     */
    startPeriodicSync() {
        // Synka var 30:e sekund om online
        setInterval(() => {
            if (navigator.onLine) {
                this.processSyncQueue();
            }
        }, 30000);

        // Synka när nätverket kommer tillbaka
        window.addEventListener('online', () => {
            setTimeout(() => this.processSyncQueue(), 1000);
        });
    }

    /**
     * Generera unikt sync-ID
     * @returns {string}
     */
    generateSyncId() {
        return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Fördröjning
     * @param {number} ms 
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Begränsa sync-historik till max 100 poster
     */
    trimSyncHistory() {
        if (this.syncHistory.length > 100) {
            this.syncHistory = this.syncHistory.slice(0, 100);
        }
    }

    /**
     * Spara sync-kö
     */
    saveSyncQueue() {
        try {
            localStorage.setItem(this.syncQueueKey, JSON.stringify(this.syncQueue));
        } catch (error) {
            console.error('Error saving sync queue:', error);
        }
    }

    /**
     * Ladda sync-kö
     */
    loadSyncQueue() {
        try {
            const data = localStorage.getItem(this.syncQueueKey);
            if (data) {
                this.syncQueue = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading sync queue:', error);
            this.syncQueue = [];
        }
    }

    /**
     * Spara sync-historik
     */
    saveSyncHistory() {
        try {
            localStorage.setItem(this.syncHistoryKey, JSON.stringify(this.syncHistory));
        } catch (error) {
            console.error('Error saving sync history:', error);
        }
    }

    /**
     * Ladda sync-historik
     */
    loadSyncHistory() {
        try {
            const data = localStorage.getItem(this.syncHistoryKey);
            if (data) {
                this.syncHistory = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading sync history:', error);
            this.syncHistory = [];
        }
    }

    /**
     * Dispatch sync-event
     * @param {string} type 
     * @param {Object} detail 
     */
    dispatchSyncEvent(type, detail) {
        const event = new CustomEvent('materialSync', {
            detail: { type, ...detail }
        });
        window.dispatchEvent(event);
    }

    /**
     * Test webhook-anslutning
     * @returns {Promise}
     */
    async testWebhook() {
        if (!this.webhookUrl) {
            throw new Error('Webhook URL not configured');
        }

        try {
            const testPayload = {
                test: true,
                timestamp: new Date().toISOString(),
                source: 'solida-elinstallationer-app'
            };

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Source': 'solida-elinstallationer-app'
                },
                body: JSON.stringify(testPayload)
            });

            return {
                status: response.ok ? 'success' : 'failed',
                statusCode: response.status,
                statusText: response.statusText
            };

        } catch (error) {
            return {
                status: 'failed',
                error: error.message
            };
        }
    }

    /**
     * Hämta kö-statistik
     * @returns {Object}
     */
    getQueueStats() {
        return {
            queueLength: this.syncQueue.length,
            oldestQueued: this.syncQueue.length > 0 ? 
                Math.min(...this.syncQueue.map(item => new Date(item.queuedAt).getTime())) : null,
            totalItems: this.syncQueue.reduce((sum, item) => sum + item.items.length, 0)
        };
    }
}

// Exportera för användning
window.MaterialSync = MaterialSync;