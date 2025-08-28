// Lösenordsskydd konfiguration
const PASSWORD_CONFIG = {
    CORRECT_PASSWORD: 'solida123',
    MAX_ATTEMPTS: 3,
    SESSION_KEY: 'solida_auth_session'
};

// Priskonfiguration för elinstallationer med detaljerade produktval
const CONFIG = {
    // Timpris för elektriker (exkl moms)
    HOURLY_RATE: 750,

    // Elinstallationer-priser med separata material- och laborvariabler
    ELECTRICAL_PRICING: {
        // Installation & Utbyggnad
        'extra_eluttag': {
            'schneider_exxact_16a': {
                materialCost: 45,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Schneider Exxact 16A'
            },
            'abb_impressivo_16a': {
                materialCost: 65,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'ABB Impressivo 16A'
            },
            'gira_system55_16a': {
                materialCost: 85,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Gira System 55 16A'
            }
        },
        'strombrytare': {
            'schneider_exxact_enpolig': {
                materialCost: 35,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Schneider Exxact enpolig'
            },
            'jung_as500_dimmer_led': {
                materialCost: 180,
                laborHours: 0.75,
                laborCost: 563, // 0.75h × 750kr/h
                description: 'Jung AS500 dimmer LED'
            },
            'plejd_wrt01_smart': {
                materialCost: 450,
                laborHours: 1,
                laborCost: 750, // 1h × 750kr/h
                description: 'Plejd WRT-01 smart switch'
            }
        },
        'inkoppling_hushallsmaskin': {
            'diskmaskin': {
                materialCost: 120,
                laborHours: 2,
                laborCost: 1500, // 2h × 750kr/h
                description: 'Diskmaskin'
            },
            'ugn': {
                materialCost: 145,
                laborHours: 2.5,
                laborCost: 1875, // 2.5h × 750kr/h
                description: 'Ugn'
            },
            'induktionsspis': {
                materialCost: 180,
                laborHours: 3,
                laborCost: 2250, // 3h × 750kr/h
                description: 'Induktionsspis'
            }
        },

        // Belysning
        'taklampa': {
            'grundarmatur_e27': {
                materialCost: 85,
                laborHours: 0.75,
                laborCost: 563, // 0.75h × 750kr/h
                description: 'Grundarmatur E27'
            },
            'led_downlight_infälld': {
                materialCost: 120,
                laborHours: 1,
                laborCost: 750, // 1h × 750kr/h
                description: 'LED downlight infälld'
            },
            'takfläkt_belysning': {
                materialCost: 850,
                laborHours: 2,
                laborCost: 1500, // 2h × 750kr/h
                description: 'Takfläkt med belysning'
            }
        },
        'spotlights': {
            'philips_led_downlight_10w': {
                materialCost: 95,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Philips LED downlight 10W'
            },
            'paulmann_skena_3spots': {
                materialCost: 280,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Paulmann skena 3-spots'
            },
            'malmbergs_infälld_gu10': {
                materialCost: 65,
                laborHours: 0.75,
                laborCost: 563, // 0.75h × 750kr/h
                description: 'Malmbergs infälld spot GU10'
            }
        },
        'led_strip': {
            'philips_hue_lightstrip_2m': {
                materialCost: 450,
                laborHours: 1,
                laborCost: 750, // 1h × 750kr/h
                description: 'Philips Hue lightstrip 2m'
            },
            'paulmann_profil_per_meter': {
                materialCost: 85,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Paulmann profil kökslist per meter'
            },
            'ikea_myrvarv_35m': {
                materialCost: 180,
                laborHours: 0.75,
                laborCost: 563, // 0.75h × 750kr/h
                description: 'IKEA Myrvarv 3,5m'
            }
        },

        // Energi & Laddning
        'laddbox_elbil': {
            'easee_home_22kw': {
                materialCost: 8500,
                laborHours: 4,
                laborCost: 3000, // 4h × 750kr/h
                description: 'Easee Home 22kW',
                greenTech: true,
                greenTechRate: 50 // 50% avdrag
            },
            'zaptec_go_11kw': {
                materialCost: 6200,
                laborHours: 3.5,
                laborCost: 2625, // 3.5h × 750kr/h
                description: 'Zaptec Go 11kW',
                greenTech: true,
                greenTechRate: 50 // 50% avdrag
            },
            'garo_glb_16a_cee': {
                materialCost: 2100,
                laborHours: 2.5,
                laborCost: 1875, // 2.5h × 750kr/h
                description: 'Garo GLB 16A CEE',
                greenTech: true,
                greenTechRate: 50 // 50% avdrag
            }
        },

        // Solenergi
        'solceller': {
            'vaxelriktare': {
                materialCost: 15000,
                laborHours: 8,
                laborCost: 6000, // 8h × 750kr/h
                description: 'Växelriktare solceller',
                greenTech: true,
                greenTechRate: 15 // 15% avdrag
            },
            'optimizers': {
                materialCost: 8500,
                laborHours: 4,
                laborCost: 3000, // 4h × 750kr/h
                description: 'Power optimizers',
                greenTech: true,
                greenTechRate: 15 // 15% avdrag
            },
            'batterisystem': {
                materialCost: 45000,
                laborHours: 12,
                laborCost: 9000, // 12h × 750kr/h
                description: 'Hemlagringsbatteri',
                greenTech: true,
                greenTechRate: 50 // 50% avdrag för batterilagring
            }
        },

        // Värme & Komfort
        'handdukstork': {
            'thermia_straight_600w': {
                materialCost: 850,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Thermia Straight 600W'
            },
            'rointe_d_series_500w': {
                materialCost: 1200,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Rointe D-Series 500W'
            },
            'hafa_original_400w': {
                materialCost: 680,
                laborHours: 1,
                laborCost: 750, // 1h × 750kr/h
                description: 'Hafa Original 400W'
            }
        },
        'golvvarme': {
            'thermia_per_kvm': {
                materialCost: 220,
                laborHours: 0.4,
                laborCost: 300, // 0.4h × 750kr/h
                description: 'Thermia Golvvärme per kvm'
            },
            'fenix_ecofloor_per_kvm': {
                materialCost: 180,
                laborHours: 0.4,
                laborCost: 300, // 0.4h × 750kr/h
                description: 'Fenix ecofloor per kvm'
            },
            'nexans_per_kvm': {
                materialCost: 260,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Nexans per kvm'
            }
        },

        // Säkerhet & Smarta Hem
        'brandvarnare': {
            'kidde_29hd_optisk': {
                materialCost: 180,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Kidde 29HD optisk'
            },
            'aico_ei650_10ar': {
                materialCost: 220,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Aico Ei650 10år batteri'
            },
            'cavius_2103_mini': {
                materialCost: 280,
                laborHours: 0.5,
                laborCost: 375, // 0.5h × 750kr/h
                description: 'Cavius 2103 mini'
            }
        },
        'natverksuttag': {
            'abb_impressivo_rj45_cat6': {
                materialCost: 65,
                laborHours: 1,
                laborCost: 750, // 1h × 750kr/h
                description: 'ABB Impressivo RJ45 Cat6'
            },
            'fiber_sc_uttag': {
                materialCost: 95,
                laborHours: 1.5,
                laborCost: 1125, // 1.5h × 750kr/h
                description: 'Fiber SC-uttag'
            },
            'unifi_u6_lite_ap': {
                materialCost: 950,
                laborHours: 2,
                laborCost: 1500, // 2h × 750kr/h
                description: 'UniFi U6-Lite access point'
            }
        }
    },

    // Arbetsbeskrivningar för elinstallationer
    WORK_DESCRIPTIONS: {
        'extra_eluttag': {
            'inomhus_vagg': 'Installation av extra eluttag inomhus:\n• Urtagning för eluttag\n• Dragning av kabel till elcentral\n• Montering av eluttag enligt SS-EN standard\n• Inkoppling och funktionstest\n• Efterjustering och städning av arbetsplats',
            'uteplats_garage': 'Installation av eluttag uteplats/garage:\n• Urtagning för eluttag med IP44-klassning\n• Dragning av kabel från elcentral\n• Montering av jordfelsskydd\n• Installation och inkoppling\n• Funktionstest och dokumentation'
        },
        'strombrytare': {
            'vanlig': 'Installation av vanlig strömbrytare:\n• Urtagning för strömbrytare\n• Dragning av styrledningar\n• Montering av strömbrytare\n• Inkoppling och märkning\n• Funktionstest',
            'dimmer': 'Installation av dimmer:\n• Urtagning för dimmerreglage\n• Dragning av styrledningar\n• Montering av LED-kompatibel dimmer\n• Programmering och kalibrering\n• Funktionstest och dokumentation',
            'smart_switch': 'Installation av smart switch:\n• Urtagning för smart strömbrytare\n• Dragning av nödvändiga ledningar\n• Installation och konfiguration\n• Uppkoppling mot hemautomation\n• Programmering och test'
        },
        'byte_elcentral': 'Byte av elcentral/automatsäkringar:\n• Avstängning av huvudbrytare\n• Demontering av befintlig central\n• Installation av ny elcentral\n• Överföring av kretsar\n• Märkning och dokumentation\n• Slutbesiktning och protokoll',
        'dragning_ny_el': 'Dragning av ny el (renovering):\n• Planering av kabelvägar\n• Urtagning för kabelgenomföringar\n• Dragning av kabel enligt standard\n• Märkning av kablar\n• Inkoppling i elcentral',
        'inkoppling_hushallsmaskin': {
            'diskmaskin': 'Inkoppling diskmaskin:\n• Dragning av 3-fas kabel\n• Installation av uttag/kopplingsplint\n• Inkoppling enligt tillverkarens anvisningar\n• Funktionstest\n• Dokumentation',
            'ugn': 'Inkoppling ugn:\n• Installation av högeffektsuttag\n• Dragning av dimensionerad kabel\n• Säkring i elcentral\n• Inkoppling och test\n• Säkerhetskontroll',
            'spis': 'Inkoppling spis:\n• Installation av spisuttag\n• Dragning av 3-fas kabel\n• Inkoppling i elcentral\n• Funktions- och säkerhetstest\n• Dokumentation och märkning',
            'tvattmaskin': 'Inkoppling tvättmaskin:\n• Installation av uttag med jordfelsbrytare\n• Dragning av kabel\n• Inkoppling enligt säkerhetsföreskrifter\n• Test av säkerhetsfunktioner\n• Dokumentation'
        },
        'jordfelsbrytare': 'Installation av jordfelsbrytare:\n• Identifiering av krets\n• Installation i elcentral\n• Inkoppling av fas och neutral\n• Test av utlösningsfunktion\n• Märkning och dokumentation',
        
        // Belysning
        'taklampa': {
            'vanlig_taklampa': 'Installation av taklampa:\n• Montering av takarmatur\n• Anslutning av ledningar\n• Installation av strömbrytare\n• Test av belysning\n• Slutjustering',
            'kristallkrona': 'Installation av kristallkrona:\n• Förstärkning av takfäste\n• Montering av tung armatur\n• Anslutning av belysningskretsar\n• Installation av dimmer\n• Test och justering',
            'takflakt_belysning': 'Installation av takfläkt med belysning:\n• Montering av takfäste\n• Anslutning av motor och belysning\n• Installation av styrenhet\n• Balansering av fläkt\n• Funktionstest'
        },
        'spotlights': {
            'led_downlights': 'Installation av LED downlights:\n• Urtagning för spotlights\n• Dragning av belysningskabel\n• Montering av LED-spots\n• Inkoppling och dimmerkompatibilitet\n• Ljustest och justering',
            'skena_spots': 'Installation av skena med spots:\n• Montering av belysningsskena\n• Installation av spotlights\n• Anslutning till dimmer\n• Programmering av ljusscener\n• Test och finjustering',
            'infallda_spots': 'Installation av infällda spots:\n• Urtagning i tak/vägg\n• Installation av spotlights\n• Anslutning av belysningskretsar\n• Installation av dimmer\n• Ljustestning och justering'
        },
        'utomhusbelysning': {
            'fasadbelysning': 'Installation av fasadbelysning:\n• Montering av utomhusarmaturer IP65\n• Dragning av utomhuskabel\n• Installation av timer/rörelsevakt\n• Anslutning och programmering\n• Test av belysningsfunktioner',
            'tradgardsspots': 'Installation av trädgårdsspots:\n• Grävning för markkabel\n• Installation av trädgårdsspots\n• Anslutning till utomhusenhet\n• Programmering av belysning\n• Test och säkerhetsverifiering',
            'vaggarmatur': 'Installation av väggarmatur:\n• Montering av väggarmatur\n• Anslutning av belysningskabel\n• Installation av strömbrytare\n• Test av belysningsfunktion\n• Slutjustering'
        },
        'led_strip': {
            'koksbelysning': 'Installation av LED-strip köksbelysning:\n• Montering av LED-profiler\n• Installation av LED-strip\n• Anslutning av driver och dimmer\n• Programmering av ljusscener\n• Test och finjustering',
            'trappbelysning': 'Installation av LED-strip trappbelysning:\n• Montering längs trappsteg\n• Installation av rörelsesensorer\n• Programmering av automatik\n• Säkerhetstestning\n• Funktionsverifiering',
            'dekorativ': 'Installation av dekorativ LED-strip:\n• Planering av belysningsdesign\n• Montering av LED-strip\n• Installation av färgstyrning\n• Programmering av effekter\n• Test och demonstration'
        },
        'smart_belysning': {
            'plejd_system': 'Installation av Plejd smart belysning:\n• Installation av Plejd-moduler\n• Konfiguration av mesh-nätverk\n• Programmering av scener\n• Integration med app\n• Användarutbildning',
            'philips_hue': 'Installation av Philips Hue system:\n• Installation av Hue Bridge\n• Montering av smart belysning\n• Konfiguration av nätverk\n• Programmering av automationer\n• App-integration och test',
            'knx': 'Installation av KNX smart belysning:\n• Installation av KNX-buss\n• Programmering av systemkomponenter\n• Integration av sensorer och styrenheter\n• Konfiguration av automationer\n• Systemtest och dokumentation'
        },

        // Energi & Laddning
        'laddbox_elbil': {
            'typ2_22kw': 'Installation av laddbox 22kW Typ 2:\n• Installation av 3-fas matning\n• Montering av laddbox\n• Inkoppling av kommunikation\n• Konfiguration och test\n• Slutbesiktning och dokumentation',
            'cee_16a': 'Installation av CEE 16A laddning:\n• Installation av CEE-uttag\n• Dragning av dimensionerad kabel\n• Installation av säkringar\n• Test av laddningsfunktion\n• Säkerhetsdokumentation',
            'typ2_11kw': 'Installation av laddbox 11kW Typ 2:\n• Installation av 3-fas matning\n• Montering av laddbox\n• Konfiguration av laddeffekt\n• Test av alla säkerhetsfunktioner\n• Dokumentation och certifiering'
        },
        'solceller': {
            'vaxelriktare': 'Installation av växelriktare:\n• Montering av växelriktare\n• DC och AC-inkopplingar\n• Installation av övervakningssystem\n• Konfiguration och test\n• Nätkoppling och dokumentation',
            'optimizers': 'Installation av optimizers:\n• Montering vid solcellspaneler\n• Inkoppling av DC-kablar\n• Konfiguration av system\n• Test av panelövervakning\n• Systemdokumentation',
            'batterisystem': 'Installation av batterisystem:\n• Installation av batteripaket\n• Inkoppling av energihantering\n• Konfiguration av ladd-/urladdning\n• Integration med växelriktare\n• Säkerhetstest och certifiering'
        },

        // Värme & Komfort
        'handdukstork': 'Installation av handdukstork:\n• Montering av värmeelement\n• Anslutning av kabel\n• Installation av termostat\n• Test av värmefunktion\n• Säkerhetskontroll',
        'golvvarme': 'Installation av elvärme i golv:\n• Planering av värmeslingor\n• Installation av värmekabel\n• Montering av termostat\n• Test av alla värmekretsar\n• Isolering och dokumentation',
        'varmepump': {
            'inkoppling_befintlig': 'Inkoppling av befintlig värmepump:\n• Anslutning av elmatning\n• Installation av styrsystem\n• Inkoppling av sensorer\n• Test av alla funktioner\n• Programmering och dokumentation',
            'installation_luft_luft': 'Installation av luft-luft värmepump:\n• Montering av inne- och uteenhet\n• Dragning av kylledningar\n• Elinkoppling och styrning\n• Vakuumtest och påfyllning\n• Driftsättning och dokumentation'
        },

        // Säkerhet & Smarta Hem
        'brandvarnare': {
            'hardkopplad': 'Installation av hårdkopplad brandvarnare:\n• Dragning av brandvarnarkabel\n• Montering av brandvarnare\n• Sammankoppling av system\n• Test av alla detektorer\n• Certifiering enligt standard',
            'rokdetektor': 'Installation av rökdetektor:\n• Montering av rökdetektor\n• Test av detektorns funktion\n• Anslutning till larmsystem\n• Konfiguration av sensitivitet\n• Funktionstest och dokumentation'
        },
        'hemlarm': 'Installation av hemlarm:\n• Installation av larmcentral\n• Montering av rörelsesensorer och dörr/fönsterkontakter\n• Programmering av larmsystem\n• Installation av larmtelefon/app\n• Test av alla komponenter\n• Användarutbildning',
        'natverksuttag': {
            'cat6_uttag': 'Installation av Cat6 nätverksuttag:\n• Dragning av nätverkskabel\n• Montering av nätverksuttag\n• Terminering enligt Cat6-standard\n• Anslutning till nätverksswitch\n• Hastighetstest och dokumentation',
            'fiber': 'Installation av fiberanslutning:\n• Dragning av fiberkabel\n• Installation av fiberuttag\n• Anslutning till fiberomvandlare\n• Test av överföringshastighet\n• Dokumentation och certifiering',
            'wifi_access_point': 'Installation av WiFi access point:\n• Montering av accesspunkt\n• Anslutning till nätverkskabel\n• Konfiguration av trådlöst nätverk\n• Optimering av täckning\n• Säkerhetstest och dokumentation'
        }
    },

    // ROT-avdrag konfiguration
    ROT_DEDUCTION: {
        MAX_PER_PERSON: 50000,
        MAX_SHARED: 100000,
        RATE: 0.50 // 50% avdrag
    }
};

class PasswordProtection {
    constructor() {
        console.log('🔐 PasswordProtection konstruktor startar...');
        
        // Hitta alla nödvändiga DOM-element
        this.passwordOverlay = document.getElementById('password-overlay');
        this.passwordForm = document.getElementById('password-form');
        this.passwordInput = document.getElementById('password-input');
        this.passwordError = document.getElementById('password-error');
        this.mainApp = document.getElementById('mainContainer');
        
        // Kontrollera att alla element finns
        const missingElements = [];
        if (!this.passwordOverlay) missingElements.push('password-overlay');
        if (!this.passwordForm) missingElements.push('password-form');
        if (!this.passwordInput) missingElements.push('password-input');
        if (!this.passwordError) missingElements.push('password-error');
        if (!this.mainApp) missingElements.push('mainContainer');
        
        if (missingElements.length > 0) {
            console.error('❌ Saknade DOM-element:', missingElements);
            return;
        }
        
        this.attempts = 0;
        this.isLocked = false;
        
        this.initializePasswordProtection();
    }
    
    initializePasswordProtection() {
        // Kontrollera om användaren redan är inloggad
        const hasExistingSession = this.checkExistingSession();
        
        if (hasExistingSession) {
            this.grantAccess();
            return;
        }
        
        // Lyssna på formulärinlämning
        this.passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validatePassword();
        });
        
        // Fokusera på lösenordsfältet
        setTimeout(() => {
            this.passwordInput.focus();
        }, 500);
    }
    
    checkExistingSession() {
        // Rensa session vid varje ny flik/fönster för säkerhet
        localStorage.removeItem(PASSWORD_CONFIG.SESSION_KEY);
        return false;
    }
    
    validatePassword() {
        if (this.isLocked) return;
        
        const enteredPassword = this.passwordInput.value;
        
        if (enteredPassword === PASSWORD_CONFIG.CORRECT_PASSWORD) {
            this.saveSession();
            this.grantAccess();
        } else {
            this.attempts++;
            this.showError();
            
            if (this.attempts >= PASSWORD_CONFIG.MAX_ATTEMPTS) {
                this.lockPassword();
            }
        }
    }
    
    saveSession() {
        try {
            const sessionData = {
                authenticated: true,
                password: PASSWORD_CONFIG.CORRECT_PASSWORD,
                timestamp: Date.now()
            };
            localStorage.setItem(PASSWORD_CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.warn('Kunde inte spara session:', error);
        }
    }
    
    grantAccess() {
        this.passwordOverlay.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            this.passwordOverlay.style.display = 'none';
            this.mainApp.style.display = 'block';
            this.mainApp.style.animation = 'fadeIn 0.5s ease-out';
            
            // Initialisera huvudapplikation
            if (window.quoteCalculator) {
                window.quoteCalculator.init();
            } else {
                window.quoteCalculator = new QuoteCalculator();
            }
        }, 500);
    }
    
    showError() {
        let errorMessage = `Fel lösenord, försök igen (${this.attempts} av ${PASSWORD_CONFIG.MAX_ATTEMPTS} försök)`;
        
        if (this.attempts >= PASSWORD_CONFIG.MAX_ATTEMPTS) {
            errorMessage = `För många felaktiga försök. Klicka på "Försök igen" för att återställa.`;
        }
        
        this.passwordError.textContent = errorMessage;
        this.passwordError.style.display = 'block';
        this.passwordInput.value = '';
        
        if (!this.isLocked) {
            this.passwordInput.focus();
        }
    }
    
    lockPassword() {
        this.isLocked = true;
        this.passwordInput.disabled = true;
        
        // Ta bort befintlig reset-knapp om den finns
        let resetButton = document.getElementById('password-reset-btn');
        if (resetButton) {
            resetButton.remove();
        }
        
        // Skapa "Försök igen" knapp
        resetButton = document.createElement('button');
        resetButton.textContent = 'Försök igen';
        resetButton.id = 'password-reset-btn';
        resetButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            display: block;
            width: 100%;
            transition: background-color 0.3s ease;
        `;
        
        resetButton.addEventListener('click', () => {
            this.resetPassword();
        });
        
        this.passwordInput.parentNode.appendChild(resetButton);
    }
    
    resetPassword() {
        this.attempts = 0;
        this.isLocked = false;
        this.passwordInput.disabled = false;
        this.passwordError.style.display = 'none';
        this.passwordInput.focus();
        
        const resetButton = document.getElementById('password-reset-btn');
        if (resetButton) {
            resetButton.remove();
        }
    }
}

class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.loadSavedTheme();
    }

    setupThemeToggle() {
        this.themeToggle = document.getElementById('theme-toggle');
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
        
        this.updateThemeIcons(isDark);
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateThemeIcons(newTheme === 'dark');
    }

    updateThemeIcons(isDark) {
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (isDark) {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
            } else {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
            }
        }
    }
}

class QuoteCalculator {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 QuoteCalculator initialiserad');
        
        this.waitForDOMReady(() => {
            this.setupElectricalServiceListeners();
            this.setupTabNavigation();
            this.setupFormSubmission();
            this.setupNavigationButtons();
            console.log('✅ Alla event listeners konfigurerade');
        });
    }

    waitForDOMReady(callback) {
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', callback);
        } else if (document.readyState === 'interactive') {
            setTimeout(callback, 100);
        } else {
            callback();
        }
    }

    setupElectricalServiceListeners() {
        console.log('🎯 Sätter upp event listeners för elinstallationer');
        
        // Lyssna på alla elinstallations-checkboxes
        const serviceCheckboxes = document.querySelectorAll('input[name="elinstallationer"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.handleElectricalServiceSelection(checkbox);
                this.calculateElectricalQuote();
                this.updateWorkDescription();
            });
        });

        // Lyssna på alla dropdown-menyer för elinstallationer
        const serviceDropdowns = document.querySelectorAll('.service-dropdown');
        serviceDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', () => {
                this.calculateElectricalQuote();
                this.updateWorkDescription();
            });
        });

        // Lyssna på alla antal-inputfält
        const serviceInputs = document.querySelectorAll('.service-input');
        serviceInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateElectricalQuote();
                this.updateWorkDescription();
            });
        });

        // Lyssna på ROT-avdrag radio buttons
        const rotRadios = document.querySelectorAll('input[name="fastighet_rot_berättigad"], input[name="är_du_berättigad_rot_avdrag"], input[name="delat_rot_avdrag"]');
        rotRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleROTAvdragChange();
                this.calculateElectricalQuote();
            });
        });

        // Lyssna på Grön Teknik-avdrag checkbox
        const greenTechCheckbox = document.getElementById('green_tech_eligible');
        if (greenTechCheckbox) {
            greenTechCheckbox.addEventListener('change', () => {
                this.handleGreenTechChange();
                this.calculateElectricalQuote();
            });
        }

        // Lyssna på Grön Teknik personer-dropdown
        const greenTechPersons = document.getElementById('green_tech_persons');
        if (greenTechPersons) {
            greenTechPersons.addEventListener('change', () => {
                this.calculateElectricalQuote();
            });
        }

        // Materialkostnad hanteras nu automatiskt från produktval

        // Lyssna på kundinformation för arbetsbeskrivning
        const customerFields = [
            'customer-company', 'customer-contact', 'customer-email', 'customer-phone',
            'customer-address', 'customer-postal-code', 'customer-city'
        ];
        
        customerFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.updateWorkDescription();
                    this.copyCustomerDataToWorkDescription();
                });
            }
        });
    }

    handleElectricalServiceSelection(checkbox) {
        const serviceOptions = checkbox.closest('.service-item').querySelector('.service-options');
        
        if (serviceOptions) {
            if (checkbox.checked) {
                serviceOptions.style.display = 'flex';
            } else {
                serviceOptions.style.display = 'none';
                // Rensa dropdown och input när tjänsten avmarkeras
                const dropdown = serviceOptions.querySelector('.service-dropdown');
                const input = serviceOptions.querySelector('.service-input');
                
                if (dropdown) dropdown.selectedIndex = 0;
                if (input) input.value = '';
            }
        }
    }

    handleROTAvdragChange() {
        const fastighetROT = document.querySelector('input[name="fastighet_rot_berättigad"]:checked');
        const kundROT = document.querySelector('input[name="är_du_berättigad_rot_avdrag"]:checked');
        
        const delatRotSection = document.getElementById('delat-rot-section');
        
        // Visa/dölj ROT-relaterade sektioner
        const showROTSections = fastighetROT?.value === 'Ja - Villa/Radhus' && 
                               kundROT?.value === 'Ja - inkludera ROT-avdrag i anbudet';
        
        if (delatRotSection) {
            delatRotSection.style.display = showROTSections ? 'block' : 'none';
        }
        
        // Uppdatera även grön teknik-synlighet
        this.updateGreenTechVisibility();
    }

    updateGreenTechVisibility() {
        const selectedServices = this.getSelectedElectricalServices();
        const hasGreenTechProducts = selectedServices.some(service => service.greenTech);
        
        const greenTechSection = document.getElementById('green-tech-section');
        if (greenTechSection) {
            greenTechSection.style.display = hasGreenTechProducts ? 'block' : 'none';
        }
    }

    handleGreenTechChange() {
        const greenTechCheckbox = document.getElementById('green_tech_eligible');
        const greenTechPersonsSection = document.getElementById('green-tech-persons-section');
        
        if (greenTechPersonsSection) {
            greenTechPersonsSection.style.display = greenTechCheckbox?.checked ? 'block' : 'none';
        }
    }

    collectGreenTechData() {
        const eligible = document.getElementById('green_tech_eligible')?.checked || false;
        const persons = document.getElementById('green_tech_persons')?.value || '1';
        
        return {
            eligible,
            maxAmount: persons === '1' ? 50000 : 100000
        };
    }

    categorizeServices(selectedServices) {
        const greenTechServices = [];
        const regularServices = [];
        
        selectedServices.forEach(service => {
            if (service.greenTech) {
                greenTechServices.push(service);
            } else {
                regularServices.push(service);
            }
        });
        
        return { greenTechServices, regularServices };
    }

    calculateElectricalQuote() {
        console.log('💰 Beräknar elinstallationer-pris med ROT/Grön Teknik dubbla avdrag');
        
        const selectedServices = this.getSelectedElectricalServices();
        this.updateGreenTechVisibility(); // Uppdatera grön teknik-synlighet
        
        if (selectedServices.length === 0) {
            this.updatePricingDisplay(0, 0, 0, 0, 0, 0, {});
            return { subtotal: 0, finalTotal: 0, services: [] };
        }

        // Kategorisera tjänster i grön teknik och vanliga
        const { greenTechServices, regularServices } = this.categorizeServices(selectedServices);
        
        // Beräkna totalkostnader
        let totalMaterial = 0;
        let totalLabor = 0;
        let greenTechMaterial = 0;
        let greenTechLabor = 0;
        let regularMaterial = 0;
        let regularLabor = 0;

        selectedServices.forEach(service => {
            totalMaterial += service.totalMaterial;
            totalLabor += service.totalLabor;
            
            if (service.greenTech) {
                greenTechMaterial += service.totalMaterial;
                greenTechLabor += service.totalLabor;
            } else {
                regularMaterial += service.totalMaterial;
                regularLabor += service.totalLabor;
            }
        });

        const subtotal = totalMaterial + totalLabor;
        const vatAmount = subtotal * 0.25;
        const totalWithVat = subtotal + vatAmount;

        // Beräkna med moms för avdragskategorier
        const regularMaterialWithVat = regularMaterial * 1.25;
        const regularLaborWithVat = regularLabor * 1.25;
        const greenTechMaterialWithVat = greenTechMaterial * 1.25;
        const greenTechLaborWithVat = greenTechLabor * 1.25;

        // SCENARIO 1: Bara grön teknik-produkter
        if (greenTechServices.length > 0 && regularServices.length === 0) {
            const greenTechData = this.collectGreenTechData();
            let greenTechDeduction = 0;
            
            if (greenTechData.eligible) {
                // Grön teknik-avdrag på hela kostnaden (material + arbete)
                greenTechServices.forEach(service => {
                    const serviceTotal = (service.totalMaterial + service.totalLabor) * 1.25;
                    greenTechDeduction += serviceTotal * (service.greenTechRate / 100);
                });
                
                // Begränsa enligt maxbelopp
                if (greenTechDeduction > greenTechData.maxAmount) {
                    greenTechDeduction = greenTechData.maxAmount;
                }
            }
            
            const finalTotal = totalWithVat - greenTechDeduction;
            this.updatePricingDisplay(subtotal, vatAmount, totalWithVat, 0, greenTechDeduction, finalTotal, {
                totalMaterial, totalLabor, regularMaterial, regularLabor, greenTechMaterial, greenTechLabor,
                scenario: 'greenOnly'
            });
            
            return {
                subtotal, totalWithVat, greenTechDeduction, finalTotal, services: selectedServices,
                scenario: 'greenOnly'
            };
        }
        
        // SCENARIO 2: Bara vanliga produkter
        if (regularServices.length > 0 && greenTechServices.length === 0) {
            const rotData = this.collectROTData();
            let rotDeduction = 0;
            
            if (this.isROTEligible(rotData)) {
                rotDeduction = regularLaborWithVat * CONFIG.ROT_DEDUCTION.RATE;
                
                const maxROTDeduction = rotData.delatROT === 'Ja' ? 
                    CONFIG.ROT_DEDUCTION.MAX_SHARED : CONFIG.ROT_DEDUCTION.MAX_PER_PERSON;
                
                if (rotDeduction > maxROTDeduction) {
                    rotDeduction = maxROTDeduction;
                }
            }
            
            const finalTotal = totalWithVat - rotDeduction;
            this.updatePricingDisplay(subtotal, vatAmount, totalWithVat, rotDeduction, 0, finalTotal, {
                totalMaterial, totalLabor, regularMaterial, regularLabor, greenTechMaterial, greenTechLabor,
                scenario: 'rotOnly'
            });
            
            return {
                subtotal, totalWithVat, rotDeduction, finalTotal, services: selectedServices,
                scenario: 'rotOnly'
            };
        }
        
        // SCENARIO 3: Blandade produkter - båda avdragen
        const rotData = this.collectROTData();
        const greenTechData = this.collectGreenTechData();
        let rotDeduction = 0;
        let greenTechDeduction = 0;
        
        // ROT-avdrag på vanliga produkters arbetskostnad
        if (this.isROTEligible(rotData)) {
            rotDeduction = regularLaborWithVat * CONFIG.ROT_DEDUCTION.RATE;
            
            const maxROTDeduction = rotData.delatROT === 'Ja' ? 
                CONFIG.ROT_DEDUCTION.MAX_SHARED : CONFIG.ROT_DEDUCTION.MAX_PER_PERSON;
            
            if (rotDeduction > maxROTDeduction) {
                rotDeduction = maxROTDeduction;
            }
        }
        
        // Grön Teknik-avdrag på grön teknik-produkter (material + arbete)
        if (greenTechData.eligible) {
            greenTechServices.forEach(service => {
                const serviceTotal = (service.totalMaterial + service.totalLabor) * 1.25;
                greenTechDeduction += serviceTotal * (service.greenTechRate / 100);
            });
            
            if (greenTechDeduction > greenTechData.maxAmount) {
                greenTechDeduction = greenTechData.maxAmount;
            }
        }
        
        const finalTotal = totalWithVat - rotDeduction - greenTechDeduction;
        this.updatePricingDisplay(subtotal, vatAmount, totalWithVat, rotDeduction, greenTechDeduction, finalTotal, {
            totalMaterial, totalLabor, regularMaterial, regularLabor, greenTechMaterial, greenTechLabor,
            scenario: 'mixed'
        });
        
        return {
            subtotal, totalWithVat, rotDeduction, greenTechDeduction, finalTotal, services: selectedServices,
            scenario: 'mixed'
        };
    }

    getSelectedElectricalServices() {
        const services = [];
        
        // Gå igenom alla tjänstekategorier
        Object.keys(CONFIG.ELECTRICAL_PRICING).forEach(serviceId => {
            const checkbox = document.getElementById(serviceId);
            
            if (checkbox && checkbox.checked) {
                const serviceConfig = CONFIG.ELECTRICAL_PRICING[serviceId];
                const dropdown = document.getElementById(`${serviceId}_type`);
                const quantityInput = document.getElementById(`${serviceId}_antal`) || 
                                    document.getElementById(`${serviceId}_meter`) || 
                                    document.getElementById(`${serviceId}_kvm`);
                
                let productData = null;
                let quantity = 1;
                
                // Hämta kvantitet
                if (quantityInput && quantityInput.value) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                
                // Hämta produktdata från dropdown
                if (dropdown && dropdown.value && serviceConfig[dropdown.value]) {
                    productData = serviceConfig[dropdown.value];
                }
                
                if (productData && quantity > 0) {
                    const totalMaterial = productData.materialCost * quantity;
                    const totalLabor = productData.laborCost * quantity;
                    const totalPrice = totalMaterial + totalLabor;
                    
                    services.push({
                        id: serviceId,
                        name: checkbox.labels[0].textContent,
                        productName: productData.description,
                        productKey: dropdown.value,
                        quantity: quantity,
                        unitMaterial: productData.materialCost,
                        unitLabor: productData.laborCost,
                        unitTotal: productData.materialCost + productData.laborCost,
                        totalMaterial: totalMaterial,
                        totalLabor: totalLabor,
                        totalPrice: totalPrice,
                        laborHours: productData.laborHours,
                        greenTech: productData.greenTech || false,
                        greenTechRate: productData.greenTechRate || 0
                    });
                }
            }
        });
        
        return services;
    }

    isROTEligible(rotData) {
        return rotData.fastighetBerättigad === 'Ja - Villa/Radhus' && 
               rotData.kundBerättigad === 'Ja - inkludera ROT-avdrag i anbudet';
    }

    collectROTData() {
        const fastighetROT = document.querySelector('input[name="fastighet_rot_berättigad"]:checked');
        const kundROT = document.querySelector('input[name="är_du_berättigad_rot_avdrag"]:checked');
        const delatROT = document.querySelector('input[name="delat_rot_avdrag"]:checked');
        
        return {
            fastighetBerättigad: fastighetROT?.value || 'Nej - Lägenhet/Kontor/Annat',
            kundBerättigad: kundROT?.value || 'Nej - visa pris utan ROT-avdrag',
            delatROT: delatROT?.value || 'Nej'
        };
    }

    updatePricingDisplay(subtotal, vatAmount, totalWithVat, rotDeduction, greenTechDeduction, finalTotal, extras = {}) {
        const { 
            totalMaterial = 0, 
            totalLabor = 0, 
            regularMaterial = 0, 
            regularLabor = 0, 
            greenTechMaterial = 0, 
            greenTechLabor = 0,
            scenario = 'rotOnly'
        } = extras;

        // Format numbers with proper spacing (Swedish standard)
        const formatPrice = (amount) => {
            return new Intl.NumberFormat('sv-SE', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(amount)).replace(/\s/g, ' ') + ' kr';
        };

        // Get or create main price container
        let priceContainer = document.querySelector('.clean-price-overview');
        if (!priceContainer) {
            // Find existing price section and replace content
            const priceSection = document.querySelector('.price-section');
            if (priceSection) {
                priceSection.innerHTML = `
                    <h3>Prisöversikt</h3>
                    <div class="clean-price-overview"></div>
                    <div class="price-details" style="display: none;">
                        <div class="details-content"></div>
                    </div>
                `;
                priceContainer = priceSection.querySelector('.clean-price-overview');
            }
        }

        if (!priceContainer) return;

        // Build clean core pricing display
        let coreHtml = `
            <div class="price-core">
                <div class="price-line excl-vat-price">
                    <span class="price-label">Pris exkl. moms:</span>
                    <span class="price-value">${formatPrice(subtotal)}</span>
                </div>
                <div class="price-line material-cost">
                    <span class="price-label">Varav materialkostnad:</span>
                    <span class="price-value">${formatPrice(totalMaterial)}</span>
                </div>
                <div class="price-line main-price">
                    <span class="price-label">Pris inkl. moms:</span>
                    <span class="price-value">${formatPrice(totalWithVat)}</span>
                </div>
        `;

        // Add ROT deduction if applicable
        if (rotDeduction > 0) {
            coreHtml += `
                <div class="price-line deduction-line">
                    <span class="price-label">ROT-avdrag:</span>
                    <span class="price-value deduction-amount">–${formatPrice(rotDeduction)}</span>
                </div>
            `;
        }

        // Add Green Tech deduction if applicable  
        if (greenTechDeduction > 0) {
            coreHtml += `
                <div class="price-line deduction-line">
                    <span class="price-label">Grön teknik-avdrag:</span>
                    <span class="price-value deduction-amount">–${formatPrice(greenTechDeduction)}</span>
                </div>
            `;
        }

        // Add final amount to pay
        coreHtml += `
                <div class="price-line final-price">
                    <span class="price-label final-label">Att betala:</span>
                    <span class="price-value final-amount">${formatPrice(finalTotal)}</span>
                </div>
            </div>
        `;

        // Add show details button
        coreHtml += `
            <button class="show-details-btn" onclick="this.parentElement.parentElement.querySelector('.price-details').style.display = this.parentElement.parentElement.querySelector('.price-details').style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent === 'Visa detaljer' ? 'Dölj detaljer' : 'Visa detaljer';">
                Visa detaljer
            </button>
        `;

        // Add disclaimer
        coreHtml += `
            <div class="price-disclaimer">
                Avdragen är preliminära. Slutligt avdrag beslutas av Skatteverket.
            </div>
        `;

        priceContainer.innerHTML = coreHtml;

        // Build detailed breakdown (hidden by default)
        this.updateDetailedBreakdown(subtotal, vatAmount, totalWithVat, rotDeduction, greenTechDeduction, extras, formatPrice);
    }

    updateDetailedBreakdown(subtotal, vatAmount, totalWithVat, rotDeduction, greenTechDeduction, extras, formatPrice) {
        const { 
            totalMaterial = 0, 
            totalLabor = 0, 
            regularMaterial = 0, 
            regularLabor = 0, 
            greenTechMaterial = 0, 
            greenTechLabor = 0,
            scenario = 'rotOnly'
        } = extras;

        const detailsContainer = document.querySelector('.details-content');
        if (!detailsContainer) return;

        let detailsHtml = '<div class="detailed-breakdown">';

        // Material and labor breakdown (excl VAT)
        detailsHtml += '<div class="breakdown-section"><h4>Delpriser exkl. moms</h4>';
        
        if (scenario === 'mixed') {
            detailsHtml += `
                <div class="detail-line">Vanligt material: ${formatPrice(regularMaterial)}</div>
                <div class="detail-line">Vanligt arbete: ${formatPrice(regularLabor)}</div>
                <div class="detail-line">Grön teknik material: ${formatPrice(greenTechMaterial)}</div>
                <div class="detail-line">Grön teknik arbete: ${formatPrice(greenTechLabor)}</div>
            `;
        } else {
            detailsHtml += `
                <div class="detail-line">Material: ${formatPrice(totalMaterial)}</div>
                <div class="detail-line">Arbete: ${formatPrice(totalLabor)}</div>
            `;
        }
        
        detailsHtml += '</div>';

        // VAT section
        detailsHtml += `
            <div class="breakdown-section">
                <div class="detail-line">Momsbelopp (25%): ${formatPrice(vatAmount)}</div>
                <div class="detail-line total-line">Mellansumma inkl. moms: ${formatPrice(totalWithVat)}</div>
            </div>
        `;

        // Calculation explanation
        let explanationText = '';
        if (rotDeduction > 0 && greenTechDeduction > 0) {
            explanationText = 'ROT beräknas på arbetskostnad inkl. moms. Grön teknik-avdrag beräknas på både produkter och arbete inom grön teknik.';
        } else if (rotDeduction > 0) {
            explanationText = 'ROT-avdrag beräknas på 50% av arbetskostnad inkl. moms.';
        } else if (greenTechDeduction > 0) {
            explanationText = 'Grön teknik-avdrag beräknas på både produkter och arbete inom grön teknik.';
        }

        if (explanationText) {
            detailsHtml += `
                <div class="breakdown-section">
                    <div class="calculation-note">${explanationText}</div>
                </div>
            `;
        }

        detailsHtml += '</div>';
        detailsContainer.innerHTML = detailsHtml;
    }

    updateWorkDescription() {
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) return;

        let workDescription = 'ELINSTALLATIONER - ARBETSBESKRIVNING\n\n';
        workDescription += 'Solida Elinstallationer AB\n';
        workDescription += 'Organisationsnummer: 559123-4567\n';
        workDescription += 'Telefon: 073-123 45 67\n';
        workDescription += 'E-post: info@solidaelinstallationer.se\n\n';
        
        workDescription += '**VALDA ELINSTALLATIONER**\n\n';

        const selectedServices = this.getSelectedElectricalServices();
        
        if (selectedServices.length === 0) {
            workDescription += 'Inga tjänster valda ännu.\n\n';
        } else {
            let totalMaterial = 0;
            let totalLabor = 0;
            
            selectedServices.forEach((service, index) => {
                totalMaterial += service.totalMaterial;
                totalLabor += service.totalLabor;
                
                workDescription += `${index + 1}. ${service.name.toUpperCase()}\n`;
                workDescription += `   Produkt: ${service.productName}\n`;
                workDescription += `   Antal: ${service.quantity} st\n`;
                workDescription += `   Material: ${new Intl.NumberFormat('sv-SE').format(service.unitMaterial)} kr × ${service.quantity} = ${new Intl.NumberFormat('sv-SE').format(service.totalMaterial)} kr\n`;
                workDescription += `   Arbete: ${new Intl.NumberFormat('sv-SE').format(service.unitLabor)} kr × ${service.quantity} = ${new Intl.NumberFormat('sv-SE').format(service.totalLabor)} kr\n`;
                workDescription += `   Total: ${new Intl.NumberFormat('sv-SE').format(service.totalPrice)} kr\n\n`;
                
                // Lägg till detaljerad arbetsbeskrivning
                const description = this.getServiceWorkDescription(service.id, service.productKey);
                if (description) {
                    workDescription += `   ARBETSBESKRIVNING:\n   ${description.split('\n').join('\n   ')}\n\n`;
                }
                
                // Lägg till materialspecifikation
                const materialInfo = this.getServiceMaterials(service.id, service.productKey, service.quantity);
                if (materialInfo) {
                    workDescription += `   MATERIAL:\n   ${materialInfo.split('\n').join('\n   ')}\n\n`;
                }
            });
            
            // Lägg till kostnadssummering
            workDescription += '**KOSTNADSSUMMERING**\n\n';
            workDescription += `Total materialkostnad: ${new Intl.NumberFormat('sv-SE').format(totalMaterial)} kr\n`;
            workDescription += `Total arbetskostnad: ${new Intl.NumberFormat('sv-SE').format(totalLabor)} kr\n`;
            workDescription += `Subtotal (exkl moms): ${new Intl.NumberFormat('sv-SE').format(totalMaterial + totalLabor)} kr\n`;
            workDescription += `Moms 25%: ${new Intl.NumberFormat('sv-SE').format((totalMaterial + totalLabor) * 0.25)} kr\n`;
            workDescription += `Total inkl moms: ${new Intl.NumberFormat('sv-SE').format((totalMaterial + totalLabor) * 1.25)} kr\n\n`;
            
            // ROT-avdrag information
            const rotData = this.collectROTData();
            if (this.isROTEligible(rotData)) {
                const rotDeduction = (totalLabor * 1.25) * 0.5;
                const finalTotal = (totalMaterial + totalLabor) * 1.25 - rotDeduction;
                workDescription += `ROT-avdrag (50% på arbetskostnad inkl moms): -${new Intl.NumberFormat('sv-SE').format(rotDeduction)} kr\n`;
                workDescription += `SLUTSUMMA EFTER ROT-AVDRAG: ${new Intl.NumberFormat('sv-SE').format(finalTotal)} kr\n\n`;
            }
        }

        // Lägg till allmän information
        workDescription += '**ALLMÄN INFORMATION**\n\n';
        workDescription += '• Alla installationer utförs enligt gällande standarder (SS-EN)\n';
        workDescription += '• Besiktning och certifiering ingår\n';
        workDescription += '• Garantitid: 5 år på utfört arbete\n';
        workDescription += '• Säkerhet: Alla elektriker är behöriga och certifierade\n\n';

        // ROT-avdrag information
        const rotData = this.collectROTData();
        if (this.isROTEligible(rotData)) {
            workDescription += '• ROT-avdrag kan tillämpas (50% skattereduktion på arbetskostnad)\n';
            workDescription += '• Vi hjälper till med ROT-avdragsansökan\n\n';
        }

        workDescription += 'Tack för förtroendet!\n';
        workDescription += 'Solida Elinstallationer AB';

        workDescriptionTextarea.value = workDescription;
    }

    getServiceWorkDescription(serviceId, serviceType) {
        const descriptions = CONFIG.WORK_DESCRIPTIONS[serviceId];
        
        if (!descriptions) return '';
        
        if (typeof descriptions === 'string') {
            return descriptions;
        } else if (typeof descriptions === 'object' && serviceType) {
            // Hitta matchande beskrivning baserat på serviceType
            const key = Object.keys(descriptions).find(k => 
                descriptions[k] && serviceType.toLowerCase().includes(k.toLowerCase())
            );
            return descriptions[key] || Object.values(descriptions)[0] || '';
        }
        
        return '';
    }

    getServiceMaterials(serviceId, productKey, quantity) {
        const serviceConfig = CONFIG.ELECTRICAL_PRICING[serviceId];
        if (!serviceConfig || !productKey) return '';
        
        const productData = serviceConfig[productKey];
        if (!productData) return '';
        
        let materialInfo = '';
        
        // Lägg till produktbeskrivning
        if (productData.description) {
            materialInfo += `• ${productData.description}`;
            if (quantity > 1) {
                materialInfo += ` - ${quantity} st`;
            }
            materialInfo += '\n';
        }
        
        // Lägg till ytterligare material baserat på tjänsttyp
        const additionalMaterials = this.getAdditionalMaterials(serviceId, productKey);
        if (additionalMaterials) {
            materialInfo += additionalMaterials;
        }
        
        return materialInfo.trim();
    }

    getAdditionalMaterials(serviceId, productKey) {
        // Definiera ytterligare material baserat på tjänsttyp
        const additionalMaterials = {
            'extra_eluttag': '• Elrör PEX 16mm\n• Kabel 3G1,5mm²\n• Gipsskruv och spackel\n• Väggfäste',
            'strombrytare': '• Elrör PEX 16mm\n• Kabel 3G1,5mm²\n• Kopplingsklämma\n• Väggfäste',
            'byte_elcentral': '• Automatsäkringar 10-16A\n• Jordfelsbrytare 30mA\n• Märkskylt\n• Kabelsko och märkband',
            'dragning_ny_el': '• Installationsrör\n• Dragstål\n• Kabelklämma\n• Tätningsmassa',
            'inkoppling_hushallsmaskin': '• Anslutningskabel\n• Säkringsautomat\n• Jordfelsbrytare\n• Kopplingsplint',
            'belysning': '• Installationsrör\n• Kabel 3G1,5mm²\n• Ljuskälla (LED)\n• Väggfäste/takfäste',
            'lamputtag': '• Elrör PEX 16mm\n• Kabel 3G1,5mm²\n• Lamppropp\n• Takfäste',
            'installation_dator': '• Nätverkskabel Cat6\n• Keystone uttag\n• Vägguttag\n• Patchkabel',
            'installation_tv': '• Koaxialkabel\n• TV-uttag\n• Väggfäste\n• F-kontakt',
            'installation_larm': '• Alarmkabel\n• Detektor\n• Magnetkontakt\n• Kopplingsbox',
            'solceller': productKey?.includes('monokristallin') ? 
                '• Monteringsrail\n• Klämma och skruv\n• DC-kabel\n• Säkringar DC' :
                productKey?.includes('polykristallin') ?
                '• Monteringsrail\n• Klämma och skruv\n• DC-kabel\n• Säkringar DC' :
                '• Mikroinverterare\n• Monteringsrail\n• AC-kabel\n• Säkringar',
            'laddbox': '• Jordfelsbrytare Typ A\n• Säkringsautomat 16-32A\n• Kabel 5G6-10mm²\n• Väggfäste',
            'batterilagring': '• DC-säkringar\n• Batterikabel\n• Övervakningssystem\n• Ventilation'
        };
        
        return additionalMaterials[serviceId] || '';
    }

    copyCustomerDataToWorkDescription() {
        const mappings = {
            'customer-company': 'arb-company',
            'customer-contact': 'arb-contact_person', 
            'customer-email': 'arb-email',
            'customer-phone': 'arb-phone',
            'customer-address': 'arb-address',
            'customer-postal-code': 'arb-postal_code',
            'customer-city': 'arb-city'
        };
        
        Object.entries(mappings).forEach(([sourceId, targetId]) => {
            const sourceField = document.getElementById(sourceId);
            const targetField = document.getElementById(targetId);
            
            if (sourceField && targetField) {
                targetField.value = sourceField.value;
            }
        });
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Uppdatera tab-knappar
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Uppdatera tab-innehåll
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
                
                // Kopiera kundinformation när vi går till arbetsbeskrivning
                if (targetTab === 'arbetsbeskrivning') {
                    this.copyCustomerDataToWorkDescription();
                    this.updateWorkDescription();
                }
            });
        });
    }

    setupFormSubmission() {
        // Implementera formulärinlämning för olika tabs här
        console.log('📝 Form submission setup placeholder');
    }

    setupNavigationButtons() {
        // Reset-knapp
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetApp();
            });
        }

        // Logout-knapp
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Mobile optimization: Add touch feedback
        this.addTouchFeedback();
        
        // Mobile optimization: Handle orientation change
        this.handleOrientationChange();
        
        // Setup signature functionality
        this.setupSignatureFunctionality();
    }

    addTouchFeedback() {
        // Add touch feedback for better mobile UX
        const touchElements = document.querySelectorAll('.radio-label, .checkbox-label, .service-header, .tab-button, .nav-btn, .submit-btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.opacity = '0.7';
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 150);
            });
            
            element.addEventListener('touchcancel', () => {
                element.style.opacity = '1';
            });
        });
    }

    handleOrientationChange() {
        // Handle mobile orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate layout after orientation change
                this.updateGreenTechVisibility();
                
                // Reinitialize signature canvas if modal is open
                const modal = document.getElementById('signature-fullscreen-modal');
                if (modal && modal.style.display !== 'none') {
                    this.initializeSignatureCanvas();
                }
                
                // Scroll to top if needed on landscape
                if (window.orientation === 90 || window.orientation === -90) {
                    const header = document.querySelector('.header');
                    if (header) {
                        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 300);
        });
    }

    setupSignatureFunctionality() {
        // Initialize signature canvas
        this.signatureCanvas = null;
        this.signatureContext = null;
        this.isDrawing = false;
        this.currentSignatureType = null; // 'main' or 'tillagg'

        // Setup event listeners for signature buttons
        this.setupSignatureEventListeners();
    }

    setupSignatureEventListeners() {
        // Main signature button
        const mainSignatureBtn = document.getElementById('signature-fullscreen-btn');
        if (mainSignatureBtn) {
            mainSignatureBtn.addEventListener('click', () => {
                this.openSignatureModal('main');
            });
        }

        // Tilläggstjänst signature button  
        const tillaggSignatureBtn = document.getElementById('tillagg-signature-fullscreen-btn');
        if (tillaggSignatureBtn) {
            tillaggSignatureBtn.addEventListener('click', () => {
                this.openSignatureModal('tillagg');
            });
        }

        // Clear signature buttons
        const clearSignatureBtn = document.getElementById('clear-signature');
        if (clearSignatureBtn) {
            clearSignatureBtn.addEventListener('click', () => {
                this.clearSignature('main');
            });
        }

        const tillaggClearSignatureBtn = document.getElementById('tillagg-clear-signature');
        if (tillaggClearSignatureBtn) {
            tillaggClearSignatureBtn.addEventListener('click', () => {
                this.clearSignature('tillagg');
            });
        }

        // Modal control buttons
        const saveBtn = document.getElementById('signature-fullscreen-save');
        const clearBtn = document.getElementById('signature-fullscreen-clear');
        const cancelBtn = document.getElementById('signature-fullscreen-cancel');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSignature();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCanvas();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeSignatureModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('signature-fullscreen-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSignatureModal();
                }
            });
        }
    }

    openSignatureModal(type) {
        this.currentSignatureType = type;
        const modal = document.getElementById('signature-fullscreen-modal');
        const canvas = document.getElementById('signature-fullscreen-canvas');
        
        if (modal && canvas) {
            modal.style.display = 'flex';
            
            // Initialize canvas
            setTimeout(() => {
                this.initializeSignatureCanvas();
            }, 100);
            
            // Show orientation notice on mobile
            this.showOrientationNotice();
        }
    }

    closeSignatureModal() {
        const modal = document.getElementById('signature-fullscreen-modal');
        if (modal) {
            modal.style.display = 'none';
            this.currentSignatureType = null;
        }
    }

    initializeSignatureCanvas() {
        const canvas = document.getElementById('signature-fullscreen-canvas');
        if (!canvas) return;

        this.signatureCanvas = canvas;
        this.signatureContext = canvas.getContext('2d');

        // Set canvas size based on screen orientation and size
        const rect = canvas.parentElement.getBoundingClientRect();
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = window.innerWidth < 768;
        
        if (isMobile && isLandscape) {
            // Landscape mode on mobile - use full available space
            canvas.width = Math.min(rect.width - 20, window.innerWidth - 20);
            canvas.height = Math.min(rect.height - 100, window.innerHeight - 150); // Leave space for controls
        } else {
            // Portrait mode or desktop
            canvas.width = rect.width - 40; // Account for padding
            canvas.height = Math.min(400, rect.height - 40);
        }

        // Setup canvas styling
        this.signatureContext.lineWidth = 3;
        this.signatureContext.lineCap = 'round';
        this.signatureContext.strokeStyle = '#000000';

        // Add event listeners for drawing
        this.setupCanvasDrawing();
    }

    setupCanvasDrawing() {
        if (!this.signatureCanvas) return;

        // Mouse events
        this.signatureCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.signatureCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.signatureCanvas.addEventListener('mouseup', () => this.stopDrawing());
        this.signatureCanvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for mobile
        this.signatureCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.signatureCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.signatureCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.signatureContext.beginPath();
        this.signatureContext.moveTo(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.signatureCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.signatureContext.lineTo(x, y);
        this.signatureContext.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        if (this.signatureCanvas && this.signatureContext) {
            this.signatureContext.clearRect(0, 0, this.signatureCanvas.width, this.signatureCanvas.height);
        }
    }

    saveSignature() {
        if (!this.signatureCanvas || !this.currentSignatureType) return;

        // Convert canvas to image
        const imageData = this.signatureCanvas.toDataURL('image/png');
        
        // Update the appropriate preview
        if (this.currentSignatureType === 'main') {
            this.updateSignaturePreview('signature', imageData);
        } else if (this.currentSignatureType === 'tillagg') {
            this.updateSignaturePreview('tillagg-signature', imageData);
        }

        // Close modal
        this.closeSignatureModal();
    }

    updateSignaturePreview(prefix, imageData) {
        const previewImage = document.getElementById(`${prefix}-image`);
        const placeholder = document.querySelector(`#${prefix}-preview .signature-placeholder`);
        const clearBtn = document.getElementById(`${prefix === 'signature' ? 'clear-signature' : 'tillagg-clear-signature'}`);

        if (previewImage) {
            previewImage.src = imageData;
            previewImage.style.display = 'block';
        }

        if (placeholder) {
            placeholder.style.display = 'none';
        }

        if (clearBtn) {
            clearBtn.style.display = 'inline-block';
        }
    }

    clearSignature(type) {
        const prefix = type === 'main' ? 'signature' : 'tillagg-signature';
        const previewImage = document.getElementById(`${prefix}-image`);
        const placeholder = document.querySelector(`#${prefix}-preview .signature-placeholder`);
        const clearBtn = document.getElementById(`${prefix === 'signature' ? 'clear-signature' : 'tillagg-clear-signature'}`);

        if (previewImage) {
            previewImage.src = '';
            previewImage.style.display = 'none';
        }

        if (placeholder) {
            placeholder.style.display = 'block';
        }

        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }

    showOrientationNotice() {
        const notice = document.getElementById('signature-orientation-notice');
        if (notice && window.innerWidth < 768) {
            const isPortrait = window.innerHeight > window.innerWidth;
            if (isPortrait) {
                notice.style.display = 'block';
            } else {
                // In landscape mode, always hide the notice
                notice.style.display = 'none';
            }
        } else if (notice) {
            // On desktop, hide the notice
            notice.style.display = 'none';
        }
    }

    resetApp() {
        // Rensa alla formulärfält
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Dölj alla service-options
        const serviceOptions = document.querySelectorAll('.service-options');
        serviceOptions.forEach(option => {
            option.style.display = 'none';
        });
        
        // Dölj ROT-sektioner
        const rotSections = ['delat-rot-section', 'materialkostnad-section'];
        rotSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Nollställ prisvisning
        this.updatePricingDisplay(0, 0, 0, 0, 0, 0, {});
        
        // Rensa signaturer
        this.clearSignature('main');
        this.clearSignature('tillagg');
        
        // Rensa arbetsbeskrivning
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (workDescriptionTextarea) {
            workDescriptionTextarea.value = '';
        }
        
        console.log('✅ Applikationen återställd');
    }

    logout() {
        // Rensa session
        localStorage.removeItem(PASSWORD_CONFIG.SESSION_KEY);
        
        // Nollställ appen
        this.resetApp();
        
        // Visa lösenordsskärmen igen
        const passwordOverlay = document.getElementById('password-overlay');
        const mainContainer = document.getElementById('mainContainer');
        
        if (passwordOverlay && mainContainer) {
            passwordOverlay.style.display = 'flex';
            mainContainer.style.display = 'none';
        }
        
        // Fokusera på lösenordsfältet
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

// Initialisera applikationen när DOM är laddat
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialiserar Solida Elinstallationer App...');
    
    // Starta lösenordsskyddet
    window.passwordProtection = new PasswordProtection();
    
    console.log('✅ App initialiserad');
});