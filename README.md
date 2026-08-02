# confettiFX

Plugin jQuery para generar confetti con iconos o imagenes, soporte de trayectoria configurable, giro, animacion por frames y limpieza del efecto.

## Archivos

- `js/jquery.confettiFX.js`
- `index.html` (demo rapida)

## Requisitos

- jQuery (probado con 3.6.0)
- Font Awesome si usas modo icono (`icon: "fa-*"`)

## Carga

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="assets/js/plugins/confettiFX/js/jquery.confettiFX.js"></script>
```

## API De Comandos

```js
$('body').confettiFX();                    // start con defaults
$('body').confettiFX('start', { confettiCount: 60 });
$('body').confettiFX('stop');
$('body').confettiFX('destroy');
```

## Uso Basico

```js
$('body').confettiFX('start', {
  confettiCount: 50,
  icon: 'fa-star',
  movement: 'random',
  spin: true
})
```

## Modo Burst / Explosion

```js
$('body').confettiFX('start', {
  mode: 'burst',
  originX: 50, // %
  originY: 50, // %
  confettiCount: 80
})
```

## Uso Con Imagenes

```js
$('body').confettiFX('start', {
  confettiCount: 12,
  imageUrls: [
    './assets/img/Ada-01.png',
    './assets/img/Ada-02.png',
    './assets/img/Ada-03.png'
  ],
  movement: 'direction-only',
  direction: 'bottom-to-top',
  minimumSize: 50,
  spin: false
});
```

## Presets Y Duracion

```js
$('body').confettiFX('start', {
  preset: 'party', // party | snow | fireworks
  duration: 5000   // auto-stop en ms
})
```

## Opciones Principales

- `confettiCount` numero de piezas.
- `colors` colores para modo icono.
- `icon` icono Font Awesome en modo icono.
- `imageUrls` array de imagenes para modo imagen.
- `minimumSize` y `maximumSize` rango de tamano.
- `fixedSize` tamano fijo.
- `movement` `random`, `vertical`, `horizontal`, `direction-only`.
- `direction` `top-to-bottom`, `bottom-to-top`, `left-to-right`, `right-to-left`, y diagonales.
- `mode` `stream` o `burst`.
- `originX` y `originY` origen en porcentaje para `burst`.
- `spin` y `spinSpeed` giro interno de la pieza.
- `minRotation`, `maxRotation`, `startRotation`, `endRotation` control de rotacion de trayectoria.
- `fadeStart` y `fadeDuration` control de desvanecido.
- `animateFrames`, `frameInterval`, `randomFrameStart` animacion por frames de imagen.
- `blink`, `blinkInterval`, `blinkProbability`, `blinkCooldownTicks` efecto twinkle.
- `preset` configuraciones listas: `party`, `snow`, `fireworks`.
- `duration` auto-limpieza en milisegundos.

## Notas

- En imagenes estaticas, el plugin ya evita repetir inmediatamente la imagen previa por pieza cuando hay alternativas.
- En cada iteracion se recalcula trayectoria para evitar que todas las vueltas salgan exactamente del mismo punto.
- La animacion principal usa `transform: translate3d(...)` para mejor rendimiento.

## Changelog

- See [CHANGELOG.md](./CHANGELOG.md) for version history.
