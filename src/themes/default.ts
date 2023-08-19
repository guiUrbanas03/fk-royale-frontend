import {MD3LightTheme} from 'react-native-paper';
import {GeneratedColors, generatedColors} from './colors';

const theme = Object.freeze({
  ...MD3LightTheme,
  colors: generatedColors as GeneratedColors,
});

type AppTheme = typeof theme;

export {theme, type AppTheme};
