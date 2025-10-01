import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersLookups , getAllTripsLookups} from "./thunk"; // Import the async thunks

const initialState = {
  usersLookups: [],
  tripsLookups: null ,

  loading: false,
  error: null,
};

const lookupsSlice = createSlice({
  name: "lookupsSlice",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersLookups.pending, (state) => {
        state.loading = true;
        state.usersLookups = []
      })
      .addCase(getAllUsersLookups.fulfilled, (state, action) => {
        state.loading = false;
        state.usersLookups = action.payload
      })
      .addCase(getAllUsersLookups.rejected, (state, action) => {
        state.loading = false;
        state.usersLookups = []
        state.error = action.error.message;
      });
    builder
      .addCase(getAllTripsLookups.pending, (state) => {
        state.loading = true;
        state.tripsLookups = []
        state.error = null
      })
      .addCase(getAllTripsLookups.fulfilled, (state, action) => {
        state.loading = false;
        state.tripsLookups = action.payload
        state.error = null
      })
      .addCase(getAllTripsLookups.rejected, (state, action) => {
        state.loading = false;
        state.tripsLookups = []
        state.error = action.error.message;
      });




  },
  

});

export default lookupsSlice.reducer;
