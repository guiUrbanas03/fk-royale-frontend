import { MD3LightTheme, useTheme } from 'react-native-paper';

const theme = Object.freeze({
    ...MD3LightTheme,
})

type AppTheme = typeof theme;

const useAppTheme = useTheme<AppTheme>();

export { theme, useAppTheme, type AppTheme };