# DS Confetti JS

Plugin jQuery de **Digitaly Studio** para crear efectos de confeti configurables con iconos o imágenes. Incluye trayectorias, giros, animación por fotogramas, explosiones, presets y limpieza automática.

## Instalación

Desde GitHub:

```bash
npm install github:ASEDARK/ds-confetti-js
```

También puedes clonar el repositorio:

```bash
git clone https://github.com/ASEDARK/ds-confetti-js.git
```

## Requisitos

- jQuery 3.0.0 o superior.
- Font Awesome únicamente si utilizas iconos como `fa-star`.

## Carga en el navegador

Carga jQuery antes del plugin:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="node_modules/ds-confetti-js/js/jquery.ds-confetti.js"></script>
```

Si copias el archivo distribuido a tus recursos públicos, ajusta la segunda ruta según tu proyecto.

## API principal

```js
$('body').dsConfetti();
$('body').dsConfetti('start', { confettiCount: 60 });
$('body').dsConfetti('stop');
$('body').dsConfetti('destroy');
```

También puedes pasar las opciones directamente:

```js
$('body').dsConfetti({
  confettiCount: 50,
  icon: 'fa-star',
  movement: 'random',
  spin: true
});
```

## Explosión

```js
$('body').dsConfetti('start', {
  mode: 'burst',
  originX: 50,
  originY: 50,
  confettiCount: 80
});
```

## Uso con imágenes

Las imágenes pertenecen al proyecto consumidor; DS Confetti JS solamente recibe sus rutas.

```js
$('body').dsConfetti('start', {
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

## Presets y duración

```js
$('body').dsConfetti('start', {
  preset: 'party', // party | snow | fireworks
  duration: 5000
});
```

## Opciones principales

- `confettiCount`: número de piezas.
- `colors`: colores utilizados en el modo icono.
- `icon`: clase de Font Awesome.
- `imageUrls`: arreglo de imágenes para el modo imagen.
- `minimumSize`, `maximumSize` y `fixedSize`: control del tamaño.
- `movement`: `random`, `vertical`, `horizontal` o `direction-only`.
- `direction`: dirección vertical, horizontal o diagonal.
- `mode`: `stream` o `burst`.
- `originX` y `originY`: origen porcentual de una explosión.
- `spin` y `spinSpeed`: giro de cada pieza.
- `minRotation`, `maxRotation`, `startRotation` y `endRotation`: rotación de la trayectoria.
- `fadeStart` y `fadeDuration`: desvanecimiento.
- `animateFrames`, `frameInterval` y `randomFrameStart`: animación por fotogramas.
- `blink`, `blinkInterval`, `blinkProbability` y `blinkCooldownTicks`: efecto de destello.
- `preset`: configuración `party`, `snow` o `fireworks`.
- `duration`: limpieza automática en milisegundos.

## Demo

Abre `index.html` desde un servidor web para ejecutar la demostración incluida.

## Licencia

[MIT](./LICENSE) © Digitaly Studio.

Consulta [CHANGELOG.md](./CHANGELOG.md) para conocer el historial de versiones.
