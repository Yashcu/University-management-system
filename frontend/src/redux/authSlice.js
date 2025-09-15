import { createSlice } from '@reduxjs/toolkit';

let parsedUser = null;
try {
  const userString = localStorage.getItem('user');
  if (userString && userString !== 'undefined') {
    parsedUser = JSON.parse(userString);
  }
} catch (error) {
  console.error('Could not parse user from localStorage', error);
  parsedUser = null;
}

const initialState = {
  userToken: localStorage.getItem('userToken') || null,
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: !!localStorage.getItem('userToken'),
  user: parsedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userToken = action.payload.userToken;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
      state.user = action.payload.user; // Save user data to state
      localStorage.setItem('userToken', action.payload.userToken);
      localStorage.setItem('userType', action.payload.userType);
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
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
