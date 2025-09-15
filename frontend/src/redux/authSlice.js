import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage if it exists
const initialState = {
  userToken: localStorage.getItem('userToken') || null,
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: !!localStorage.getItem('userToken'),
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
    },
    logout: (state) => {
      state.userToken = null;
      state.userType = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userType');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
