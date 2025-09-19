import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loading from '../../components/ui/Loading';

const StudentHomePage = lazy(() => import('./pages/StudentHomePage'));

const StudentRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
