import { ThemeProvider } from 'styled-components';
import theme from './@bug-ui/theme';
import MainRouter from './routes/routes';
import GlobalStyles from './styles/globalStyles';

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <MainRouter />
  </ThemeProvider>
);
export default App;
