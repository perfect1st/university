import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers, getAllUsersWithoutPaginations, getOneUser,login } from "./thunk";

const initialState = {
  users: [],
  allUsers: [],
  loginResponse:null,
  loading: false,
  error: null,
  oneUser: null
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allUsers = [];
      })
      .addCase(getAllUsersWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(getAllUsersWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allUsers = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.users = [];
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getOneUser.pending, (state) => {
        state.loading = true;
        state.oneUser = null;
      })
      .addCase(getOneUser.fulfilled, (state, action) => {
        state.loading = false;
        state.oneUser = action.payload;
      })
      .addCase(getOneUser.rejected, (state, action) => {
        state.loading = false;
        state.oneUser = null;
        state.error = action.error.message;
      });
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginResponse = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.loginResponse = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.loginResponse = null;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
