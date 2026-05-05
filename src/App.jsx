import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPage from './pages/auth/ForgotPage';
import AppShell from './components/layout/AppShell';
import Toast from './components/ui/Toast';

function Router() {
  const { currentPage } = useApp();
  if (currentPage === 'register') return <RegisterPage />;
  if (currentPage === 'forgot') return <ForgotPage />;
  if (currentPage === 'login') return <LoginPage />;
  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <Toast />
    </AppProvider>
  );
}
