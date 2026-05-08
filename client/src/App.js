import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

const RootRedirect = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="screen-center">
        <Spinner label="Preparing your workspace" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ToastContainer position="top-right" theme="dark" autoClose={2800} pauseOnHover newestOnTop />
  </>
);

export default App;
