import { createSlice } from "@reduxjs/toolkit";
import { signUp, login,logout,refreshToken,checkAuth } from "../actions/userAction";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    checkingAuth: true,
    error: "",
  },
  reducers: {
    // Define your reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = [action.payload];
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(refreshToken.pending, (state) => {
        state.checkingAuth = true; // Start the refresh process
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token; // Update token
        state.checkingAuth = false; // End the refresh process
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null; // Log out user on failure
        state.checkingAuth = false;
        state.error = action.payload; // Capture error
      })
       // Logout
      builder.addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      builder.addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })
       // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.checkingAuth = true;
    })
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload;
      state.checkingAuth = false;
    })
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null;
      state.checkingAuth = false;
    })
  },
});

export default userSlice.reducer;
