import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
  getOnePermissionGroups,
  updatePermissionsActions
} from "./thunk";

const initialState = {
  allPermissionGroups: [],
  onePermissionGroups: null,
  loading: false,
  error: null,
};

const permissionGroupSlice = createSlice({
  name: "permissionGroupSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getAllPermissionGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allPermissionGroups = action.payload;
      })
      .addCase(getAllPermissionGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    builder
      // Get one
      .addCase(getOnePermissionGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOnePermissionGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.onePermissionGroups = action.payload;
      })
      .addCase(getOnePermissionGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updatePermissionsActions.fulfilled, (state, action) => {
        const { id, data } = action.payload;
      
        // تأكد إن البيانات تخص نفس المجموعة المعروضة حاليًا
        if (state.onePermissionGroups && state.onePermissionGroups._id === id) {
          state.onePermissionGroups = data;
        }
      
      })

      // Create
      .addCase(createPermissionGroup.fulfilled, (state, action) => {
        state.allPermissionGroups.unshift(action.payload);
      })

      // Update
      .addCase(updatePermissionGroup.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.allPermissionGroups.findIndex((g) => g._id === id);
        if (index !== -1) {
          state.allPermissionGroups[index] = data;
        }
      })

      // Delete
      .addCase(deletePermissionGroup.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.allPermissionGroups = state.allPermissionGroups.filter(
          (group) => group._id !== id
        );
      });


  },
});

export default permissionGroupSlice.reducer;
