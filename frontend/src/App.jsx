import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import mystore from './redux/store';
import { setupInterceptors } from './lib/AxiosWrapper';
import 'react-day-picker/dist/style.css';

import AuthRoutes from './features/auth/routes';
import AdminRoutes from './features/admin/routes';
import FacultyRoutes from './features/faculty/routes';
import StudentRoutes from './features/student/routes';

setupInterceptors(mystore);

const App = () => {
  return (
    <Provider store={mystore}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<AuthRoutes />} />

          {/* Protected Routes */}
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/faculty/*" element={<FacultyRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
