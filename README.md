# Ejecución

```bash
 npm run build && npm run preview  
```
## Generar datos
```bash
node parser/index.js C:\Users\atoms\Documents\AI-projects\proyecto-sacrificio\antigravity-stress-test\
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# complejidad
El nivel de complejidad del código mide qué tan difícil es entender, mantener y modificar el software, afectando su calidad y rendimiento. Se evalúa principalmente mediante la complejidad ciclomática (caminos lógicos/pruebas) y la complejidad cognitiva (comprensión humana), siendo fundamental para reducir errores, facilitar pruebas y asegurar un código limpio. 

Aquí hay un desglose detallado de cómo se mide la complejidad del código:

## Complejidad Ciclomática (Métrica Estructural):
Mide el número de caminos independientes a través del código.
Se basa en estructuras de control: if, while, for, case, etc..
Un valor alto indica que el código es difícil de probar y mantener.
- 1-10: Código simple, de bajo riesgo.
- 11-20: Complejidad moderada.
- 21-50: Complejidad alta, difícil de probar.
- >50: Riesgo extremo, requiere reescritura.

## Complejidad Cognitiva (Facilidad de Entendimiento):
Mide qué tan difícil es para un ser humano entender el código.
Aumenta con estructuras anidadas, recursión y secuencias lógicas complejas.
El objetivo es mantener el código simple e intuitivo.

## Complejidad Algorítmica (Big O Notation):
Analiza la eficiencia del código en tiempo de ejecución y uso de memoria a medida que crecen los datos.
- O(1) (Constante): Mejor rendimiento, el tiempo es constante independientemente de los datos.
- O(n) (Lineal): El tiempo crece proporcionalmente a la entrada.
- O(n^2) (Cuadrático): Típico de bucles anidados, puede ser lento

## Cohesión (Inv)
La "Cohesión Inversa" (o falta de cohesión) mide qué tan enfocada está una clase o módulo. En términos de diseño, la cohesión ideal es alta (el principio de Responsabilidad Única).

Cuando una métrica marca "Cohesión (Inv)", generalmente se refiere al LCOM (Lack of Cohesion of Methods). Esta métrica analiza la relación entre los métodos de una clase y sus atributos (campos).

Cómo se mide: Se observa si los métodos de una clase comparten los mismos atributos.
- Baja Cohesión Inv (Bueno): Casi todos los métodos usan casi todos los atributos. La clase tiene un propósito único y claro.
- Alta Cohesión Inv (Malo): Tienes grupos de métodos que no comparten nada con otros grupos dentro de la misma clase. Esto sugiere que la clase es un "objeto Dios" o un cajón de sastre que debería dividirse en dos o más clases.

## Fan-out
El Fan-out mide la dependencia de salida. Es decir, a cuántos otros componentes (clases, módulos, servicios) llama o utiliza una clase específica para realizar su trabajo.

El impacto: Un Fan-out elevado indica que una clase es muy compleja porque "sabe demasiado" sobre el resto del sistema.

Riesgos:
- Fragilidad: Si cualquiera de las dependencias cambia, es muy probable que esta clase se rompa.
- Dificultad de testeo: Para probar esta clase, necesitarás crear muchísimos mocks o stubs de todas sus dependencias.

Regla de oro: Un Fan-out alto suele ser el síntoma principal de un código "espagueti" donde todo está acoplado con todo.
