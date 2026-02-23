export const THEME = {
    colors: {
        level0: '#FFD700', // Root
        level1: '#007AFF', // Layouts
        level2: '#34C759', // Atoms/Molecules
        level3: '#248A3D', // Deep Atoms (Dark Green)
        level4: '#145224', // Core utils (Very Dark Green)
        function: '#AF52DE', // Logic functions
        text: '#ffffff',
        background: '#1a1a1a',
        edgeDefault: '#444444',
        edgeCircular: '#FF3B30'
    },
    typography: {
        fontFamily: '"Inter", "Outfit", sans-serif',
    }
};

export const getNodeColor = (level, type, isCircular) => {
    if (isCircular) return THEME.colors.edgeCircular;

    if (type === 'function') {
        return THEME.colors.function;
    }

    switch (level) {
        case 0: return THEME.colors.level0;
        case 1: return THEME.colors.level1;
        case 2: return THEME.colors.level2;
        case 3: return THEME.colors.level3;
        default: return THEME.colors.level4;
    }
};
