# DS Confetti JS

Plugin jQuery independiente de **Digitaly Studio** para crear efectos de confeti con iconos o imágenes. Incluye trayectorias configurables, giro, animación por fotogramas, explosiones, presets y limpieza automática.

La versión actual es `2.0.0`. Desde esta versión solamente se mantienen las APIs con prefijo `ds`; las APIs heredadas de `confettiFX` ya no forman parte del plugin.

## Requisitos

- jQuery 3.0.0 o superior.
- Font Awesome únicamente cuando se utilizan iconos, por ejemplo `icon: 'fa-star'`.

## Carga desde CDN

Carga jQuery antes del plugin. Para producción se recomienda fijar una revisión concreta, de modo que una actualización futura del repositorio no cambie un sitio existente sin control:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ASEDARK/ds-confetti-js@efce315d6720873373fa8c125540343b08d2e1ed/js/jquery.ds-confetti.js"></script>
```

## Instalación desde GitHub

```bash
npm install github:ASEDARK/ds-confetti-js#efce315d6720873373fa8c125540343b08d2e1ed
```

El archivo distribuido queda disponible en:

```html
<script src="node_modules/ds-confetti-js/js/jquery.ds-confetti.js"></script>
```

También puedes clonar el repositorio para desarrollar o probar el plugin:

```bash
git clone https://github.com/ASEDARK/ds-confetti-js.git
```

## API

### Iniciar reemplazando el efecto anterior

`dsConfetti()` limpia primero los efectos existentes en el elemento y después crea el nuevo:

```js
$('body').dsConfetti();
$('body').dsConfetti('start', { confettiCount: 60 });

// Las opciones también se pueden pasar directamente.
$('body').dsConfetti({
  confettiCount: 50,
  icon: 'fa-star',
  movement: 'random',
  spin: true
});
```

### Agregar otro efecto simultáneo

`dsGenerateConfetti()` crea un efecto sin limpiar los contenedores anteriores. Es útil para combinar, por ejemplo, estrellas y corazones:

```js
$('body').dsGenerateConfetti({ icon: 'fa-star' });
$('body').dsGenerateConfetti({ icon: 'fa-heart' });
```

### Detener y limpiar

Estas llamadas eliminan el efecto registrado más recientemente sobre el elemento:

```js
$('body').dsConfetti('stop');
$('body').dsConfetti('destroy');
$('body').clearDSConfetti();
```

## Uso con imágenes

Las imágenes pertenecen al proyecto consumidor; el plugin solamente recibe sus URLs. Las rutas relativas se resuelven con respecto a la página que ejecuta el código.

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

## Explosiones, presets y duración

```js
$('body').dsConfetti('start', {
  mode: 'burst',
  originX: 50,
  originY: 50,
  confettiCount: 80,
  duration: 5000
});
```

Presets disponibles:

```js
$('body').dsConfetti('start', { preset: 'party' });
$('body').dsConfetti('start', { preset: 'snow' });
$('body').dsConfetti('start', { preset: 'fireworks' });
```

## Opciones principales

- `confettiCount`: número de piezas.
- `colors`: colores utilizados en el modo icono.
- `icon`: clase de Font Awesome.
- `imageUrls`: arreglo de imágenes para el modo imagen.
- `minimumSize`, `maximumSize` y `fixedSize`: control del tamaño.
- `movement`: `random`, `vertical`, `horizontal` o `direction-only`.
- `direction`: dirección vertical u horizontal.
- `mode`: `stream` o `burst`.
- `originX` y `originY`: origen porcentual de una explosión.
- `spin` y `spinSpeed`: giro de cada pieza.
- `minRotation`, `maxRotation`, `startRotation` y `endRotation`: rotación de la trayectoria.
- `fadeStart` y `fadeDuration`: desvanecimiento.
- `animateFrames`, `frameInterval` y `randomFrameStart`: animación por fotogramas.
- `blink`, `blinkInterval`, `blinkProbability` y `blinkCooldownTicks`: efecto de destello.
- `preset`: configuración `party`, `snow` o `fireworks`.
- `duration`: limpieza automática en milisegundos.

## Migración desde confettiFX

| API anterior | API oficial |
| --- | --- |
| `$('body').confettiFX('start', options)` | `$('body').dsConfetti('start', options)` |
| `$('body').generateConfetti(options)` | `$('body').dsGenerateConfetti(options)` |
| `$('body').clearConfettiFX()` | `$('body').clearDSConfetti()` |
| `$('body').clearConfetti()` | `$('body').clearDSConfetti()` |

Las APIs anteriores no existen en `2.0.0`; el proyecto consumidor debe migrarlas antes de actualizar el archivo del plugin.

> Nota: cuando se crean varios efectos con `dsGenerateConfetti()`, cada llamada agrega un contenedor, pero la limpieza del elemento conserva la referencia del efecto más reciente. Si se necesita retirar todos los efectos simultáneos, conviene recargar la vista o gestionar cada efecto en un elemento anfitrión distinto.

## Demo y licencia

Abre `index.html` desde un servidor web para ejecutar la demostración incluida.

[MIT](./LICENSE) © Digitaly Studio. Consulta [CHANGELOG.md](./CHANGELOG.md) para conocer el historial de versiones.
