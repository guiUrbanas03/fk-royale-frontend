import React from 'react';
import {Path, Rect, Svg, SvgProps, TSpan, Text} from 'react-native-svg';

const CardsBackgroundSVG = (props: SvgProps): JSX.Element => (
  <Svg width={461} height={343} fill="none" {...props}>
    <Rect
      width={235}
      height={365}
      x={379.459}
      fill="#343C43"
      rx={5}
      transform="rotate(24 379.459 0)"
    />
    <Path
      fill="#3E735D"
      fillRule="evenodd"
      d="m445.119 226.066-3.319-72.427-58.74 44.796h-.001l3.32 72.426 58.74-44.795z"
      clipRule="evenodd"
    />
    <Text
      fill="#3E735D"
      fontFamily="Roboto"
      fontSize={40}
      fontWeight="bold"
      letterSpacing="0em"
      transform="rotate(24 142.092 931.653)">
      <TSpan x={0} y={37.172}>
        {'5'}
      </TSpan>
    </Text>
    <Rect
      width={235}
      height={365}
      fill="#343C43"
      rx={5}
      transform="scale(-1 1) rotate(24 -41.342 -194.497)"
    />
    <Path
      fill="#3E735D"
      fillRule="evenodd"
      d="m17.023 226.066 3.319-72.427 58.74 44.796-3.319 72.426-58.74-44.795z"
      clipRule="evenodd"
    />
    <Text
      fill="#3E735D"
      fontFamily="Roboto"
      fontSize={40}
      fontWeight="bold"
      letterSpacing="0em"
      transform="rotate(-24.88 98.301 -96.333)">
      <TSpan x={0} y={37.172}>
        {'5'}
      </TSpan>
    </Text>
    <Rect width={235} height={365} x={113} fill="#343C43" rx={5} />
    <Path
      fill="#F2577C"
      fillRule="evenodd"
      d="M264.933 179.815 232.442 115 197 179.815l32.491 64.815 35.442-64.815z"
      clipRule="evenodd"
    />
    <Text
      fill="#F2577C"
      fontFamily="Roboto"
      fontSize={40}
      fontWeight="bold"
      letterSpacing="0em">
      <TSpan x={133} y={53.172}>
        {'5'}
      </TSpan>
    </Text>
  </Svg>
);
export {CardsBackgroundSVG};
