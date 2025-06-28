import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  role: null,
  subscription: null,
  isSubscribed: false, // <-- Needed for easy access
  timestamp: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("Reducer payload:", action.payload);
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.subscription = action.payload.subscription;
      state.isSubscribed = action.payload.isSubscribed || false; // <-- derived from backend or login logic
      state.timestamp = Date.now();
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.subscription = null;
      state.isSubscribed = false;
      state.timestamp = null;
    },

    updateSubscription: (state, action) => {
      state.subscription = action.payload;
      state.isSubscribed = new Date(action.payload.expiresAt) > new Date();
    },
  },
});

export const { loginSuccess, logout, updateSubscription } = authSlice.actions;
export default authSlice.reducer;
