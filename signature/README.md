# Signature Module

Fristående ES-modul för signaturfunktionalitet som kan återanvändas mellan flera appar utan sidoeffekter.

## Features

- ✅ **iOS-optimerad**: Stöd för `100dvh/svh`, `env(safe-area-inset-bottom)`, `visualViewport`
- ✅ **Responsiv**: Fungerar på iOS/Android/desktop
- ✅ **Namespacad**: Inga globala CSS-variabler eller sidoeffekter
- ✅ **Header-hantering**: Automatiskt dölja header i landscape-läge
- ✅ **High-DPI**: Stöd för retina-skärmar med devicePixelRatio
- ✅ **Touch & Mouse**: Fungerar både med mus och pekskärm
- ✅ **ES-modul**: Modern import/export syntax

## Installation

1. Kopiera `signature/`-mappen till ditt projekt
2. Lägg till viewport-fit i HTML head
3. Inkludera CSS och JS i din app

### HTML Structure

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Din App</title>
  <link rel="stylesheet" href="/signature/signature.css">
</head>
<body>
  <!-- Din befintliga app -->
  
  <!-- Signature Modal -->
  <div id="signatureModal" class="sig-modal" style="display: none;">
    <div class="sig-modal__header">
      <h2>Signera dokument</h2>
      <div class="sig-orientation-notice">
        <p>Vänd telefonen till liggande läge för bästa signeringsupplevelse</p>
      </div>
    </div>
    
    <div class="sig-modal__body">
      <div class="sig-canvas-wrap">
        <canvas id="signatureCanvas"></canvas>
      </div>
    </div>
    
    <div class="sig-modal__footer">
      <button class="sig-btn sig-btn--clear" data-sig="clear">Rensa</button>
      <button class="sig-btn sig-btn--cancel" data-sig="cancel">Avbryt</button>
      <button class="sig-btn sig-btn--save" data-sig="save">Spara</button>
    </div>
  </div>

  <script type="module">
    import { initSignature } from '/signature/signature.js';

    document.addEventListener('DOMContentLoaded', () => {
      const modal = document.getElementById('signatureModal');
      let signatureAPI = null;

      // Funktion för att öppna signeringsmodal
      window.openSignatureModal = () => {
        modal.style.display = 'block';
        
        signatureAPI = initSignature(modal, {
          hideHeaderInLandscape: true,
          onSave: (dataUrl) => {
            console.log('Signature saved:', dataUrl);
            // Här kan du ladda upp signatur till server
            closeSignatureModal();
          },
          onCancel: () => {
            closeSignatureModal();
          },
          onClear: () => {
            console.log('Signature cleared');
          },
          themeVars: {
            'sig-bg': '#ffffff',
            'sig-border': 'rgba(0,0,0,.12)'
          }
        });
      };

      // Funktion för att stänga signeringsmodal
      window.closeSignatureModal = () => {
        if (signatureAPI) {
          signatureAPI.destroy();
          signatureAPI = null;
        }
        modal.style.display = 'none';
      };

      // Cleanup vid siddestroying
      window.addEventListener('unload', () => {
        if (signatureAPI) {
          signatureAPI.destroy();
        }
      });
    });
  </script>
</body>
</html>
```

## API Reference

### `initSignature(containerEl, options)`

Initierar signaturfunktionalitet på ett givet DOM-element.

#### Parameters

- **`containerEl`** (HTMLElement): Container-element med `.sig-modal` klass
- **`options`** (Object): Konfigurationsobjekt

#### Options

```javascript
{
  hideHeaderInLandscape: true,        // Dölj header i landscape-läge
  onSave: (dataUrl) => {},           // Callback när användaren sparar
  onCancel: () => {},                // Callback när användaren avbryter  
  onClear: () => {},                 // Callback när användaren rensar
  themeVars: {                       // CSS-variabler för temaanpassning
    'sig-bg': '#ffffff',
    'sig-border': 'rgba(0,0,0,.12)',
    'sig-header-bg': '#2c2c2c'
  }
}
```

#### Return Value

Returnerar ett API-objekt:

```javascript
{
  destroy(),           // Ta bort event listeners och cleanup
  redraw(),           // Omritning av layout (t.ex. vid orientering)
  clear(),            // Rensa signaturen
  getImageData(),     // Få signatur som base64 dataURL
  isEmpty()           // Kontrollera om signatur är tom
}
```

## CSS Klasser

Alla CSS-klasser är namespacade med `sig-` prefix:

- `.sig-modal` - Huvudcontainer
- `.sig-modal__header` - Header-sektion
- `.sig-modal__body` - Body med canvas
- `.sig-modal__footer` - Footer med knappar
- `.sig-canvas-wrap` - Canvas-wrapper
- `.sig-btn` - Knapp-grundklass
- `.sig-btn--save/cancel/clear` - Knapp-varianter

## Temaanpassning

Använd CSS-variabler för anpassning:

```css
.sig-modal {
  --sig-bg: #1a1a1a;
  --sig-border: rgba(255,255,255,.12);
  --sig-header-bg: #2c2c2c;
  --sig-header-text: #fff;
  --sig-btn-bg: #444;
  --sig-btn-text: #fff;
}
```

Eller via JavaScript:

```javascript
initSignature(container, {
  themeVars: {
    'sig-bg': '#1a1a1a',
    'sig-border': 'rgba(255,255,255,.12)'
  }
});
```

## Dark Mode

Lägg till `sig-modal--dark` klass för automatisk dark theme:

```javascript
container.classList.add('sig-modal--dark');
```

## Responsiv Design

Modulen är helt responsiv och hanterar:

- **Mobil portrait**: Standard layout med orientationshint
- **Mobil landscape**: Header dold, kompakt layout
- **Tablet**: Något större padding och knappar
- **Desktop**: Centrerat med fast storlek och skuggor

## iOS-specifika Fixar

- `100dvh/svh` för korrekt viewport-höjd
- `env(safe-area-inset-bottom)` för safe area
- `visualViewport.resize` för keyboard-hantering
- `-webkit-fill-available` fallback för äldre iOS

## Browser Support

- iOS Safari 12+
- Chrome/Edge/Firefox (senaste 2 versioner)
- Android Chrome 80+

## Exempel Integration

Se `index.html` i huvudapp för komplett exempel på integration i befintlig app.

## Utveckling

För att utveckla modulen:

1. Redigera `signature.js` för funktionalitet
2. Redigera `signature.css` för styling
3. Testa i olika browsers och enheter
4. Säkerställ att alla iOS-fixar fungerar

## Licens

MIT License - Kan användas fritt i kommersiella projekt.