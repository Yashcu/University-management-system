import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loading from '../../components/ui/Loading';

const FacultyHomePage = lazy(() => import('./pages/FacultyHomePage'));

const FacultyRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <FacultyHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default FacultyRoutes;
