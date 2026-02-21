import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { THEME } from '../theme';

export default function SearchBar({ nodes, onFocus, focusedNodeId }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredNodes = useMemo(() => {
        if (!query) return [];
        return nodes
            .filter(n => n.id.toLowerCase().includes(query.toLowerCase()) || (n.data.label && n.data.label.toLowerCase().includes(query.toLowerCase())))
            .slice(0, 10);
    }, [nodes, query]);

    const handleSelect = (nodeId) => {
        onFocus(nodeId);
        setQuery('');
        setIsOpen(false);
    };

    const handleClear = () => {
        onFocus(null);
        setQuery('');
    };

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 10,
            width: '300px',
            fontFamily: THEME.typography.fontFamily,
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(30, 30, 30, 0.9)',
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '8px 12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            }}>
                <Search size={18} color="#888" style={{ marginRight: '8px' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search components..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: THEME.colors.text,
                        outline: 'none',
                        flex: 1,
                        fontSize: '14px',
                    }}
                />
                {focusedNodeId && (
                    <button
                        onClick={handleClear}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px',
                            marginLeft: '4px'
                        }}
                        title="Clear Focus"
                    >
                        <X size={16} color={THEME.colors.level1} />
                    </button>
                )}
            </div>

            {isOpen && filteredNodes.length > 0 && (
                <div style={{
                    marginTop: '8px',
                    background: 'rgba(30, 30, 30, 0.95)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px rgba(0,0,0,0.5)',
                }}>
                    {filteredNodes.map(node => (
                        <div
                            key={node.id}
                            onClick={() => handleSelect(node.id)}
                            style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #333',
                                color: THEME.colors.text,
                                display: 'flex',
                                justifyContent: 'space-between',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontWeight: 500 }}>{node.id}</span>
                            <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>{node.data.type}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
