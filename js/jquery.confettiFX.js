(function($) {

$.fn.generateConfetti = function (options) {
    /*
            Author:         Abelardo SÃ¡nchez EspaÃ±a
            Date:           2024/11/17
            Modification:   2025/11/08
            Description:    Generate Custom Confetti with optional spin animation, diagonal and vertical movement,
                            and now supports initial random rotation angle.

            Examples:
                    
                            $('body').generateConfetti({
                                confettiCount: 70,
                                colors: ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'],
                                circles: false,
                                icon: "fa-star"
                            });

                            
                            $('body').generateConfetti({
                                confettiCount: 70,
                                colors: ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'],
                                icon: "fa-star",
                                fixedSize: 18,
                                movement: "direction-only",
                                direction: "top-to-bottom",
                                spin: true,
                                spinSpeed: 'slow',
                                blink: true,
                                blinkInterval: 350,
                                blinkProbability: 0.3,
                                blinkCooldownTicks: 2
                            });

                            $('body').generateConfetti({
                                confettiCount: 50,
                                imageUrls: [
                                    'https://example.com/image1.png',
                                    'https://example.com/image2.png',
                                    'https://example.com/image3.png'
                                ],
                                fixedSize: 30,
                                movement: "direction-only",
                                direction: "top-to-bottom",
                                spin: true,
                                spinSpeed: "fast",
                                minRotation: 0,
                                maxRotation: 360
                            });

                            $('body').generateConfetti({
                                confettiCount: 10,
                                imageUrls: [
                                    './assets/img/Abeja-01.png'
                                    , './assets/img/Abeja-02.png'
                                    , './assets/img/Abeja-03.png'
                                ],
                                fixedSize: 30,
                                animateFrames: true,
                                frameInterval: 350,
                                randomFrameStart: true,
                                movement: "direction-only",
                                direction: "bottom-to-top",
                                spin: false,
                                minRotation: -10,
                                maxRotation: 10
                            });

                            

        */

        var presets = {
            party: {
                confettiCount: 80,
                spin: true,
                blink: true,
                movement: 'random'
            },
            snow: {
                confettiCount: 40,
                spin: false,
                direction: 'top-to-bottom',
                movement: 'direction-only'
            },
            fireworks: {
                confettiCount: 120,
                mode: 'burst',
                spin: true
            }
        };

        var defaults = {
            confettiCount: 40,             // Cantidad de confeti
            colors: [
                '#FFC300'
                , '#FF5733'
                , '#C70039'
                , '#900C3F'
                , '#581845'
            ],                              // Colores para Ã­conos
            icon: "fa-star",                // Solo para Ã­conos
            imageUrls: [],                  // Para imÃ¡genes
            minimumSize: 10,                // TamaÃ±o mÃ­nimo
            maximumSize: null,              // TamaÃ±o mÃ¡ximo (si es null, usa minimumSize+10)
            fixedSize: null,                // TamaÃ±o fijo
            spin: false,                    // Giros activados/desactivados
            spinSpeed: "medium",            // Velocidad del giro
            movement: "direction-only",     // Movimiento predeterminado: direction-only  (random, vertical, horizontal, direction-only)
            minRotation: 0,                 // RotaciÃ³n mÃ­nima inicial en grados (aleatoria)
            maxRotation: 0,                 // RotaciÃ³n mÃ¡xima inicial en grados (aleatoria)
            startRotation: null,            // grados (fuerza rotaciÃ³n inicial fija)
            endRotation: null,              // grados (rotaciÃ³n final de la trayectoria)
            rotationStart: 0,               // 0..1, cuÃ¡ndo comienza a interpolar hacia endRotation
            direction: "top-to-bottom",     // DirecciÃ³n: "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left"
            fadeStart: 0.10,                // 10% del tiempo opaco antes de desvanecer, 0..1 punto donde inicia el fade
            fadeDuration: 0.90,             // 0..1 cuÃ¡nto dura el fade desde fadeStart
            animateFrames: false,           // true = usa imageUrls como frames
            frameInterval: 500,             // ms entre cambios de frame
            randomFrameStart: true,         // cada pieza empieza en un frame aleatorio
            blink: false,                   // Efecto de parpadeo
            blinkInterval: 500,             // ms entre parpadeos
            blinkProbability: 0.25,         // prob. de que UNA pieza cambie en este ciclo
            blinkCooldownTicks: 2,          // ticks mÃ­nimos antes de que esa pieza pueda volver a cambiar
            mode: "stream",                 // stream | burst
            originX: 50,                    // origen en X (%) para burst
            originY: 50,                    // origen en Y (%) para burst
            duration: null,                 // ms para auto-stop
            preset: null                    // party | snow | fireworks
        };

        var requestedPreset = options && options.preset ? String(options.preset) : null;
        var presetOptions = (requestedPreset && presets[requestedPreset]) ? presets[requestedPreset] : {};

        // Opciones predeterminadas + preset + opciones del usuario
        var settings = $.extend({}, defaults, presetOptions, options);

        // Normaliza rangos de tamaÃ±o
        var min = Number(settings.minimumSize) || 0;
        var max = (settings.maximumSize != null) ? Number(settings.maximumSize) : (min + 10);
        if (max < min) { var tmp = min; min = max; max = tmp; } // por si vienen invertidos




        // Alias por si pasas "animated: true"
        if (options && Object.prototype.hasOwnProperty.call(options, 'animated')) {
            settings.animateFrames = !!options.animated;
        }

        // Pre-cargar imÃ¡genes si es animaciÃ³n por cuadros
        if (settings.animateFrames && settings.imageUrls.length > 1) {
            settings.imageUrls.forEach(function (src) {
                var img = new Image();
                img.src = src;
            });
        }

        // Normalizar movimiento segÃºn settings.movement
        switch (settings.movement) {
            case "random":
                settings.direction = [
                    "top-to-bottom",
                    "bottom-to-top",
                    "left-to-right",
                    "right-to-left"
                ][Math.floor(Math.random() * 4)];
                break;

            case "vertical":
                settings.direction = [
                    "top-to-bottom",
                    "bottom-to-top"
                ][Math.floor(Math.random() * 2)];
                break;

            case "horizontal":
                settings.direction = [
                    "left-to-right",
                    "right-to-left"
                ][Math.floor(Math.random() * 2)];
                break;

            case "direction-only":
            default:
                // NO tocar settings.direction
                break;
        }

        var uniqueId = "confettiContainer-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

        var $confettiContainer = $('<div>', {
            class: 'confetti-container',
            id: uniqueId
        }).appendTo(this);

        // Asegura que el contenedor no bloquee clics ni desborde
        if (!$confettiContainer.data('styled')) {
            $confettiContainer.css({
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 1
            });

            // Si el padre es estÃ¡tico, dale contexto de posicionamiento
            if ($(this).css('position') === 'static') {
                $(this).css('position', 'relative');
            }

            $confettiContainer.data('styled', true);
        }

        // Crear estilos dinÃ¡micos si no existen
        if (!$("head").find("#confettiStyle").length) {
            $('<style>', { id: 'confettiStyle', type: 'text/css' })
                .html(`
                    @keyframes spin-left {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }

                    @keyframes spin-right {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .confetti-container,
                    .confetti-container .confetti,
                    .confetti-container .confetti-inner {
                        pointer-events: none !important;
                    }
                `)
                .appendTo('head');
        }

        // Mapeo de velocidades de giro
        var spinDurations = {
            slow: "10s",
            medium: "5s",
            fast: "2s"
        };

        function randomPathByDirection(direction) {
            var jitter = function () { return (Math.random() * 40 - 20); };
            var rect = $confettiContainer[0] ? $confettiContainer[0].getBoundingClientRect() : null;
            var width = (rect && rect.width) ? rect.width : window.innerWidth;
            var height = (rect && rect.height) ? rect.height : window.innerHeight;

            if (settings.mode === "burst") {
                var ox = (Math.max(0, Math.min(100, Number(settings.originX))) / 100) * width;
                var oy = (Math.max(0, Math.min(100, Number(settings.originY))) / 100) * height;
                var angle = Math.random() * Math.PI * 2;
                var distance = 220 + Math.random() * 260;

                return {
                    sx: ox + 'px',
                    sy: oy + 'px',
                    ex: (ox + Math.cos(angle) * distance) + 'px',
                    ey: (oy + Math.sin(angle) * distance) + 'px'
                };
            }

            switch (direction) {
                case "bottom-to-top":
                    return {
                        sx: (Math.random() * width) + 'px',
                        sy: (height + 50) + 'px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: '-50px'
                    };
                case "top-to-bottom":
                    return {
                        sx: (Math.random() * width) + 'px',
                        sy: '-50px',
                        ex: (Math.random() * width) + 'px',
                        ey: (height + 50) + 'px'
                    };
                case "left-to-right":
                    return {
                        sx: '-50px',
                        sy: (Math.random() * height) + 'px',
                        ex: (width + 50) + 'px',
                        ey: (Math.random() * height) + 'px'
                    };
                case "right-to-left":
                    return {
                        sx: (width + 50) + 'px',
                        sy: (Math.random() * height) + 'px',
                        ex: '-50px',
                        ey: (Math.random() * height) + 'px'
                    };
                case "left-to-top":
                    return {
                        sx: '-50px',
                        sy: (Math.random() * height) + 'px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: '-50px'
                    };
                case "right-to-top":
                    return {
                        sx: (width + 50) + 'px',
                        sy: (Math.random() * height) + 'px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: '-50px'
                    };
                case "left-to-bottom":
                    return {
                        sx: '-50px',
                        sy: (Math.random() * height) + 'px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: (height + 50) + 'px'
                    };
                case "right-to-bottom":
                    return {
                        sx: (width + 50) + 'px',
                        sy: (Math.random() * height) + 'px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: (height + 50) + 'px'
                    };
                default:
                    return {
                        sx: (Math.random() * width) + 'px',
                        sy: '-50px',
                        ex: ((Math.random() * width) + jitter()) + 'px',
                        ey: (height + 50) + 'px'
                    };
            }
        }

        function setPathAndRotationVars($piece, path, initialRotation, finalRotation) {
            if (!$piece || !$piece.length) return;
            var node = $piece[0];
            if (!node) return;
            node.style.setProperty('--sx', path.sx);
            node.style.setProperty('--sy', path.sy);
            node.style.setProperty('--ex', path.ex);
            node.style.setProperty('--ey', path.ey);
            node.style.setProperty('--start-rot', initialRotation + 'deg');
            node.style.setProperty('--end-rot', finalRotation + 'deg');
        }

        function applyDistinctStaticImage($inner, $container) {
            if (!$inner || !$inner.length || !settings.imageUrls.length) return;

            var used = {};
            var previousIndex = $inner.data('imageIndex');
            $container.find('.confetti-image').not($inner).each(function () {
                var idx = $(this).data('imageIndex');
                if (typeof idx === 'number' && idx >= 0) {
                    used[idx] = true;
                }
            });

            var pool = [];
            for (var iPool = 0; iPool < settings.imageUrls.length; iPool++) {
                if (!used[iPool] && iPool !== previousIndex) pool.push(iPool);
            }
            if (!pool.length) {
                for (var iAll = 0; iAll < settings.imageUrls.length; iAll++) {
                    if (iAll !== previousIndex) {
                        pool.push(iAll);
                    }
                }
            }
            if (!pool.length) {
                for (var iAny = 0; iAny < settings.imageUrls.length; iAny++) {
                    pool.push(iAny);
                }
            }

            var nextIndex = pool[Math.floor(Math.random() * pool.length)];
            $inner
                .data('imageIndex', nextIndex)
                .css('background-image', 'url(' + settings.imageUrls[nextIndex] + ')');
        }

        var keyframesCssBuf = [];

        // Generar confeti
        for (var i = 0; i < settings.confettiCount; i++) {
            var confetti;           // OUTER (trayectoria/rotaciÃ³n startâ†’end)
            var inner;              // INNER (imagen/Ã­cono, spin, blink, frames)

            var size = (settings.fixedSize !== null)
            ? settings.fixedSize
            : (Math.random() * (max - min) + min);


            var startPos, endPos, animationName;
            var animPrefix = 'fall';

            // Determinar la posiciÃ³n inicial y final segÃºn la direcciÃ³n
            const jitter = () => (Math.random() * 40 - 20);

            switch (settings.direction) {

                case "bottom-to-top":
                    startPos = `top: 100%; left: ${Math.random() * 100}%;`;
                    endPos = `top: -50px; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-bottom-to-top-${uniqueId}-${i}`;
                    break;

                case "top-to-bottom":
                    startPos = `top: -50px; left: ${Math.random() * 100}%;`;
                    endPos   = `top: 100%; left: ${Math.random() * 100}%;`;
                    animationName = `${animPrefix}-top-to-bottom-${uniqueId}-${i}`;
                    break;

                case "left-to-right":
                    startPos = `top: ${Math.random() * 100}%; left: -50px;`;
                    endPos   = `top: ${Math.random() * 100}%; left: 100%;`;
                    animationName = `${animPrefix}-left-to-right-${uniqueId}-${i}`;
                    break;

                case "right-to-left":
                    startPos = `top: ${Math.random() * 100}%; left: 100%;`;
                    endPos   = `top: ${Math.random() * 100}%; left: -50px;`;
                    animationName = `${animPrefix}-right-to-left-${uniqueId}-${i}`;
                    break;

                /* DIAGONALES */

                // â†– left â†’ top
                case "left-to-top":
                    startPos = `top: ${Math.random() * 100}%; left: -50px;`;
                    endPos = `top: -50px; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-left-to-top-${uniqueId}-${i}`;
                    break;

                // â†— right â†’ top
                case "right-to-top":
                    startPos = `top: ${Math.random() * 100}%; left: 100%;`;
                    endPos = `top: -50px; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-right-to-top-${uniqueId}-${i}`;
                    break;

                // â†™ left â†’ bottom
                case "left-to-bottom":
                    startPos = `top: ${Math.random() * 100}%; left: -50px;`;
                    endPos = `top: 100%; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-left-to-bottom-${uniqueId}-${i}`;
                    break;

                // â†˜ right â†’ bottom
                case "right-to-bottom":
                    startPos = `top: ${Math.random() * 100}%; left: 100%;`;
                    endPos = `top: 100%; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-right-to-bottom-${uniqueId}-${i}`;
                    break;

                /* fallback */
                default:
                    startPos = `top: -50px; left: ${Math.random() * 100}%;`;
                    endPos = `top: 100%; left: calc(${Math.random()*100}% + ${jitter()}px);`;
                    animationName = `${animPrefix}-top-to-bottom-${uniqueId}-${i}`;
                    break;
            }


            var animationDuration = 5 + Math.random() * 5;
            var animationDelay = Math.random() * 3; // Retraso inicial aleatorio hasta 3 segundos
            var fadeStartPct = Math.min(99.9, Math.max(0, (settings.fadeStart || 0) * 100));
            var fadeDurPct   = Math.max(0.1, (settings.fadeDuration || 0.1) * 100);
            var fadeEndPct   = Math.min(99.9, fadeStartPct + fadeDurPct);

            settings.fadeStart = Math.max(0, Math.min(1, settings.fadeStart));
            settings.fadeDuration = Math.max(0, Math.min(1 - settings.fadeStart, settings.fadeDuration));



            // --- Rotaciones de trayectoria: calcular antes de usarlas en keyframes ---
            var initialRotation;
            if (settings.startRotation !== null) {
                initialRotation = settings.startRotation;
            } else {
                initialRotation = Math.random() * (settings.maxRotation - settings.minRotation) + settings.minRotation;
            }
            var finalRotation = (settings.endRotation !== null)
                ? settings.endRotation
                : initialRotation;

            var rotStartPct = Math.min(100, Math.max(0, Math.round((settings.rotationStart || 0) * 100)));

            // Keyframes (OUTER controla transform)
            keyframesCssBuf.push(`
            @keyframes ${animationName} {
            0%   { opacity: 0; transform: translate3d(var(--sx), var(--sy), 0) rotate(var(--start-rot)); }
            10%  { opacity: 1; transform: translate3d(var(--sx), var(--sy), 0) rotate(var(--start-rot)); }
            ${rotStartPct}% { transform: translate3d(var(--sx), var(--sy), 0) rotate(var(--start-rot)); }
            ${fadeStartPct}% { opacity: 1; }
            ${fadeEndPct}%   { opacity: 0; }
            100% { opacity: 0; transform: translate3d(var(--ex), var(--ey), 0) rotate(var(--end-rot)); }
            }
            `);


            // ConstrucciÃ³n de elementos
            if (settings.imageUrls.length > 0) {
                // OUTER
                confetti = $('<div>', { class: 'confetti' });
                // INNER visual
                inner = $('<span>', { class: 'confetti-inner' }).appendTo(confetti);

                if (settings.animateFrames && settings.imageUrls.length > 1) {
                    // Frames animados
                    var startIdx = settings.randomFrameStart
                        ? Math.floor(Math.random() * settings.imageUrls.length)
                        : 0;

                    inner
                        .data('frames', settings.imageUrls.slice())
                        .data('frameIndex', startIdx)
                        .css({
                            'background-image': `url(${settings.imageUrls[startIdx]})`,
                            'background-size': 'contain',
                            'background-repeat': 'no-repeat',
                            'background-position': 'center',
                            'width': size + 'px',
                            'height': size + 'px',
                            'display': 'inline-block'
                        });
                } else {
                    // Imagen estÃ¡tica
                    inner.addClass('confetti-image');

                    inner.css({
                        'background-size': 'contain',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'width': size + 'px',
                        'height': size + 'px',
                        'display': 'inline-block',
                        'image-rendering': 'auto',
                        '-webkit-backface-visibility': 'hidden',
                        '-webkit-transform': 'translateZ(0)'
                    });
                    applyDistinctStaticImage(inner, $confettiContainer);
                }

                // Efectos visuales (blink) sobre INNER
                if (settings.blink) {
                    inner.css({
                        'filter': 'brightness(var(--b,1)) saturate(var(--s,1))',
                        'transition': 'filter 0.25s ease-in-out'
                    });
                }


            } else {
                // Ãcono (fa-*)
                confetti = $('<div>', { class: 'confetti' });
                inner = $('<i>', { class: 'confetti-inner fas ' + settings.icon }).appendTo(confetti);

                var color = settings.colors[Math.floor(Math.random() * settings.colors.length)];

                inner.css({
                'font-size': size + 'px',
                'color': color,
                'display': 'inline-block'
                });
                if (settings.blink) {
                inner.css({
                    'filter': 'brightness(var(--b,1)) saturate(var(--s,1))',
                    'transition': 'filter 0.25s ease-in-out'
                });
                } else {
                inner.css('filter', 'none');
                }

            }

            // OUTER: trayectoria + rotaciÃ³n startâ†’end
            confetti.css({
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                'will-change': 'transform, opacity, filter',
                'backface-visibility': 'hidden',
                animation: `${animationName} ${animationDuration}s linear ${animationDelay}s infinite`
            });
            setPathAndRotationVars(confetti, randomPathByDirection(settings.direction), initialRotation, finalRotation);

            // INNER: spin (si aplica)
            if (settings.spin) {
                var spinAnimationName = (Math.random() < 0.5 ? 'spin-left' : 'spin-right');
                var spinDuration = (settings.spinSpeed && spinDurations[settings.spinSpeed]) || spinDurations.medium;
                inner.css({
                    animation: `${spinAnimationName} ${spinDuration} linear ${animationDelay}s infinite`
                });
            }

            // Montar pieza
            $confettiContainer.append(confetti);

            // En cada iteraciÃ³n: nueva trayectoria y nueva imagen estÃ¡tica (sin repetir si hay opciones)
            confetti.on('animationiteration', function () {
                var $piece = $(this);
                var nextInitialRotation = (settings.startRotation !== null)
                    ? settings.startRotation
                    : (Math.random() * (settings.maxRotation - settings.minRotation) + settings.minRotation);
                var nextFinalRotation = (settings.endRotation !== null)
                    ? settings.endRotation
                    : nextInitialRotation;

                setPathAndRotationVars($piece, randomPathByDirection(settings.direction), nextInitialRotation, nextFinalRotation);

                if (settings.imageUrls.length > 0 && !(settings.animateFrames && settings.imageUrls.length > 1)) {
                    applyDistinctStaticImage($piece.find('.confetti-image').first(), $confettiContainer);
                }
            });

            // Estado inicial aleatorio de blink (sobre INNER)
            if (settings.blink) {
            var startOn = Math.random() < 0.5;
            inner.data('blinkOn', startOn).data('blinkCooldown', 0);
            inner[0].style.setProperty('--b', startOn ? '1.4' : '1');
            inner[0].style.setProperty('--s', startOn ? '1.7' : '1');
            } else {
            inner.data('blinkOn', false).data('blinkCooldown', 0);
            inner[0].style.setProperty('--b', '1');
            inner[0].style.setProperty('--s', '1');
            }

        }

        // Agregar 1 sola vez el Style con todos los keyframes del batch
        if (keyframesCssBuf.length) {
            $('<style>', { 'data-confetti-style-batch': uniqueId })
                .html(keyframesCssBuf.join('\n'))
                .appendTo('head');
        }

        // ðŸ” AnimaciÃ³n por cuadros (1 solo ticker por contenedor) â€” ahora sobre .confetti-inner
        if (settings.animateFrames && settings.imageUrls.length > 1) {
            if (!$confettiContainer.data('frameTicker')) {
                var intervalMs = Math.max(16, parseInt(settings.frameInterval, 10) || 500); // mÃ­nimo ~60fps

                var ticker = setInterval(function () {
                    $confettiContainer.find('.confetti-inner').each(function () {
                        var $el = $(this);
                        var frames = $el.data('frames');
                        if (!Array.isArray(frames) || frames.length < 2) return;

                        var idx = ($el.data('frameIndex') || 0) + 1;
                        if (idx >= frames.length) idx = 0;

                        $el
                            .css('background-image', 'url(' + frames[idx] + ')')
                            .data('frameIndex', idx);
                    });
                }, intervalMs);

                $confettiContainer.data('frameTicker', ticker);
            }
        }

        // âœ¨ Blink/Twinkle (glow pastel desincronizado por pieza) â€” ahora sobre .confetti-inner
        if (settings.blink) {
            if (!$confettiContainer.data('blinkTicker')) {
                var blinkMs = Math.max(16, parseInt(settings.blinkInterval, 10) || 500);

                var bticker = setInterval(function () {
                    $confettiContainer.find('.confetti-inner').each(function () {
                        var $el = $(this);

                        // Cooldown
                        var cd = ($el.data('blinkCooldown') || 0);
                        if (cd > 0) {
                            $el.data('blinkCooldown', cd - 1);
                            return;
                        }

                        // Con cierta probabilidad, esta pieza cambia su estado
                        if (Math.random() < (settings.blinkProbability || 0.25)) {
                            var on = !$el.data('blinkOn');
                            $el.data('blinkOn', on);

                            // Glow bonito (brillo+saturaciÃ³n)
                            var nextB = on ? '1.6' : '1';
                            var nextS = on ? '1.9' : '1';
                            this.style.setProperty('--b', nextB);
                            this.style.setProperty('--s', nextS);

                            // Cooldown aleatorio para naturalidad
                            var maxCd = Math.max(1, parseInt(settings.blinkCooldownTicks, 10) || 2);
                            $el.data('blinkCooldown', 1 + Math.floor(Math.random() * maxCd));
                        }
                    });
                }, blinkMs);

                $confettiContainer.data('blinkTicker', bticker);
            }
        }

        $confettiContainer.show();
        var $host = this; // el jQuery host (e.g., $('body'))

        var autoStopTimer = null;
        if (settings.duration != null) {
            var durationMs = parseInt(settings.duration, 10);
            if (!isNaN(durationMs) && durationMs > 0) {
                autoStopTimer = setTimeout(function () {
                    var cleanupFn = $host.data('confettiCleanup');
                    if (typeof cleanupFn === 'function') {
                        cleanupFn();
                    }
                }, durationMs);
            }
        }

        // Guarda referencias para teardown
        $confettiContainer.data('confettiMeta', {
            uniqueId: uniqueId,
            frameTicker: $confettiContainer.data('frameTicker') || null,
            blinkTicker: $confettiContainer.data('blinkTicker') || null,
            autoStopTimer: autoStopTimer
        });

        // MÃ©todo de limpieza en el elemento jQuery donde llamaste el plugin
        $host.data('confettiCleanup', function () {
            var meta = $confettiContainer.data('confettiMeta') || {};

            if (meta.frameTicker) {
                clearInterval(meta.frameTicker);
            }
            if (meta.blinkTicker) {
                clearInterval(meta.blinkTicker);
            }
            if (meta.autoStopTimer) {
                clearTimeout(meta.autoStopTimer);
            }

            // Remueve estilos batch de este contenedor
            $('style[data-confetti-style-batch="'+ meta.uniqueId +'"]').remove();

            // Remueve el contenedor
            $confettiContainer.remove();
        });

        return this;
    };


    $.fn.clearConfettiFX = function () {
        return this.each(function () {
            var $el = $(this);
            var fn = $el.data('confettiCleanup');
            if (typeof fn === 'function') fn();
            $el.removeData('confettiCleanup');
        });
    };

    $.fn.clearConfetti = function () {
        return this.clearConfettiFX();
    };

    $.fn.confettiFX = function (command, options) {
        var cmd = command;
        var opts = options;

        if (typeof cmd === 'undefined') {
            cmd = 'start';
            opts = {};
        } else if ($.isPlainObject(cmd)) {
            opts = cmd;
            cmd = 'start';
        }

        if (typeof cmd !== 'string') {
            cmd = 'start';
        }

        cmd = cmd.toLowerCase();

        if (cmd === 'start') {
            return this.each(function () {
                var $el = $(this);
                $el.clearConfettiFX();
                $el.generateConfetti(opts || {});
            });
        }

        if (cmd === 'stop' || cmd === 'destroy') {
            return this.clearConfettiFX();
        }

        return this.each(function () {
            var $el = $(this);
            $el.clearConfettiFX();
            $el.generateConfetti(opts || {});
        });
    };

})(jQuery);
