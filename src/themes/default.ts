import { MD3LightTheme, useTheme } from 'react-native-paper';
import { GeneratedColors, generatedColors } from './colors';

const theme = Object.freeze({
    ...MD3LightTheme,
    colors: generatedColors as GeneratedColors
})

type AppTheme = typeof theme;

const useAppTheme = useTheme<AppTheme>();

export { theme, useAppTheme, type AppTheme };