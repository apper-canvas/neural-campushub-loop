const customFunctions = {};

export const getRouteConfig = (path) => {
  try {
    import routesData from '@/router/routes.json' with { type: 'json' };
    const routes = routesData;
    
    // Find exact match first
    if (routes[path]) {
      return routes[path];
    }
    
    // Find pattern match with highest specificity
    const patterns = Object.keys(routes);
    const matches = patterns
      .filter(pattern => matchesPattern(path, pattern))
      .map(pattern => ({
        pattern,
        config: routes[pattern],
        specificity: getSpecificity(pattern)
      }))
      .sort((a, b) => b.specificity - a.specificity);
    
    return matches.length > 0 ? matches[0].config : null;
  } catch (error) {
    console.error('Failed to load route config:', error);
    return null;
  }
};

export const verifyRouteAccess = (config, user) => {
  if (!config || !config.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const { when, redirectOnDeny, excludeRedirectQuery = false } = config.allow;
  
  if (!when || !when.conditions) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const { conditions, operator = 'AND' } = when;
  const results = conditions.map(condition => checkCondition(condition, user));
  const failed = results.filter(r => !r.passed).map(r => r.label);
  
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(r => r.passed);
  } else {
    allowed = results.every(r => r.passed);
  }
  
  return {
    allowed,
    redirectTo: allowed ? null : redirectOnDeny || null,
    excludeRedirectQuery: excludeRedirectQuery || false,
    failed
  };
};

const checkCondition = (condition, user) => {
  const { label, rule } = condition;
  
  switch (rule) {
    case 'public':
      return { passed: true, label };
    case 'authenticated':
      return { passed: !!user, label };
    default:
      console.warn(`Unknown rule: ${rule}`);
      return { passed: false, label };
  }
};

export const matchesPattern = (path, pattern) => {
  if (path === pattern) return true;
  
  // Handle wildcard patterns
  if (pattern.endsWith('/**/*')) {
    const basePattern = pattern.slice(0, -5);
    return path.startsWith(basePattern);
  }
  
  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2);
    const pathAfterBase = path.slice(basePattern.length);
    return path.startsWith(basePattern) && !pathAfterBase.includes('/');
  }
  
  // Handle parameter patterns
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  
  if (patternParts.length !== pathParts.length) return false;
  
  return patternParts.every((part, index) => {
    if (part.startsWith(':')) return true;
    return part === pathParts[index];
  });
};

export const getSpecificity = (pattern) => {
  let score = 0;
  
  if (!pattern.includes('*') && !pattern.includes(':')) {
    score += 1000; // Exact match
  }
  
  const parts = pattern.split('/');
  score += parts.length * 10;
  
  parts.forEach(part => {
    if (part.startsWith(':')) {
      score += 1; // Parameter
    } else if (part === '*') {
      score -= 5; // Single wildcard
    } else if (part === '**') {
      score -= 10; // Double wildcard
    } else {
      score += 5; // Literal segment
    }
  });
  
  return score;
};