const generatedColors = {
      primary: "#3E755E",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(135, 248, 201)",
      onPrimaryContainer: "rgb(0, 33, 21)",
      secondary: "#221D2E",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "rgb(233, 221, 255)",
      onSecondaryContainer: "rgb(35, 0, 92)",
      tertiary: "rgb(0, 108, 75)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(137, 248, 198)",
      onTertiaryContainer: "rgb(0, 33, 20)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "rgb(251, 253, 249)",
      onBackground: "rgb(25, 28, 26)",
      surface: "rgb(251, 253, 249)",
      onSurface: "rgb(25, 28, 26)",
      surfaceVariant: "rgb(219, 229, 222)",
      onSurfaceVariant: "rgb(64, 73, 68)",
      outline: "rgb(112, 121, 115)",
      outlineVariant: "rgb(191, 201, 194)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(46, 49, 47)",
      inverseOnSurface: "rgb(239, 241, 237)",
      inversePrimary: "rgb(106, 219, 174)",
      elevation: {
        level0: "transparent",
        level1: "rgb(238, 246, 240)",
        level2: "rgb(231, 241, 235)",
        level3: "rgb(223, 237, 230)",
        level4: "rgb(221, 236, 229)",
        level5: "rgb(216, 233, 225)"
      },
      surfaceDisabled: "rgba(25, 28, 26, 0.12)",
      onSurfaceDisabled: "rgba(25, 28, 26, 0.38)",
      backdrop: "rgba(42, 50, 46, 0.4)",
      white: "#FFFFFF"
  }

type GeneratedColors = typeof generatedColors;

export { generatedColors, type GeneratedColors }