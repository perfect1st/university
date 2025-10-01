import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCarAssignments,
  getAllCarAssignmentsWithoutPaginations,
  getAllAvaliableCarAssignments,
  getAllAvaliableDriversAssignments,
  getOneCarAssignment,
  editCarAssignment,
  addCarAssignment,
} from "./thunk";

const initialState = {
  allAssignments: [],
  assignments: [],
  availableCars: [],
  availableDrivers: [],
  assignment: null,

  loading: false,
  error: null,
};

const carAssignmentSlice = createSlice({
  name: "carAssignmentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get all assignments (without pagination)
    builder
      .addCase(getAllCarAssignmentsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allAssignments = [];
      })
      .addCase(getAllCarAssignmentsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allAssignments = action.payload;
      })
      .addCase(getAllCarAssignmentsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allAssignments = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getAllAvaliableCarAssignments.pending, (state) => {
        state.loading = true;
        state.availableCars = [];
      })
      .addCase(getAllAvaliableCarAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCars = action.payload;
      })
      .addCase(getAllAvaliableCarAssignments.rejected, (state, action) => {
        state.loading = false;
        state.availableCars = [];
        state.error = action.error.message;
      });
      // get All Avaliable Drivers Assignments
    builder
      .addCase(getAllAvaliableDriversAssignments.pending, (state) => {
        state.loading = true;
        state.availableDrivers = [];
      })
      .addCase(getAllAvaliableDriversAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDrivers = action.payload;
      })
      .addCase(getAllAvaliableDriversAssignments.rejected, (state, action) => {
        state.loading = false;
        state.availableDrivers = [];
        state.error = action.error.message;
      });

    // Get all assignments (with pagination)
    builder
      .addCase(getAllCarAssignments.pending, (state) => {
        state.loading = true;
        state.assignments = [];
      })
      .addCase(getAllCarAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(getAllCarAssignments.rejected, (state, action) => {
        state.loading = false;
        state.assignments = [];
        state.error = action.error.message;
      });

    // Get one assignment
    builder
      .addCase(getOneCarAssignment.pending, (state) => {
        state.loading = true;
        state.assignment = null;
        state.error = null;
      })
      .addCase(getOneCarAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = action.payload;
        state.error = null;
      })
      .addCase(getOneCarAssignment.rejected, (state, action) => {
        state.loading = false;
        state.assignment = null;
        state.error = action.error.message;
      });

  },
});

export default carAssignmentSlice.reducer;
