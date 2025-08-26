// Lösenordsskydd konfiguration
const PASSWORD_CONFIG = {
    CORRECT_PASSWORD: 'solida123',
    MAX_ATTEMPTS: 3,
    SESSION_KEY: 'solida_auth_session'
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
        
        // Debug: Logga alla element
        console.log('📋 DOM-element kontroll:');
        console.log('  passwordOverlay:', this.passwordOverlay);
        console.log('  passwordForm:', this.passwordForm);
        console.log('  passwordInput:', this.passwordInput);
        console.log('  passwordError:', this.passwordError);
        console.log('  mainApp:', this.mainApp);
        
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
        } else {
            console.log('✅ Alla nödvändiga DOM-element hittades');
        }
        
        // Försöksräknare
        this.attempts = 0;
        this.isLocked = false;
        
        console.log('🚀 Initialiserar lösenordsskydd...');
        this.initializePasswordProtection();
    }
    
    initializePasswordProtection() {
        console.log('🔍 Kontrollerar befintlig session...');
        
        // Kontrollera om användaren redan är inloggad
        const hasExistingSession = this.checkExistingSession();
        console.log('📊 Befintlig session:', hasExistingSession);
        
        if (hasExistingSession) {
            console.log('✅ Giltig session hittad - ger åtkomst automatiskt');
            this.grantAccess();
            return;
        } else {
            console.log('❌ Ingen giltig session - visar lösenordsskärm');
        }
        
        // Lyssna på formulärinlämning
        this.passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validatePassword();
        });
        
        // Lyssna på Enter-tangent i lösenordsfältet
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.validatePassword();
            }
        });
        
        // Fokusera på lösenordsfältet när sidan laddas
        setTimeout(() => {
            this.passwordInput.focus();
        }, 500);
    }
    
    checkExistingSession() {
        console.log('🔎 checkExistingSession() körs...');
        
        // NYTT: Rensa session vid varje ny flik/fönster för säkerhet
        console.log('🔒 Rensar sessions för säkerhet - kräver nytt lösenord');
        localStorage.removeItem(PASSWORD_CONFIG.SESSION_KEY);
        return false;
    }
    
    validatePassword() {
        if (this.isLocked) return;
        
        const enteredPassword = this.passwordInput.value;
        
        if (enteredPassword === PASSWORD_CONFIG.CORRECT_PASSWORD) {
            // Spara session i localStorage
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
        console.log('🚪 grantAccess() körs - ger användaren åtkomst...');
        
        // Dölj lösenordsskärm med animering
        console.log('🎭 Animerar bort lösenordsskärm...');
        this.passwordOverlay.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            console.log('⏰ setTimeout i grantAccess körs (efter 500ms)...');
            
            this.passwordOverlay.style.display = 'none';
            this.mainApp.style.display = 'block';
            this.mainApp.style.animation = 'fadeIn 0.5s ease-out';
            
            console.log('👁️ Visibility ändrat:');
            console.log('  - passwordOverlay display:', this.passwordOverlay.style.display);
            console.log('  - mainApp display:', this.mainApp.style.display);
            
            // Initialisera QuoteCalculator efter framgångsrik inloggning
            console.log('🚀 Initialiserar huvudapplikation...');
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
        
        // Kontrollera om reset-knappen redan finns
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
        
        resetButton.addEventListener('mouseenter', () => {
            resetButton.style.backgroundColor = '#5a6268';
        });
        
        resetButton.addEventListener('mouseleave', () => {
            resetButton.style.backgroundColor = '#6c757d';
        });
        
        resetButton.addEventListener('click', () => {
            this.resetPassword();
        });
        
        // Lägg till knappen efter lösenordsfältet
        this.passwordInput.parentNode.appendChild(resetButton);
    }
    
    resetPassword() {
        this.attempts = 0;
        this.isLocked = false;
        this.passwordInput.disabled = false;
        this.passwordError.style.display = 'none';
        this.passwordInput.focus();
        
        // Ta bort resetknappen
        const resetButton = document.getElementById('password-reset-btn');
        if (resetButton) {
            resetButton.remove();
        }
    }
    
    resetApp() {
        console.log('🔄 Nollställer hela applikationen...');
        
        // Rensa alla textinput-fält med KORREKTA ID:n
        const textInputs = [
            'customer-company', 'customer-contact', 'customer-address', 'customer-phone', 
            'customer-email', 'customer-city', 'customer-postal-code', 'customer-fastighetsbeteckning',
            'fp_antal_fonster', 'fp_antal_rutor'
        ];
        
        console.log('📝 Rensar text/number input-fält...');
        let clearedFields = 0;
        textInputs.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
                clearedFields++;
            }
        });
        console.log(`✅ ${clearedFields} textfält rensade`);
        
        // Rensa alla select-fält
        const selectInputs = [
            'bostadstyp', 'stadfrekvens', 'fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor',
            'access-method', 'pets', 'parking', 'preferred-day', 'preferred-time'
        ];
        
        console.log('📋 Rensar select-fält...');
        let clearedSelects = 0;
        selectInputs.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.selectedIndex = 0;
                clearedSelects++;
            }
        });
        console.log(`✅ ${clearedSelects} select-fält rensade`);
        
        // Rensa textarea-fält
        const textareas = ['allergies'];
        textareas.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
            }
        });
        
        // Rensa date-fält
        const dateFields = ['start-date'];
        dateFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
            }
        });
        
        // Avmarkera alla checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(`☑️  Rensar ${checkboxes.length} checkboxes...`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Sätt första radio button som vald för alla radio-grupper
        const radioGroups = ['fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring', 'fp_karmar', 'fp_stege', 'fp_skylift'];
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => radio.checked = false);
        });
        
        // Dölj fönsterputs-tillägg
        const fonsterpputsTillagg = document.getElementById('fonsterputs-tillagg');
        if (fonsterpputsTillagg) {
            fonsterpputsTillagg.style.display = 'none';
        }
        
        // Dölj hemstädning schema
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = 'none';
        }
        
        // Nollställ alla priser
        this.resetAllPriceDisplays();
        
        console.log('✅ Applikationen nollställd framgångsrikt');
    }
    
    resetAllPriceDisplays() {
        const priceIds = [
            'stad-grundpris', 'stad-tillagg', 'stad-total', 'stad-rut-pris',
            'fonsterputs-price', 'stadtjanster_cost', 'stadtjanster_tillagg_cost', 'total_stad_price'
        ];
        
        priceIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0 kr';
            }
        });
        
        // Dölj prisdisplays
        const priceDisplays = ['stad-price-display', 'fonsterputs-price-display'];
        priceDisplays.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    initializeMainApplication() {
        console.log('🚀 initializeMainApplication() startar...');
        
        // Kontrollera att alla nödvändiga element finns
        const requiredElements = [
            'quote-form',
            'objektets_forutsattningar_cost',
            'fonsterinformation_cost',
            'tillagg_cost',
            'submit-btn'
        ];
        
        console.log('🔍 Kontrollerar nödvändiga element...');
        console.log('📋 Söker efter element:', requiredElements);
        
        // Detaljerad kontroll av varje element
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`  - ${id}: ${element ? '✅ HITTAT' : '❌ SAKNAS'}`);
            if (!element) {
                console.log(`    🔍 Sökning efter '${id}':`, document.querySelectorAll(`#${id}, [id*="${id}"], [name="${id}"]`));
            }
        });
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('❌ KRITISKA ELEMENT SAKNAS:', missingElements);
            console.log('🔍 Alla form-element:', document.querySelectorAll('form'));
            console.log('🔍 Alla input-element:', document.querySelectorAll('input'));
            console.log('🔍 Alla element med ID:', document.querySelectorAll('[id]'));
            console.log('🔍 mainContainer innehåll:', this.mainApp ? this.mainApp.innerHTML.substring(0, 500) + '...' : 'mainContainer saknas');
            
            setTimeout(() => {
                console.log('⏰ Försöker igen efter 1 sekund...');
                this.initializeMainApplication();
            }, 1000);
            return;
        }
        
        console.log('✅ Alla nödvändiga element hittades');
        
        try {
            // Initialisera kalkylatorn
            console.log('🧮 Skapar QuoteCalculator...');
            window.calculator = new QuoteCalculator();
            console.log('✅ QuoteCalculator initialiserad');
            
            // Initialisera tema-toggle
            console.log('🎨 Skapar ThemeToggle...');
            window.themeToggle = new ThemeToggle();
            console.log('✅ ThemeToggle initialiserad');
            
            // Initialisera AdditionalServiceManager
            console.log('📝 Skapar AdditionalServiceManager...');
            window.additionalServiceManager = new AdditionalServiceManager();
            console.log('✅ AdditionalServiceManager initialiserad');
            
            // Visa navigation bar
            this.showNavigationBar();
            
            console.log('🎉 Hela applikationen framgångsrikt initialiserad!');
            
        } catch (error) {
            console.error('❌ Fel vid initialisering av huvudapplikation:', error);
            console.log('📊 Error stack:', error.stack);
        }
    }
    
    logout() {
        console.log('👋 Loggar ut användaren...');
        
        // Rensa sessionsdata
        sessionStorage.removeItem('solidaPassword');
        localStorage.removeItem('solidaPassword');
        
        // Nollställ appen
        if (window.quoteCalculator) {
            window.quoteCalculator.resetApp();
        }
        
        // Dölj navigation bar
        this.hideNavigationBar();
        
        // Visa lösenordsskärmen igen
        this.passwordOverlay.style.display = 'flex';
        this.mainContainer.style.display = 'none';
        
        // Rensa lösenordsfältet
        this.passwordInput.value = '';
        this.passwordInput.focus();
        
        // Återställ antal försök
        this.attempts = 0;
        
        console.log('✅ Användaren är utloggad');
    }
    
    showNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.add('visible');
            console.log('✅ Navigation bar visas');
        } else {
            console.warn('⚠️ Navigation bar hittades inte');
        }
    }
    
    hideNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.remove('visible');
            console.log('✅ Navigation bar dold');
        } else {
            console.warn('⚠️ Navigation bar hittades inte');
        }
    }
}

class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        this.cleanup();
        this.setupThemeToggle();
        this.loadSavedTheme();
        window.currentThemeToggleInstance = this;
    }

    cleanup() {
        if (window.currentThemeToggleInstance && window.currentThemeToggleInstance.themeToggle) {
            const oldToggle = window.currentThemeToggleInstance.themeToggle;
            const oldHandler = window.currentThemeToggleInstance.handleToggleClick;
            if (oldToggle && oldHandler) {
                oldToggle.removeEventListener('click', oldHandler);
            }
        }
    }

    setupThemeToggle() {
        this.themeToggle = document.getElementById('theme-toggle');
        if (this.themeToggle) {
            this.handleToggleClick = () => this.toggleTheme();
            this.themeToggle.addEventListener('click', this.handleToggleClick);
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
        
        // Update theme icons
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

    toggleTheme() {
        console.log('🎨 Theme toggle klickad');
        const currentTheme = document.body.getAttribute('data-theme');
        const isDark = currentTheme === 'light';
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        console.log(`🎨 Tema ändrat till: ${isDark ? 'mörkt' : 'ljust'}`);
        
        // Update theme icons
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
            console.log('✅ Theme ikoner uppdaterade');
        } else {
            console.warn('⚠️ Theme ikoner hittades inte');
        }
    }
}

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
        'jordfelsbrytare': 2800,            // 3500kr inkl moms = 2800kr exkl moms
        
        // Belysning
        'taklampa': {
            'vanlig_taklampa': 640,         // 800kr inkl moms = 640kr exkl moms
            'kristallkrona': 1200,          // 1500kr inkl moms = 1200kr exkl moms
            'takflakt_belysning': 2000      // 2500kr inkl moms = 2000kr exkl moms
        },
        'spotlights': {
            'led_downlights': 480,          // 600kr/st inkl moms = 480kr/st exkl moms
            'skena_spots': 960,             // 1200kr/st inkl moms = 960kr/st exkl moms
            'infallda_spots': 640           // 800kr/st inkl moms = 640kr/st exkl moms
        },
        'utomhusbelysning': {
            'fasadbelysning': 1200,         // 1500kr inkl moms = 1200kr exkl moms
            'tradgardsspots': 800,          // 1000kr inkl moms = 800kr exkl moms
            'vaggarmatur': 640              // 800kr inkl moms = 640kr exkl moms
        },
        'led_strip': {
            'koksbelysning': 960,           // 1200kr inkl moms = 960kr exkl moms
            'trappbelysning': 1200,         // 1500kr inkl moms = 1200kr exkl moms
            'dekorativ': 640                // 800kr inkl moms = 640kr exkl moms
        },
        'smart_belysning': {
            'plejd_system': 1600,           // 2000kr inkl moms = 1600kr exkl moms
            'philips_hue': 2000,            // 2500kr inkl moms = 2000kr exkl moms
            'knx': 4000                     // 5000kr inkl moms = 4000kr exkl moms
        },
        
        // Energi & Laddning
        'laddbox_elbil': {
            'typ2_22kw': 9600,              // 12000kr inkl moms = 9600kr exkl moms
            'cee_16a': 6400,                // 8000kr inkl moms = 6400kr exkl moms
            'typ2_11kw': 8000               // 10000kr inkl moms = 8000kr exkl moms
        },
        'solceller': {
            'vaxelriktare': 6400,           // 8000kr inkl moms = 6400kr exkl moms
            'optimizers': 4000,             // 5000kr inkl moms = 4000kr exkl moms
            'batterisystem': 12000          // 15000kr inkl moms = 12000kr exkl moms
        },
        
        // Värme & Komfort
        'handdukstork': 1440,               // 1800kr inkl moms = 1440kr exkl moms
        'golvvarme': 320,                   // 400kr/kvm inkl moms = 320kr/kvm exkl moms
        'varmepump': {
            'inkoppling_befintlig': 3600,   // 4500kr inkl moms = 3600kr exkl moms
            'installation_luft_luft': 4800  // 6000kr inkl moms = 4800kr exkl moms
        },
        
        // Säkerhet & Smarta Hem
        'brandvarnare': {
            'hardkopplad': 640,             // 800kr inkl moms = 640kr exkl moms
            'rokdetektor': 960              // 1200kr inkl moms = 960kr exkl moms
        },
        'hemlarm': 2800,                    // 3500kr inkl moms = 2800kr exkl moms
        'natverksuttag': {
            'cat6_uttag': 640,              // 800kr inkl moms = 640kr exkl moms
            'fiber': 960,                   // 1200kr inkl moms = 960kr exkl moms
            'wifi_access_point': 1200       // 1500kr inkl moms = 1200kr exkl moms
        }
    },

    // Detaljerade arbetsbeskrivningar för varje tjänst och typ
    SERVICE_DESCRIPTIONS: {
        // Installation & Utbyggnad
        'extra_eluttag': {
            base_title: 'Extra eluttag',
            types: {
                'inomhus_vagg': {
                    title: 'Extra eluttag - Inomhus vägg',
                    description: `- Planering och utstäkning av ny eluttags-placering
- Borrning och fräsning för kabelführung genom väggar
- Dragning av elkabel från närmaste fördelning/gruppcentral
- Installation av väggdosa och montering av eluttag
- Anslutning enligt gällande elsäkerhetsverkets föreskrifter
- Funktions- och spänningstest av ny installation
- Märkning av krets i elcentral
- Efterjustering och städning av arbetsplats`
                },
                'uteplats_garage': {
                    title: 'Extra eluttag - Uteplats/garage',
                    description: `- Planering och utstäkning av ny eluttags-placering
- Borrning och fräsning för kabelführung genom väggar
- Dragning av elkabel från närmaste fördelning/gruppcentral
- Installation av väggdosa och montering av eluttag
- Anslutning enligt gällande elsäkerhetsverkets föreskrifter
- Funktions- och spänningstest av ny installation
- Märkning av krets i elcentral
- Efterjustering och städning av arbetsplats`
                }
            }
        },
        'strombrytare': {
            base_title: 'Strömbrytare',
            types: {
                'vanlig': {
                    title: 'Vanlig strömbrytare',
                    description: `- Spänningsfrånkoppling och säkerhetskontroll
- Demontering av befintlig strömbrytare/väggdosa
- Installation av ny strömbrytare eller dimmer
- Anslutning av fas-, noll- och skyddsledare
- Kontroll av jordning och isolationsresistans
- Funktionstest av belysning och strömbrytare
- Märkning och dokumentation av installation`
                },
                'dimmer': {
                    title: 'Dimmer',
                    description: `- Spänningsfrånkoppling och säkerhetskontroll
- Demontering av befintlig strömbrytare/väggdosa
- Installation av ny strömbrytare eller dimmer
- Anslutning av fas-, noll- och skyddsledare
- Kontroll av jordning och isolationsresistans
- Funktionstest av belysning och strömbrytare
- Märkning och dokumentation av installation`
                },
                'smart_switch': {
                    title: 'Smart switch',
                    description: `- Spänningsfrånkoppling och säkerhetskontroll
- Demontering av befintlig strömbrytare/väggdosa
- Installation av ny strömbrytare eller dimmer
- Anslutning av fas-, noll- och skyddsledare
- Kontroll av jordning och isolationsresistans
- Funktionstest av belysning och strömbrytare
- Märkning och dokumentation av installation`
                }
            }
        },
        'byte_elcentral': {
            title: 'Byte elcentral/automatsäkringar',
            description: `- Anmälan till nätbolag och avstängning av huvudsäkring
- Demontering av gammal elcentral och säkringar
- Installation av ny elcentral med automatsäkringar
- Ommärkning och systematisk anslutning av alla kretsar
- Installation av jordfelsbrytare för personskydd
- Funktions- och utlösningstest av alla säkringar
- Upprättande av installationsprotokoll och besiktning
- Återinkoppling och slutkontroll av alla funktioner`
        },
        'dragning_ny_el': {
            title: 'Dragning ny el (renovering)',
            description: `- Genomgång av ritningar och planering av elinstallation
- Utstäkning och märkning av kabel- och dossträckningar
- Dragning av kabel i rör eller direkt i konstruktion
- Installation av centraldon, fördelningar och dosor
- Inmätning och dokumentation av kabelsträckningar
- Märkning av kablar för framtida identifiering
- Kontroll av installationen före överlämning`
        },
        'inkoppling_hushallsmaskin': {
            base_title: 'Inkoppling hushållsmaskin',
            types: {
                'diskmaskin': {
                    title: 'Inkoppling diskmaskin',
                    description: `- Planering av elmatning för specifik maskin
- Installation av lämplig säkring/automat i elcentral
- Dragning av dimensionerad kabel till maskinens placering
- Montering av fast elanslutning eller uttag
- Anslutning enligt tillverkarens installationsanvisningar
- Funktions- och säkerhetstest av installation
- Genomgång av drift och skötsel med kund`
                },
                'ugn': {
                    title: 'Inkoppling ugn',
                    description: `- Planering av elmatning för specifik maskin
- Installation av lämplig säkring/automat i elcentral
- Dragning av dimensionerad kabel till maskinens placering
- Montering av fast elanslutning eller uttag
- Anslutning enligt tillverkarens installationsanvisningar
- Funktions- och säkerhetstest av installation
- Genomgång av drift och skötsel med kund`
                },
                'spis': {
                    title: 'Inkoppling spis',
                    description: `- Planering av elmatning för specifik maskin
- Installation av lämplig säkring/automat i elcentral
- Dragning av dimensionerad kabel till maskinens placering
- Montering av fast elanslutning eller uttag
- Anslutning enligt tillverkarens installationsanvisningar
- Funktions- och säkerhetstest av installation
- Genomgång av drift och skötsel med kund`
                },
                'tvattmaskin': {
                    title: 'Inkoppling tvättmaskin',
                    description: `- Planering av elmatning för specifik maskin
- Installation av lämplig säkring/automat i elcentral
- Dragning av dimensionerad kabel till maskinens placering
- Montering av fast elanslutning eller uttag
- Anslutning enligt tillverkarens installationsanvisningar
- Funktions- och säkerhetstest av installation
- Genomgång av drift och skötsel med kund`
                }
            }
        },
        'jordfelsbrytare': {
            title: 'Installation jordfelsbrytare',
            description: `- Kartläggning av befintlig installation och kretsfördelning
- Val av lämplig jordfelsbrytare med korrekt känslighet
- Installation av jordfelsbrytare i elcentral
- Omanslutning av berörda kretsar genom jordfelsbrytaren
- Test av utlösningstid och känslighet
- Märkning och instruktion till kund om testfunktion`
        },
        
        // Belysning
        'taklampa': {
            base_title: 'Taklampa',
            types: {
                'vanlig_taklampa': {
                    title: 'Vanlig taklampa',
                    description: `- Planering av belysningsplacering och last
- Installation eller förstärkning av takupphäng
- Dragning av belysningskabel till armaturen
- Montering av tak-rosett eller direktanslutning
- Installation och justering av belysningsarmatur
- Anslutning till strömbrytare och funktionstest
- Säkerhetskontroll av takfäste och elektrisk anslutning`
                },
                'kristallkrona': {
                    title: 'Kristallkrona',
                    description: `- Planering av belysningsplacering och last
- Installation eller förstärkning av takupphäng
- Dragning av belysningskabel till armaturen
- Montering av tak-rosett eller direktanslutning
- Installation och justering av belysningsarmatur
- Anslutning till strömbrytare och funktionstest
- Säkerhetskontroll av takfäste och elektrisk anslutning`
                },
                'takflakt_belysning': {
                    title: 'Takfläkt med belysning',
                    description: `- Planering av belysningsplacering och last
- Installation eller förstärkning av takupphäng
- Dragning av belysningskabel till armaturen
- Montering av tak-rosett eller direktanslutning
- Installation och justering av belysningsarmatur
- Anslutning till strömbrytare och funktionstest
- Säkerhetskontroll av takfäste och elektrisk anslutning`
                }
            }
        },
        'spotlights': {
            base_title: 'Spotlights',
            types: {
                'led_downlights': {
                    title: 'LED downlights',
                    description: `- Planering av spotplacering för optimal ljusbild
- Borrning av hål för infällda armaturer
- Installation av transformatorer vid lågvoltsspots
- Dragning och anslutning av belysningskabel
- Montering och injustering av spot-armaturer
- Programmering av eventuella dimmerfunktioner
- Ljustest och slutjustering av riktning`
                },
                'skena_spots': {
                    title: 'Skena med spots',
                    description: `- Planering av spotplacering för optimal ljusbild
- Borrning av hål för infällda armaturer
- Installation av transformatorer vid lågvoltsspots
- Dragning och anslutning av belysningskabel
- Montering och injustering av spot-armaturer
- Programmering av eventuella dimmerfunktioner
- Ljustest och slutjustering av riktning`
                },
                'infallda_spots': {
                    title: 'Infällda spots',
                    description: `- Planering av spotplacering för optimal ljusbild
- Borrning av hål för infällda armaturer
- Installation av transformatorer vid lågvoltsspots
- Dragning och anslutning av belysningskabel
- Montering och injustering av spot-armaturer
- Programmering av eventuella dimmerfunktioner
- Ljustest och slutjustering av riktning`
                }
            }
        },
        'utomhusbelysning': {
            base_title: 'Utomhusbelysning',
            types: {
                'fasadbelysning': {
                    title: 'Fasadbelysning',
                    description: `- Planering av utomhusinstallation med IP-klassning
- Grävning och dragning av armerad utomhuskabel
- Installation av utomhusklassade armaturer och dosor
- Anslutning via jordfelsbrytare för säkerhet
- Installation av timer eller ljussensor vid behov
- Funktions- och isolationstest av installation
- Instruktion om drift och underhåll`
                },
                'tradgardsspots': {
                    title: 'Trädgårdsspots',
                    description: `- Planering av utomhusinstallation med IP-klassning
- Grävning och dragning av armerad utomhuskabel
- Installation av utomhusklassade armaturer och dosor
- Anslutning via jordfelsbrytare för säkerhet
- Installation av timer eller ljussensor vid behov
- Funktions- och isolationstest av installation
- Instruktion om drift och underhåll`
                },
                'vaggarmatur': {
                    title: 'Väggarmatur',
                    description: `- Planering av utomhusinstallation med IP-klassning
- Grävning och dragning av armerad utomhuskabel
- Installation av utomhusklassade armaturer och dosor
- Anslutning via jordfelsbrytare för säkerhet
- Installation av timer eller ljussensor vid behov
- Funktions- och isolationstest av installation
- Instruktion om drift och underhåll`
                }
            }
        },
        'led_strip': {
            base_title: 'LED-strip',
            types: {
                'koksbelysning': {
                    title: 'LED-strip köksbelysning',
                    description: `- Mätning och planering av LED-stripens sträckning
- Installation av aluminimprofiler för värmeavledning
- Montering av LED-strip i profiler med diffusor
- Installation av lämplig LED-driver/transformator
- Anslutning till dimmer eller styrenheter
- Programmering av färg- och ljusstyrka vid RGB
- Test av hela systemet och instruktion till kund`
                },
                'trappbelysning': {
                    title: 'LED-strip trappbelysning',
                    description: `- Mätning och planering av LED-stripens sträckning
- Installation av aluminimprofiler för värmeavledning
- Montering av LED-strip i profiler med diffusor
- Installation av lämplig LED-driver/transformator
- Anslutning till dimmer eller styrenheter
- Programmering av färg- och ljusstyrka vid RGB
- Test av hela systemet och instruktion till kund`
                },
                'dekorativ': {
                    title: 'LED-strip dekorativ',
                    description: `- Mätning och planering av LED-stripens sträckning
- Installation av aluminimprofiler för värmeavledning
- Montering av LED-strip i profiler med diffusor
- Installation av lämplig LED-driver/transformator
- Anslutning till dimmer eller styrenheter
- Programmering av färg- och ljusstyrka vid RGB
- Test av hela systemet och instruktion till kund`
                }
            }
        },
        'smart_belysning': {
            base_title: 'Smart belysning',
            types: {
                'plejd_system': {
                    title: 'Smart belysning - Plejd system',
                    description: `- Planering av smart belysningssystem och styrning
- Installation av smarta reläer eller strömbrytare
- Konfiguration av trådlöst nätverk och appkoppling
- Programmering av belysningsscenarier och timer
- Integration med eventuella smarta hem-system
- Test av all funktionalitet och fjärrstyrning
- Genomgång av app och instruktion till kund`
                },
                'philips_hue': {
                    title: 'Smart belysning - Philips Hue',
                    description: `- Planering av smart belysningssystem och styrning
- Installation av smarta reläer eller strömbrytare
- Konfiguration av trådlöst nätverk och appkoppling
- Programmering av belysningsscenarier och timer
- Integration med eventuella smarta hem-system
- Test av all funktionalitet och fjärrstyrning
- Genomgång av app och instruktion till kund`
                },
                'knx': {
                    title: 'Smart belysning - KNX',
                    description: `- Planering av smart belysningssystem och styrning
- Installation av smarta reläer eller strömbrytare
- Konfiguration av trådlöst nätverk och appkoppling
- Programmering av belysningsscenarier och timer
- Integration med eventuella smarta hem-system
- Test av all funktionalitet och fjärrstyrning
- Genomgång av app och instruktion till kund`
                }
            }
        },
        
        // Energi & Laddning
        'laddbox_elbil': {
            base_title: 'Laddbox elbil',
            types: {
                'typ2_22kw': {
                    title: 'Laddbox elbil - Typ 2 (22kW)',
                    description: `- Dimensionering av elkrets för laddboxens effekt
- Installation av dedikerad säkring och jordfelsbrytare
- Dragning av dimensionerad kabel till laddplats
- Montering av laddbox på vägg eller stolpe
- Anslutning och konfiguration av laddparametrar
- Funktions- och säkerhetstest av laddning
- Anmälan till nätbolag vid effekt över 11kW
- Instruktion om användning och underhåll`
                },
                'cee_16a': {
                    title: 'Laddbox elbil - CEE 16A',
                    description: `- Dimensionering av elkrets för laddboxens effekt
- Installation av dedikerad säkring och jordfelsbrytare
- Dragning av dimensionerad kabel till laddplats
- Montering av laddbox på vägg eller stolpe
- Anslutning och konfiguration av laddparametrar
- Funktions- och säkerhetstest av laddning
- Anmälan till nätbolag vid effekt över 11kW
- Instruktion om användning och underhåll`
                },
                'typ2_11kw': {
                    title: 'Laddbox elbil - Typ 2 (11kW)',
                    description: `- Dimensionering av elkrets för laddboxens effekt
- Installation av dedikerad säkring och jordfelsbrytare
- Dragning av dimensionerad kabel till laddplats
- Montering av laddbox på vägg eller stolpe
- Anslutning och konfiguration av laddparametrar
- Funktions- och säkerhetstest av laddning
- Anmälan till nätbolag vid effekt över 11kW
- Instruktion om användning och underhåll`
                }
            }
        },
        'solceller': {
            base_title: 'Solceller',
            types: {
                'vaxelriktare': {
                    title: 'Solceller - Växelriktare',
                    description: `- Installation av DC-kopplare och säkringar
- Montering av växelriktare på lämplig plats
- Anslutning av solcellssträngar till växelriktare
- Installation av produktionsmätare i elcentral
- Konfiguration av övervakning och kommunikation
- Test av systemet och kontroll av produktion
- Registrering hos Energimarknadsinspektionen
- Instruktion om drift och övervakning`
                },
                'optimizers': {
                    title: 'Solceller - Optimizers',
                    description: `- Installation av DC-kopplare och säkringar
- Montering av växelriktare på lämplig plats
- Anslutning av solcellssträngar till växelriktare
- Installation av produktionsmätare i elcentral
- Konfiguration av övervakning och kommunikation
- Test av systemet och kontroll av produktion
- Registrering hos Energimarknadsinspektionen
- Instruktion om drift och övervakning`
                },
                'batterisystem': {
                    title: 'Solceller - Batterisystem',
                    description: `- Installation av DC-kopplare och säkringar
- Montering av växelriktare på lämplig plats
- Anslutning av solcellssträngar till växelriktare
- Installation av produktionsmätare i elcentral
- Konfiguration av övervakning och kommunikation
- Test av systemet och kontroll av produktion
- Registrering hos Energimarknadsinspektionen
- Instruktion om drift och övervakning`
                }
            }
        },
        
        // Värme & Komfort
        'handdukstork': {
            title: 'Handdukstork installation',
            description: `- Planering av elmatning för handdukstork
- Installation av fast elanslutning i badrum
- Montering av termostat eller timer för styrning
- Installation och inkoppling av handdukstork
- Säkerhets- och funktionstest av installation
- Kontroll av IP-klassning för badrumsmiljö
- Instruktion om användning och temperaturinställning`
        },
        'golvvarme': {
            title: 'Golvvärme (el)',
            description: `- Planering och beräkning av värmeeffekt per område
- Utläggning av värmekabel eller värmematta
- Installation av golvtermostat med givare
- Anslutning till elförsörjning via egen säkring
- Isolationstest före golvläggning
- Uppvärmningstest efter färdig golvbeläggning
- Programmering av termostat och instruktion`
        },
        'varmepump': {
            base_title: 'Värmepump',
            types: {
                'inkoppling_befintlig': {
                    title: 'Värmepump - Inkoppling befintlig',
                    description: `- Planering av elanslutning för värmepumpens behov
- Installation av lämplig säkring och kontaktor
- Dragning av starkströmskabel till utedelen
- Anslutning av styrledningar mellan ute- och innedel
- Inkoppling enligt tillverkarens kopplingsschema
- Funktions- och säkerhetstest av installation
- Instruktion om drift och grundläggande underhåll`
                },
                'installation_luft_luft': {
                    title: 'Värmepump - Installation ny luft-luft',
                    description: `- Planering av elanslutning för värmepumpens behov
- Installation av lämplig säkring och kontaktor
- Dragning av starkströmskabel till utedelen
- Anslutning av styrledningar mellan ute- och innedel
- Inkoppling enligt tillverkarens kopplingsschema
- Funktions- och säkerhetstest av installation
- Instruktion om drift och grundläggande underhåll`
                }
            }
        },
        
        // Säkerhet & Smarta Hem
        'brandvarnare': {
            base_title: 'Brandvarnare',
            types: {
                'hardkopplad': {
                    title: 'Brandvarnare - Hårdkopplad',
                    description: `- Planering av placering enligt brandskyddsregler
- Installation av hårdkopplade brandvarnare
- Sammanlänkning av detektorer för simultant larm
- Anslutning till reservkraft (batteri backup)
- Test av larmsystem och ljudnivå
- Märkning och dokumentation av installation
- Instruktion om test och batteribyte`
                },
                'rokdetektor': {
                    title: 'Brandvarnare - Rökdetektor',
                    description: `- Planering av placering enligt brandskyddsregler
- Installation av hårdkopplade brandvarnare
- Sammanlänkning av detektorer för simultant larm
- Anslutning till reservkraft (batteri backup)
- Test av larmsystem och ljudnivå
- Märkning och dokumentation av installation
- Instruktion om test och batteribyte`
                }
            }
        },
        'hemlarm': {
            title: 'Hemlarm installation',
            description: `- Planering av larmsystem med sensorer och central
- Installation av larmcentral och backup-batteri
- Montering av rörelsesensorer och dörr/fönsterkontakter
- Dragning av larmledningar eller trådlös konfiguration
- Programmering av larmzoner och användarinställningar
- Test av alla sensorer och kommunikation
- Instruktion om aktivering, avaktivering och underhåll`
        },
        'natverksuttag': {
            base_title: 'Nätverk',
            types: {
                'cat6_uttag': {
                    title: 'Nätverk - Cat6 uttag',
                    description: `- Planering av nätverksinfrastruktur och uttag
- Dragning av nätverkskabel (Cat6/Cat6a standard)
- Installation av vägguttag och patchpaneler
- Terminering och märkning av alla anslutningar
- Installation av switches och WiFi access points
- Test av nätverksanslutningar och hastigheter
- Konfiguration av nätverk och trådlösa inställningar
- Dokumentation av installation och lösenord`
                },
                'fiber': {
                    title: 'Nätverk - Fiber',
                    description: `- Planering av nätverksinfrastruktur och uttag
- Dragning av nätverkskabel (Cat6/Cat6a standard)
- Installation av vägguttag och patchpaneler
- Terminering och märkning av alla anslutningar
- Installation av switches och WiFi access points
- Test av nätverksanslutningar och hastigheter
- Konfiguration av nätverk och trådlösa inställningar
- Dokumentation av installation och lösenord`
                },
                'wifi_access_point': {
                    title: 'Nätverk - WiFi access point',
                    description: `- Planering av nätverksinfrastruktur och uttag
- Dragning av nätverkskabel (Cat6/Cat6a standard)
- Installation av vägguttag och patchpaneler
- Terminering och märkning av alla anslutningar
- Installation av switches och WiFi access points
- Test av nätverksanslutningar och hastigheter
- Konfiguration av nätverk och trådlösa inställningar
- Dokumentation av installation och lösenord`
                }
            }
        }
    },

    EXTRAS: {
        VAT_RATE: 0.25,           // 25% moms
        ROT_DEDUCTION: 0.50,      // 50% ROT-avdrag på arbetskostnad
        ROT_MAX_SINGLE: 75000,    // Max 75 000 kr per person
        ROT_MAX_SHARED: 150000    // Max 150 000 kr för två personer
    }
};

class QuoteCalculator {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 QuoteCalculator initialiserad');
        
        // Ensure DOM is fully loaded before setting up listeners
        this.waitForDOMReady(() => {
            console.log('✅ DOM är redo, initialiserar komponenter...');
            
            // Visa navigation bar
            this.showNavigationBar();
            
            this.setupTabNavigation();
            this.setupFormListeners();
            this.setupROTListeners();
            this.setupGDPRModal();
            this.setDefaultDates();
            this.populateDropdowns();
            this.setupCleaningServiceListeners();
            
            // Setup service listeners with retry mechanism
            this.setupServiceListenersWithRetry();
            
            // Add debug button for testing work descriptions
            this.addDebugButton();
            
            // Initialize work description
            setTimeout(() => {
                console.log('🔄 Initialiserar arbetsbeskrivning...');
                this.generateDetailedWorkDescription();
            }, 200);
        });
    }

    waitForDOMReady(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            console.log('⏳ Väntar på att DOM ska laddas...');
            window.addEventListener('load', callback);
        }
    }

    setupServiceListenersWithRetry(attempts = 0) {
        console.log(`🔄 Försök ${attempts + 1} att sätta upp service listeners...`);
        
        const serviceCheckboxes = document.querySelectorAll('input[name="elinstallationer"]');
        const serviceDropdowns = document.querySelectorAll('.service-dropdown');
        const serviceInputs = document.querySelectorAll('.service-input');
        
        console.log(`🔍 Hittade: ${serviceCheckboxes.length} checkboxes, ${serviceDropdowns.length} dropdowns, ${serviceInputs.length} inputs`);
        
        if (serviceCheckboxes.length === 0 && attempts < 5) {
            console.log('⚠️ Inga elinstallations-element hittade, försöker igen...');
            setTimeout(() => {
                this.setupServiceListenersWithRetry(attempts + 1);
            }, 200);
            return;
        }
        
        // Setup the actual listeners
        this.setupServiceListeners();
        
        // Add universal event listener for any changes in the elinstallationer section
        this.setupUniversalListeners();
        
        console.log('✅ Service listeners är uppsatta');
    }

    initializeMainApplication() {
        console.log('🚀 Initialiserar huvudapplikation');
        
        const requiredElements = [
            'company', 'email', 'phone', 'address', 'postal_code', 'city',
            'antal_vaningar', 'typ_fastighet', 'fonster_atkomst', 'antal_fonster'
        ];

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('❌ Saknade DOM-element:', missingElements);
            return false;
        }

        console.log('✅ Alla obligatoriska element hittade');
        this.setupServiceListeners();
        this.updateROTSections();
        this.calculateQuote();
        this.updateSubmitButton();
        return true;
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Transfer customer data when switching to work description tab
                if (targetTab === 'arbetsbeskrivning') {
                    console.log('🔄 Växlar till arbetsbeskrivning-flik, uppdaterar...');
                    this.transferCustomerDataToWorkDescription();
                    // Force update work description when switching to this tab
                    setTimeout(() => {
                        console.log('⚡ TAB SWITCH - Uppdaterar arbetsbeskrivning...');
                        this.generateDetailedWorkDescription();
                    }, 100);
                }
                
                // Transfer customer data when switching to tilläggstjänst tab
                if (targetTab === 'tillaggtjanst') {
                    this.transferCustomerDataToTillaggstjanst();
                }
            });
        });
    }

    setupServiceListeners() {
        console.log('🔧 Sätter upp lyssnare för tjänster');
        
        // Wait for DOM to be fully ready
        if (document.readyState !== 'complete') {
            console.log('⏳ DOM inte fullt laddat, väntar...');
            setTimeout(() => this.setupServiceListeners(), 100);
            return;
        }
        
        // Lyssna på checkboxar för att visa/dölja options-fält
        const serviceCheckboxes = document.querySelectorAll('input[name="elinstallationer"]');
        console.log(`🔍 Hittade ${serviceCheckboxes.length} elinstallations-checkboxes`);
        
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const serviceId = e.target.id;
                const serviceItem = e.target.closest('.service-item');
                const optionsDiv = serviceItem ? serviceItem.querySelector('.service-options') : null;
                
                console.log(`📦 Tjänst ${serviceId} ${e.target.checked ? 'aktiverad' : 'inaktiverad'}`);
                
                if (optionsDiv) {
                    optionsDiv.style.display = e.target.checked ? 'flex' : 'none';
                    if (!e.target.checked) {
                        // Clear dropdown and input values
                        const dropdown = optionsDiv.querySelector('.service-dropdown');
                        const input = optionsDiv.querySelector('.service-input');
                        if (dropdown) dropdown.value = '';
                        if (input) input.value = '';
                    }
                }
                
                console.log('⚡ CHECKBOX CHANGE - Kör prisberäkning och arbetsbeskrivning...');
                this.calculateQuote();
                this.updateSubmitButton();
                // Update work description when services change
                setTimeout(() => {
                    console.log('⚡ CHECKBOX CHANGE - Uppdaterar arbetsbeskrivning...');
                    this.generateDetailedWorkDescription();
                }, 50);
            });
        });

        // Lyssna på dropdown-ändringar
        const serviceDropdowns = document.querySelectorAll('.service-dropdown');
        console.log(`🔍 Hittade ${serviceDropdowns.length} service dropdowns`);
        
        serviceDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', () => {
                console.log(`📊 Dropdown ändrat för ${dropdown.id}: ${dropdown.value}`);
                console.log('⚡ DROPDOWN CHANGE - Kör prisberäkning och arbetsbeskrivning...');
                this.calculateQuote();
                this.updateSubmitButton();
                setTimeout(() => {
                    console.log('⚡ DROPDOWN CHANGE - Uppdaterar arbetsbeskrivning...');
                    this.generateDetailedWorkDescription();
                }, 50);
            });
        });

        // Lyssna på input-värden för elinstallationer
        const serviceInputs = document.querySelectorAll('.service-input');
        console.log(`🔍 Hittade ${serviceInputs.length} service inputs`);
        
        serviceInputs.forEach(input => {
            input.addEventListener('input', () => {
                console.log(`📊 Värde ändrat för ${input.id}: ${input.value}`);
                console.log('⚡ INPUT CHANGE - Kör prisberäkning och arbetsbeskrivning...');
                this.calculateQuote();
                this.updateSubmitButton();
                // Update work description when quantities change
                setTimeout(() => {
                    console.log('⚡ INPUT CHANGE - Uppdaterar arbetsbeskrivning...');
                    this.generateDetailedWorkDescription();
                }, 50);
            });
        });
    }

    setupFormListeners() {
        const formInputs = document.querySelectorAll('#company, #email, #phone, #address, #postal_code, #city');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updateSubmitButton());
        });

        // Main quote form submission
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.handleQuoteSubmit(e));
        }

        // Arbetsbeskrivning form submission
        const arbetsbeskrivningForm = document.getElementById('arbetsbeskrivning-form');
        if (arbetsbeskrivningForm) {
            arbetsbeskrivningForm.addEventListener('submit', (e) => this.handleArbetsbeskrivningSubmit(e));
        }
        
        // Arbetsbeskrivning form validation
        const arbFormInputs = document.querySelectorAll('#arb-company, #arb-email, #arb-phone, #arb-address, #arb-postal_code, #arb-city');
        arbFormInputs.forEach(input => {
            input.addEventListener('input', () => this.updateArbetsbeskrivningSubmitButton());
        });
    }

    setupROTListeners() {
        // ROT property and customer eligibility listeners
        const fastighetROTRadios = document.querySelectorAll('input[name="fastighet_rot_berättigad"]');
        const kundROTRadios = document.querySelectorAll('input[name="är_du_berättigad_rot_avdrag"]');
        const delatROTSection = document.getElementById('delat-rot-section');
        const materialSection = document.getElementById('materialkostnad-section');

        fastighetROTRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateROTSections();
                this.calculateQuote();
            });
        });

        kundROTRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateROTSections();
                this.calculateQuote();
            });
        });

        // Shared ROT listeners
        const sharedROTRadios = document.querySelectorAll('input[name="delat_rot_avdrag"]');
        sharedROTRadios.forEach(radio => {
            radio.addEventListener('change', () => this.calculateQuote());
        });

        // Material cost listener
        const materialSelect = document.getElementById('materialkostnad');
        if (materialSelect) {
            materialSelect.addEventListener('change', () => this.calculateQuote());
        }

        // Project settings listeners
        const projectInputs = document.querySelectorAll('input[name="projekttyp"], input[name="bostadssituation"], input[name="farghantering"], input[name="garanti"], #resekostnad');
        projectInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.calculateQuote();
                // Update work description when project settings change
                this.generateDetailedWorkDescription();
            });
            if (input.type !== 'radio') {
                input.addEventListener('input', () => {
                    this.calculateQuote();
                    this.generateDetailedWorkDescription();
                });
            }
        });
    }

    updateROTSections() {
        const fastighetROT = document.querySelector('input[name="fastighet_rot_berättigad"]:checked');
        const kundROT = document.querySelector('input[name="är_du_berättigad_rot_avdrag"]:checked');
        const delatROTSection = document.getElementById('delat-rot-section');
        const materialSection = document.getElementById('materialkostnad-section');

        const fastighetEligible = fastighetROT && fastighetROT.value === 'Ja - Villa/Radhus';
        const kundEligible = kundROT && kundROT.value === 'Ja - inkludera ROT-avdrag i anbudet';
        const bothEligible = fastighetEligible && kundEligible;

        if (delatROTSection) {
            delatROTSection.style.display = bothEligible ? 'block' : 'none';
        }

        if (materialSection) {
            materialSection.style.display = bothEligible ? 'block' : 'none';
        }
    }

    calculateQuote() {
        console.log('⚡ Beräknar elinstallations-offert...');
        
        let totalCostExclVat = 0;

        // Calculate costs for all selected electrical services
        const selectedServices = this.getSelectedElectricalServices();
        console.log('🔧 Beräknar för', selectedServices.length, 'valda elinstallationer');

        selectedServices.forEach(service => {
            const serviceId = service.id;
            const serviceType = service.type;
            const quantity = service.quantity || 1;
            
            // Find price in new dropdown structure
            let unitPrice = 0;
            
            if (CONFIG.ELECTRICAL_PRICING[serviceId]) {
                const serviceConfig = CONFIG.ELECTRICAL_PRICING[serviceId];
                
                if (typeof serviceConfig === 'object' && serviceType) {
                    // Service has dropdown options
                    unitPrice = serviceConfig[serviceType] || 0;
                } else if (typeof serviceConfig === 'number') {
                    // Service has fixed price
                    unitPrice = serviceConfig;
                }
            }
            
            if (unitPrice > 0) {
                const serviceCost = unitPrice * quantity;
                totalCostExclVat += serviceCost;
                console.log(`⚡ ${serviceId}${serviceType ? ` (${serviceType})` : ''} (${quantity} ${service.unit}): ${serviceCost} kr`);
            } else {
                console.warn(`⚠️ Inget pris hittat för service: ${serviceId}${serviceType ? ` med typ: ${serviceType}` : ''}`);
            }
        });

        // Beräkna moms
        const vatAmount = totalCostExclVat * 0.25; // 25% moms
        const totalInclVat = totalCostExclVat + vatAmount;

        // Beräkna ROT-avdrag
        let rotDeduction = 0;
        let materialDeduction = 0;
        const hasRotDeduction = this.checkROTEligibility();
        if (hasRotDeduction) {
            // Materialkostnad avdrag
            const materialSelect = document.getElementById('materialkostnad');
            const materialPercent = materialSelect ? parseFloat(materialSelect.value) || 0 : 0;
            if (materialPercent > 0) {
                materialDeduction = (totalCostExclVat * materialPercent) / 100;
            }

            // Arbetskostnad för ROT = total - materialkostnad
            const workCostForRot = totalCostExclVat - materialDeduction;
            const calculatedRotDeduction = workCostForRot * 0.5; // 50% ROT-avdrag
            
            const isSharedRot = document.querySelector('input[name="delat_rot_avdrag"]:checked')?.value === 'Ja';
            const maxRotAmount = isSharedRot ? 100000 : 50000;
            rotDeduction = Math.min(calculatedRotDeduction, maxRotAmount);
        }

        const finalTotal = totalInclVat - rotDeduction;

        console.log(`💰 Totalt exkl moms: ${totalCostExclVat} kr`);
        console.log(`💰 Moms: ${vatAmount} kr`);
        console.log(`💰 Totalt inkl moms: ${totalInclVat} kr`);
        console.log(`💰 Material avdrag: ${materialDeduction} kr`);
        console.log(`💰 ROT-avdrag: ${rotDeduction} kr`);
        console.log(`💰 Slutsumma: ${finalTotal} kr`);

        this.updatePricingDisplay(totalCostExclVat, vatAmount, totalInclVat, rotDeduction, finalTotal, {
            materialDeduction
        });
    }

    checkROTEligibility() {
        const fastighetROT = document.querySelector('input[name="fastighet_rot_berättigad"]:checked');
        const kundROT = document.querySelector('input[name="är_du_berättigad_rot_avdrag"]:checked');
        
        const fastighetEligible = fastighetROT && fastighetROT.value === 'Ja - Villa/Radhus';
        const kundEligible = kundROT && kundROT.value === 'Ja - inkludera ROT-avdrag i anbudet';
        
        return fastighetEligible && kundEligible;
    }

    getServiceDisplayName(serviceKey) {
        const displayNames = {
            'RUM': 'Målning vardagsrum/sovrum',
            'KOK_BADRUM': 'Målning kök/badrum',
            'HALL_TRAPPHUS': 'Målning hall/trapphus',
            'TAKTEXTIL': 'Målning taktextil',
            'VARDAGSRUM_SOVRUM': 'Tapetsering vardagsrum/sovrum',
            'TAPETBORTTAGNING': 'Tapetborttagning',
            'FONSTERFARG': 'Fönstertärg',
            'PUTSFASAD': 'Putsfasad',
            'STENMALING': 'Stenmålning',
            'TRAFORVASK': 'Träförfvask',
            'HYRA_VECKA': 'Ställning hyra/vecka',
            'UPPMONTERING': 'Ställning uppmontering',
            'NEDMONTERING': 'Ställning nedmontering',
            'TRANSPORT': 'Ställning transport',
            'MALA_FONSTER': 'Måla fönster',
            'FONSTERKITT': 'Fönsterkitt',
            'SPECIALBEHANDLING': 'Specialbehandling',
            'GRUNDMALING': 'Grundmålning',
            'SPACKLING': 'Spackling',
            'SLIPNING': 'Slipning',
            'MASKERING': 'Maskering'
        };
        return displayNames[serviceKey] || serviceKey;
    }

    updatePricingDisplay(totalExclVat, vatAmount, totalInclVat, rutDeduction, finalTotal, extras = {}) {
        // Update subtotal price display (matches Sternbecks structure)
        const subtotalPriceDisplay = document.getElementById('subtotal-price-display');
        if (subtotalPriceDisplay) {
            subtotalPriceDisplay.textContent = new Intl.NumberFormat('sv-SE').format(Math.round(totalExclVat)) + ' kr';
        }

        // Update total with VAT
        const totalWithVat = document.getElementById('total-with-vat');
        if (totalWithVat) {
            totalWithVat.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(totalInclVat)) + ' kr</strong>';
        }

        // Update RUT deduction if applicable
        const rutDeductionEl = document.getElementById('rut-deduction');
        const rutRow = document.getElementById('rut-row');
        const rutPreliminaryText = document.getElementById('rut-preliminary-text');
        const materialRow = document.getElementById('material-row');
        const materialDeductionEl = document.getElementById('material-deduction');

        if (rutDeduction > 0) {
            if (rutDeductionEl) {
                rutDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(rutDeduction)) + ' kr';
            }
            if (rutRow) {
                rutRow.style.display = 'flex';
            }
            if (rutPreliminaryText) {
                rutPreliminaryText.style.display = 'block';
            }

            // Update material deduction if exists
            const { materialDeduction = 0 } = extras;
            if (materialDeduction > 0 && materialDeductionEl && materialRow) {
                materialDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(materialDeduction)) + ' kr';
                materialRow.style.display = 'flex';
            } else if (materialRow) {
                materialRow.style.display = 'none';
            }
        } else {
            if (rutRow) {
                rutRow.style.display = 'none';
            }
            if (rutPreliminaryText) {
                rutPreliminaryText.style.display = 'none';
            }
            if (materialRow) {
                materialRow.style.display = 'none';
            }
        }

        // Update final customer price
        const finalCustomerPrice = document.getElementById('final-customer-price');
        if (finalCustomerPrice) {
            finalCustomerPrice.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(finalTotal)) + ' kr</strong>';
        }
    }

    generateWorkDescription(selectedServices) {
        const workList = document.getElementById('workDescription');
        if (!workList) {
            console.log('⚠️ workDescription element inte hittat');
            return;
        }

        workList.innerHTML = '';

        if (selectedServices.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Inga tjänster valda än';
            workList.appendChild(li);
            return;
        }

        selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.textContent = `${service.name}: ${service.quantity} ${service.unit} × ${new Intl.NumberFormat('sv-SE').format(service.unitPrice)} kr = ${new Intl.NumberFormat('sv-SE').format(service.total)} kr`;
            workList.appendChild(li);
            console.log(`📝 Arbetsbeskrivning: ${li.textContent}`);
        });

        // Lägg till ROT-information om relevant
        const hasRotDeduction = this.checkROTEligibility();
        if (hasRotDeduction) {
            const li = document.createElement('li');
            li.textContent = 'ROT-avdrag beräknas på 70% av arbetskostnaden';
            workList.appendChild(li);
        }
    }

    updateSubmitButton() {
        const requiredFields = ['quote-date', 'company', 'email', 'phone', 'address', 'postal_code', 'city'];
        const submitButton = document.getElementById('submit-btn');
        
        if (!submitButton) return;

        const allFieldsFilled = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        const hasSelectedServices = Object.keys(CONFIG.SERVICE_PRICES).some(serviceId => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            return checkbox && checkbox.checked && inputField && parseFloat(inputField.value) > 0;
        });

        submitButton.disabled = !allFieldsFilled || !hasSelectedServices;
    }

    async handleQuoteSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const quoteForm = document.getElementById('quote-form');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const data = this.collectFormData();
            console.log('Skickar anbudsdata:', data);

            await this.submitToNetlifyFunction(data);

            // Show success message
            quoteForm.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Fel vid skickning:', error);
            
            // Show error message
            quoteForm.style.display = 'none';
            errorMessage.style.display = 'block';
            
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    async handleArbetsbeskrivningSubmit(e) {
        e.preventDefault();
        
        if (!this.validateArbetsbeskrivningForm()) {
            return;
        }

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const successMessage = document.getElementById('arb-success-message');
        const errorMessage = document.getElementById('arb-error-message');

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const formData = new FormData(form);
            const data = {
                type: 'arbetsbeskrivning',
                timestamp: new Date().toISOString(),
                arbetsbeskrivningsDatum: formData.get('work-date'),
                kundInfo: {
                    företag: formData.get('arb-company'),
                    kontaktperson: formData.get('arb-contact_person'),
                    email: formData.get('arb-email'),
                    telefon: formData.get('arb-phone'),
                    adress: formData.get('arb-address'),
                    fastighetsbeteckning: formData.get('arb-fastighetsbeteckning'),
                    postnummer: formData.get('arb-postal_code'),
                    ort: formData.get('arb-city')
                },
                projektBeskrivning: formData.get('arb-beskrivning'),
                gdprConsent: formData.get('arb-gdpr-consent') === 'on'
            };

            await this.submitToNetlifyFunction(data);
            
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Fel vid skickning:', error);
            
            // Show error message
            form.style.display = 'none';
            errorMessage.style.display = 'block';
            
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'quote-date', name: 'Anbudsdatum' },
            { id: 'company', name: 'Företag/Namn' },
            { id: 'email', name: 'E-post' },
            { id: 'phone', name: 'Telefonnummer' },
            { id: 'address', name: 'Adress' },
            { id: 'postal_code', name: 'Postnummer' },
            { id: 'city', name: 'Ort' },
            { id: 'antal_vaningar', name: 'Antal våningar' },
            { id: 'typ_fastighet', name: 'Typ av fastighet' },
            { id: 'fonster_atkomst', name: 'Fönstrens åtkomst' },
            { id: 'antal_fonster', name: 'Antal fönster' }
        ];

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        // Validate required fields
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorDiv = document.getElementById(`${field.id}-error`);
            
            if (!input.value.trim()) {
                if (errorDiv) {
                    errorDiv.textContent = `${field.name} är obligatorisk`;
                    errorDiv.style.display = 'block';
                }
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // Validate email format
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            if (emailError) {
                emailError.textContent = 'Ange en giltig e-postadress';
                emailError.style.display = 'block';
            }
            emailInput.classList.add('error');
            isValid = false;
        }

        // Validate postal code format (5 digits)
        const postalCodeInput = document.getElementById('postal_code');
        const postalCodeError = document.getElementById('postal_code-error');
        const postalCodeRegex = /^[0-9]{5}$/;
        
        if (postalCodeInput.value.trim() && !postalCodeRegex.test(postalCodeInput.value.trim())) {
            if (postalCodeError) {
                postalCodeError.textContent = 'Ange ett giltigt postnummer (5 siffror)';
                postalCodeError.style.display = 'block';
            }
            postalCodeInput.classList.add('error');
            isValid = false;
        }

        // Validate that at least one window type is selected
        const hasSelectedWindowType = document.querySelectorAll('input[name="fonstertyp"]:checked').length > 0;
        const fonsterTypError = document.getElementById('fonstertyp-error');

        if (!hasSelectedWindowType) {
            if (fonsterTypError) {
                fonsterTypError.textContent = 'Välj minst en fönstertyp';
                fonsterTypError.style.display = 'block';
            }
            isValid = false;
        } else {
            if (fonsterTypError) {
                fonsterTypError.style.display = 'none';
            }
        }

        // Validate GDPR consent
        const gdprConsent = document.getElementById('gdpr-consent');
        const gdprError = document.getElementById('gdpr-consent-error');
        
        if (!gdprConsent.checked) {
            if (gdprError) {
                gdprError.textContent = 'Du måste godkänna behandling av personuppgifter';
                gdprError.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }
    
    transferCustomerDataToWorkDescription() {
        const customerFieldMapping = {
            'company': 'arb-company',
            'contact_person': 'arb-contact_person',
            'email': 'arb-email',
            'phone': 'arb-phone',
            'address': 'arb-address',
            'fastighetsbeteckning': 'arb-fastighetsbeteckning',
            'postal_code': 'arb-postal_code',
            'city': 'arb-city'
        };
        
        Object.entries(customerFieldMapping).forEach(([quoteFieldId, workDescFieldId]) => {
            const quoteField = document.getElementById(quoteFieldId);
            const workDescField = document.getElementById(workDescFieldId);
            
            if (quoteField && workDescField && quoteField.value.trim()) {
                workDescField.value = quoteField.value;
            }
        });
        
        // Generate work description based on selected services
        this.updateCleaningWorkDescription();
        
        console.log('📋 Kunddata överförd från Anbud till Arbetsbeskrivning');
    }
    
    transferCustomerDataToTillaggstjanst() {
        const customerFieldMapping = {
            'company': 'tillagg-customer-company',
            'contact_person': 'tillagg-customer-contact',
            'email': 'tillagg-customer-email',
            'address': 'tillagg-customer-address'
        };
        
        Object.entries(customerFieldMapping).forEach(([quoteFieldId, tillaggFieldId]) => {
            const quoteField = document.getElementById(quoteFieldId);
            const tillaggField = document.getElementById(tillaggFieldId);
            
            if (quoteField && tillaggField && quoteField.value.trim()) {
                tillaggField.value = quoteField.value;
            }
        });
        
        console.log('📋 Kunddata överförd från Anbud till Tilläggstjänst');
    }

    addDebugButton() {
        // Add a debug button to manually trigger work description generation
        const debugButton = document.createElement('button');
        debugButton.innerHTML = '🔧 Debug: Generera Arbetsbeskrivning';
        debugButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: #ff6b6b; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;';
        debugButton.onclick = () => {
            console.log('🔧 DEBUG: Manuell aktivering av arbetsbeskrivning');
            this.generateDetailedWorkDescription();
        };
        document.body.appendChild(debugButton);
        console.log('🔧 Debug-knapp tillagd i övre högra hörnet');
    }

    setupUniversalListeners() {
        console.log('🌐 Sätter upp universell event listener...');
        
        // Listen for any changes in the entire document that might affect electrical services
        document.addEventListener('change', (e) => {
            if (e.target && (
                e.target.name === 'elinstallationer' ||
                e.target.classList.contains('service-dropdown') ||
                e.target.classList.contains('service-input')
            )) {
                console.log('🌐 UNIVERSAL CHANGE - Detected:', e.target.id || e.target.name);
                setTimeout(() => {
                    console.log('🌐 UNIVERSAL CHANGE - Uppdaterar arbetsbeskrivning...');
                    this.generateDetailedWorkDescription();
                }, 100);
            }
        });
        
        document.addEventListener('input', (e) => {
            if (e.target && e.target.classList.contains('service-input')) {
                console.log('🌐 UNIVERSAL INPUT - Detected:', e.target.id);
                setTimeout(() => {
                    console.log('🌐 UNIVERSAL INPUT - Uppdaterar arbetsbeskrivning...');
                    this.generateDetailedWorkDescription();
                }, 100);
            }
        });
        
        console.log('✅ Universella lyssnare uppsatta');
    }
    
    generateDetailedWorkDescription() {
        console.log('🚀 generateDetailedWorkDescription() anropad');
        
        // Force immediate DOM check
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) {
            console.error('❌ Arbetsbeskrivning textarea inte hittad! DOM kan behöva laddas först.');
            // Try again after a short delay
            setTimeout(() => {
                console.log('🔄 Försöker igen efter DOM-laddning...');
                this.generateDetailedWorkDescription();
            }, 100);
            return;
        } else {
            console.log('✅ Arbetsbeskrivning textarea hittad:', workDescriptionTextarea.id);
        }
        
        const selectedServices = this.getSelectedElectricalServices();
        console.log('📝 Genererar arbetsbeskrivning för', selectedServices.length, 'tjänster');
        
        // Debug: Show all available service descriptions
        console.log('🔍 Tillgängliga SERVICE_DESCRIPTIONS keys:', Object.keys(CONFIG.SERVICE_DESCRIPTIONS));
        
        let workDescription = "ARBETSBESKRIVNING - ELINSTALLATIONER\n\n";
        
        workDescription += "VALDA ELINSTALLATIONER:\n\n";
        
        if (selectedServices.length === 0) {
            workDescription += "• Inga tjänster valda\n";
            console.log('⚠️ Inga tjänster är valda');
        } else {
            console.log('🔧 Bearbetar valda tjänster:', selectedServices);
            selectedServices.forEach(service => {
                const serviceConfig = CONFIG.SERVICE_DESCRIPTIONS[service.id];
                let serviceDesc = null;
                
                if (serviceConfig) {
                    if (serviceConfig.types && service.type && serviceConfig.types[service.type]) {
                        // Service has dropdown types
                        serviceDesc = serviceConfig.types[service.type];
                    } else if (serviceConfig.title) {
                        // Service has direct description (no dropdown)
                        serviceDesc = serviceConfig;
                    }
                }
                
                if (serviceDesc) {
                    workDescription += `${serviceDesc.title.toUpperCase()}`;
                    if (service.quantity && service.quantity > 1) {
                        workDescription += ` (${service.quantity} ${service.unit || 'st'})`;
                    }
                    workDescription += ":\n";
                    workDescription += `${serviceDesc.description}\n\n`;
                    console.log(`✅ Beskrivning tillagd för: ${service.id}${service.type ? ` (${service.type})` : ''}`);
                } else {
                    console.warn(`⚠️ Ingen beskrivning hittad för service: ${service.id}${service.type ? ` med typ: ${service.type}` : ''}`);
                    console.log('🔍 Available service keys:', Object.keys(CONFIG.SERVICE_DESCRIPTIONS));
                }
            });
        }
        
        workDescription += "SÄKERHET OCH KVALITET:\n\n";
        workDescription += "• Alla installationer utförs enligt Elsäkerhetsverkets föreskrifter\n";
        workDescription += "• Funktions- och säkerhetstest av alla installationer\n";
        workDescription += "• Certifierade elektriker med behörighet\n";
        workDescription += "• Kvalitetsgaranti på utfört arbete\n";
        workDescription += "• Protokollering och dokumentation\n\n";
        
        workDescription += "Solida Elinstallationer AB\nProfessionella elinstallationer med kvalitetsgaranti";
        
        console.log('📝 Slutgiltig arbetsbeskrivning längd:', workDescription.length);
        console.log('📝 Första 200 tecken:', workDescription.substring(0, 200));
        
        // Set the value and force update
        workDescriptionTextarea.value = workDescription;
        workDescriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log('✅ Arbetsbeskrivning har uppdaterats i textarea');
        console.log('📝 Textarea värde efter uppdatering:', workDescriptionTextarea.value.substring(0, 100) + '...');
    }
    
    
    getSelectedElectricalServices() {
        const selectedServices = [];
        
        // Get all checked electrical service checkboxes
        const checkedServices = document.querySelectorAll('input[name="elinstallationer"]:checked');
        console.log('🔍 Antal valda elinstallationer:', checkedServices.length);
        console.log('🔍 Hittade checkboxes:', Array.from(checkedServices).map(cb => cb.id));
        
        checkedServices.forEach(checkbox => {
            const serviceId = checkbox.value;
            const serviceItem = checkbox.closest('.service-item');
            let quantity = 1;
            let unit = 'st';
            let serviceType = null;
            
            if (serviceItem) {
                // Get dropdown selection if exists
                const dropdown = serviceItem.querySelector('.service-dropdown');
                if (dropdown && dropdown.value) {
                    serviceType = dropdown.value;
                }
                
                // Get quantity input
                const quantityInput = serviceItem.querySelector('.service-input');
                if (quantityInput && quantityInput.value) {
                    quantity = parseInt(quantityInput.value) || 1;
                    
                    // Determine unit based on service and input placeholder
                    if (quantityInput.placeholder.includes('meter')) {
                        unit = 'meter';
                    } else if (quantityInput.placeholder.includes('kvm')) {
                        unit = 'kvm';
                    } else if (quantityInput.placeholder.includes('kW')) {
                        unit = 'kW';
                    } else if (quantityInput.placeholder.includes('timmar')) {
                        unit = 'timmar';
                    } else if (quantityInput.placeholder.includes('rum')) {
                        unit = 'rum';
                    } else if (quantityInput.placeholder.includes('system')) {
                        unit = 'system';
                    } else {
                        unit = 'st';
                    }
                }
            }
            
            console.log(`📝 Service found: ${serviceId}, type: ${serviceType}, quantity: ${quantity}, unit: ${unit}`);
            selectedServices.push({
                id: serviceId,
                type: serviceType,
                quantity: quantity,
                unit: unit
            });
        });
        
        return selectedServices;
    }

    getSelectedServicesForWorkDescription() {
        const services = [];
        const serviceDescriptions = {
            'vaggmaling': {
                name: 'Väggmålning',
                description: '• VÄGGMÅLNING:\n  - Grundlig rengöring och preparation av väggytor\n  - Spackling av mindre skador och ojämnheter\n  - Slipning av spackel för jämn yta\n  - Grundmålning vid behov\n  - Två strykningar med högkvalitativ väggfärg\n  - Målning utförs med roller och pensel för professionell finish'
            },
            'vagg_spackling': {
                name: 'Väggmålning med spackling',
                description: '• VÄGGMÅLNING MED OMFATTANDE SPACKLING:\n  - Noggrann genomgång och reparation av alla väggskador\n  - Omfattande spackling av sprickor, hål och ojämnheter\n  - Slipning för perfekt jämn yta\n  - Grundmålning av spacklad yta\n  - Två strykningar med högkvalitativ väggfärg\n  - Extra omsorg för enhetlig färgton över hela ytan'
            },
            'takmalning': {
                name: 'Takmålning',
                description: '• TAKMÅLNING:\n  - Skyddstäckning av golv och möbler\n  - Rengöring och preparation av takyta\n  - Spackling av mindre skador\n  - Grundmålning vid behov\n  - Två strykningar med takfärg\n  - Användning av professionell takutrustning för jämnt resultat'
            },
            'snickerier': {
                name: 'Målning snickerier',
                description: '• MÅLNING AV SNICKERIER:\n  - Demontage av beslag vid behov\n  - Slipning av befintlig färg/lack\n  - Spackling av skador och ojämnheter\n  - Grundmålning med lämplig grund\n  - Två strykningar med snickerifärg/lack\n  - Återmontering av beslag\n  - Extra precision för professionell finish'
            },
            'dorrar': {
                name: 'Målning dörrar',
                description: '• DÖRRMÅLNING:\n  - Nedtagning av dörrar för optimal målning\n  - Avmontering av handtag och beslag\n  - Slipning av samtliga ytor\n  - Spackling av skador\n  - Grundmålning\n  - Två strykningar med högkvalitativ dörr/snickerifärg\n  - Återhängning med korrekt justering'
            },
            'tapetsering': {
                name: 'Tapetsering',
                description: '• TAPETSERING:\n  - Borttagning av befintlig tapet vid behov\n  - Preparation och utjämning av väggyta\n  - Spackling och slipning för perfekt underlag\n  - Grundning av väggyta\n  - Professionell uppsättning av ny tapet\n  - Noggrann kantbehandling och fogar\n  - Slutkontroll för bubblor och ojämnheter'
            },
            'fasadmaling': {
                name: 'Fasadmålning',
                description: '• FASADMÅLNING:\n  - Högtryckstvätt av fasadyta\n  - Reparation av sprickor och skador\n  - Spackling med utomhuspackel\n  - Grundmålning med fasadgrund\n  - Två strykningar med högkvalitativ fasadfärg\n  - Skydd av omgivning och växtlighet\n  - Arbete utförs endast under lämpliga väderförhållanden'
            }
        };
        
        Object.entries(serviceDescriptions).forEach(([serviceId, serviceInfo]) => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            
            if (checkbox && checkbox.checked && inputField && parseFloat(inputField.value) > 0) {
                const quantity = parseFloat(inputField.value);
                const unit = serviceInfo.name.includes('dörrar') ? 'st' : 
                           serviceInfo.name.includes('snickerier') ? 'lm' : 'm²';
                
                services.push({
                    name: serviceInfo.name,
                    description: `${serviceInfo.description}\n  - Omfattning: ${quantity} ${unit}`,
                    quantity: quantity,
                    unit: unit
                });
            }
        });
        
        return services;
    }
    
    getProjectSettingsForWorkDescription() {
        return {
            projektTyp: document.querySelector('input[name="projekttyp"]:checked')?.value || 'Standard',
            bostadsSituation: document.querySelector('input[name="bostadssituation"]:checked')?.value || 'Obebott',
            fargHantering: document.querySelector('input[name="farghantering"]:checked')?.value || 'Företaget ordnar',
            garanti: document.querySelector('input[name="garanti"]:checked')?.value || '2 år',
            resekostnad: parseFloat(document.getElementById('resekostnad')?.value) || 0
        };
    }
    
    validateArbetsbeskrivningForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'work-date', name: 'Datum' },
            { id: 'arb-company', name: 'Företag/Namn' },
            { id: 'arb-email', name: 'E-post' },
            { id: 'arb-phone', name: 'Telefonnummer' },
            { id: 'arb-address', name: 'Adress' },
            { id: 'arb-postal_code', name: 'Postnummer' },
            { id: 'arb-city', name: 'Ort' },
            { id: 'arb-beskrivning', name: 'Projektbeskrivning' }
        ];

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        // Validate required fields
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorDiv = document.getElementById(`${field.id}-error`);
            
            if (!input.value.trim()) {
                if (errorDiv) {
                    errorDiv.textContent = `${field.name} är obligatorisk`;
                    errorDiv.style.display = 'block';
                }
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // Validate email format
        const emailInput = document.getElementById('arb-email');
        const emailError = document.getElementById('arb-email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            if (emailError) {
                emailError.textContent = 'Ange en giltig e-postadress';
                emailError.style.display = 'block';
            }
            emailInput.classList.add('error');
            isValid = false;
        }

        // Validate postal code format (5 digits)
        const postalCodeInput = document.getElementById('arb-postal_code');
        const postalCodeError = document.getElementById('arb-postal_code-error');
        const postalCodeRegex = /^[0-9]{5}$/;
        
        if (postalCodeInput.value.trim() && !postalCodeRegex.test(postalCodeInput.value.trim())) {
            if (postalCodeError) {
                postalCodeError.textContent = 'Ange ett giltigt postnummer (5 siffror)';
                postalCodeError.style.display = 'block';
            }
            postalCodeInput.classList.add('error');
            isValid = false;
        }

        // Validate GDPR consent
        const gdprConsent = document.getElementById('arb-gdpr-consent');
        const gdprError = document.getElementById('arb-gdpr-consent-error');
        
        if (!gdprConsent.checked) {
            if (gdprError) {
                gdprError.textContent = 'Du måste godkänna behandling av personuppgifter';
                gdprError.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }
    
    updateArbetsbeskrivningSubmitButton() {
        const requiredFields = ['work-date', 'arb-company', 'arb-email', 'arb-phone', 'arb-address', 'arb-postal_code', 'arb-city', 'arb-beskrivning'];
        const submitButton = document.getElementById('arb-submit-btn');
        
        if (!submitButton) return;

        const allFieldsFilled = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        submitButton.disabled = !allFieldsFilled;
    }

    collectFormData() {
        const data = {
            type: 'quote',
            timestamp: new Date().toISOString(),
            anbudsNummer: `SM-${Date.now()}`,
            anbudsDatum: document.getElementById('quote-date')?.value,
            kundInfo: {
                företag: document.getElementById('company').value,
                kontaktperson: document.getElementById('contact_person').value,
                email: document.getElementById('email').value,
                telefon: document.getElementById('phone').value,
                adress: document.getElementById('address').value,
                fastighetsbeteckning: document.getElementById('fastighetsbeteckning').value,
                postnummer: document.getElementById('postal_code').value,
                ort: document.getElementById('city').value
            },
            tjanster: this.collectSelectedServices(),
            rutAvdrag: this.collectRUTData(),
            totaler: this.collectPricingTotals()
        };

        return data;
    }

    collectSelectedServices() {
        const services = [];
        
        Object.entries(CONFIG.SERVICE_PRICES).forEach(([serviceId, serviceConfig]) => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            
            if (checkbox && checkbox.checked && inputField) {
                const quantity = parseFloat(inputField.value) || 0;
                if (quantity > 0) {
                    services.push({
                        tjanst: checkbox.nextElementSibling.textContent,
                        serviceId: serviceId,
                        antal: quantity,
                        enhet: serviceConfig.unit,
                        pris: serviceConfig.price,
                        total: serviceConfig.price * quantity
                    });
                }
            }
        });

        return services;
    }


    collectRUTData() {
        const fastighetRUT = document.querySelector('input[name="fastighet_rut_berättigad"]:checked');
        const kundRUT = document.querySelector('input[name="är_du_berättigad_rut_avdrag"]:checked');
        const delatRUT = document.querySelector('input[name="delat_rut_avdrag"]:checked');
        
        return {
            fastighetBerättigad: fastighetRUT?.value || 'Nej - Hyresrätt/Kommersiell fastighet',
            kundBerättigad: kundRUT?.value || 'Nej - visa fullpris utan avdrag',
            delatRUT: delatRUT?.value || 'Nej',
            materialkostnad: document.getElementById('materialkostnad')?.value || '0'
        };
    }

    collectPricingTotals() {
        return {
            exklMoms: document.getElementById('subtotal-price-display')?.textContent || '0 kr',
            inklMoms: document.getElementById('total-with-vat')?.textContent || '0 kr',
            rotAvdrag: document.getElementById('rot-deduction')?.textContent || '0 kr',
            materialAvdrag: document.getElementById('material-deduction')?.textContent || '0 kr',
            slutsumma: document.getElementById('final-customer-price')?.textContent || '0 kr'
        };
    }

    async submitToNetlifyFunction(data) {
        const response = await fetch('/.netlify/functions/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    resetApp() {
        console.log('🔄 QuoteCalculator resetApp() startar...');
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"]');
        const textareas = document.querySelectorAll('textarea');
        const selects = document.querySelectorAll('select');

        checkboxInputs.forEach(input => input.checked = false);
        radioInputs.forEach(input => input.checked = false);
        textInputs.forEach(input => input.value = '');
        textareas.forEach(textarea => textarea.value = '');
        selects.forEach(select => select.selectedIndex = 0);
        
        console.log(`✅ Resetat: ${checkboxInputs.length} checkboxes, ${radioInputs.length} radiobuttons, ${textInputs.length} text inputs, ${textareas.length} textareas, ${selects.length} selects`);

        // Reset radio buttons to defaults
        const defaultRadios = {
            'projekttyp': 'Standard',
            'bostadssituation': 'Obebott',
            'farghantering': 'Företaget ordnar',
            'garanti': '2 år',
            'delat_rot_avdrag': 'Nej',
            'fastighet_rot_berättigad': 'Nej - Hyresrätt/Kommersiell fastighet',
            'är_du_berättigad_rot_avdrag': 'Nej - visa fullpris utan avdrag',
            'inglasad_balkong': 'Nej',
            'invandig_puts': 'Nej'
        };

        Object.entries(defaultRadios).forEach(([name, value]) => {
            const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
        });

        // Reset service input fields visibility
        const serviceInputs = document.querySelectorAll('.service-input');
        serviceInputs.forEach(input => {
            input.style.display = 'none';
            input.value = '';
        });

        // Reset ROT sections visibility
        this.updateROTSections();
        
        this.resetPriceDisplays();
        this.calculateQuote();
        
        // Reset default dates
        this.setDefaultDates();
        
        // Reset fönsterputs fields and hide sections
        this.clearWindowCleaningFields();
        const fonsterputsTillagg = document.getElementById('fonsterputs-tillagg');
        if (fonsterputsTillagg) {
            fonsterputsTillagg.style.display = 'none';
        }
        
        // Hide hemstädning schema
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = 'none';
        }
        
        // Hide estimated time display
        const estimatedTimeDisplay = document.getElementById('estimated-time-display');
        if (estimatedTimeDisplay) {
            estimatedTimeDisplay.style.display = 'none';
        }
        
        // Hide price displays
        const stadtPriceDisplay = document.getElementById('stad-price-display');
        if (stadtPriceDisplay) {
            stadtPriceDisplay.style.display = 'none';
        }
        
        // Clear all new customer and additional fields
        const additionalFields = [
            'customer-company', 'customer-contact', 'customer-email', 'customer-phone',
            'customer-address', 'customer-fastighetsbeteckning', 'customer-postal-code', 'customer-city',
            'preferred-day', 'preferred-time', 'start-date', 'access-method',
            'pets', 'allergies', 'parking'
        ];
        
        additionalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = false;
                } else if (field.tagName === 'SELECT') {
                    field.selectedIndex = 0;
                } else {
                    field.value = '';
                }
            }
        });
        
        // Show reset notification
        this.showResetNotification();

        // Switch to first tab
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) firstTab.click();
    }
    
    setupGDPRModal() {
        const gdprLinks = document.querySelectorAll('#gdpr-details-link, #arb-gdpr-details-link');
        const gdprModal = document.getElementById('gdpr-modal');
        const gdprModalClose = document.getElementById('gdpr-modal-close');
        const gdprModalOk = document.getElementById('gdpr-modal-ok');

        gdprLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                gdprModal.style.display = 'flex';
            });
        });

        const closeModal = () => {
            gdprModal.style.display = 'none';
        };

        if (gdprModalClose) {
            gdprModalClose.addEventListener('click', closeModal);
        }

        if (gdprModalOk) {
            gdprModalOk.addEventListener('click', closeModal);
        }

        // Close modal when clicking outside
        gdprModal.addEventListener('click', (e) => {
            if (e.target === gdprModal) {
                closeModal();
            }
        });
    }
    
    setDefaultDates() {
        // Set today's date as default for both forms
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const quoteDateInput = document.getElementById('quote-date');
        const workDateInput = document.getElementById('work-date');
        
        if (quoteDateInput) {
            quoteDateInput.value = todayString;
            console.log('📅 Anbudsdatum satt till dagens datum:', todayString);
        }
        
        if (workDateInput) {
            workDateInput.value = todayString;
            console.log('📅 Arbetsbeskrivningsdatum satt till dagens datum:', todayString);
        }
    }

    resetPriceDisplays() {
        const priceElements = ['totalExklMoms', 'momsAmount', 'totalInklMoms', 'rotAvdrag', 'slutsumma'];
        priceElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0 kr';
            }
        });

        const workDescriptionElement = document.getElementById('workDescription');
        if (workDescriptionElement) {
            workDescriptionElement.innerHTML = '';
        }
    }

    showResetNotification() {
        let notification = document.getElementById('resetNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'resetNotification';
            notification.className = 'reset-notification';
            notification.textContent = '✓ Formuläret har återställts';
            document.body.appendChild(notification);
        }

        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Nya metoder för städtjänster
    populateDropdowns() {
        console.log('🔧 Populerar dropdown-menyer för städtjänster (inga dropdown-menyer att populera för nya fönsterputs-formuläret)');
        // De nya fönsterputs-fälten är antingen statiska dropdowns eller input-fält som inte behöver populeras
    }

    setupCleaningServiceListeners() {
        console.log('🎯 Sätter upp event listeners för städtjänster');
        
        // Lyssna på ändringar i bostadstyp och frekvens
        const bostadstyp = document.getElementById('bostadstyp');
        const stadfrekvens = document.getElementById('stadfrekvens');
        
        if (bostadstyp) {
            bostadstyp.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }
        
        if (stadfrekvens) {
            stadfrekvens.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }

        // Lyssna på tjänstval checkboxes
        const serviceCheckboxes = document.querySelectorAll('input[name="stadtjanster"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.handleServiceSelection(checkbox);
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
                
                // Visa/dölj hemstädning schema
                if (checkbox.value === 'hemstadning') {
                    this.toggleHemstadningSchema(checkbox.checked);
                }
            });
        });
        
        // Lyssna på akut-service checkbox för pristillägg
        const akutServiceCheckbox = document.getElementById('akut-service');
        if (akutServiceCheckbox) {
            akutServiceCheckbox.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }
        
        // Lyssna på bostadstyp-ändringar för estimerad tid (redan deklarerad ovan)
        if (bostadstyp) {
            bostadstyp.addEventListener('change', () => {
                this.updateEstimatedTime();
            });
        }
        
        
        // Lyssna på alla kundinformationsfält för automatisk överföring
        const customerFields = [
            'customer-company', 'customer-contact', 'customer-email', 'customer-phone',
            'customer-address', 'customer-fastighetsbeteckning', 'customer-postal-code', 'customer-city'
        ];
        
        customerFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.updateCleaningWorkDescription();
                    // Kopiera data till arbetsbeskrivning-formuläret
                    this.copyCustomerDataToWorkDescription();
                });
            }
        });
        
        // Lyssna på övriga nya fält
        const otherFields = [
            'preferred-day', 'preferred-time', 'start-date', 'access-method',
            'pets', 'allergies', 'parking'
        ];
        
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                const eventType = field.type === 'textarea' ? 'input' : 'change';
                field.addEventListener(eventType, () => {
                    this.updateCleaningWorkDescription();
                });
            }
        });

        // Lyssna på nummer-input för små rutor
        const antalRutorInput = document.getElementById('fp_antal_rutor');
        if (antalRutorInput) {
            antalRutorInput.addEventListener('input', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }

        // Lyssna på select-fält för fönsterputs
        const fonsterputsSelects = ['fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor'];
        fonsterputsSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', () => {
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            }
        });
        
        // Lyssna på number-inputs för fönsterputs
        const fonsterputsNumbers = ['fp_antal_fonster'];
        fonsterputsNumbers.forEach(numberId => {
            const input = document.getElementById(numberId);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            }
        });

        // Lyssna på alla radiobuttons för fönsterputs
        const radioGroups = [
            'fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring', 
            'fp_karmar', 'fp_stege', 'fp_skylift'
        ];
        
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    // Hantera spröjs-logik
                    if (groupName === 'fp_sprojs') {
                        this.handleSprojsSelection(radio.value);
                    }
                    if (groupName === 'fp_sprojs_typ') {
                        this.handleSprojsTypeSelection(radio.value);
                    }
                    
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            });
        });
    }

    handleSprojsSelection(value) {
        const sprojsDetaljer = document.getElementById('fp_sprojs_detaljer');
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        
        if (value === 'ja') {
            sprojsDetaljer.style.display = 'block';
        } else {
            sprojsDetaljer.style.display = 'none';
            if (antalRutorSection) {
                antalRutorSection.style.display = 'none';
            }
            
            // Rensa spröjs-relaterade fält
            const sprojsRadios = document.querySelectorAll('input[name="fp_sprojs_typ"]');
            sprojsRadios.forEach(radio => radio.checked = false);
            
            const antalRutorInput = document.getElementById('fp_antal_rutor');
            if (antalRutorInput) antalRutorInput.value = '';
        }
    }

    handleSprojsTypeSelection(value) {
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        
        if (value === 'fast' && antalRutorSection) {
            antalRutorSection.style.display = 'block';
        } else if (antalRutorSection) {
            antalRutorSection.style.display = 'none';
            const antalRutorInput = document.getElementById('fp_antal_rutor');
            if (antalRutorInput) antalRutorInput.value = '';
        }
    }
    
    toggleHemstadningSchema(show) {
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = show ? 'block' : 'none';
            console.log(`${show ? '✅' : '❌'} Hemstädning schema ${show ? 'visas' : 'döljs'}`);
        }
    }
    
    updateEstimatedTime() {
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const estimatedTimeDisplay = document.getElementById('estimated-time-display');
        const estimatedTimeText = document.getElementById('estimated-time-text');
        
        const estimatedTimes = {
            '1a_30kvm': '1,5-2 timmar',
            '1a_40kvm': '2-2,5 timmar', 
            '2a_50kvm': '2,5-3 timmar',
            '2a_60kvm': '3-3,5 timmar',
            '3a_70kvm': '3,5-4 timmar',
            '4a_90kvm': '4-5 timmar',
            'enplansvilla_100kvm': '4-6 timmar',
            'tvåplansvilla_140kvm': '6-8 timmar'
        };
        
        if (bostadstyp && estimatedTimes[bostadstyp]) {
            if (estimatedTimeDisplay) estimatedTimeDisplay.style.display = 'block';
            if (estimatedTimeText) estimatedTimeText.textContent = `Estimerad tid: ${estimatedTimes[bostadstyp]}`;
            console.log(`⏱️ Estimerad tid uppdaterad: ${estimatedTimes[bostadstyp]}`);
        } else {
            if (estimatedTimeDisplay) estimatedTimeDisplay.style.display = 'none';
            if (estimatedTimeText) estimatedTimeText.textContent = 'Välj bostadstyp för att se estimerad tid';
        }
    }
    
    copyCustomerDataToWorkDescription() {
        // Kopiera kundinformation till arbetsbeskrivning-formuläret
        const mappings = {
            'customer-company': 'arb-company',
            'customer-contact': 'arb-contact_person', 
            'customer-email': 'arb-email',
            'customer-phone': 'arb-phone',
            'customer-address': 'arb-address',
            'customer-fastighetsbeteckning': 'arb-fastighetsbeteckning',
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
        
        console.log('✅ Kundinformation kopierad till arbetsbeskrivning');
    }

    handleServiceSelection(checkbox) {
        const fonsterputsTillagg = document.getElementById('fonsterputs-tillagg');
        
        // Visa/dölj fönsterputs-tillägg beroende på om fönsterputs är valt
        if (checkbox.value === 'fonsterputs') {
            if (checkbox.checked) {
                fonsterputsTillagg.style.display = 'block';
            } else {
                fonsterputsTillagg.style.display = 'none';
                // Rensa fönsterputs-fält när det döljs
                this.clearWindowCleaningFields();
            }
        }
    }

    clearWindowCleaningFields() {
        // Rensa select-fält
        const selectFields = ['fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor'];
        selectFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.selectedIndex = 0;
            }
        });
        
        // Rensa number inputs
        const numberFields = ['fp_antal_fonster', 'fp_antal_rutor'];
        numberFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
        
        // Rensa alla radiobuttons
        const radioGroups = [
            'fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring',
            'fp_karmar', 'fp_stege', 'fp_skylift'
        ];
        
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => radio.checked = false);
        });
        
        // Dölj villkorliga sektioner
        const sprojsDetaljer = document.getElementById('fp_sprojs_detaljer');
        if (sprojsDetaljer) {
            sprojsDetaljer.style.display = 'none';
        }
        
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        if (antalRutorSection) {
            antalRutorSection.style.display = 'none';
        }
        
        // Dölj prisvisning
        const priceDisplay = document.getElementById('fonsterputs-price-display');
        if (priceDisplay) {
            priceDisplay.style.display = 'none';
        }
    }

    calculateCleaningPrice() {
        console.log('💰 Beräknar städtjänster-priser');
        
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const stadfrekvens = document.getElementById('stadfrekvens')?.value;
        
        let grundpris = 0;
        let tillaggerKostnad = 0;
        
        // Beräkna grundpris baserat på bostadstyp och frekvens
        if (bostadstyp && stadfrekvens && CONFIG.CLEANING_PRICING.BASE_PRICES[bostadstyp]) {
            grundpris = CONFIG.CLEANING_PRICING.BASE_PRICES[bostadstyp][stadfrekvens] || 0;
        }

        // Beräkna tilläggstjänster
        const selectedServices = document.querySelectorAll('input[name="stadtjanster"]:checked');
        selectedServices.forEach(service => {
            if (service.value !== 'hemstadning' && service.value !== 'fonsterputs') {
                tillaggerKostnad += CONFIG.CLEANING_PRICING.SERVICES[service.value] || 0;
            }
        });

        // Beräkna fönsterputs-tillägg med nya detaljerade priser
        const fonsterputsChecked = document.getElementById('fonsterputs')?.checked;
        if (fonsterputsChecked) {
            const fonsterputsPris = this.calculateWindowCleaningPrice();
            tillaggerKostnad += fonsterputsPris;
            // Visa fönsterputs-pris separat
            this.updateWindowCleaningPriceDisplay(fonsterputsPris);
        } else {
            // Dölj fönsterputs-prisvisning om inte valt
            this.updateWindowCleaningPriceDisplay(0);
        }
        
        // Beräkna totalpris
        let totalPris = grundpris + tillaggerKostnad;
        
        // Lägg till akuttjänst-tillägg (50%)
        const akutServiceChecked = document.getElementById('akut-service')?.checked;
        if (akutServiceChecked) {
            const akutTillagg = totalPris * 0.5; // 50% tillägg
            tillaggerKostnad += akutTillagg;
            console.log(`🚨 Akuttjänst-tillägg (50%): ${akutTillagg} kr`);
        }

        // Uppdatera prisvisning
        this.updateCleaningPriceDisplay(grundpris, tillaggerKostnad);
    }

    calculateWindowCleaningPrice() {
        console.log('🪟 Beräknar fönsterputs-pris');
        
        // Hämta alla värden från nya formuläret
        const fastighet = document.getElementById('fp_fastighet')?.value;
        const fonstertyp = document.getElementById('fp_fonstertyp')?.value;
        const oppning = document.querySelector('input[name="fp_oppning"]:checked')?.value;
        const rengoring = document.querySelector('input[name="fp_rengoring"]:checked')?.value;
        const antalFonster = parseInt(document.getElementById('fp_antal_fonster')?.value) || 0;
        const antalSidor = document.getElementById('fp_antal_sidor')?.value;
        
        // Kontrollera grundläggande krav
        if (!fonstertyp || !fastighet || antalFonster <= 0) {
            console.log('⚠️ Saknar obligatoriska fönsterputs-värden');
            this.updateWindowCleaningPriceDisplay(0);
            return 0;
        }

        // Beräkna grundpris per fönster
        let grundPrisPerFonster = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.BASE_PRICES[fonstertyp] || 0;
        console.log(`📊 Grundpris per fönster (${fonstertyp}): ${grundPrisPerFonster} kr`);
        
        // Applicera fastighetstyp multiplikator
        const fastighetMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.PROPERTY_MULTIPLIERS[fastighet] || 1.0;
        grundPrisPerFonster *= fastighetMultiplikator;
        console.log(`🏠 Efter fastighetstyp (${fastighet}): ${grundPrisPerFonster} kr per fönster`);
        
        // Applicera öppningstyp multiplikator
        if (oppning) {
            const oppningMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.OPENING_MULTIPLIERS[oppning] || 1.0;
            grundPrisPerFonster *= oppningMultiplikator;
            console.log(`🚪 Efter öppningstyp (${oppning}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Applicera rengöringstyp multiplikator
        if (rengoring) {
            const rengoringMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.CLEANING_TYPE_MULTIPLIERS[rengoring] || 1.0;
            grundPrisPerFonster *= rengoringMultiplikator;
            console.log(`🧹 Efter rengöringstyp (${rengoring}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Applicera sidor multiplikator
        if (antalSidor) {
            const sideMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.SIDES_MULTIPLIERS[antalSidor] || 1.0;
            grundPrisPerFonster *= sideMultiplikator;
            console.log(`📐 Efter antal sidor (${antalSidor}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Beräkna totalpris för alla fönster
        let totalPris = grundPrisPerFonster * antalFonster;
        console.log(`💰 Grundtotal (${grundPrisPerFonster} × ${antalFonster}): ${totalPris} kr`);

        // Hantera spröjs-tillägg
        const sprojs = document.querySelector('input[name="fp_sprojs"]:checked')?.value;
        if (sprojs === 'ja') {
            const sprojsTyp = document.querySelector('input[name="fp_sprojs_typ"]:checked')?.value;
            if (sprojsTyp) {
                const sprojsAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.SPROJS_FEES[sprojsTyp] || 0;
                const totalSprojsAvgift = sprojsAvgift * antalFonster;
                totalPris += totalSprojsAvgift;
                console.log(`🪟 Spröjs tillägg (${sprojsTyp}): ${sprojsAvgift} kr × ${antalFonster} = ${totalSprojsAvgift} kr`);
                
                // Extra avgift för små rutor om fast spröjs
                if (sprojsTyp === 'fast') {
                    const antalRutor = parseInt(document.getElementById('fp_antal_rutor')?.value) || 0;
                    if (antalRutor > 0) {
                        const rutorAvgift = antalRutor * CONFIG.CLEANING_PRICING.WINDOW_CLEANING.RUTA_FEE * antalFonster;
                        totalPris += rutorAvgift;
                        console.log(`🔢 Rutor tillägg: ${antalRutor} rutor × ${CONFIG.CLEANING_PRICING.WINDOW_CLEANING.RUTA_FEE} kr × ${antalFonster} fönster = ${rutorAvgift} kr`);
                    }
                }
            }
        }

        // Hantera tillgänglighetstillägg
        const karmar = document.querySelector('input[name="fp_karmar"]:checked')?.value;
        const stege = document.querySelector('input[name="fp_stege"]:checked')?.value;
        const skylift = document.querySelector('input[name="fp_skylift"]:checked')?.value;
        
        if (karmar === 'ja') {
            const karmarAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['karmar_ja'] * antalFonster;
            totalPris += karmarAvgift;
            console.log(`🪟 Karmar tillägg: ${CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['karmar_ja']} kr × ${antalFonster} = ${karmarAvgift} kr`);
        }
        
        if (stege === 'ja') {
            const stegeAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['stege_ja'];
            totalPris += stegeAvgift;
            console.log(`🪜 Stege tillägg: ${stegeAvgift} kr`);
        }
        
        if (skylift === 'ja') {
            const skyliftAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['skylift_ja'];
            totalPris += skyliftAvgift;
            console.log(`🏗️ Skylift tillägg: ${skyliftAvgift} kr`);
        }

        totalPris = Math.round(totalPris);
        console.log(`💰 Total fönsterputs kostnad: ${totalPris} kr`);

        // Uppdatera fönsterputs-prisvisning
        this.updateWindowCleaningPriceDisplay(totalPris);

        return totalPris;
    }

    updateWindowCleaningPriceDisplay(pris) {
        const fonsterputsPriceElement = document.getElementById('fonsterputs-price');
        const priceDisplay = document.getElementById('fonsterputs-price-display');
        
        if (fonsterputsPriceElement) {
            fonsterputsPriceElement.textContent = `${pris} kr`;
        }
        
        // Visa/dölj prisvisning beroende på om det finns ett pris
        if (priceDisplay) {
            if (pris > 0) {
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        }
    }

    updateCleaningPriceDisplay(grundpris, tillaggerKostnad) {
        // Uppdatera grundpris
        const stadtGrundprisElement = document.getElementById('stad-grundpris');
        if (stadtGrundprisElement) {
            stadtGrundprisElement.textContent = `${grundpris} kr`;
        }
        
        // Beräkna totalpris före moms
        const subtotal = grundpris + tillaggerKostnad;
        
        // Uppdatera subtotal (exkl moms)
        const subtotalElement = document.getElementById('subtotal-price-display');
        if (subtotalElement) {
            subtotalElement.textContent = `${subtotal} kr`;
        }
        
        // Beräkna moms (25%)
        const vatAmount = subtotal * 0.25;
        const totalWithVat = subtotal + vatAmount;
        
        // Uppdatera total inkl moms
        const totalWithVatElement = document.getElementById('total-with-vat');
        if (totalWithVatElement) {
            totalWithVatElement.textContent = `${totalWithVat} kr`;
        }
        
        // Slutpris (samma som inkl moms för denna app)
        const finalPriceElement = document.getElementById('final-customer-price');
        if (finalPriceElement) {
            finalPriceElement.textContent = `${totalWithVat} kr`;
        }
        
        // Visa/dölj akuttjänst-rad
        const akutServiceChecked = document.getElementById('akut-service')?.checked;
        const akutPriceRow = document.getElementById('akut-price-row');
        const akutTillaggPriceElement = document.getElementById('akut-tillagg-price');
        
        if (akutServiceChecked && akutPriceRow && akutTillaggPriceElement) {
            const akutTillagg = (grundpris + tillaggerKostnad) * 0.5;
            akutTillaggPriceElement.textContent = `${akutTillagg} kr`;
            akutPriceRow.style.display = 'flex';
        } else if (akutPriceRow) {
            akutPriceRow.style.display = 'none';
        }
        
        // Visa/dölj fönster-rad
        const fonsterputsChecked = document.getElementById('fonsterputs')?.checked;
        const fonsterPriceRow = document.getElementById('fonster-price-row');
        
        if (fonsterputsChecked && fonsterPriceRow) {
            fonsterPriceRow.style.display = 'flex';
        } else if (fonsterPriceRow) {
            fonsterPriceRow.style.display = 'none';
        }
        
        // Visa prissektion om det finns något pris
        const priceSection = document.getElementById('main-price-section');
        if (priceSection) {
            if (grundpris > 0 || tillaggerKostnad > 0) {
                priceSection.style.display = 'block';
            } else {
                priceSection.style.display = 'none';
            }
        }
    }

    updateCleaningWorkDescription() {
        console.log('📝 Uppdaterar arbetsbeskrivning för städtjänster');
        
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) {
            console.warn('❌ Arbetsbeskrivning-fält hittades inte');
            return;
        }

        // Hämta grundinformation
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const stadfrekvens = document.getElementById('stadfrekvens')?.value;
        const selectedServices = document.querySelectorAll('input[name="stadtjanster"]:checked');
        const akutService = document.getElementById('akut-service')?.checked;

        // Skapa arbetsbeskrivning i Solida Måleri stil
        let workDescription = "";

        // Kontrollera om några tjänster är valda
        if (selectedServices.length === 0 && !bostadstyp) {
            workDescription = "Välj tjänster under Anbud-fliken så genereras en detaljerad arbetsbeskrivning automatiskt här.";
            workDescriptionTextarea.value = workDescription;
            return;
        }

        // Huvudrubrik
        workDescription += "SOLIDA STÄD & FÖNSTERPUTS AB\n";
        workDescription += "ARBETSBESKRIVNING\n\n";

        // Grundinformation
        if (bostadstyp && stadfrekvens) {
            const bostadstypText = document.querySelector(`#bostadstyp option[value="${bostadstyp}"]`)?.textContent || '';
            const frekvensText = document.querySelector(`#stadfrekvens option[value="${stadfrekvens}"]`)?.textContent || '';
            
            workDescription += "UPPDRAGSINFO:\n";
            workDescription += `Bostadstyp: ${bostadstypText}\n`;
            workDescription += `Frekvens: ${frekvensText}\n`;
            
            if (akutService) {
                workDescription += "AKUTTJÄNST: Ja (+50% tillägg)\n";
            }
            
            workDescription += "\n" + "=".repeat(60) + "\n\n";
        }

        // Lägg till detaljerade beskrivningar för valda tjänster
        if (selectedServices.length > 0) {
            selectedServices.forEach(service => {
                const serviceValue = service.value;
                console.log('🔍 Service value:', serviceValue);
                console.log('🔍 SERVICE_DESCRIPTIONS:', CONFIG.CLEANING_PRICING.SERVICE_DESCRIPTIONS);
                const serviceDescription = CONFIG.CLEANING_PRICING.SERVICE_DESCRIPTIONS[serviceValue];
                console.log('🔍 Found description:', serviceDescription);
                
                if (serviceDescription) {
                    workDescription += serviceDescription.title + "\n\n";
                    workDescription += serviceDescription.content + "\n\n";
                    workDescription += "=".repeat(60) + "\n\n";
                } else {
                    console.warn('❌ Ingen beskrivning hittades för:', serviceValue);
                }
                
                // Lägg till fönsterputs-detaljer om det är valt
                if (serviceValue === 'fonsterputs') {
                    const fastighet = document.getElementById('fp_fastighet')?.value;
                    const fonstertyp = document.getElementById('fp_fonstertyp')?.value;
                    const oppning = document.querySelector('input[name="fp_oppning"]:checked')?.value;
                    const rengoring = document.querySelector('input[name="fp_rengoring"]:checked')?.value;
                    const antalFonster = document.getElementById('fp_antal_fonster')?.value;
                    const antalSidor = document.getElementById('fp_antal_sidor')?.value;
                    const sprojs = document.querySelector('input[name="fp_sprojs"]:checked')?.value;
                    const sprojsTyp = document.querySelector('input[name="fp_sprojs_typ"]:checked')?.value;
                    const antalRutor = document.getElementById('fp_antal_rutor')?.value;
                    const karmar = document.querySelector('input[name="fp_karmar"]:checked')?.value;
                    const stege = document.querySelector('input[name="fp_stege"]:checked')?.value;
                    const skylift = document.querySelector('input[name="fp_skylift"]:checked')?.value;

                    if (fastighet && fonstertyp) {
                        workDescription += "FÖNSTERPUTS TILLÄGG - DETALJER:\n";
                        
                        // Fastighetstyp
                        const fastighetOptions = {
                            'villa_radhus': 'Villa/Radhus',
                            'lagenhet': 'Lägenhet', 
                            'affarslokal': 'Affärslokal',
                            'kommersiell_lokal': 'Kommersiell lokal',
                            'restaurang': 'Restaurang'
                        };
                        workDescription += `• Fastighetstyp: ${fastighetOptions[fastighet] || fastighet}\n`;
                        
                        // Fönstertyp
                        const fonstertypOptions = {
                            'standardfonster': 'Standardfönster',
                            'blandat': 'Blandat',
                            'stora_partier': 'Stora fönsterpartier'
                        };
                        workDescription += `• Fönstertyp: ${fonstertypOptions[fonstertyp] || fonstertyp}\n`;
                        
                        // Öppning
                        if (oppning) {
                            const oppningOptions = {
                                'utat': 'Öppnas utåt',
                                'inat': 'Öppnas inåt', 
                                'gar_ej_oppna': 'Går ej att öppna'
                            };
                            workDescription += `• Öppning: ${oppningOptions[oppning] || oppning}\n`;
                        }
                        
                        // Rengöringstyp
                        if (rengoring) {
                            const rengoringOptions = {
                                'invandig_utvandig': 'Invändig och utvändig rengöring',
                                'bara_invandig': 'Bara invändig rengöring',
                                'bara_utvandig': 'Bara utvändig rengöring'
                            };
                            workDescription += `• Rengöringstyp: ${rengoringOptions[rengoring] || rengoring}\n`;
                        }
                        
                        // Antal fönster och sidor
                        if (antalFonster) {
                            workDescription += `• Antal fönster: ${antalFonster} st\n`;
                        }
                        if (antalSidor) {
                            workDescription += `• Antal sidor att putsa: ${antalSidor} sidor\n`;
                        }
                        
                        // Spröjs-information
                        if (sprojs === 'ja' && sprojsTyp) {
                            const sprojsOptions = {
                                'fast': 'Fönster med fast spröjs',
                                'lostagbart': 'Fönster med löstagbart spröjs'
                            };
                            let sprojsText = sprojsOptions[sprojsTyp] || sprojsTyp;
                            if (sprojsTyp === 'fast' && antalRutor && parseInt(antalRutor) > 0) {
                                sprojsText += ` (${antalRutor} små rutor per fönster)`;
                            }
                            workDescription += `• Spröjs: ${sprojsText}\n`;
                        } else if (sprojs === 'nej') {
                            workDescription += "• Spröjs: Inga spröjs\n";
                        }
                        
                        // Tillgänglighetskrav
                        const tillganglighetKrav = [];
                        if (karmar === 'ja') tillganglighetKrav.push('Fönsterkarmar rengörs och torkas');
                        if (stege === 'ja') tillganglighetKrav.push('Stege behövs för åtkomst');
                        if (skylift === 'ja') tillganglighetKrav.push('Skylift/kran behövs');
                        
                        if (tillganglighetKrav.length > 0) {
                            workDescription += `• Särskilda krav: ${tillganglighetKrav.join(', ')}\n`;
                        }
                        
                        workDescription += "\nFönsterputs utförs professionellt med miljövänliga rengöringsmedel. Priset inkluderar all utrustning och säker åtkomst till fönstren.\n\n";
                    }
                }
            });
        }

        // Lägg till kundinformation
        const customerCompany = document.getElementById('customer-company')?.value;
        const customerContact = document.getElementById('customer-contact')?.value;
        const customerEmail = document.getElementById('customer-email')?.value;
        const customerPhone = document.getElementById('customer-phone')?.value;
        const customerAddress = document.getElementById('customer-address')?.value;
        const customerPostalCode = document.getElementById('customer-postal-code')?.value;
        const customerCity = document.getElementById('customer-city')?.value;
        
        if (customerCompany || customerEmail || customerPhone) {
            workDescription += "KUNDINFORMATION:\n";
            if (customerCompany) workDescription += `• Företag/Namn: ${customerCompany}\n`;
            if (customerContact) workDescription += `• Kontaktperson: ${customerContact}\n`;
            if (customerEmail) workDescription += `• E-post: ${customerEmail}\n`;
            if (customerPhone) workDescription += `• Telefon: ${customerPhone}\n`;
            if (customerAddress) workDescription += `• Adress: ${customerAddress}\n`;
            if (customerPostalCode && customerCity) workDescription += `• Ort: ${customerPostalCode} ${customerCity}\n`;
            workDescription += "\n";
        }
        
        // Lägg till akut/jourservice information (akutService redan deklarerad ovan)
        if (akutService) {
            workDescription += "AKUTTJÄNST:\n";
            workDescription += "• Samma dag eller nästa dag-tjänst begärd\n";
            workDescription += "• Pristillägg: +50%\n\n";
        }
        
        // Lägg till hemstädning schema (om hemstädning är vald)
        const hemstadningChecked = document.getElementById('hemstadning')?.checked;
        if (hemstadningChecked) {
            const preferredDay = document.getElementById('preferred-day')?.value;
            const preferredTime = document.getElementById('preferred-time')?.value;
            const startDate = document.getElementById('start-date')?.value;
            
            if (preferredDay || preferredTime || startDate) {
                workDescription += "SCHEMA HEMSTÄDNING:\n";
                if (preferredDay) workDescription += `• Föredragen dag: ${preferredDay}\n`;
                if (preferredTime) workDescription += `• Föredragen tid: ${preferredTime}\n`;
                if (startDate) workDescription += `• Startdatum: ${startDate}\n`;
                workDescription += "\n";
            }
        }
        
        // Lägg till tillgänglighet & nyckelhantering
        const accessMethod = document.getElementById('access-method')?.value;
        if (accessMethod) {
            workDescription += "ÅTKOMST:\n";
            workDescription += `• Åtkomst till fastigheten: ${accessMethod}\n\n`;
        }
        
        // Lägg till husdjur & allergier
        const pets = document.getElementById('pets')?.value;
        const allergies = document.getElementById('allergies')?.value;
        if (pets || allergies) {
            workDescription += "SÄRSKILDA KRAV:\n";
            if (pets && pets !== 'nej') workDescription += `• Husdjur: ${pets}\n`;
            if (allergies) workDescription += `• Allergier/Önskemål: ${allergies}\n`;
            workDescription += "\n";
        }
        
        // Lägg till parkering
        const parking = document.getElementById('parking')?.value;
        if (parking) {
            workDescription += "PARKERING:\n";
            workDescription += `• Parkeringsmöjligheter: ${parking}\n\n`;
        }

        // Lägg till allmän information och garanti
        if (selectedServices.length > 0) {
            workDescription += "UTFÖRANDE OCH GARANTI:\n";
            workDescription += "• Professionell städning utförs av erfaren personal\n";
            workDescription += "• Användning av miljövänliga rengöringsmedel\n";
            workDescription += "• All utrustning och material ingår\n";
            workDescription += "• Kvalitetsgaranti på utfört arbete\n";
            workDescription += "• RUT-avdrag kan tillämpas (50% skattereduktion)\n\n";
        }

        // Lägg till slutinformation
        workDescription += "UTFÖRANDE:\n";
        workDescription += "• Professionell städning med erfaren personal\n";
        workDescription += "• Miljövänliga rengöringsmedel används\n";
        workDescription += "• All nödvändig utrustning ingår\n";
        workDescription += "• Kvalitetsgaranti på utfört arbete\n\n";
        
        workDescription += "Med vänliga hälsningar,\n";
        workDescription += "SOLIDA STÄD & FÖNSTERPUTS AB";

        // Uppdatera arbetsbeskrivningsfältet
        workDescriptionTextarea.value = workDescription;
        
        console.log('✅ Arbetsbeskrivning uppdaterad för städtjänster');
    }
    
    showNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.add('visible');
            console.log('✅ Navigation bar visas från QuoteCalculator');
        } else {
            console.warn('⚠️ Navigation bar hittades inte från QuoteCalculator');
        }
    }
}

// =================
// ADDITIONAL SERVICE MANAGER
// =================
class AdditionalServiceManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupModal();
        this.setupSignatureCanvas();
        this.setupEventListeners();
    }
    
    setupModal() {
        this.modal = document.getElementById('additional-service-modal');
        this.form = document.getElementById('tillaggtjanst-form');
        this.openBtn = document.getElementById('additional-service-btn');
        this.closeBtn = document.getElementById('additional-service-close');
        this.cancelBtn = document.getElementById('additional-service-cancel');
    }
    
    setupSignatureCanvas() {
        // Setup fullscreen signature elements
        this.signatureModal = document.getElementById('signature-fullscreen-modal');
        this.fullscreenCanvas = document.getElementById('signature-fullscreen-canvas');
        this.signaturePreview = document.getElementById('tillagg-signature-preview');
        this.signaturePlaceholder = this.signaturePreview?.querySelector('.signature-placeholder');
        this.signatureImage = document.getElementById('tillagg-signature-image');
        
        // Setup fullscreen canvas
        if (this.fullscreenCanvas) {
            this.fullscreenCtx = this.fullscreenCanvas.getContext('2d');
            this.setupFullscreenCanvasStyles();
        }
        
        // Signature data storage
        this.signatureBase64 = null;
    }
    
    resizeFullscreenCanvas() {
        if (!this.fullscreenCanvas || !this.fullscreenCtx) return;
        
        // Force canvas to use full viewport dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Get device pixel ratio for high DPI support
        const dpr = window.devicePixelRatio || 1;
        
        // Set the internal size to the display size multiplied by dpr
        this.fullscreenCanvas.width = width * dpr;
        this.fullscreenCanvas.height = height * dpr;
        
        // Set the display size to full viewport
        this.fullscreenCanvas.style.width = width + 'px';
        this.fullscreenCanvas.style.height = height + 'px';
        
        // Scale the context to ensure correct drawing operations
        this.fullscreenCtx.scale(dpr, dpr);
        
        this.setupFullscreenCanvasStyles();
        
        console.log(`📱 Canvas resized to: ${width}x${height} (DPR: ${dpr})`);
    }
    
    setupFullscreenCanvasStyles() {
        if (!this.fullscreenCtx) return;
        
        this.fullscreenCtx.strokeStyle = '#000000'; // Black for clear signature
        this.fullscreenCtx.lineWidth = 4; // Optimal thickness for mobile
        this.fullscreenCtx.lineCap = 'round';
        this.fullscreenCtx.lineJoin = 'round';
        this.fullscreenCtx.imageSmoothingEnabled = true;
        this.fullscreenCtx.imageSmoothingQuality = 'high';
    }
    
    setupEventListeners() {
        // Modal open/close
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.openModal());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Fullscreen signature button (tab version)
        const fullscreenBtn = document.getElementById('tillagg-signature-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.openFullscreenSignature());
        }
        
        // Clear signature button (tab version)
        const clearBtn = document.getElementById('tillagg-clear-signature');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSignature());
        }
        
        // Fullscreen signature controls
        const fullscreenClearBtn = document.getElementById('signature-fullscreen-clear');
        const fullscreenCancelBtn = document.getElementById('signature-fullscreen-cancel');
        const fullscreenSaveBtn = document.getElementById('signature-fullscreen-save');
        
        if (fullscreenClearBtn) {
            fullscreenClearBtn.addEventListener('click', () => this.clearFullscreenSignature());
        }
        
        if (fullscreenCancelBtn) {
            fullscreenCancelBtn.addEventListener('click', () => this.closeFullscreenSignature());
        }
        
        if (fullscreenSaveBtn) {
            fullscreenSaveBtn.addEventListener('click', () => this.saveFullscreenSignature());
        }
        
        // Fullscreen signature canvas events
        this.setupFullscreenCanvasEvents();
        
        // Window resize listener for fullscreen canvas
        window.addEventListener('resize', () => {
            if (this.signatureModal && this.signatureModal.style.display !== 'none') {
                setTimeout(() => this.resizeFullscreenCanvas(), 100);
            }
        });
        
        // Orientation change listener for mobile devices
        window.addEventListener('orientationchange', () => {
            if (this.signatureModal && this.signatureModal.style.display !== 'none') {
                // Multiple resize attempts to handle orientation change properly
                setTimeout(() => this.resizeFullscreenCanvas(), 100);
                setTimeout(() => this.resizeFullscreenCanvas(), 300);
                setTimeout(() => this.resizeFullscreenCanvas(), 600);
            }
        });
    }
    
    setupFullscreenCanvasEvents() {
        if (!this.fullscreenCanvas) return;
        
        // Mouse events
        this.fullscreenCanvas.addEventListener('mousedown', (e) => this.startFullscreenDrawing(e));
        this.fullscreenCanvas.addEventListener('mousemove', (e) => this.drawFullscreen(e));
        this.fullscreenCanvas.addEventListener('mouseup', () => this.stopFullscreenDrawing());
        this.fullscreenCanvas.addEventListener('mouseout', () => this.stopFullscreenDrawing());
        
        // Touch events for mobile
        this.fullscreenCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.startFullscreenDrawing(e);
            }
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.drawFullscreen(e);
            }
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopFullscreenDrawing();
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.stopFullscreenDrawing();
        }, { passive: false });
    }
    
    // Fullscreen signature methods
    openFullscreenSignature() {
        if (!this.signatureModal) return;
        
        // Try to force landscape orientation on mobile
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                console.log('Could not lock orientation');
            });
        }
        
        // Show modal
        this.signatureModal.style.display = 'flex';
        
        // Initialize canvas after modal is visible
        setTimeout(() => {
            this.resizeFullscreenCanvas();
            this.clearFullscreenSignature();
        }, 100);
        
        // Additional resize check for mobile orientation changes
        setTimeout(() => {
            this.resizeFullscreenCanvas();
        }, 500);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeFullscreenSignature() {
        if (!this.signatureModal) return;
        
        // Unlock orientation
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        
        // Hide modal
        this.signatureModal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    clearFullscreenSignature() {
        if (!this.fullscreenCanvas || !this.fullscreenCtx) return;
        
        // Clear canvas
        this.fullscreenCtx.clearRect(0, 0, this.fullscreenCanvas.width, this.fullscreenCanvas.height);
        
        // Reset drawing state
        this.isDrawing = false;
        this.hasSignature = false;
    }
    
    saveFullscreenSignature() {
        if (!this.fullscreenCanvas || !this.hasSignature) {
            alert('Vänligen signera innan du sparar');
            return;
        }
        
        // Create compressed signature image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set desired output size (higher quality: 800x400px)
        tempCanvas.width = 800;
        tempCanvas.height = 400;
        
        // Fill with white background
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Enable high-quality rendering
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
        // Scale and draw the signature with high quality
        tempCtx.drawImage(this.fullscreenCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Convert to base64 PNG with maximum quality
        this.signatureBase64 = tempCanvas.toDataURL('image/png', 1.0);
        
        // Update preview
        this.updateSignaturePreview();
        
        // Close fullscreen modal
        this.closeFullscreenSignature();
        
        // Show confirmation
        this.showSignatureConfirmation();
    }
    
    updateSignaturePreview() {
        if (!this.signatureBase64) return;
        
        // Hide placeholder, show image
        if (this.signaturePlaceholder) {
            this.signaturePlaceholder.style.display = 'none';
        }
        
        if (this.signatureImage) {
            this.signatureImage.src = this.signatureBase64;
            this.signatureImage.style.display = 'block';
        }
        
        // Show clear button
        const clearBtn = document.getElementById('clear-signature');
        if (clearBtn) {
            clearBtn.style.display = 'block';
        }
    }
    
    showSignatureConfirmation() {
        // Create temporary confirmation message
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        `;
        confirmation.innerHTML = '✅ Signering sparad!';
        
        document.body.appendChild(confirmation);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 3000);
    }
    
    // Fullscreen drawing methods
    startFullscreenDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        
        const point = this.getEventPoint(e, this.fullscreenCanvas);
        this.fullscreenCtx.beginPath();
        this.fullscreenCtx.moveTo(point.x, point.y);
    }
    
    drawFullscreen(e) {
        if (!this.isDrawing) return;
        
        const point = this.getEventPoint(e, this.fullscreenCanvas);
        this.fullscreenCtx.lineTo(point.x, point.y);
        this.fullscreenCtx.stroke();
    }
    
    stopFullscreenDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.fullscreenCtx.beginPath();
        }
    }
    
    getEventPoint(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        // Calculate accurate coordinates considering device pixel ratio and scaling
        const x = (clientX - rect.left) * (canvas.width / rect.width) / dpr;
        const y = (clientY - rect.top) * (canvas.height / rect.height) / dpr;
        
        return { x, y };
    }
    
    openModal() {
        this.populateCustomerInfo();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        this.form.reset();
        
        // Wait for modal to render then setup canvas properly
        setTimeout(() => {
            this.resizeCanvas();
            this.clearSignature();
        }, 50);
        
        this.hideError();
        this.hideSuccess();
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    populateCustomerInfo() {
        // Auto-fill customer info from main form
        const customerName = document.getElementById('additional-customer-name');
        const customerPhone = document.getElementById('additional-customer-phone');
        const customerAddress = document.getElementById('additional-customer-address');
        
        if (customerName) {
            const firstName = document.getElementById('first_name')?.value || '';
            const lastName = document.getElementById('last_name')?.value || '';
            const company = document.getElementById('company_name')?.value || '';
            customerName.value = company ? `${firstName} ${lastName} (${company})` : `${firstName} ${lastName}`;
        }
        
        if (customerPhone) {
            customerPhone.value = document.getElementById('phone_number')?.value || '';
        }
        
        if (customerAddress) {
            const street = document.getElementById('street_address')?.value || '';
            const postal = document.getElementById('postal_code')?.value || '';
            const city = document.getElementById('city')?.value || '';
            customerAddress.value = `${street}, ${postal} ${city}`;
        }
    }
    
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        return {
            x: (clientX - rect.left) * (scaleX / (window.devicePixelRatio || 1)),
            y: (clientY - rect.top) * (scaleY / (window.devicePixelRatio || 1))
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        this.hasSignature = true;
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }
    
    clearSignature() {
        // Clear the signature preview and hide image
        if (this.signatureImage) {
            this.signatureImage.style.display = 'none';
        }
        
        if (this.signaturePlaceholder) {
            this.signaturePlaceholder.style.display = 'block';
        }
        
        // Clear signature data
        this.signatureBase64 = null;
        this.hasSignature = false;
        
        // Hide clear button
        const clearBtn = document.getElementById('clear-signature');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        
        this.hideError();
    }
    
    getSignatureBase64() {
        return this.signatureBase64;
    }
    
    validateForm() {
        const serviceTypeEl = document.getElementById('tillagg-service-type');
        const servicePriceEl = document.getElementById('tillagg-service-price');
        
        if (!serviceTypeEl || !serviceTypeEl.value.trim()) {
            this.showError('Vänligen ange typ av tilläggstjänst');
            if (serviceTypeEl) serviceTypeEl.focus();
            return false;
        }
        
        const priceValue = servicePriceEl ? parseFloat(servicePriceEl.value) : 0;
        if (!servicePriceEl || !servicePriceEl.value.trim() || isNaN(priceValue) || priceValue <= 0) {
            this.showError('Vänligen ange ett giltigt pris för tilläggstjänsten');
            if (servicePriceEl) servicePriceEl.focus();
            return false;
        }
        
        if (!this.signatureBase64) {
            this.showError('Signatur krävs för att godkänna tilläggstjänsten');
            return false;
        }
        
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const submitBtn = document.getElementById('tillagg-submit-btn');
        const spinner = document.getElementById('tillagg-loading-spinner');
        
        // Show loading state
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        
        try {
            const formData = this.collectFormData();
            await this.sendToWebhook(formData);
            this.showSuccess();
        } catch (error) {
            console.error('Error sending additional service:', error);
            this.showError('Ett fel uppstod vid skickning av tilläggstjänsten. Vänligen försök igen.');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        }
    }
    
    collectFormData() {
        const originalAnbudsId = this.generateAnbudsId();
        
        const nameEl = document.getElementById('tillagg-customer-company');
        const phoneEl = document.getElementById('tillagg-customer-contact');
        const addressEl = document.getElementById('tillagg-customer-address');
        const typeEl = document.getElementById('tillagg-service-type');
        const priceEl = document.getElementById('tillagg-service-price');
        const dateEl = document.getElementById('tillagg-service-date');
        const commentEl = document.getElementById('tillagg-service-comment');
        
        // Signatur-data för Zapier
        const signatureBase64 = this.getSignatureBase64();
        const signatureTimestamp = new Date().toISOString();
        const hasSignature = !!signatureBase64;
        
        return {
            kundInfo: {
                namn: nameEl ? nameEl.value : '',
                telefon: phoneEl ? phoneEl.value : '',
                adress: addressEl ? addressEl.value : ''
            },
            tilläggstyp: typeEl ? typeEl.value : '',
            pris: priceEl ? parseFloat(priceEl.value) || 0 : 0,
            datum: dateEl ? dateEl.value : '',
            kommentar: commentEl ? commentEl.value || '' : '',
            
            // Signatur-data för Zapier-integration
            signatur_base64: signatureBase64,
            signatur_timestamp: signatureTimestamp,
            signatur_tillagd: hasSignature,
            
            // Legacy field för bakåtkompatibilitet
            signaturBild: signatureBase64,
            
            tidsstämpel: signatureTimestamp,
            ursprungligtAnbud: originalAnbudsId,
            källa: 'Solida Städ & Fönsterputs AB - Tilläggstjänst'
        };
    }
    
    generateAnbudsId() {
        // Generate a simple anbud ID based on customer info and timestamp
        const nameEl = document.getElementById('tillagg-customer-company');
        const customerName = nameEl ? nameEl.value : 'UNKNOWN';
        const timestamp = Date.now();
        const nameCode = customerName.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 6) || 'NONAME';
        return `TILLAGG-${nameCode}-${timestamp}`;
    }
    
    async sendToWebhook(data) {
        const webhookUrl = '/.netlify/functions/submit';
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    showError(message) {
        const errorEl = document.getElementById('tillagg-signature-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }
    
    hideError() {
        const errorEl = document.getElementById('tillagg-signature-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }
    
    showSuccess() {
        const formEl = document.getElementById('tillaggtjanst-form');
        const successEl = document.getElementById('tillagg-success-message');
        
        if (formEl) formEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (formEl) formEl.style.display = 'block';
            if (successEl) successEl.style.display = 'none';
            // Reset form
            if (formEl) formEl.reset();
            this.clearSignature();
        }, 5000);
    }
    
    hideSuccess() {
        const successEl = document.getElementById('additional-service-success');
        if (successEl) {
            successEl.style.display = 'none';
        }
    }
    
    // Test function for debugging
    testIntegrity() {
        console.log('🧪 Testing Additional Service Manager integrity...');
        
        const tests = {
            modal: !!this.modal,
            canvas: !!this.canvas,
            context: !!this.ctx,
            openBtn: !!this.openBtn,
            closeBtn: !!this.closeBtn,
            cancelBtn: !!this.cancelBtn,
            form: !!this.form
        };
        
        console.log('Elements found:', tests);
        
        const allElementsFound = Object.values(tests).every(test => test);
        console.log(allElementsFound ? '✅ All elements found' : '❌ Some elements missing');
        
        return allElementsFound;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM Content Loaded');
    
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        console.log('🚀 Initializing application...');
        window.passwordProtection = new PasswordProtection();
        window.quoteCalculator = new QuoteCalculator();
        window.themeToggle = new ThemeToggle();
        window.additionalServiceManager = new AdditionalServiceManager();
        console.log('✅ Application initialized');
    }, 50);

    // Setup navigation buttons
    const logoutBtn = document.getElementById('logout-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('🚪 Logout knapp klickad');
            if (window.passwordProtection) {
                window.passwordProtection.logout();
            } else {
                console.warn('⚠️ passwordProtection är inte tillgängligt');
            }
        });
        console.log('✅ Logout knapp event listener tillagd');
    } else {
        console.warn('⚠️ Logout knapp hittades inte');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            console.log('🔄 Reset knapp klickad');
            if (window.quoteCalculator) {
                window.quoteCalculator.resetApp();
            } else {
                console.warn('⚠️ quoteCalculator är inte tillgängligt');
            }
        });
        console.log('✅ Reset knapp event listener tillagd');
    } else {
        console.warn('⚠️ Reset knapp hittades inte');
    }
    
    // Theme toggle test
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        console.log('✅ Theme toggle knapp hittad');
    } else {
        console.warn('⚠️ Theme toggle knapp hittades inte');
    }
});

// Backup initialization if DOM event fails
window.addEventListener('load', function() {
    console.log('🌟 Window Load Event');
    
    if (!window.passwordProtection) {
        console.log('🔧 Backup initialization triggered');
        setTimeout(() => {
            window.passwordProtection = new PasswordProtection();
            window.quoteCalculator = new QuoteCalculator();
            window.themeToggle = new ThemeToggle();
            window.additionalServiceManager = new AdditionalServiceManager();
            console.log('✅ Backup initialization complete');
        }, 100);
    }
});

// Global login function for direct testing
window.testDirectLogin = function() {
    console.log('🧪 Direct login test called');
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.value = 'solida123';
        console.log('Password set to:', passwordInput.value);
        
        // Try to login directly
        if (window.passwordProtection) {
            window.passwordProtection.handleLogin();
        } else {
            console.log('❌ PasswordProtection not found, trying direct approach');
            const overlay = document.getElementById('password-overlay');
            const main = document.getElementById('mainContainer');
            if (overlay && main) {
                overlay.style.display = 'none';
                main.style.display = 'block';
                console.log('✅ Direct UI switch completed');
            }
        }
    }
};