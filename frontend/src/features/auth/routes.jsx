import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '../../components/ui/Loading';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'));
const UpdatePasswordPage = lazy(() => import('./pages/UpdatePasswordPage'));

const AuthRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route
          path="/:type/update-password/:resetId"
          element={<UpdatePasswordPage />}
        />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
