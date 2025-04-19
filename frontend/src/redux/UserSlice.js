import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SignInStart: (state) => {
      state.loading = true;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = false;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { SignInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
