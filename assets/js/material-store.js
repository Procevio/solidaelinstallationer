/**
 * Material Store Module
 * Lokal persistens för skannade material med localStorage
 * Stöder offline-läge och synkronisering
 */

class MaterialStore {
    constructor() {
        this.storageKey = 'solida_materials';
        this.pricebookKey = 'solida_pricebook';
        this.currentJobId = null;
        this.materials = new Map();
        this.pricebook = new Map();
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.loadPricebook();
    }

    /**
     * Initialisera store för specifikt jobb
     * @param {string} jobId 
     */
    initJob(jobId) {
        this.currentJobId = jobId;
        if (!this.materials.has(jobId)) {
            this.materials.set(jobId, new Map());
            this.saveToStorage();
        }
    }

    /**
     * Lägg till eller uppdatera material enligt Zapier-specifikation
     * @param {Object} item - Material object
     * {
     *   jobId: string,
     *   barcode: string,
     *   name?: string,          // valfritt om okänd i pricebook
     *   qty: number,
     *   source: "scan" | "manual"
     * }
     */
    addItem(item) {
        if (!this.currentJobId) {
            throw new Error('No job initialized. Call init(jobId) first.');
        }

        const {
            barcode,
            name = null, // Valfritt - Zapier slår upp produktnamn
            qty = 1,
            source = 'scan' // 'scan' eller 'manual'
        } = item;

        const jobMaterials = this.materials.get(this.currentJobId);
        
        if (jobMaterials.has(barcode)) {
            // Uppdatera befintlig - öka kvantitet för samma streckkod
            const existing = jobMaterials.get(barcode);
            existing.qty += qty;
            existing.scannedAt = new Date().toISOString(); // Uppdatera scan-tid
        } else {
            // Lägg till ny enligt Zapier-specifikation
            const newItem = {
                jobId: this.currentJobId,
                barcode,
                name, // null om okänd, annars manuellt inmatad
                qty,
                scannedAt: new Date().toISOString(),
                source
            };
            jobMaterials.set(barcode, newItem);
        }

        this.saveToStorage();
        this.dispatchUpdateEvent();
    }

    /**
     * Uppdatera antal för specifik artikel
     * @param {string} barcode 
     * @param {number} qty 
     */
    updateQty(barcode, qty) {
        if (!this.currentJobId) return false;

        const jobMaterials = this.materials.get(this.currentJobId);
        if (!jobMaterials.has(barcode)) return false;

        const item = jobMaterials.get(barcode);
        item.qty = Math.max(0, qty); // Inte negativa värden
        item.lastUpdated = new Date().toISOString();

        if (item.qty === 0) {
            jobMaterials.delete(barcode);
        }

        this.saveToStorage();
        this.dispatchUpdateEvent();
        return true;
    }

    /**
     * Ta bort artikel
     * @param {string} barcode 
     */
    removeItem(barcode) {
        if (!this.currentJobId) return false;

        const jobMaterials = this.materials.get(this.currentJobId);
        const removed = jobMaterials.delete(barcode);

        if (removed) {
            this.saveToStorage();
            this.dispatchUpdateEvent();
        }
        
        return removed;
    }

    /**
     * Lista alla material för aktuellt jobb
     * @returns {Array} Array av material-objekt
     */
    list() {
        if (!this.currentJobId) return [];

        const jobMaterials = this.materials.get(this.currentJobId);
        if (!jobMaterials) return [];

        return Array.from(jobMaterials.values()).sort((a, b) => 
            new Date(b.scannedAt) - new Date(a.scannedAt)
        );
    }

    /**
     * Lista material för specifikt jobb
     * @param {string} jobId 
     * @returns {Array}
     */
    listForJob(jobId) {
        const jobMaterials = this.materials.get(jobId);
        if (!jobMaterials) return [];

        return Array.from(jobMaterials.values()).sort((a, b) => 
            new Date(b.scannedAt) - new Date(a.scannedAt)
        );
    }

    /**
     * Rensa alla material för aktuellt jobb
     */
    clear() {
        if (!this.currentJobId) return;

        this.materials.delete(this.currentJobId);
        this.saveToStorage();
        this.dispatchUpdateEvent();
    }

    /**
     * Rensa specifikt jobb
     * @param {string} jobId 
     */
    clearJob(jobId) {
        this.materials.delete(jobId);
        this.saveToStorage();
        
        if (jobId === this.currentJobId) {
            this.dispatchUpdateEvent();
        }
    }

    /**
     * Hämta totalt antal artiklar och rader
     * @returns {Object} {items: number, totalQty: number}
     */
    getStats() {
        const items = this.list();
        return {
            items: items.length,
            totalQty: items.reduce((sum, item) => sum + item.qty, 0)
        };
    }

    /**
     * Sök i pricebook
     * @param {string} barcode 
     * @returns {Object|null}
     */
    findInPricebook(barcode) {
        return this.pricebook.get(barcode) || null;
    }

    /**
     * Lägg till/uppdatera i pricebook
     * @param {Object} item 
     */
    addToPricebook(item) {
        const {
            barcode,
            name,
            unit = 'st',
            priceExVat = null,
            vat = 25,
            isGreenTech = false,
            rotEligible = false
        } = item;

        this.pricebook.set(barcode, {
            barcode,
            name,
            unit,
            priceExVat,
            vat,
            isGreenTech,
            rotEligible,
            addedAt: new Date().toISOString()
        });

        this.savePricebook();
    }

    /**
     * Ta bort från pricebook
     * @param {string} barcode 
     */
    removeFromPricebook(barcode) {
        const removed = this.pricebook.delete(barcode);
        if (removed) {
            this.savePricebook();
        }
        return removed;
    }

    /**
     * Lista alla pricebook-poster
     * @returns {Array}
     */
    listPricebook() {
        return Array.from(this.pricebook.values()).sort((a, b) => 
            a.name.localeCompare(b.name, 'sv')
        );
    }

    /**
     * Lista alla jobb som har material
     * @returns {Array} Array med jobId och metadata
     */
    listJobs() {
        const jobs = [];
        
        for (const [jobId, materials] of this.materials) {
            const items = Array.from(materials.values());
            const stats = {
                items: items.length,
                totalQty: items.reduce((sum, item) => sum + item.qty, 0),
                lastUpdated: items.reduce((latest, item) => 
                    new Date(item.lastUpdated) > new Date(latest) ? item.lastUpdated : latest
                , items[0]?.lastUpdated || new Date().toISOString())
            };

            jobs.push({
                jobId,
                ...stats
            });
        }

        return jobs.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    /**
     * Exportera data för Zapier webhook enligt specifikation
     * @param {string} jobId 
     * @returns {Object}
     * Format:
     * {
     *   jobId: "JOB-123",
     *   source: "scan",
     *   items: [
     *     { "barcode": "7312345678901", "qty": 2 },
     *     { "barcode": "7399999999999", "qty": 1, "name": "Manuellt namn om okänd" }
     *   ]
     * }
     */
    exportForSync(jobId = null) {
        const targetJobId = jobId || this.currentJobId;
        if (!targetJobId) return null;

        const materials = this.listForJob(targetJobId);
        
        // Transformera till Zapier-format - minimala fält
        const items = materials.map(material => {
            const item = {
                barcode: material.barcode,
                qty: material.qty
            };
            
            // Lägg bara till namn om det finns (manuellt inmatat)
            if (material.name) {
                item.name = material.name;
            }
            
            return item;
        });

        return {
            jobId: targetJobId,
            source: 'scan',
            items
        };
    }

    /**
     * Spara till localStorage
     */
    saveToStorage() {
        try {
            const data = {};
            for (const [jobId, materials] of this.materials) {
                data[jobId] = Object.fromEntries(materials);
            }
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving materials to storage:', error);
        }
    }

    /**
     * Ladda från localStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.materials.clear();

                for (const [jobId, materials] of Object.entries(parsed)) {
                    const jobMap = new Map();
                    for (const [barcode, item] of Object.entries(materials)) {
                        jobMap.set(barcode, item);
                    }
                    this.materials.set(jobId, jobMap);
                }
            }
        } catch (error) {
            console.error('Error loading materials from storage:', error);
            this.materials.clear();
        }
    }

    /**
     * Spara pricebook
     */
    savePricebook() {
        try {
            const data = Object.fromEntries(this.pricebook);
            localStorage.setItem(this.pricebookKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving pricebook to storage:', error);
        }
    }

    /**
     * Ladda pricebook
     */
    loadPricebook() {
        try {
            const data = localStorage.getItem(this.pricebookKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.pricebook.clear();
                
                for (const [barcode, item] of Object.entries(parsed)) {
                    this.pricebook.set(barcode, item);
                }
            } else {
                // Ladda standard pricebook
                this.loadDefaultPricebook();
            }
        } catch (error) {
            console.error('Error loading pricebook from storage:', error);
            this.loadDefaultPricebook();
        }
    }

    /**
     * Ladda standard pricebook med vanliga el-artiklar
     */
    loadDefaultPricebook() {
        const defaultItems = [
            {
                barcode: '7313284016050',
                name: 'Eluttag ABB Impressivo 16A vit',
                unit: 'st',
                priceExVat: 65,
                vat: 25,
                isGreenTech: false,
                rotEligible: true
            },
            {
                barcode: '3606481711027',
                name: 'Strömbrytare Schneider Exxact vit',
                unit: 'st',
                priceExVat: 35,
                vat: 25,
                isGreenTech: false,
                rotEligible: true
            },
            {
                barcode: '7393086079959',
                name: 'Kabel PFXP 3G1,5 100m',
                unit: 'rulle',
                priceExVat: 1250,
                vat: 25,
                isGreenTech: false,
                rotEligible: true
            },
            {
                barcode: '7313284009974',
                name: 'LED Downlight 10W vit',
                unit: 'st',
                priceExVat: 125,
                vat: 25,
                isGreenTech: true,
                rotEligible: true
            },
            {
                barcode: '7313284502859',
                name: 'Automatsäkring C16 1-pol',
                unit: 'st',
                priceExVat: 45,
                vat: 25,
                isGreenTech: false,
                rotEligible: true
            }
        ];

        defaultItems.forEach(item => {
            this.pricebook.set(item.barcode, {
                ...item,
                addedAt: new Date().toISOString()
            });
        });

        this.savePricebook();
    }

    /**
     * Dispatch custom event när material uppdateras
     */
    dispatchUpdateEvent() {
        const event = new CustomEvent('materialStoreUpdated', {
            detail: {
                jobId: this.currentJobId,
                stats: this.getStats()
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Rensa all data (för debug/reset)
     */
    clearAll() {
        this.materials.clear();
        this.pricebook.clear();
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.pricebookKey);
        this.dispatchUpdateEvent();
    }

    /**
     * Importera pricebook från extern källa
     * @param {Array} items 
     */
    importPricebook(items) {
        items.forEach(item => {
            this.addToPricebook(item);
        });
    }
}

// Exportera för användning
window.MaterialStore = MaterialStore;