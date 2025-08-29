/**
 * Configuration Module
 * Centraliserad konfiguration för appen
 */

export const CONFIG = {
    // Zapier Webhook URL - sätt denna till din specifika webhook URL
    MATERIAL_WEBHOOK_URL: process.env.MATERIAL_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/',
    
    // Pricebook-inställningar (för framtida användning)
    PRICEBOOK: {
        ENABLED: false, // Lokalt pricebook inaktiverat - Zapier sköter uppslag
        SOURCE: 'zapier' // all uppslag sker via Zapier mot Google Sheets
    },
    
    // Scanner-inställningar  
    SCANNER: {
        // Begränsade format för bästa prestanda
        SUPPORTED_FORMATS: ['EAN_13', 'EAN_8', 'CODE_128', 'CODE_39'],
        SCAN_COOLDOWN: 1000, // Max 1 scan per sekund
        VIBRATE_DURATION: 50, // Vibrering vid träff
        VIDEO_CONSTRAINTS: {
            video: {
                facingMode: "environment", // Bakre kamera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        }
    },
    
    // Sync-inställningar
    SYNC: {
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000, // ms
        PERIODIC_SYNC_INTERVAL: 30000, // 30 sekunder
        BATCH_SIZE: 50 // Max antal items per sync
    },
    
    // UI-inställningar
    UI: {
        ENABLE_ADMIN_MODE: true,
        ADMIN_CLICKS_REQUIRED: 5 // Easter egg för admin
    },
    
    // Lagring
    STORAGE: {
        MATERIALS_KEY: 'solida_materials',
        SYNC_QUEUE_KEY: 'solida_sync_queue',
        SYNC_HISTORY_KEY: 'solida_sync_history',
        PRICEBOOK_KEY: 'solida_pricebook',
        WEBHOOK_URL_KEY: 'material_webhook_url'
    }
};

// Funktion för att uppdatera webhook URL runtime
export const updateWebhookUrl = (url) => {
    CONFIG.MATERIAL_WEBHOOK_URL = url;
    localStorage.setItem(CONFIG.STORAGE.WEBHOOK_URL_KEY, url);
};

// Ladda sparad webhook URL vid start
export const loadSavedWebhookUrl = () => {
    const saved = localStorage.getItem(CONFIG.STORAGE.WEBHOOK_URL_KEY);
    if (saved) {
        CONFIG.MATERIAL_WEBHOOK_URL = saved;
    }
    return CONFIG.MATERIAL_WEBHOOK_URL;
};

// Exportera för bakåtkompatibilitet med befintlig kod
window.MATERIAL_CONFIG = CONFIG;