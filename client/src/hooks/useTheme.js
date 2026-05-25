// Theme hook: exposes the shared light and dark mode state.
// It gives components access to the current theme setting.
// Use this file when a component needs theme toggles.
import { useTheme as useThemeContext } from '../state/ThemeContext';

export const useTheme = useThemeContext;
