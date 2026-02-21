import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { THEME, getComplexityColor } from '../theme';

export default function HealthInspector({ selectedNode }) {
    if (!selectedNode) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md font-['Inter'] text-gray-500">
                <Activity size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Select a component to view metrics</p>
            </div>
        );
    }

    const { cyclomatic = 1, cognitive = 0, bigO = 'O(1)' } = selectedNode.data.complexity || {};

    const data = useMemo(() => {
        // Map BigO to scale of 1-30 for visual weight
        let algoWeight = 5;
        if (bigO === 'O(n)') algoWeight = 15;
        if (bigO === 'O(n^2)') algoWeight = 30;

        // Mock Fan-out and Cohesion for visualization balance
        const fakeFanOut = Math.abs(selectedNode.id.charCodeAt(0) % 20) + 5;
        const fakeCohesion = 30 - Math.abs(selectedNode.id.charCodeAt(selectedNode.id.length - 1) % 20);

        return [
            { subject: 'Ciclomática', A: Math.min(cyclomatic * 2, 30), fullMark: 30 },
            { subject: 'Cognitiva', A: Math.min(cognitive * 1.5, 30), fullMark: 30 },
            { subject: 'Algorítmica', A: algoWeight, fullMark: 30 },
            { subject: 'Fan-out', A: fakeFanOut, fullMark: 30 },
            { subject: 'Cohesión (inv)', A: fakeCohesion, fullMark: 30 },
        ];
    }, [cyclomatic, cognitive, bigO, selectedNode.id]);

    const radarColor = getComplexityColor(selectedNode.data.complexity);
    const isDanger = radarColor === THEME.colors.xrayDanger || radarColor === THEME.colors.xrayCritical;

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md font-['Inter'] relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-gray-300 tracking-wider">HUD - HEALTH INDICATORS</span>
            </div>

            <div className="flex-1 w-full min-h-[250px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 10, fontFamily: 'monospace' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} axisLine={false} />
                        <Radar name="Complejidad" dataKey="A" stroke={radarColor} fill={radarColor} fillOpacity={0.4} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} itemStyle={{ color: radarColor }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="px-5 pb-5 grid grid-cols-3 gap-2 text-center border-t border-gray-800/50 pt-3 bg-black/20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Ciclomática</span>
                    <span className={`text-lg font-bold ${cyclomatic > 11 ? 'text-red-400' : 'text-green-400'}`}>{cyclomatic}</span>
                </div>
                <div className="flex flex-col border-x border-gray-800/50">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Cognitiva</span>
                    <span className={`text-lg font-bold ${cognitive > 15 ? 'text-red-400' : 'text-green-400'}`}>{cognitive}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Big O</span>
                    <span className={`text-sm font-bold font-mono py-1 rounded ${bigO === 'O(n^2)' ? 'bg-red-500/20 text-red-300' : 'text-green-400'}`}>{bigO}</span>
                </div>
            </div>

            {isDanger && (
                <div className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
            )}
        </div>
    );
}
