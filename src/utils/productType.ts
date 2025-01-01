export function getProductType(title: string, projectType: string = 'default'): string | null {
  const title_lower = title.toLowerCase();
  
  // First priority: Check PROJECT_TYPE
  if (projectType === 'repshoes') {
    return 'shoes';
  }
  
  // Second priority: Check title for shoe-related terms
  if (title_lower.includes('shoe') ||
      title_lower.includes('sneaker') ||
      title_lower.includes('trainer') ||
      title_lower.includes('footwear') ||
      title_lower.includes('boot') ||
      title_lower.includes('sandal') ||
      title_lower.includes('slipper') ||
      title_lower.includes('loafer')) {
    return 'shoes';
  }
  
  // Third priority: Check for clothing terms
  if (title_lower.includes('shirt') || 
      title_lower.includes('hoodie') || 
      title_lower.includes('jacket') || 
      title_lower.includes('sweater') ||
      title_lower.includes('vest')) {
    return 'clothing';
  }
  
  return projectType === 'shoes' ? 'shoes' : null;
} 