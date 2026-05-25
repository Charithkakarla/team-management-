import { BrowserRouter } from 'react-router-dom';
// App root: wires providers and the route tree for the client.
// It sets up theme, auth, toast, and data providers.
// Use this file to see how the whole client boots.
import { ThemeProvider } from './state/ThemeContext';
import { AuthProvider } from './state/AuthContext';
import { ToastProvider } from './state/ToastContext';
import { DataProvider } from './state/DataContext';
import { AppRoutes } from './navigation/AppRoutes';

const Providers = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <DataProvider>{children}</DataProvider>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);

export const App = () => (
  <BrowserRouter>
    <Providers>
      <AppRoutes />
    </Providers>
  </BrowserRouter>
);
