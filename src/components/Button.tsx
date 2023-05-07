import { Button as PaperButton, ButtonProps } from 'react-native-paper';

const Button = (props: ButtonProps) => {
  return (
    <PaperButton
        theme={{ roundness: 1 }}
        {...props}
    />
  );
}

export { Button }