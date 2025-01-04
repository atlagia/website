export function getTheme(): string {
    return import.meta.env.THEME || 'default';
}
