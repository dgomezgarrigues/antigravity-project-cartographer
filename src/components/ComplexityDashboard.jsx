import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HealthInspector from './HealthInspector';
import RefactorTerminal from './RefactorTerminal';

export default function ComplexityDashboard({ isOpen, selectedNode }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute top-20 right-6 w-96 flex flex-col gap-4 z-10 pointer-events-auto"
                    style={{ height: 'calc(100vh - 120px)' }}
                >
                    <div className="flex-none h-1/2 min-h-[300px]">
                        <HealthInspector selectedNode={selectedNode} />
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <RefactorTerminal selectedNode={selectedNode} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
