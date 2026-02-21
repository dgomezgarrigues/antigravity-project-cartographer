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
        edgeCircular: '#FF3B30',
        xraySafe: '#10b981', // green-500
        xrayLow: '#84cc16', // lime-500
        xrayWarn: '#eab308', // yellow-500
        xrayHigh: '#f97316', // orange-500
        xrayDanger: '#ef4444', // red-500
        xrayCritical: '#9f1239' // rose-800
    },
    typography: {
        fontFamily: '"Inter", "Outfit", sans-serif',
    }
};

export const getComplexityColor = (complexity) => {
    if (!complexity) return THEME.colors.xraySafe;
    const { cyclomatic = 1, cognitive = 0, bigO = 'O(1)' } = complexity;

    let score = 0;

    // Cyclomatic weight
    if (cyclomatic > 20) score += 50;
    else if (cyclomatic > 11) score += 30;
    else if (cyclomatic > 5) score += 15;
    else if (cyclomatic > 2) score += 5;

    // Cognitive weight
    if (cognitive > 25) score += 50;
    else if (cognitive > 15) score += 30;
    else if (cognitive > 8) score += 15;
    else if (cognitive > 3) score += 5;

    // BigO weight
    if (bigO === 'O(n^3)' || bigO === 'O(2^n)' || bigO === 'O(n!)') score += 50;
    else if (bigO === 'O(n^2)') score += 30;
    else if (bigO === 'O(nlogn)') score += 15;
    else if (bigO === 'O(n)') score += 5;

    if (score >= 60) return THEME.colors.xrayCritical;
    if (score >= 40) return THEME.colors.xrayDanger;
    if (score >= 25) return THEME.colors.xrayHigh;
    if (score >= 10) return THEME.colors.xrayWarn;
    if (score >= 5) return THEME.colors.xrayLow;
    return THEME.colors.xraySafe;
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
