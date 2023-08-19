import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type BaseLayoutProps = {
  children: React.ReactNode;
};

const BaseLayout = ({children}: BaseLayoutProps): JSX.Element => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.linearGradient}>
      <SafeAreaView>
        <ScrollView
          style={{padding: 20}}
          contentInsetAdjustmentBehavior="automatic">
          {children}
        </ScrollView>
      </SafeAreaView>
      {/* <View style={styles.cardsBackground}>
            <CardsBackgroundSVG />
        </View> */}
    </LinearGradient>
  );
};

type Styles = {
  linearGradient: ViewStyle;
  cardsBackground: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  linearGradient: {
    flex: 1,
  },
  cardsBackground: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.4,
    zIndex: 0,
  },
});

export {BaseLayout};
