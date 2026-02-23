📋 Ficha Técnica del Nodo (Metadata Expandida)
Además del nombre y la URI, integra estos campos para maximizar la utilidad:

1. Huella de Dependencias (Imports/Exports)
Fan-In (Dependientes): Cuántos otros archivos importan este componente. Si el número es alto (ej. > 10), indica que es un componente crítico y cualquier cambio puede romper la App.

Fan-Out (Dependencias): Cuántas librerías externas y componentes internos consume este archivo. Útil para detectar componentes "Gordos" que saben demasiado.

2. Clasificación de Tecnología
Runtime: Identificar si es Lit (Web Component) o React (Functional/Class).

Hooks/State: Listado de los Hooks utilizados (ej. useState, useAuth, useEffect). Esto ayuda a entender si el componente tiene efectos secundarios o maneja estado global.

3. Métricas de Tamaño (Física del Código)
Líneas de Código (LoC): Total de líneas. Si supera las 250-300 líneas, el sistema debería sugerir fragmentación.

Tamaño Estimado (Bundle): Si el parser puede leer el tamaño del archivo, mostrarlo en KB. Es vital para componentes Lit que deben ser ligeros.

4. Metadatos de Negocio (Etiquetas)
Directorio Raíz: Indicar si pertenece a /core, /apps, o /shared.

Última Modificación: (Si integras git) Mostrar quién fue el último autor y hace cuánto se tocó. Esto ayuda a identificar "código legacy" o "código fresco".

🚨 Sistema de Alertas: "Architectural Red Flags"Añadiremos iconos de advertencia junto al nombre del archivo en el Inspector Panel basándonos en los siguientes disparadores (triggers):1. El "Efecto Mariposa" (High Fan-In)Trigger: El componente es importado por más de 15 archivos.Alerta: 🦋 Critical Dependency.Por qué: Un cambio pequeño aquí puede romper múltiples aplicaciones. Es un nodo con mucha "gravedad".2. El "Componente Dios" (High Fan-Out + LoC)Trigger: El componente tiene más de 300 líneas y usa más de 8 dependencias distintas.Alerta: 🧠 God Object Detected.Por qué: Indica que el componente está haciendo demasiadas cosas y viola el Principio de Responsabilidad Única.3. El "Cerebro de Espagueti" (Cognitive Complexity)Trigger: Complejidad Cognitiva > 20.Alerta: 🍝 Spaghetti Logic.Por qué: El código es tan difícil de leer que cualquier modificación probablemente introduzca bugs.4. El "Freno de Mano" (Performance Debt)Trigger: Complejidad Algorítmica $O(n^2)$ o superior en un método de renderizado.Alerta: 🐢 Performance Bottleneck.Por qué: Puede causar lag en la interfaz de usuario, especialmente en listas grandes.

🛠️ Actualización del Prompt para Antigravity
Copia este bloque en tu documento de instrucciones:

"Implementa un objeto flags en el JSON de cada nodo. La lógica del parser debe evaluar:

isFragile: true si fanIn > 15.

isGiant: true si linesOfCode > 300 y fanOut > 8.

isComplex: true si cognitiveComplexity > 20.

isSlow: true si bigO es cuadrático o superior.

En la interfaz, si un nodo tiene alguna flag en true, muestra un icono de alerta dinámico. Al pasar el ratón (hover), despliega un tooltip que explique el riesgo técnico (ej: 'Este componente es una dependencia crítica, procede con cautela')."

Mapa de Experiencia de Usuario (UX) Completo
Acción,Información en Pantalla,Valor para el Dev
Hover sobre Nodo,"Nombre, Tecnología (React/Lit), Flags de Alerta.",Diagnóstico rápido sin clics.
Click en Nodo,"URI completa, Tamaño (KB), Radar de Complejidad.",Evaluación de deuda técnica profunda.
Búsqueda (Modo Foco),Solo el linaje de archivos y sus funciones.,Limpieza de ruido visual para debugear.
Click en Refactor,Snippet original vs Snippet sugerido por IA.,Acción inmediata para mejorar el código.

📝 Documento Final de Instrucciones (Markdown)Con todo lo que hemos construido, tu prompt final para la IA debe estructurarse así:Contexto: Herramienta de mapas visuales interactivos para React/Lit.Generador de Datos: Parser de AST con métricas de complejidad ($M$, Cognitiva, Big O).Visualización: React Flow con sistema de colores por niveles y Heatmap de salud.Telemetría: Panel lateral con URI, LoC, Fan-In/Out y Lista de Hooks.Inteligencia: Sistema de Alertas (Flags) y sugerencias de refactorización automáticas.


🎨 Diseño de Interfaz: The "Contextual Switcher"
Para que la transición sea "interesante", utilizaremos un desplazamiento lateral elástico (Spring Physics). Cuando el usuario cambie de pestaña, el contenido no solo aparecerá, sino que se deslizará suavemente, dando una sensación de profundidad.

1. Estructura de la Card Inferior
La card tendrá una cabecera fija con el selector de pestañas y un cuerpo dinámico.

Tab 1: CARD DATA (El Origen): Muestra la URI, Metadatos, Líneas de Código y Flags de alerta.

Tab 2: REFACTOR SANDBOX (El Destino): Muestra el Diff de código (Original vs Sugerido) y el botón "Apply Changes".

2. Animación Sugerida (Framer Motion)
Para que se sienta "premium", el indicador de la pestaña activa (un subrayado o fondo resaltado) debe moverse físicamente de una palabra a otra.

🛠️ Especificación de Implementación para Antigravity
Añade este bloque a tus instrucciones de desarrollo:

Módulo: AnimatedInspectorCard
"Crea un componente React llamado InspectorTabs que gestione el panel derecho inferior:"

1. Estado: Usa useState para controlar la pestaña activa.

2. Animación de Contenido: Utiliza AnimatePresence y motion.div de Framer Motion.

Al cambiar, el contenido actual debe salir hacia la izquierda con opacity: 0.

El nuevo contenido debe entrar desde la derecha con un efecto de x: 20 a x: 0.

3. Visual de Tabs:

Usa un contenedor con display: flex y gap: 4.

Añade un layoutId al fondo de la pestaña activa para que el color "fluya" entre ellas al hacer clic.

Contenido de las Tabs:
- Card Data:
    - File Name (Bolding).
    - URI (Caja de texto con estilo code y botón copiar).
    - Alert Badges (Los iconos de 🦋, 🧠, 🍝, 🐢 que definimos).

- Refactor Sandbox:
    - Complexity Reduction Score: Un badge que diga cuánto bajaría la complejidad (ej: -15%).
    - Code Comparison: Un visor de código minimalista.

### 🖥️ UI: Panel Lateral Inferior con Tabs Animadas
- **Componente:** `InteractiveInspector`
- **Lógica de Navegación:**
  - Implementar un sistema de tabs: [CARD DATA | REFACTOR SANDBOX].
  - Usar **Framer Motion** para animaciones de entrada/salida (Slide + Fade).
  - La pestaña "REFACTOR SANDBOX" debe brillar con un borde sutil si el componente seleccionado tiene Flags de Alerta activas.

- **Contenido Detallado:**
  - **Tab CARD DATA:** - Mostrar `full_path` del archivo.
    - Listado de `hooks` detectados.
    - Estadísticas de `fan-in` y `fan-out`.
  - **Tab REFACTOR SANDBOX:** - Mostrar recomendación de la IA para reducir la complejidad.
    - Si la complejidad es O(n^2), sugerir la estructura de datos optimizada.

¿Cómo se vería el flujo de usuario?
El usuario hace clic en el nodo "DataEngine.ts" (que está en rojo).

La card inferior se abre por defecto en CARD DATA, mostrando que tiene 400 líneas de código.

El usuario ve que la pestaña REFACTOR SANDBOX tiene un punto rojo de notificación.

Al hacer clic, la pestaña se desliza lateralmente y la IA le dice: "Tu método render() es demasiado complejo, ¿quieres dividirlo en 3 sub-componentes?".