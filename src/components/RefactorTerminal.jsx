import React from 'react';
import { Terminal, Lightbulb, Code2 } from 'lucide-react';
import { THEME } from '../theme';

export default function RefactorTerminal({ selectedNode }) {
    if (!selectedNode) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md font-['Inter'] text-gray-500 p-6 text-center">
                <Code2 size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Waiting for selection to provide <span className="text-purple-400">AI</span> suggestions</p>
            </div>
        );
    }

    const { cyclomatic, cognitive, bigO } = selectedNode.data.complexity || { cyclomatic: 1, cognitive: 0, bigO: 'O(1)' };

    // Simple heuristic for demo
    let suggestion = '';
    let isDanger = false;

    if (bigO === 'O(n^3)' || bigO === 'O(n!)' || bigO === 'O(2^n)') {
        suggestion = "Sugerencia CRÍTICA: 'Cuello de Botella Extremo'. Complejidad algorítmica inmanejable detectada. Reescribir lógica urgentemente.";
        isDanger = true;
    } else if (bigO === 'O(n^2)') {
        suggestion = "Sugerencia: 'Optimización de Búsqueda'. El módulo contiene bucles anidados intensivos. Recomienda el uso de un Map o Set de cacheo en lugar de iteraciones dependientes (.find dentro de .map).";
        isDanger = true;
    } else if (cyclomatic > 11) {
        suggestion = "Sugerencia: 'Extraer Lógica de Decisión'. Complejidad estructural muy alta. Identificar bloques switch o if/else múltiples y proponer convertirlos en un objeto de configuración o pequeños sub-componentes.";
        isDanger = true;
    } else if (cognitive > 15) {
        suggestion = "Sugerencia: 'Fragmentación de Render'. La carga mental de lectura es excesiva. Sugerimos dividir el método principal en métodos privados más pequeños o delegar el estado.";
        isDanger = true;
    } else {
        suggestion = "Código dentro de los márgenes óptimos de complejidad. No se requieren refactorizaciones urgentes.";
    }

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md font-['Inter']">

            <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
                <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-purple-500/10 rounded-lg shrink-0">
                        <Code2 size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-sm text-gray-400 font-medium mb-1">Componente Analizado</h4>
                        <div className="text-base font-bold text-white font-mono break-all">{selectedNode.id}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{selectedNode.data.type}</div>
                    </div>
                </div>

                <div className={`mt-2 p-4 rounded-lg border ${isDanger ? 'bg-red-950/20 border-red-900/50 text-red-200' : 'bg-green-950/20 border-green-900/50 text-green-200'}`}>
                    <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                        <Lightbulb size={16} className={isDanger ? "text-red-400" : "text-green-400"} />
                        A.I. Suggestion
                    </div>
                    <p className="text-sm leading-relaxed opacity-90">
                        {suggestion}
                    </p>
                </div>

                {isDanger && (
                    <div className="mt-auto bg-[#141414] p-3 rounded text-xs font-mono text-gray-400 border border-gray-800 whitespace-pre-wrap">
                        {`// Simulated AST Hotspot\nfunction processData(items) {\n  return items.map(i => {\n    // O(n^2) cascade detected here\n    const linked = db.find(d => d.id === i.ref);\n    if (linked) {\n      if (linked.status === 'active') {\n        ...\n      }\n    }\n  });\n}`}
                    </div>
                )}
            </div>
        </div>
    );
}
