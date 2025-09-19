import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loading from '../../components/ui/Loading';

const AdminHomePage = lazy(() => import('./pages/AdminHomePage'));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
