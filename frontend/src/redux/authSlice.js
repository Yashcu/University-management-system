import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/profileService';

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await profileService.getMyProfile();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
  loading: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
