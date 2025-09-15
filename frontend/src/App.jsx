import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import mystore from './redux/store';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/ui/Loading';

const Login = lazy(() => import('./Screens/Login'));
const ForgetPassword = lazy(() => import('./Screens/ForgetPassword'));
const UpdatePassword = lazy(() => import('./Screens/UpdatePassword'));
const StudentHome = lazy(() => import('./Screens/Student/Home'));
const FacultyHome = lazy(() => import('./Screens/Faculty/Home'));
const AdminHome = lazy(() => import('./Screens/Admin/Home'));

const App = () => {
  return (
    <Provider store={mystore}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/:type/update-password/:resetId"
              element={<UpdatePassword />}
            />

            {/* Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty"
              element={
                <ProtectedRoute>
                  <FacultyHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
