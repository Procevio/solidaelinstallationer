// Lösenordsskydd konfiguration
const PASSWORD_CONFIG = {
    CORRECT_PASSWORD: 'solida123',
    MAX_ATTEMPTS: 3,
    SESSION_KEY: 'solida_auth_session'
};

// Priskonfiguration för elinstallationer
const CONFIG = {
    // Elinstallationer-priser med dropdown-struktur (exkl moms)
    ELECTRICAL_PRICING: {
        // Installation & Utbyggnad
        'extra_eluttag': {
            'inomhus_vagg': 1440,           // 1800kr inkl moms = 1440kr exkl moms
            'uteplats_garage': 1760         // 2200kr inkl moms = 1760kr exkl moms
        },
        'strombrytare': {
            'vanlig': 960,                  // 1200kr inkl moms = 960kr exkl moms
            'dimmer': 1200,                 // 1500kr inkl moms = 1200kr exkl moms
            'smart_switch': 1600            // 2000kr inkl moms = 1600kr exkl moms
        },
        'byte_elcentral': 20000,            // 25000kr inkl moms = 20000kr exkl moms (fast pris)
        'dragning_ny_el': 680,              // 850kr/m inkl moms = 680kr/m exkl moms
        'inkoppling_hushallsmaskin': {
            'diskmaskin': 2000,             // 2500kr inkl moms = 2000kr exkl moms
            'ugn': 2000,                    // 2500kr inkl moms = 2000kr exkl moms
            'spis': 2400,                   // 3000kr inkl moms = 2400kr exkl moms
            'tvattmaskin': 1600             // 2000kr inkl moms = 1600kr exkl moms
        },
        'jordfelsbrytare': 1200,            // 1500kr inkl moms = 1200kr exkl moms

        // Belysning
        'taklampa': {
            'vanlig_taklampa': 800,         // 1000kr inkl moms = 800kr exkl moms
            'kristallkrona': 1600,          // 2000kr inkl moms = 1600kr exkl moms
            'takflakt_belysning': 2400      // 3000kr inkl moms = 2400kr exkl moms
        },
        'spotlights': {
            'led_downlights': 400,          // 500kr inkl moms = 400kr exkl moms
            'skena_spots': 800,             // 1000kr inkl moms = 800kr exkl moms
            'infallda_spots': 600           // 750kr inkl moms = 600kr exkl moms
        },
        'utomhusbelysning': {
            'fasadbelysning': 1200,         // 1500kr inkl moms = 1200kr exkl moms
            'tradgardsspots': 800,          // 1000kr inkl moms = 800kr exkl moms
            'vaggarmatur': 960              // 1200kr inkl moms = 960kr exkl moms
        },
        'led_strip': {
            'koksbelysning': 400,           // 500kr/m inkl moms = 400kr/m exkl moms
            'trappbelysning': 480,          // 600kr/m inkl moms = 480kr/m exkl moms
            'dekorativ': 320                // 400kr/m inkl moms = 320kr/m exkl moms
        },
        'smart_belysning': {
            'plejd_system': 8000,           // 10000kr inkl moms = 8000kr exkl moms (per rum)
            'philips_hue': 4000,            // 5000kr inkl moms = 4000kr exkl moms (per rum)
            'knx': 16000                    // 20000kr inkl moms = 16000kr exkl moms (per rum)
        },

        // Energi & Laddning
        'laddbox_elbil': {
            'typ2_22kw': 12000,             // 15000kr inkl moms = 12000kr exkl moms
            'cee_16a': 8000,                // 10000kr inkl moms = 8000kr exkl moms
            'typ2_11kw': 10000              // 12500kr inkl moms = 10000kr exkl moms
        },
        'solceller': {
            'vaxelriktare': 8000,           // 10000kr inkl moms = 8000kr exkl moms
            'optimizers': 4000,             // 5000kr inkl moms = 4000kr exkl moms
            'batterisystem': 40000          // 50000kr inkl moms = 40000kr exkl moms
        },

        // Värme & Komfort
        'handdukstork': 1600,               // 2000kr inkl moms = 1600kr exkl moms
        'golvvarme': 800,                   // 1000kr/kvm inkl moms = 800kr/kvm exkl moms
        'varmepump': {
            'inkoppling_befintlig': 4000,   // 5000kr inkl moms = 4000kr exkl moms
            'installation_luft_luft': 12000 // 15000kr inkl moms = 12000kr exkl moms
        },

        // Säkerhet & Smarta Hem
        'brandvarnare': {
            'hardkopplad': 800,             // 1000kr inkl moms = 800kr exkl moms
            'rokdetektor': 600              // 750kr inkl moms = 600kr exkl moms
        },
        'hemlarm': 8000,                    // 10000kr inkl moms = 8000kr exkl moms (fast pris)
        'natverksuttag': {
            'cat6_uttag': 800,              // 1000kr inkl moms = 800kr exkl moms
            'fiber': 1600,                  // 2000kr inkl moms = 1600kr exkl moms
            'wifi_access_point': 2400       // 3000kr inkl moms = 2400kr exkl moms
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

        // Lyssna på materialkostnad dropdown
        const materialkostnad = document.getElementById('materialkostnad');
        if (materialkostnad) {
            materialkostnad.addEventListener('change', () => {
                this.calculateElectricalQuote();
            });
        }

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
        const materialkostnadSection = document.getElementById('materialkostnad-section');
        
        // Visa/dölj ROT-relaterade sektioner
        const showROTSections = fastighetROT?.value === 'Ja - Villa/Radhus' && 
                               kundROT?.value === 'Ja - inkludera ROT-avdrag i anbudet';
        
        if (delatRotSection) {
            delatRotSection.style.display = showROTSections ? 'block' : 'none';
        }
        
        if (materialkostnadSection) {
            materialkostnadSection.style.display = showROTSections ? 'block' : 'none';
        }
    }

    calculateElectricalQuote() {
        console.log('💰 Beräknar elinstallationer-pris');
        
        let subtotal = 0;
        const selectedServices = this.getSelectedElectricalServices();
        
        // Beräkna totalkostnad för alla tjänster
        selectedServices.forEach(service => {
            subtotal += service.totalPrice;
        });

        // Beräkna moms (25%)
        const vatAmount = subtotal * 0.25;
        const totalWithVat = subtotal + vatAmount;

        // Beräkna ROT-avdrag
        const rotData = this.collectROTData();
        let rotDeduction = 0;
        let materialDeduction = 0;

        if (this.isROTEligible(rotData)) {
            // Materialkostnad som procent
            const materialPercent = parseInt(rotData.materialkostnad) / 100;
            materialDeduction = totalWithVat * materialPercent;
            
            // ROT-avdrag på arbetskostnad (50% av totalbelopp minus materialkostnad)
            const workCost = totalWithVat - materialDeduction;
            rotDeduction = workCost * CONFIG.ROT_DEDUCTION.RATE;
            
            // Begränsa ROT-avdrag enligt regler
            const maxROTDeduction = rotData.delatROT === 'Ja' ? 
                CONFIG.ROT_DEDUCTION.MAX_SHARED : CONFIG.ROT_DEDUCTION.MAX_PER_PERSON;
            
            if (rotDeduction > maxROTDeduction) {
                rotDeduction = maxROTDeduction;
            }
        }

        const finalTotal = totalWithVat - rotDeduction;

        // Uppdatera prisvisning
        this.updatePricingDisplay(subtotal, vatAmount, totalWithVat, rotDeduction, finalTotal, { materialDeduction });
        
        return {
            subtotal,
            vatAmount,
            totalWithVat,
            rotDeduction,
            materialDeduction,
            finalTotal,
            services: selectedServices
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
                
                let price = 0;
                let serviceType = '';
                let quantity = 1;
                
                // Hämta kvantitet
                if (quantityInput && quantityInput.value) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                
                // Bestäm pris baserat på dropdown eller fast pris
                if (dropdown && dropdown.value && typeof serviceConfig === 'object' && serviceConfig[dropdown.value]) {
                    price = serviceConfig[dropdown.value];
                    serviceType = dropdown.options[dropdown.selectedIndex].text;
                } else if (typeof serviceConfig === 'number') {
                    price = serviceConfig;
                    serviceType = checkbox.labels[0].textContent;
                }
                
                if (price > 0) {
                    const totalPrice = price * quantity;
                    
                    services.push({
                        id: serviceId,
                        name: checkbox.labels[0].textContent,
                        type: serviceType,
                        unitPrice: price,
                        quantity: quantity,
                        totalPrice: totalPrice
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
            delatROT: delatROT?.value || 'Nej',
            materialkostnad: document.getElementById('materialkostnad')?.value || '0'
        };
    }

    updatePricingDisplay(subtotal, vatAmount, totalWithVat, rotDeduction, finalTotal, extras = {}) {
        // Uppdatera subtotal
        const subtotalDisplay = document.getElementById('subtotal-price-display');
        if (subtotalDisplay) {
            subtotalDisplay.textContent = new Intl.NumberFormat('sv-SE').format(Math.round(subtotal)) + ' kr';
        }

        // Uppdatera total med moms
        const totalWithVatDisplay = document.getElementById('total-with-vat');
        if (totalWithVatDisplay) {
            totalWithVatDisplay.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(totalWithVat)) + ' kr</strong>';
        }

        // Uppdatera ROT-avdrag
        const rotDeductionEl = document.getElementById('rot-deduction');
        const rotRow = document.getElementById('rot-row');
        const rotPreliminaryText = document.getElementById('rot-preliminary-text');
        const materialRow = document.getElementById('material-row');
        const materialDeductionEl = document.getElementById('material-deduction');

        if (rotDeduction > 0) {
            if (rotDeductionEl) {
                rotDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(rotDeduction)) + ' kr';
            }
            if (rotRow) {
                rotRow.style.display = 'flex';
            }
            if (rotPreliminaryText) {
                rotPreliminaryText.style.display = 'block';
            }

            // Visa materialkostnad avdrag om det finns
            const { materialDeduction = 0 } = extras;
            if (materialDeduction > 0 && materialDeductionEl && materialRow) {
                materialDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(materialDeduction)) + ' kr';
                materialRow.style.display = 'flex';
            } else if (materialRow) {
                materialRow.style.display = 'none';
            }
        } else {
            if (rotRow) {
                rotRow.style.display = 'none';
            }
            if (rotPreliminaryText) {
                rotPreliminaryText.style.display = 'none';
            }
            if (materialRow) {
                materialRow.style.display = 'none';
            }
        }

        // Uppdatera slutsumma
        const finalPriceDisplay = document.getElementById('final-customer-price');
        if (finalPriceDisplay) {
            finalPriceDisplay.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(finalTotal)) + ' kr</strong>';
        }
    }

    updateWorkDescription() {
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) return;

        let workDescription = 'ELINSTALLATIONER - ARBETSBESKRIVNING\n\n';
        workDescription += 'Solida Elinstallationer AB\n';
        workDescription += 'Organisationsnummer: 559123-4567\n';
        workDescription += 'Telefon: 073-123 45 67\n';
        workDescription += 'E-post: info@solidaelinstallationer.se\n\n';
        
        workDescription += '='.repeat(50) + '\n';
        workDescription += 'VALDA ELINSTALLATIONER\n';
        workDescription += '='.repeat(50) + '\n\n';

        const selectedServices = this.getSelectedElectricalServices();
        
        if (selectedServices.length === 0) {
            workDescription += 'Inga tjänster valda ännu.\n\n';
        } else {
            selectedServices.forEach((service, index) => {
                workDescription += `${index + 1}. ${service.name.toUpperCase()}`;
                if (service.type && service.type !== service.name) {
                    workDescription += ` (${service.type})`;
                }
                workDescription += `\n   Antal: ${service.quantity} st\n   Pris: ${new Intl.NumberFormat('sv-SE').format(service.totalPrice)} kr\n\n`;
                
                // Lägg till detaljerad arbetsbeskrivning
                const description = this.getServiceWorkDescription(service.id, service.type);
                if (description) {
                    workDescription += `   ARBETSBESKRIVNING:\n   ${description.split('\n').join('\n   ')}\n\n`;
                }
            });
        }

        // Lägg till allmän information
        workDescription += '='.repeat(50) + '\n';
        workDescription += 'ALLMÄN INFORMATION\n';
        workDescription += '='.repeat(50) + '\n\n';
        workDescription += '• Alla installationer utförs enligt gällande standarder (SS-EN)\n';
        workDescription += '• Besiktning och certifiering ingår\n';
        workDescription += '• Garantitid: 5 år på utfört arbete\n';
        workDescription += '• Försäkring: Ansvarsförsäkring 10 miljoner kr\n';
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
        this.updatePricingDisplay(0, 0, 0, 0, 0);
        
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