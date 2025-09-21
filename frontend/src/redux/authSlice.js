import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { profileService } from '@services/api'

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()

      // Check if we have a token
      if (!auth.userToken) {
        throw new Error('No authentication token found')
      }

      const response = await profileService.getMyProfile()

      if (response?.success && response?.data) {
        return response.data
      } else {
        throw new Error(response?.message || 'Failed to fetch profile')
      }
    } catch (error) {
      const message = error.message || 'Failed to fetch user profile'
      console.error('Profile fetch error:', error)
      return rejectWithValue(message)
    }
  }
)

// Async thunk for logout (if you need server-side logout)
export const performLogout = createAsyncThunk(
  'auth/performLogout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call logout endpoint
      // await authService.logout()

      // Clear localStorage regardless of API success
      localStorage.removeItem('userToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('user')

      return true
    } catch (error) {
      // Still clear localStorage even if API fails
      localStorage.removeItem('userToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('user')

      const message = error.message || 'Logout completed with errors'
      console.warn('Logout API error (continuing anyway):', error)
      return rejectWithValue(message)
    }
  }
)

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error)
      return null
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error)
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
    }
  }
}

// Safe JSON parsing
const safeJSONParse = (value, fallback = null) => {
  try {
    return value && value !== 'undefined' ? JSON.parse(value) : fallback
  } catch (error) {
    console.warn('Failed to parse JSON:', error)
    return fallback
  }
}

// Initial state setup
const getInitialState = () => {
  const userToken = safeLocalStorage.getItem('userToken')
  const userType = safeLocalStorage.getItem('userType')
  const userString = safeLocalStorage.getItem('user')
  const parsedUser = safeJSONParse(userString)

  return {
    userToken,
    userType,
    user: parsedUser,
    isAuthenticated: !!userToken,
    loading: false,
    error: null,
    profileLoading: false,
    profileError: null,
    // Track last profile fetch to avoid unnecessary calls
    lastProfileFetch: null,
  }
}

const initialState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success action
    loginSuccess: (state, action) => {
      const { userToken, userType, user } = action.payload

      state.userToken = userToken
      state.userType = userType
      state.user = user || null
      state.isAuthenticated = true
      state.error = null
      state.profileError = null

      // Persist to localStorage
      safeLocalStorage.setItem('userToken', userToken)
      safeLocalStorage.setItem('userType', userType)
      if (user) {
        safeLocalStorage.setItem('user', JSON.stringify(user))
      }
    },

    // Logout action
    logout: (state) => {
      state.userToken = null
      state.userType = null
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.profileLoading = false
      state.profileError = null
      state.lastProfileFetch = null

      // Clear localStorage
      safeLocalStorage.removeItem('userToken')
      safeLocalStorage.removeItem('userType')
      safeLocalStorage.removeItem('user')
    },

    // Clear errors
    clearError: (state) => {
      state.error = null
      state.profileError = null
    },

    // Update user profile manually
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      safeLocalStorage.setItem('user', JSON.stringify(state.user))
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true
        state.profileError = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.profileLoading = false
        state.profileError = null
        state.lastProfileFetch = Date.now()

        // Persist updated user to localStorage
        if (action.payload) {
          safeLocalStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false
        state.profileError = action.payload || 'Failed to fetch profile'

        // If profile fetch fails due to auth issues, logout
        if (action.payload?.includes('authentication') || action.payload?.includes('token')) {
          state.userToken = null
          state.userType = null
          state.user = null
          state.isAuthenticated = false

          safeLocalStorage.removeItem('userToken')
          safeLocalStorage.removeItem('userType')
          safeLocalStorage.removeItem('user')
        }
      })

      // Perform logout
      .addCase(performLogout.pending, (state) => {
        state.loading = true
      })
      .addCase(performLogout.fulfilled, (state) => {
        // Reset to initial state
        Object.assign(state, getInitialState())
        state.loading = false
      })
      .addCase(performLogout.rejected, (state) => {
        // Still reset state even if logout API failed
        Object.assign(state, getInitialState())
        state.loading = false
      })
  },
})

export const {
  loginSuccess,
  logout,
  clearError,
  updateUser,
  setLoading
} = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserType = (state) => state.auth.userType
export const selectAuthLoading = (state) => state.auth.loading || state.auth.profileLoading

export default authSlice.reducer
