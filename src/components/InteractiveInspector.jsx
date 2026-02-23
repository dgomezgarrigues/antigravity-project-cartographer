import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, Link, Copy, Check, GitPullRequest, Activity, AlertTriangle, Bug, Code2, Cpu, Database, Terminal } from 'lucide-react';
import HealthInspector from './HealthInspector';
import RefactorTerminal from './RefactorTerminal';

const TABS = [
    { id: 'data', label: 'Card Data', icon: Database },
    { id: 'refactor', label: 'Refactor Sandbox', icon: Terminal }
];

export default function InteractiveInspector({ isOpen, selectedNode }) {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const nodeData = selectedNode?.data || {};
    const flags = nodeData.flags || {};
    const hooks = nodeData.hooks || [];

    const hasAlerts = Object.values(flags).some(Boolean);

    const displayPath = nodeData.fullPath && nodeData.fullPath.includes('proyecto-sacrificio')
        ? nodeData.fullPath.substring(nodeData.fullPath.indexOf('proyecto-sacrificio'))
        : nodeData.fullPath;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-20 right-6 w-[450px] flex flex-col gap-4 z-10 pointer-events-auto"
                style={{ height: 'calc(100vh - 120px)' }}
            >
                {/* UP CARD: RADAR HEALTH */}
                <div className="flex-none h-1/2 min-h-[300px]">
                    <HealthInspector selectedNode={selectedNode} />
                </div>

                {/* DOWN CARD: TABS (CARD DATA / REFACTOR SANDBOX) */}
                <div className="flex-1 min-h-[300px] flex flex-col bg-[#1a1a1a]/95 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl font-['Inter']">
                    {/* Header & Tabs */}
                    <div className="bg-black/40 border-b border-gray-800 p-2 flex-none">
                        <div className="flex bg-black/50 rounded-lg p-1 relative">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const isRefactor = tab.id === 'refactor';
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex-1 py-1.5 text-[10px] sm:text-xs font-bold tracking-wider rounded-md transition-colors z-10 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabBadge"
                                                className="absolute inset-0 bg-gray-800 rounded-md -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative flex items-center justify-center gap-1.5">
                                            {tab.icon && <tab.icon size={14} className={isRefactor && hasAlerts ? "text-red-400" : ""} />}
                                            {tab.label}
                                            {isRefactor && hasAlerts && (
                                                <span className="flex h-2 w-2 relative ml-1">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 overflow-y-auto p-4"
                            >
                                {/* TAB 1: CARD DATA */}
                                {activeTab === 'data' && (
                                    <div className="flex flex-col gap-4">
                                        {!selectedNode ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                                <FileCode2 size={32} className="mb-2 opacity-30" />
                                                <p className="text-sm">Select a component to view metadata</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Header File Info */}
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                                            {selectedNode.id}
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 uppercase tracking-wider">{nodeData.type}</span>
                                                        </h2>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="flex-1 overflow-hidden rounded bg-black/40 border border-gray-800 flex items-center p-1">
                                                                <div className="px-2 text-gray-500"><Link size={12} /></div>
                                                                <div className="text-[10px] text-gray-400 font-mono truncate select-all">{displayPath}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleCopy(displayPath)}
                                                                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                                                title="Copy URI"
                                                            >
                                                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Alert Badges */}
                                                {hasAlerts && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {flags.isFragile && (
                                                            <div className="flex items-center gap-1.5 bg-blue-900/30 border border-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs" title="Critical Dependency: Alta cantidad de dependientes.">
                                                                <span>🦋</span> Critical Dependency
                                                            </div>
                                                        )}
                                                        {flags.isGiant && (
                                                            <div className="flex items-center gap-1.5 bg-purple-900/30 border border-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs" title="God Object: Componente muy extenso y con muchas dependencias.">
                                                                <span>🧠</span> God Object
                                                            </div>
                                                        )}
                                                        {flags.isComplex && (
                                                            <div className="flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 px-2 py-1 rounded text-xs" title="Spaghetti Logic: Complejidad cognitiva alta. Difícil de leer.">
                                                                <span>🍝</span> Spaghetti Logic
                                                            </div>
                                                        )}
                                                        {flags.isSlow && (
                                                            <div className="flex items-center gap-1.5 bg-red-900/30 border border-red-500/30 text-red-300 px-2 py-1 rounded text-xs" title="Performance Bottleneck: Complejidad algorítmica cuadrática o peor.">
                                                                <span>🐢</span> Performance Bottleneck
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Metrics Grid */}
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    <div className="bg-black/30 p-3 rounded-lg border border-gray-800/50 flex flex-col items-center">
                                                        <Code2 size={16} className="text-gray-500 mb-1" />
                                                        <span className="text-xl font-bold text-gray-200">{nodeData.linesOfCode || '-'}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">LoC</span>
                                                    </div>
                                                    <div className="bg-black/30 p-3 rounded-lg border border-gray-800/50 flex flex-col items-center">
                                                        <GitPullRequest size={16} className="text-gray-500 mb-1" />
                                                        <span className="text-xl font-bold text-gray-200">{nodeData.fanIn || 0}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">Fan-In</span>
                                                    </div>
                                                    <div className="bg-black/30 p-3 rounded-lg border border-gray-800/50 flex flex-col items-center">
                                                        <Activity size={16} className="text-gray-500 mb-1" />
                                                        <span className="text-xl font-bold text-gray-200">{nodeData.fanOut || 0}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">Fan-Out</span>
                                                    </div>
                                                </div>

                                                {/* Hooks List */}
                                                {hooks.length > 0 && (
                                                    <div className="mt-2">
                                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <Cpu size={12} /> Detected Hooks
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {hooks.map(h => (
                                                                <span key={h} className="px-2 py-1 bg-cyan-900/20 text-cyan-400 border border-cyan-800/50 rounded text-[11px] font-mono">
                                                                    {h}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: REFACTOR SANDBOX */}
                                {activeTab === 'refactor' && (
                                    <div className="h-full w-full">
                                        <RefactorTerminal selectedNode={selectedNode} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
