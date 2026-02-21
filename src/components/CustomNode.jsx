import { Handle, Position } from '@xyflow/react';
import { getNodeColor, getComplexityColor, THEME } from '../theme';
import { Activity, Box, Code2, AlertTriangle } from 'lucide-react';

export function CustomNode({ data }) {
    const isXRay = data.isXRayMode;
    const bgColor = isXRay ? getComplexityColor(data.complexity) : getNodeColor(data.level, data.type, data.isCircular);
    const isDanger = isXRay && (bgColor === THEME.colors.xrayDanger || bgColor === THEME.colors.xrayCritical);

    const Icon = () => {
        if (data.isCircular) return <AlertTriangle size={16} />;
        if (data.type === 'function') return <Activity size={16} />;
        if (data.type === 'class') return <Code2 size={16} />;
        return <Box size={16} />;
    }

    return (
        <div
            className={`transition-all duration-300 ${isDanger ? 'animate-pulse' : ''}`}
            style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(8px)',
                border: `2px solid ${bgColor}`,
                color: THEME.colors.text,
                fontFamily: THEME.typography.fontFamily,
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isDanger ? `0 0 30px ${bgColor}80` : (data.isCircular ? `0 0 20px ${THEME.colors.edgeCircular}40` : '0 4px 6px rgba(0,0,0,0.1)'),
                opacity: data.opacity ?? 1,
                transform: data.isFocused ? 'scale(1.05)' : 'scale(1)',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div style={{ color: bgColor, display: 'flex', alignItems: 'center' }}>
                <Icon />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{data.label}</div>
                <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>
                    {data.type} • L{data.level}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
}
