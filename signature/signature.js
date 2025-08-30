/**
 * Signature Module - Fristående ES-modul för signaturfunktionalitet
 * Kan återanvändas mellan flera appar utan sidoeffekter
 */

export function initSignature(containerEl, options = {}) {
    const opts = {
        hideHeaderInLandscape: true,
        onSave: null,
        onCancel: null,
        onClear: null,
        themeVars: {},
        ...options
    };

    // Sätt temavariabler om angivna
    for (const [k, v] of Object.entries(opts.themeVars)) {
        containerEl.style.setProperty(`--${k}`, v);
    }

    // DOM-element
    const header = containerEl.querySelector('.sig-modal__header');
    const body = containerEl.querySelector('.sig-modal__body');
    const footer = containerEl.querySelector('.sig-modal__footer');
    const wrap = containerEl.querySelector('.sig-canvas-wrap');
    const canvas = containerEl.querySelector('canvas#signatureCanvas');

    if (!canvas) {
        console.error('Signature canvas not found');
        return null;
    }

    // Signaturstatus
    let isDrawing = false;
    let signatureContext = null;

    // Initiera canvas-context
    function initCanvas() {
        signatureContext = canvas.getContext('2d');
        
        // Canvas-styling med hög upplösning
        signatureContext.lineWidth = 2;
        signatureContext.lineCap = 'round';
        signatureContext.lineJoin = 'round';
        signatureContext.strokeStyle = '#000000';
        signatureContext.imageSmoothingEnabled = true;
        if (signatureContext.imageSmoothingQuality) {
            signatureContext.imageSmoothingQuality = 'high';
        }
    }

    // Layout-funktioner
    function isLandscape() {
        return window.matchMedia('(orientation: landscape)').matches;
    }

    function layoutSignature() {
        // Dölj header i landscape vid behov
        if (header && opts.hideHeaderInLandscape) {
            header.style.display = isLandscape() ? 'none' : '';
        }

        const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const isLandscapeMode = isLandscape();
        
        const headerH = isLandscapeMode ? 0 : (header ? header.offsetHeight : 0);
        const footerH = footer ? footer.offsetHeight : 0;
        
        // Safe area bottom om CSS-variabel saknas
        let safeBottom = 0;
        try {
            const sb = getComputedStyle(footer).getPropertyValue('padding-bottom');
            safeBottom = parseInt((sb || '0').replace('px',''), 10) || 0;
        } catch(e) {}
        
        const verticalGaps = 16;
        const available = Math.max(120, vvH - headerH - footerH - safeBottom - verticalGaps);
        
        // Sätt höjd på canvasens wrapper
        wrap.style.height = available + 'px';
        
        // Optimerad canvas-rendering - använd lägre DPR på mobil för bättre prestanda
        const isMobile = window.innerWidth < 768;
        const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 2) : (window.devicePixelRatio || 1);
        const displayWidth = wrap.clientWidth;
        const displayHeight = wrap.clientHeight;
        
        // Kolla om dimensioner faktiskt har ändrats
        const needsResize = canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr;
        
        if (needsResize) {
            // Spara befintlig signatur om det finns någon
            let imageData = null;
            if (signatureContext && !isEmpty()) {
                imageData = canvas.toDataURL('image/png');
            }
            
            // Sätt nya dimensioner
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            
            // Återställ context-inställningar efter resize
            if (signatureContext) {
                signatureContext.scale(dpr, dpr);
                signatureContext.lineWidth = 2;
                signatureContext.lineCap = 'round';
                signatureContext.lineJoin = 'round';
                signatureContext.strokeStyle = '#000000';
                signatureContext.imageSmoothingEnabled = true;
                if (signatureContext.imageSmoothingQuality) {
                    signatureContext.imageSmoothingQuality = 'high';
                }
                
                // Återställ signatur om det fanns någon
                if (imageData) {
                    const img = new Image();
                    img.onload = () => {
                        signatureContext.drawImage(img, 0, 0, displayWidth, displayHeight);
                    };
                    img.src = imageData;
                }
            }
        }
    }
    
    function isEmpty() {
        if (!signatureContext) return true;
        const imageData = signatureContext.getImageData(0, 0, canvas.width, canvas.height);
        return !imageData.data.some(channel => channel !== 0);
    }

    // Rita-funktioner
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        signatureContext.beginPath();
        signatureContext.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        signatureContext.lineTo(x, y);
        signatureContext.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function clearSignature() {
        if (signatureContext) {
            signatureContext.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Event handlers med throttling för bättre prestanda
    let layoutTimer = null;
    
    function throttledLayout() {
        if (layoutTimer) {
            cancelAnimationFrame(layoutTimer);
        }
        layoutTimer = requestAnimationFrame(layoutSignature);
    }

    function onResize() {
        throttledLayout();
    }

    function onOrientationChange() {
        // Orientation change behöver lite längre timeout
        setTimeout(throttledLayout, 100);
    }

    function onVisualViewportResize() {
        throttledLayout();
    }

    // Canvas-rithantering
    function setupCanvasDrawing() {
        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events för mobil
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e.touches[0]);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e.touches[0]);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopDrawing();
        });
    }

    // Footerknappar
    const btnSave = containerEl.querySelector('[data-sig="save"]');
    const btnCancel = containerEl.querySelector('[data-sig="cancel"]');
    const btnClear = containerEl.querySelector('[data-sig="clear"]');

    function onSaveClick() {
        if (opts.onSave) {
            const imageData = canvas.toDataURL('image/png');
            opts.onSave(imageData);
        }
    }

    function onCancelClick() {
        if (opts.onCancel) {
            opts.onCancel();
        }
    }

    function onClearClick() {
        clearSignature();
        if (opts.onClear) {
            opts.onClear();
        }
    }

    // Event listeners
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientationChange, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', onVisualViewportResize, { passive: true });
    }

    // Knapp-lyssnare
    if (btnSave) btnSave.addEventListener('click', onSaveClick);
    if (btnCancel) btnCancel.addEventListener('click', onCancelClick);
    if (btnClear) btnClear.addEventListener('click', onClearClick);

    // Initiera
    initCanvas();
    setupCanvasDrawing();
    layoutSignature();

    // Publikt API
    return {
        destroy() {
            // Ta bort event listeners
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onOrientationChange);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', onVisualViewportResize);
            }

            // Ta bort canvas-lyssnare
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);

            // Ta bort knapp-lyssnare
            if (btnSave) btnSave.removeEventListener('click', onSaveClick);
            if (btnCancel) btnCancel.removeEventListener('click', onCancelClick);
            if (btnClear) btnClear.removeEventListener('click', onClearClick);
        },
        
        redraw: layoutSignature,
        
        clear: clearSignature,
        
        getImageData() {
            return canvas.toDataURL('image/png');
        },
        
        isEmpty() {
            return isEmpty();
        }
    };
}