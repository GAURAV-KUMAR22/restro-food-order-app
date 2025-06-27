import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null, // OR {} — depends on your app
  role: null,
  subscribe: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("Reducer payload:", action.payload);
      state.token = action.payload.token;
      state.user = action.payload.user; // <-- user object stored here
      state.role = action.payload.role;
      state.timestamp = Date.now(); // 🕒 Save login time
    },

    subscribe: (state, action) => {
      [...state, (subscribe = true)];
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null; // <-- fixed typo
      state.timestamp = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
