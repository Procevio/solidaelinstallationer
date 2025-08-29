/**
 * Configuration Module
 * Publika inställningar för Solida Elinstallationer AB
 * Känslig information hanteras av Netlify serverless-funktioner
 */

export const CONFIG = {
    // Moms- och avdragsinställningar (kundspecifika)
    VAT_RATE: 0.25,
    GREEN_TECH_ENABLED: true,
    ROT_ENABLED: true,

    // Pricebook lookup sker via servern mot Zapier
    PRICEBOOK: {
        ENABLED: false
    },

    // API-endpoints (alla via Netlify serverless)
    API: {
        SUBMIT_ENDPOINT: '/.netlify/functions/submit'
    },

    // Scanner-inställningar för optimal prestanda
    SCANNER: {
        SUPPORTED_FORMATS: ['EAN_13', 'EAN_8', 'CODE_128', 'CODE_39'],
        SCAN_COOLDOWN: 1000, // Max 1 scan per sekund
        VIBRATE_DURATION: 50, // Vibrering vid träff (ms)
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
        MAX_RETRIES: 3, // Antal försök vid misslyckad sync
        RETRY_DELAY: 2000, // Väntetid mellan försök (ms)
        PERIODIC_SYNC_INTERVAL: 30000, // Auto-sync intervall (ms)
        BATCH_SIZE: 50 // Max antal items per sync-batch
    },
    
    // UI och admin-inställningar
    UI: {
        ENABLE_ADMIN_MODE: false, // Admin via servern istället
        ADMIN_CLICKS_REQUIRED: 5
    },
    
    // localStorage-nycklar
    STORAGE: {
        MATERIALS_KEY: 'solida_materials',
        SYNC_QUEUE_KEY: 'solida_sync_queue',
        SYNC_HISTORY_KEY: 'solida_sync_history',
        PRICEBOOK_KEY: 'solida_pricebook'
    }
};

// Exportera för bakåtkompatibilitet med befintlig kod
window.MATERIAL_CONFIG = CONFIG;