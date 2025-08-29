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
        
        const verticalGaps = 16; // liten buffert för paddings/marginaler
        const available = Math.max(120, vvH - headerH - footerH - safeBottom - verticalGaps);
        
        // Sätt höjd på canvasens wrapper
        wrap.style.height = available + 'px';
        
        // Sätt faktiska canvas-pixlar med device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = wrap.clientWidth;
        const displayHeight = wrap.clientHeight;
        
        // Viktigt: width/height attribut, inte bara CSS
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        // Scale the context to match device pixel ratio
        if (signatureContext) {
            signatureContext.scale(dpr, dpr);
            
            // Restore canvas styling after scaling
            signatureContext.lineWidth = 2;
            signatureContext.lineCap = 'round';
            signatureContext.lineJoin = 'round';
            signatureContext.strokeStyle = '#000000';
            signatureContext.imageSmoothingEnabled = true;
            if (signatureContext.imageSmoothingQuality) {
                signatureContext.imageSmoothingQuality = 'high';
            }
        }
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

    // Event handlers
    function onResize() {
        setTimeout(layoutSignature, 100);
    }

    function onOrientationChange() {
        setTimeout(layoutSignature, 150);
    }

    function onVisualViewportResize() {
        setTimeout(layoutSignature, 50);
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
            const imageData = signatureContext.getImageData(0, 0, canvas.width, canvas.height);
            return !imageData.data.some(channel => channel !== 0);
        }
    };
}