/**
 * Barcode Scanner Module
 * Använder ZXing-JS som primär bibliotek, QuaggaJS som fallback
 * Stöder EAN-13, EAN-8, Code 128, Code 39
 */

class BarcodeScanner {
    constructor() {
        this.stream = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.isScanning = false;
        this.onDetectedCallback = null;
        this.lastScan = 0;
        this.scanCooldown = 1000; // Max 1 scan per sekund
        this.codeReader = null;
        this.fallbackMode = false;
        this.torchSupported = false;
        this.torchEnabled = false;
        
        this.supportedFormats = [
            'EAN_13',
            'EAN_8', 
            'CODE_128',
            'CODE_39'
        ];
        
        this.init();
    }

    async init() {
        // Försök ladda ZXing-JS först
        try {
            if (typeof ZXing !== 'undefined') {
                console.log('Using ZXing-JS for barcode scanning');
                this.codeReader = new ZXing.BrowserBarcodeReader();
                this.fallbackMode = false;
            } else {
                throw new Error('ZXing not available');
            }
        } catch (error) {
            console.log('ZXing-JS not available, checking for QuaggaJS fallback');
            if (typeof Quagga !== 'undefined') {
                console.log('Using QuaggaJS as fallback');
                this.fallbackMode = true;
            } else {
                throw new Error('No barcode scanning library available');
            }
        }
    }

    async startScanner(videoElement) {
        this.videoElement = videoElement;
        
        try {
            // Begär kameratillstånd
            const constraints = {
                video: {
                    facingMode: 'environment', // Bakre kamera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.stream;
            
            // Kontrollera torch-stöd
            const track = this.stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            this.torchSupported = capabilities && 'torch' in capabilities;

            await this.videoElement.play();
            this.isScanning = true;

            if (this.fallbackMode) {
                await this.startQuaggaScanning();
            } else {
                this.startZXingScanning();
            }

            return true;
        } catch (error) {
            console.error('Error starting camera:', error);
            throw error;
        }
    }

    startZXingScanning() {
        const scanFrame = () => {
            if (!this.isScanning || !this.videoElement) {
                return;
            }

            const now = Date.now();
            if (now - this.lastScan < this.scanCooldown) {
                requestAnimationFrame(scanFrame);
                return;
            }

            try {
                // Skapa canvas för att fånga videoframes
                if (!this.canvasElement) {
                    this.canvasElement = document.createElement('canvas');
                    this.canvasElement.width = this.videoElement.videoWidth;
                    this.canvasElement.height = this.videoElement.videoHeight;
                }

                const ctx = this.canvasElement.getContext('2d');
                ctx.drawImage(this.videoElement, 0, 0);
                const imageData = ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

                this.codeReader.decodeFromImageData(imageData)
                    .then(result => {
                        if (result && this.isValidFormat(result.getBarcodeFormat())) {
                            this.lastScan = now;
                            this.handleDetection(result.getText(), result.getBarcodeFormat().toString());
                        }
                    })
                    .catch(err => {
                        // Ingen kod hittad, fortsätt skanna
                    });
            } catch (error) {
                console.error('ZXing scanning error:', error);
            }

            requestAnimationFrame(scanFrame);
        };

        scanFrame();
    }

    async startQuaggaScanning() {
        return new Promise((resolve, reject) => {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: this.videoElement.parentElement,
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    }
                },
                decoder: {
                    readers: [
                        "ean_reader",
                        "ean_8_reader", 
                        "code_128_reader",
                        "code_39_reader"
                    ]
                }
            }, (err) => {
                if (err) {
                    console.error('Quagga initialization error:', err);
                    reject(err);
                    return;
                }
                
                Quagga.start();
                
                Quagga.onDetected((result) => {
                    const now = Date.now();
                    if (now - this.lastScan < this.scanCooldown) {
                        return;
                    }

                    this.lastScan = now;
                    this.handleDetection(result.codeResult.code, result.codeResult.format);
                });

                resolve();
            });
        });
    }

    isValidFormat(format) {
        const formatStr = format.toString();
        return this.supportedFormats.some(supported => 
            formatStr.includes(supported) || 
            supported.includes(formatStr)
        );
    }

    handleDetection(code, format) {
        console.log(`Detected barcode: ${code} (${format})`);
        
        // Vibration om stöds
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Ljud om tillåtet (måste ske efter användargest)
        this.playBeepSound();

        if (this.onDetectedCallback) {
            this.onDetectedCallback(code, format);
        }
    }

    playBeepSound() {
        try {
            // Skapa kort beep-ljud
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Ljud inte tillåtet eller stöds inte
            console.log('Audio not available');
        }
    }

    async setTorch(enabled) {
        if (!this.torchSupported || !this.stream) {
            return false;
        }

        try {
            const track = this.stream.getVideoTracks()[0];
            await track.applyConstraints({
                advanced: [{ torch: enabled }]
            });
            this.torchEnabled = enabled;
            return true;
        } catch (error) {
            console.error('Error setting torch:', error);
            return false;
        }
    }

    stopScanner() {
        this.isScanning = false;
        
        if (this.fallbackMode && typeof Quagga !== 'undefined') {
            Quagga.stop();
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }

        this.torchEnabled = false;
    }

    onDetected(callback) {
        this.onDetectedCallback = callback;
    }

    // Fallback för manuell inmatning
    static showManualInput(callback) {
        const modal = document.createElement('div');
        modal.className = 'barcode-manual-modal';
        modal.innerHTML = `
            <div class="barcode-manual-content">
                <h3>Ange streckkod manuellt</h3>
                <div class="form-group">
                    <label for="manual-barcode">Streckkod:</label>
                    <input type="text" id="manual-barcode" placeholder="Ange streckkod..." autofocus>
                </div>
                <div class="form-group">
                    <label for="manual-name">Produktnamn:</label>
                    <input type="text" id="manual-name" placeholder="Ange produktnamn...">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn-cancel">Avbryt</button>
                    <button type="button" class="btn-add">Lägg till</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const barcodeInput = modal.querySelector('#manual-barcode');
        const nameInput = modal.querySelector('#manual-name');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const addBtn = modal.querySelector('.btn-add');

        const cleanup = () => {
            document.body.removeChild(modal);
        };

        cancelBtn.addEventListener('click', cleanup);

        addBtn.addEventListener('click', () => {
            const barcode = barcodeInput.value.trim();
            const name = nameInput.value.trim();

            if (barcode && name) {
                callback(barcode, 'MANUAL', name);
                cleanup();
            } else {
                alert('Både streckkod och produktnamn måste fyllas i');
            }
        });

        // Stäng på Escape
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }
}

// Skapa overlay-komponent för kameravy
class ScannerOverlay {
    constructor(container) {
        this.container = container;
        this.overlay = null;
        this.createOverlay();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'scanner-overlay';
        this.overlay.innerHTML = `
            <div class="scanner-frame">
                <div class="scanner-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
                <div class="scanner-line"></div>
            </div>
            <div class="scanner-instructions">
                Placera streckkoden inom ramen
            </div>
        `;

        this.container.appendChild(this.overlay);
    }

    show() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    remove() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

// Exportera för användning
window.BarcodeScanner = BarcodeScanner;
window.ScannerOverlay = ScannerOverlay;