import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes/AppRoutes';

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
