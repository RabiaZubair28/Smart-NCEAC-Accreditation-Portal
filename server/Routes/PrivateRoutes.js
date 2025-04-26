import { Route, Navigate } from 'react-router-dom';

// This component checks if the user is authenticated
const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      element={token ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
