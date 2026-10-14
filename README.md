# Tandil Tech Week 2026

**Hack. Build. Connect.** Una experiencia web de **Shitty Brainstorming** para presentar Tandil Tech Week, explorar sus jornadas y aprender jugando con desafíos de ciberseguridad.

El proyecto es una aplicación frontend desarrollada con Angular. Combina una estética hacker en tonos oscuros y verde lima, una dona interactiva con geometría 3D, animaciones, agenda por pestañas, descarga de calendario y un cyber lab que funciona en el navegador.

Es un concepto web independiente sobre el encuentro del **14 y 15 de octubre de 2026 en Tandil, Argentina**. Las inscripciones, los horarios detallados y las novedades se consultan mediante los enlaces al sitio oficial.

## Contenido

- [Inicio rápido](#inicio-rápido)
- [Tecnologías](#tecnologías)
- [Desarrollo con IA](#desarrollo-con-ia)
- [Funcionalidades](#funcionalidades)
- [Cyber lab y terminal](#cyber-lab-y-terminal)
- [Diseño, accesibilidad y rendimiento](#diseño-accesibilidad-y-rendimiento)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Personalización](#personalización)
- [Comandos y compilación](#comandos-y-compilación)
- [Pruebas](#pruebas)
- [Guía para una demostración](#guía-para-una-demostración)
- [Estado de los datos y alcance](#estado-de-los-datos-y-alcance)
- [Equipo](#equipo)

## Inicio rápido

### Requisitos

- **Node.js compatible con Angular 22.2**. Los paquetes instalados declaran `^22.22.3 || ^24.15.0 || >=26.0.0`: dentro de la rama 22, usar 22.22.3 o posterior; dentro de la rama 24, usar 24.15.0 o posterior.
- **npm**. El proyecto declara `npm@11.5.2` como gestor de paquetes.
- Un navegador moderno con soporte para Canvas 2D, Pointer Events y ResizeObserver.
- Git, si se va a clonar el repositorio.

### Clonar e instalar

```bash
git clone https://github.com/manuela-ibanez/Tandil-Tech-Week-2026.git
cd Tandil-Tech-Week-2026
npm ci
npm start
```

Abrir **http://localhost:4200/** cuando termine la compilación. El servidor actualiza la página al guardar cambios. Mantener la terminal abierta y usar **Ctrl + C** para detenerlo.

`npm ci` instala las dependencias respetando `package-lock.json`. No hace falta instalar Angular CLI globalmente: los scripts utilizan la versión local.

### Si el proyecto ya está en tu computadora

Desde la carpeta de trabajo que contiene `tandil-tech-week/`:

```bash
cd tandil-tech-week
npm ci
npm start
```

Todos los comandos de este README se ejecutan en la carpeta que contiene **`package.json` y `angular.json`**. En el repositorio clonado, esos archivos están en su raíz.

### Windows y PowerShell

Si PowerShell bloquea la ejecución de `npm.ps1`, usar `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd start
```

La misma alternativa sirve para el resto de los comandos, por ejemplo `npm.cmd run build -- --configuration development`.

Si el puerto 4200 está ocupado, se puede elegir otro:

```bash
npm start -- --port 4300
```

En ese caso, abrir **http://localhost:4300/**.

## Tecnologías

| Tecnología | Versión del proyecto | Uso |
| --- | --- | --- |
| Angular y Angular CLI | 22.2.x | Componentes standalone, plantillas, navegación e interacciones |
| TypeScript | 6.0.x | Tipado y lógica de la aplicación |
| Angular Signals y `computed` | Incluidos en Angular | Estado de pestañas, misiones, puntaje, animaciones y fechas |
| GSAP | 3.15.x | Animaciones de entrada del inicio |
| Lenis | 1.3.x | Desplazamiento suave y navegación hacia secciones |
| SCSS | Compilado por Angular | Estilos, variables, animaciones y diseño responsive |
| Canvas 2D y SVG | APIs y formatos del navegador | Dona, iconos, favicon e imagen de respaldo |
| `node:test` | Incluido en Node.js | Pruebas de las misiones, puntajes y fechas |

Las dependencias declaradas están en [package.json](package.json). Las versiones resueltas se registran en [package-lock.json](package-lock.json).

## Desarrollo con IA

Para el desarrollo del proyecto, el equipo utilizó **Nemotron** como inteligencia artificial y **OpenCode** como agente de programación.

| Herramienta | Rol |
| --- | --- |
| Nemotron | IA utilizada durante el desarrollo |
| OpenCode | Agente de programación utilizado por el equipo |

Estas herramientas forman parte del proceso de desarrollo del proyecto.

## Funcionalidades

### 1. Inicio y navegación

La primera pantalla presenta el nombre del evento, su primera edición, las fechas y el concepto visual de la página.

- Marca **TTW_26** con acceso al inicio.
- Encabezado que permanece visible al desplazarse.
- Enlaces a **El encuentro**, **Las jornadas**, **Cyber lab** y **Comunidad**.
- Indicador de la sección activa según la posición del scroll.
- Menú desplegable en pantallas pequeñas, con botones para abrirlo y cerrarlo.
- Cierre del menú al seleccionar una sección o presionar **Escape**. Con Escape, el foco vuelve al botón del menú.
- Botón **Ver inscripciones**, que abre el sitio oficial en otra pestaña.
- Acceso **Encontrá tu jornada**, que lleva a la agenda.
- Acceso **Probá el cyber lab**, que lleva al laboratorio.
- Indicador **Scroll para conectar**, que lleva a la presentación del encuentro.
- Cursor parpadeante en el título y animación de entrada de los textos y la ilustración.

### 2. La dona interactiva

La dona del inicio está implementada en [signal-orbit.ts](src/app/signal-orbit.ts), mediante el componente `app-signal-orbit`. Modela una geometría tridimensional de toro y la proyecta sobre un canvas 2D para dibujar la malla verde, su profundidad, el halo y las partículas luminosas.

| Interacción | Comportamiento |
| --- | --- |
| Movimiento automático | La dona gira y flota suavemente |
| Mover el cursor por el inicio | Cambia la inclinación y la posición de la dona |
| Clic y arrastre sobre la dona | Permite girarla manualmente con una respuesta suavizada |
| Arrastre horizontal en móvil | Permite girarla con el dedo |
| Gesto vertical en móvil | Permite seguir desplazando la página |
| Scroll de la página | Modifica la orientación, escala y posición del objeto |
| Cambiar el tamaño de la ventana | Ajusta las dimensiones del canvas |
| Pausar animaciones | Detiene el movimiento y la interacción del canvas |
| Activar movimiento reducido en el dispositivo | Muestra la dona sin animación |

La imagen [signal-orbit.svg](public/signal-orbit.svg) sirve como respaldo cuando no se puede obtener un contexto Canvas 2D.

Para reducir el trabajo del navegador, la animación se detiene cuando la dona sale de la pantalla o cuando la pestaña del navegador deja de estar visible. La resolución del canvas considera la densidad de píxeles, con un límite de factor 2.

### 3. Animaciones y control de movimiento

El botón **ANIMACIONES ON/OFF**, ubicado al pie del inicio, permite activar o pausar los efectos de la página.

- Entrada de textos e ilustración con GSAP.
- Desplazamiento suave con Lenis cuando los efectos están activos.
- Aparición progresiva de contenido al entrar en pantalla, mediante `IntersectionObserver` y el atributo `data-reveal`.
- Franja animada con **HACK. BUILD. CONNECT.** y el nombre del evento.
- Cursor parpadeante y símbolo giratorio en la visual de Startup Day.
- Transición de entrada al cambiar entre organizaciones y sponsors.
- Estados de hover y foco en botones, enlaces y campos.

Se respeta `prefers-reduced-motion`. Cuando el sistema solicita menos movimiento, se desactivan los efectos y el botón de animaciones queda deshabilitado con una explicación. El contenido permanece visible al pausar y los elementos que reciben foco se revelan para poder usarlos con teclado.

### 4. Presentación del encuentro

La sección **De las sierras. Al próximo.** explica el propósito del evento: conectar a quienes programan, emprenden, estudian e invierten.

Incluye una presentación del ecosistema, los perfiles **Developers**, **Founders**, **Estudiantes** e **Inversores**, y un enlace para elegir una jornada.

### 5. Agenda con dos pestañas

La sección **Dos días. Un montón de posibilidades.** muestra una jornada por vez:

| Jornada | Fecha incluida | Ubicación incluida | Temas |
| --- | --- | --- | --- |
| Hacking Day | Miércoles 14 de octubre de 2026 | Campus Universitario UNICEN | Ciberseguridad, desafíos técnicos, hacking en equipos y aprendizaje colaborativo |
| Startup Day | Jueves 15 de octubre de 2026 | Distrito Avellaneda, Tandil | Experiencias de founders, inversión, producto y networking |

Al cambiar de pestaña se actualizan el título, la descripción, los temas, la fecha, la ubicación y la visual de la jornada. Hacking Day utiliza la estética de una consola; Startup Day presenta un símbolo giratorio sobre fondo verde lima.

Cada jornada tiene un enlace a **Google Maps** y un botón **Ver inscripciones y agenda** que abre el sitio oficial. Los horarios detallados se consultan allí.

Las pestañas funcionan con clic, **flecha izquierda**, **flecha derecha**, **Home** y **End**.

### 6. Descarga del calendario `.ics`

El enlace **Agendar las fechas** descarga [tandil-tech-week-2026.ics](public/tandil-tech-week-2026.ics).

El archivo contiene **dos eventos de día completo**:

1. Hacking Day, el 14 de octubre, con su ubicación y descripción.
2. Startup Day, el 15 de octubre, con su ubicación y descripción.

También incluye el enlace al sitio oficial. Se puede abrir o importar en una aplicación de calendario compatible con `.ics`.

**La descarga agenda los días del encuentro; no contiene una grilla de horarios de charlas.** Tampoco crea eventos en una cuenta de calendario automáticamente: la importación se realiza desde la aplicación que elija el visitante.

En el formato del archivo, `DTEND` es exclusivo: el 15 como fecha de cierre de Hacking Day representa un evento que ocupa el día 14; el 16 como cierre de Startup Day representa el día 15.

### 7. Cyber lab educativo

La sección **Tu curiosidad. Tu primer exploit.** propone tres misiones con evidencias, pistas, respuestas y puntaje. Todo se resuelve en el navegador con datos ficticios.

La explicación de las misiones, los comandos y el progreso está en [Cyber lab y terminal](#cyber-lab-y-terminal).

### 8. Organizaciones y sponsors en una sola sección

**Distintas miradas. La misma energía.** utiliza dos pestañas dentro del mismo espacio:

- **Organizaciones:** muestra las seis organizaciones que participan en la organización del encuentro.
- **Sponsors:** muestra las ocho marcas que apoyan la edición.

La pestaña activa se resalta en verde y cada pestaña muestra la cantidad de participantes. Al seleccionar una, se presenta únicamente su grupo de tarjetas. Se puede cambiar con clic, toque, flechas, Home y End.

**Organizaciones:** Hack Tandil, Picante, Relaw, Paisanos, Geonosis y Fardo.

**Sponsors:** Geonosis, Rotonda, Fardo, Payoneer, The Red Guild, TDL 2050, Novum y Baken, identificado como café.

Geonosis y Fardo aparecen en ambos grupos porque tienen los dos roles. Las tarjetas de organizaciones incluyen los enlaces definidos en los datos del proyecto; las de sponsors muestran el nombre y el rol.

### 9. Preguntas frecuentes

La sección **Por si te lo preguntabas** contiene cinco respuestas desplegables:

- Para quién está pensado Tandil Tech Week.
- Participación en las dos jornadas.
- Ubicación de los encuentros.
- Conocimientos necesarios para jugar al cyber lab.
- Consulta de inscripciones y horarios.

Los desplegables usan `details` y `summary`, se manejan con mouse o teclado y pueden permanecer abiertos de forma independiente.

### 10. Formulario de preguntas de demostración

Debajo del título de preguntas frecuentes hay un formulario con:

| Campo | Validación |
| --- | --- |
| Nombre | Opcional, hasta 80 caracteres |
| Email | Opcional; si se completa, debe tener formato válido; hasta 254 caracteres |
| Tu pregunta | Obligatoria, hasta 1200 caracteres; no acepta únicamente espacios |

El botón **Enviar pregunta** valida los campos y simula el envío. Cuando la validación es correcta, limpia el formulario y muestra una confirmación que explica que la pregunta **no se envió ni se guardó**.

La tarjeta está identificada como **DEMO**. No realiza solicitudes de red para enviar los campos, no manda correos y no almacena las preguntas. Al empezar a escribir otra consulta se limpia la confirmación anterior.

### 11. Estado del evento y cuenta regresiva

La sección final **Lo que viene empieza con vos.** cambia según la fecha del dispositivo, tomando como límites las fechas de Argentina con offset `-03:00`:

| Estado | Período | Mensaje o contenido |
| --- | --- | --- |
| Próximo | Antes del 14 de octubre de 2026 a las 00:00 | Cuenta regresiva en días, horas y minutos |
| En curso | Desde el inicio del 14 hasta el final del 15 de octubre | **ESTAMOS EN SEMANA TECH** |
| Finalizado | Desde el 16 de octubre de 2026 a las 00:00 | **LAS CONEXIONES SIGUEN.** |

El reloj se actualiza cada 30 segundos. La sección también incluye un acceso al sitio oficial para consultar las inscripciones.

### 12. Footer y metadatos

- Marca con enlace para volver al inicio.
- Texto **TANDIL, ARGENTINA. HECHO PARA CONECTAR.**
- Enlace al sitio oficial.
- Año, aclaración de concepto web independiente y crédito **EQUIPO: Shitty Brainstorming**.
- Título, descripción, color de tema y metadatos Open Graph en [index.html](src/index.html).
- Idioma del documento `es-AR` y favicon SVG propio.

## Cyber lab y terminal

### Misiones

| N.º | Misión | Categoría | Aprendizaje | Puntos |
| --- | --- | --- | --- | --- |
| 01 | El enlace impostor | OSINT | Reconocer el dominio esperado y detectar enlaces de phishing | 100 |
| 02 | Señal desde las sierras | CRYPTO | Descifrar un mensaje con César y desplazamiento de tres letras | 150 |
| 03 | La llave justa | DEFENSA | Aplicar el principio de mínimo privilegio | 200 |

El total máximo es **450 puntos**.

### Cómo jugar

1. Seleccionar una misión desde la lista lateral.
2. Leer el contexto, la evidencia y la pregunta.
3. Elegir una opción o escribir la respuesta, según el desafío.
4. Presionar **Verificar** o elegir directamente una opción.
5. Pedir una pista si hace falta y volver a intentar.
6. Usar **Siguiente misión** para avanzar hacia una pendiente.

Las respuestas se comparan sin distinguir mayúsculas y minúsculas y se eliminan los espacios al principio y al final. Resolver de nuevo una misión no duplica sus puntos. Las pistas no descuentan puntaje.

El panel muestra los puntos acumulados, una barra de progreso y la cantidad de misiones resueltas. Las misiones completadas se marcan con un check y sus controles de respuesta quedan deshabilitados en la interfaz.

Al resolver las tres aparece **ACCESS GRANTED**, el nivel cambia de **EXPLORADOR** a **SIGNAL MASTER** y se habilita **Volver a jugar**. Reiniciar borra el puntaje, las misiones completadas, la respuesta, las pistas y el contenido de la terminal.

El progreso vive en memoria: recargar la página inicia una sesión nueva.

### Terminal interactiva

La terminal se presenta como `guest@ttw: ~/cyber-lab`. Es un intérprete local de los comandos del juego:

| Comando | Acción |
| --- | --- |
| `help` | Muestra los comandos disponibles |
| `misiones` | Lista las misiones e indica cuáles están resueltas |
| `abrir 1` | Abre El enlace impostor |
| `abrir 2` | Abre Señal desde las sierras |
| `abrir 3` | Abre La llave justa |
| `pista` | Muestra la pista de la misión actual |
| `verificar <respuesta>` | Comprueba una respuesta para la misión actual |
| `score` | Muestra el puntaje y la cantidad de misiones resueltas |
| `clear` | Limpia la salida de la terminal y conserva el progreso |

Se ejecutan con **Enter** o con el botón de la terminal. Los nombres de los comandos aceptan mayúsculas o minúsculas. Un comando desconocido muestra una indicación para consultar `help`; un número de misión inválido explica las opciones disponibles.

La terminal no ejecuta comandos del sistema ni se conecta con servidores. Los dominios `.example` y `.test` que aparecen en los retos forman parte de las evidencias ficticias.

<details>
<summary>Soluciones para preparar una exposición o verificar el recorrido</summary>

| Misión | Respuesta |
| --- | --- |
| El enlace impostor | Opción **B**: `https://tickets.techweek.example` |
| Señal desde las sierras | **TANDIL** |
| La llave justa | Opción **C**: solo lectura de la agenda |

Recorrido completo desde la terminal:

```text
abrir 1
verificar b
abrir 2
verificar TANDIL
abrir 3
verificar c
score
```

El resultado esperado es **450 / 450 puntos** y **3 / 3 misiones**.

</details>

## Diseño, accesibilidad y rendimiento

### Diseño visual y responsive

- Base oscura, superficies verde oscuro y acentos verde lima.
- Agenda sobre fondo claro para distinguir las jornadas del resto del recorrido.
- Títulos grandes, textos de interfaz y detalles monoespaciados de estética técnica.
- Retículas, marcas de esquina, cruces, etiquetas y una visual de malla para reforzar la identidad hacker.
- Tarjetas, pestañas y formulario con bordes y colores consistentes.
- Ajustes de distribución en los puntos de corte de 1050, 700 y 380 píxeles.
- En pantallas pequeñas, el inicio, la agenda, el lab y las preguntas se reorganizan en una columna; las tarjetas se adaptan a dos columnas.

La dirección visual toma como referencias las experiencias de [Lando Norris](https://landonorris.com/) y [Rancho Lab](https://rancholab.ar/), adaptadas al contenido y la identidad de este proyecto.

### Medidas de accesibilidad incluidas

- Enlace **Saltar al contenido** para evitar recorrer el encabezado con teclado.
- Foco visible en enlaces, botones, campos y controles nativos.
- Nombres accesibles, etiquetas de formulario y elementos decorativos ocultos a lectores de pantalla.
- `aria-expanded` y `aria-controls` en el menú.
- Pestañas con `tablist`, `tab`, `tabpanel`, estado de selección, relación entre controles y panel y una sola pestaña en el orden de tabulación.
- Navegación de pestañas con flechas, Home y End.
- Mensajes del lab y del formulario anunciados mediante regiones `aria-live`.
- Barra de progreso etiquetada para comunicar el puntaje.
- Respeto a la preferencia de movimiento reducido y control manual de animaciones.
- Estilos de impresión que simplifican la página y ocultan el encabezado, la dona, la franja animada y el lab, entre otros elementos.

Estas son las medidas implementadas; el proyecto no declara una certificación de accesibilidad.

### Rendimiento y ciclo de vida

La dona usa `requestAnimationFrame`, reutiliza buffers de puntos y ejecuta su animación fuera de la zona de Angular. Los observadores controlan su tamaño y visibilidad. Al destruir los componentes se liberan listeners, observadores, animaciones y temporizadores.

Los elementos revelados durante el scroll dejan de observarse una vez visibles. La preferencia de movimiento se escucha también durante el uso de la página, para responder a cambios del dispositivo.

## Estructura del proyecto

```text
.
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── signal-orbit.svg             # Respaldo visual de la dona
│   └── tandil-tech-week-2026.ics     # Calendario descargable
├── scripts/
│   └── experience.test.mjs          # Pruebas de lógica con node:test
├── src/
│   ├── app/
│   │   ├── app.ts                   # Estado, interacciones y animaciones
│   │   ├── app.html                 # Secciones y controles de la página
│   │   ├── app.scss                 # Estilos y adaptaciones responsive
│   │   ├── app.config.ts            # Proveedores y configuración de Angular
│   │   ├── app.routes.ts            # Configuración de rutas, actualmente vacía
│   │   ├── signal-orbit.ts          # Componente de la dona interactiva
│   │   ├── event-data.ts            # Jornadas, participantes y estado del evento
│   │   └── cyber-lab.ts             # Misiones, validación de respuestas y puntajes
│   ├── index.html                   # Documento, idioma y metadatos
│   ├── main.ts                      # Arranque de la aplicación standalone
│   └── styles.scss                  # Variables y estilos globales
├── angular.json                     # Servidor, compilación, assets y presupuestos
├── package.json                     # Scripts y dependencias
├── package-lock.json                # Dependencias resueltas
├── tsconfig.json                    # Configuración base de TypeScript
├── tsconfig.app.json                # Configuración de la aplicación
├── tsconfig.spec.json               # Configuración de TypeScript para specs
├── .gitignore
└── README.md
```

La aplicación tiene un único recorrido por secciones con anclas: `#inicio`, `#encuentro`, `#agenda`, `#cyber-lab`, `#comunidad` y `#preguntas`. El router está registrado, pero no hay rutas adicionales configuradas.

Los archivos de `public/` se publican en la raíz de la aplicación. Por eso el calendario se enlaza como `tandil-tech-week-2026.ics` y la imagen como `signal-orbit.svg`.

## Personalización

| Qué cambiar | Archivo o lugar |
| --- | --- |
| Contenido del inicio, textos, FAQ, formulario y crédito del equipo | [src/app/app.html](src/app/app.html) |
| Colores, tipografías y estilos globales | [src/styles.scss](src/styles.scss) |
| Diseño de secciones, tarjetas, pestañas y puntos de corte | [src/app/app.scss](src/app/app.scss) |
| Giro, malla, partículas e interacción de la dona | [src/app/signal-orbit.ts](src/app/signal-orbit.ts) |
| Jornadas, ubicaciones, mapas, organizaciones y sponsors | [src/app/event-data.ts](src/app/event-data.ts) |
| Textos, evidencias, pistas, respuestas y puntos del lab | [src/app/cyber-lab.ts](src/app/cyber-lab.ts) |
| Comandos del lab, formulario y comportamiento de la interfaz | [src/app/app.ts](src/app/app.ts) |
| Eventos que se descargan al calendario | [public/tandil-tech-week-2026.ics](public/tandil-tech-week-2026.ics) |
| Título de la pestaña, descripción y Open Graph | [src/index.html](src/index.html) |
| Presupuestos de compilación y configuración del servidor | [angular.json](angular.json) |

Al cambiar las fechas, actualizar **los datos de las jornadas, los límites de `getEventState`, la fecha de la cuenta regresiva en `app.ts`, el archivo `.ics` y los textos visibles de la plantilla y los metadatos**.

Al agregar o quitar misiones, revisar también los textos y máximos de la interfaz: actualmente se muestra **3 misiones** y **450 puntos**. La puntuación se calcula desde `MISSIONS`, pero esos rótulos y límites están escritos en la plantilla.

Para mantener el comportamiento accesible de nuevas pestañas, conservar sus roles, identificadores, relación con el panel y navegación por teclado.

## Comandos y compilación

| Comando | Función |
| --- | --- |
| `npm ci` | Instala las dependencias a partir del lockfile |
| `npm start` | Inicia el servidor de desarrollo |
| `npm start -- --port 4300` | Inicia el servidor en otro puerto |
| `npm run build -- --configuration development` | Compila en modo desarrollo |
| `npm run build` | Intenta compilar en modo producción, con optimización y presupuestos |
| `npm run watch` | Recompila en modo desarrollo al detectar cambios |
| `node --test scripts/experience.test.mjs` | Ejecuta las pruebas implementadas |
| `npm run ng -- <comando>` | Ejecuta Angular CLI localmente |

### Salida de la compilación

```bash
npm run build -- --configuration development
```

La salida de la aplicación para servir en el navegador se genera en:

```text
dist/tandil-tech-week/browser/
```

Es un frontend que puede servirse como contenido estático. Durante el desarrollo se usa `npm start`; para distribuir una compilación se debe servir la carpeta de salida mediante un servidor web.

### Estado actual de producción

La compilación de desarrollo funciona. La compilación de producción está bloqueada por el presupuesto de estilos definido en `angular.json`:

- Advertencia de `anyComponentStyle`: **4 kB**.
- Error de `anyComponentStyle`: **8 kB**.
- En la validación del **14 de octubre de 2026**, `app.scss` compilado ocupó aproximadamente **24,37 kB** y superó esos límites.

Antes de publicar una compilación de producción, hace falta reducir o distribuir los estilos entre componentes, o ajustar el presupuesto según el tamaño que se decida aceptar. Luego se debe volver a ejecutar `npm run build` y comprobar que termine correctamente.

### Pruebas de Angular CLI

`package.json` contiene el script `npm test`, que llama a `ng test`, pero `angular.json` todavía no configura un target `test`. El comando de pruebas implementado y verificado para este proyecto es:

```bash
node --test scripts/experience.test.mjs
```

No hay un target de pruebas end-to-end configurado en Angular CLI.

## Pruebas

El archivo [scripts/experience.test.mjs](scripts/experience.test.mjs) utiliza el runner de Node.js y transpila los módulos TypeScript necesarios para verificar:

1. Que los enlaces señuelo no resuelven la misión de phishing y la opción correcta sí.
2. Que el mensaje César se descifra a la respuesta esperada.
3. Que los permisos excesivos no resuelven la misión de mínimo privilegio.
4. Que repetir una misión no duplica el puntaje y que el total correcto es 450.
5. Que el evento comienza a medianoche del 14 de octubre en Argentina.
6. Que ambas jornadas están incluidas y el evento pasa a finalizado al comenzar el 16.

En la validación del **14 de octubre de 2026**, las **seis pruebas pasaron** y la compilación de desarrollo terminó correctamente.

Las pruebas automatizadas cubren esa lógica. Las interacciones visuales se pueden revisar con el recorrido de demostración siguiente y con las herramientas del navegador.

## Guía para una demostración

1. Iniciar la página y mover el cursor por el inicio para mostrar la respuesta de la dona.
2. Arrastrar la dona para cambiar su orientación y bajar con scroll para mostrar su transformación.
3. Pausar y reactivar **ANIMACIONES**.
4. Abrir **Las jornadas**, cambiar entre Hacking Day y Startup Day y mostrar el acceso al mapa.
5. Descargar **Agendar las fechas** y revisar que el calendario contiene las dos jornadas de día completo.
6. Entrar al **Cyber lab**, resolver una misión, pedir una pista y mostrar el cambio de puntaje.
7. Usar `help`, `misiones`, `abrir 2` y `score` en la terminal. Completar el lab para mostrar **ACCESS GRANTED** y **Volver a jugar**.
8. En **Comunidad**, alternar entre **Organizaciones** y **Sponsors**.
9. Abrir una pregunta frecuente y probar el formulario: una pregunta vacía se rechaza y una válida muestra la confirmación de demostración.
10. Revisar el menú, las pestañas y el formulario en una pantalla pequeña y recorrer los controles con teclado.
11. Mostrar la cuenta regresiva o el mensaje correspondiente a la fecha del dispositivo y el crédito del equipo en el footer.

## Estado de los datos y alcance

- **Frontend:** contenido, interacciones y estado de sesión funcionan en el navegador. El proyecto no incluye backend, base de datos, autenticación ni panel administrativo.
- **Inscripciones y horarios:** los botones abren el [sitio oficial de Tandil Tech Week](https://www.tandiltechweek.com/); la página no procesa inscripciones.
- **Datos del evento:** las jornadas y los participantes están definidos en el código. No se sincronizan automáticamente con el sitio oficial.
- **Referencia del encuentro:** la página incluye un enlace a la [nota del Clúster Tecnológico Tandil](https://www.clustertecnologicotandil.org.ar/nota-tandil-tech-week-2026-dos-jornadas-para-conectar-tecnologia--startups-e-innovacion-63931).
- **Calendario:** la descarga es un archivo estático incluido en `public/`.
- **Cyber lab:** es una experiencia educativa de esta página con evidencias ficticias. Los resultados se pierden al recargar y no se envían a terceros.
- **Formulario:** es una demostración local. No envía ni almacena consultas.
- **Estado de interfaz:** la misión, el puntaje, las pestañas y la preferencia manual de animaciones se mantienen durante la sesión de la página.
- **Enlaces externos:** los accesos al sitio oficial, a mapas y a las organizaciones permiten continuar en otros sitios.

## Equipo

**Shitty Brainstorming**

El nombre del equipo aparece en el footer como **EQUIPO: Shitty Brainstorming**.

Tandil Tech Week 2026 · Tandil, Argentina · Concepto web independiente.
