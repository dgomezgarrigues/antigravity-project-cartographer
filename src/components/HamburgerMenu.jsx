import React, { useState } from 'react';
import { Menu, X, Settings, Info, Box } from 'lucide-react';
import { THEME } from '../theme';

export default function HamburgerMenu({ isXRayMode, toggleXRay, isDashboardOpen, toggleDashboard }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 20,
            fontFamily: THEME.typography.fontFamily,
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: THEME.colors.text,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                }}
                title="Menú"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: 0,
                    background: 'rgba(30, 30, 30, 0.95)',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '8px 0',
                    minWidth: '220px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 15px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '10px 16px',
                        color: '#888',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #333',
                        marginBottom: '4px',
                        fontWeight: 600
                    }}>
                        Opciones
                    </div>
                    <button style={menuItemStyle} onClick={() => { setIsOpen(false); toggleDashboard(); }}>
                        <Settings size={16} className={isDashboardOpen ? "text-cyan-400" : ""} />
                        <span className={isDashboardOpen ? "text-cyan-400 font-semibold" : ""}>Interactive Inspector</span>
                    </button>
                    <button style={menuItemStyle} onClick={() => { setIsOpen(false); toggleXRay(); }}>
                        <Box size={16} className={isXRayMode ? "text-green-400" : ""} />
                        <span className={isXRayMode ? "text-green-400 font-semibold" : ""}>X-Ray Mode</span>
                    </button>
                    <button style={menuItemStyle}>
                        <Info size={16} />
                        <span>Acerca de Cartographer</span>
                    </button>
                </div>
            )}
        </div>
    );
}

const menuItemStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'transparent',
    border: 'none',
    color: THEME.colors.text,
    padding: '10px 16px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'background 0.2s',
    fontFamily: THEME.typography.fontFamily,
};
