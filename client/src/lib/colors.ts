export const categoryColors = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#be185d', // Pink
  '#4f46e5', // Indigo
  '#059669', // Emerald
];

export function getNextAvailableColor(usedColors: string[]): string {
  return categoryColors.find(color => !usedColors.includes(color)) || categoryColors[0];
}
