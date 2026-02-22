Contexto: Necesitamos una herramienta de análisis estático y visualización de arquitecturas Frontend (React y Lit) para proyectos locales.

1. Requisitos Técnicos del Parser (Backend)
Objetivo: Analizar el directorio local y generar un archivo graph-data.json con la estructura de nodos y enlaces.

Parser: Utilizar @babel/parser para archivos JSX/TSX y el compilador de TypeScript para archivos de Lit.

Estructura del JSON resultante:

JSON
{
  "nodes": [{ "id": "string", "type": "component|function", "level": number }],
  "edges": [{ "source": "string", "target": "string" }]
}
Lógica de Detección: Implementar un visitor de AST que identifique:

import statements para mapear dependencias.

Definiciones de componentes (function ComponentName, class ... extends LitElement).

Llamadas a funciones dentro del cuerpo de renderizado.

2. Requisitos de Visualización (Frontend)
Librería: Utilizar React Flow por su capacidad de manipulación de grafos.

Sistema de Estilos:

Crear un theme.js donde definamos:

level-0: Color #FFD700 (Raíz).

level-1: Color #007AFF (Layouts).

level-2+: Color #34C759 (Atoms/Molecules).

function: Color #AF52DE (Lógica).

Renderizado: Implementar un layout de fuerza (Force-directed graph) para el estado inicial "Big Bang".

3. Motor de Búsqueda y "Modo Foco"
Funcionalidad: Crear un buscador que acepte el nombre del componente.

Lógica de Aislamiento:

Al seleccionar un componente:

Identificar todos los nodes y edges conectados (hacia arriba y hacia abajo).

Setear opacity: 0.1 a todos los elementos que no estén en el set de "conexión directa".

Realizar un fitView hacia el clúster seleccionado.

4. Entregables Esperados
Script de Análisis: (Node.js) que escanea una ruta process.argv[2] y genera el JSON.

Componente React: Un visualizador que consuma el JSON y aplique los estilos de nivel.

Hook de Búsqueda: useGraphFocus(nodeId) que maneje la lógica de opacidad dinámica.

Notas para la IA
Prioriza la legibilidad del código y la modularidad.

Si detectas dependencias cíclicas durante el parseo, inclúyelas en el JSON con una propiedad isCircular: true para resaltarlas en el UI.

📦 Configuración del Entorno (Ecosistema Antigravity)
Para que el proyecto funcione con la precisión de un reloj suizo, el archivo package.json debe incluir estas dependencias clave:

JSON
{
  "name": "antigravity-project-cartographer",
  "version": "1.0.0",
  "dependencies": {
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0",
    "reactflow": "^11.10.0",
    "dagre": "^0.8.5",
    "fastify": "^4.24.0",
    "fastify-static": "^4.5.0",
    "typescript": "^5.2.0",
    "lucide-react": "^0.284.0"
  },
  "devDependencies": {
    "vite": "^4.5.0"
  }
}
📂 Estructura de Archivos Propuesta
Instruye a la IA para que organice el código de la siguiente manera:

/bin/parser.js: El script de Node que utiliza Babel para leer el AST de los archivos .jsx / .tsx y busca los decoradores @customElement o las clases que extienden de LitElement.

/src/components/GraphCanvas.jsx: El contenedor de React Flow que recibe el JSON y aplica la lógica de colores por profundidad.

/src/hooks/useArchitectureSearch.js: Lógica personalizada para filtrar el grafo. Utiliza un algoritmo de búsqueda en anchura (BFS) para encontrar ancestros y descendientes.

🧩 Lógica de Diferenciación (React vs Lit)
Para que la IA no se confunda, dile que use estas reglas en el Parser:

Detector de React: Busca funciones que retornen JSX o componentes que importen de 'react'.

Detector de Lit: Busca el decorador @customElement('tag-name') o la herencia de la clase LitElement.

Mapeo de Funciones: Identifica funciones exportadas fuera de los componentes y las marca con el tipo function para asignarles el color púrpura.

Instrucción Final para Antigravity
"Genera el código para parser.js asegurándote de que el objeto resultante sea un array de nodes y edges compatible con React Flow. Implementa una función recursiva que asigne el level (profundidad) a cada nodo basándose en su distancia desde el componente de entrada (main/index)."