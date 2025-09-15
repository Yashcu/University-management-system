import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage if it exists
const initialState = {
  userToken: localStorage.getItem('userToken') || null,
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: !!localStorage.getItem('userToken'),
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userToken = action.payload.userToken;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
      localStorage.setItem('userToken', action.payload.userToken);
      localStorage.setItem('userType', action.payload.userType);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.userToken = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
