import { DefaultTheme } from 'styled-components';

const colors = {
  primary: '#586FFA',
  secondary: '#8B9AF4',
  light: '#A5B1FC',
  accent: '#E5E9FF',
  offwhite: '#EAEEFF',
  white: '#FBFBFF',
  black: '#3D3C47',
  gray: '#A5ADC6',
  green: '#25B93E',
  greenlight: '#CEFDD7',
  red: '#FF5555',
  redlight: '#FFDADA',
  cardBg: '#F7F8FF',
};
const font = {
  primary: '"Product Sans Regular", -apple-system',
  primaryBold: '"Product Sans Bold", -apple-system',
  primaryItalic: '"Product Sans Italic", -apple-system',
  primaryMedium: '"Product Sans Medium Regular", -apple-system',
  primaryLight: '"Product Sans Light Regular", -apple-system',
};

const size = {
  mobileS: '320px',
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  desktopL: '1440px',
};

const theme: DefaultTheme = {
  colors,
  font,
  border: `2px solid ${colors.offwhite}`,
  space: {
    none: 0,
    small: 5,
    medium: 10,
    large: 15,
    xlarge: 30,
    huge: 40,
  },
  media: {
    mobileS: `max-width: ${size.mobileS}`,
    mobile: `max-width: ${size.mobile}`,
    tablet: `max-width: ${size.tablet}`,
    minTablet: `min-width: ${size.tablet}`,
    desktop: `max-width: ${size.desktop}`,
    desktopL: `max-width: ${size.desktopL}`,
  },
};

export default theme;
