import { ThemeProvider } from 'styled-components';
import { Provider as StoreProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import theme from '@bug-ui/config-ui/theme';
import '@bug-ui/config-ui/fontLib';
import MainRouter from './routes/routes';
import GlobalStyles from './styles/globalStyles';
import store, { history } from 'redux/configStore';

const App = () => (
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <GlobalStyles />
        <MainRouter />
      </ConnectedRouter>
    </ThemeProvider>
  </StoreProvider>
);
export default App;
