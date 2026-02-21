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