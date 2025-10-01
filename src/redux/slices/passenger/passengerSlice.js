import { createSlice } from "@reduxjs/toolkit";
import { getAllPassengers, getOnePassenger } from "./thunk"; // Import the async thunks

const initialState = {
  passengers: [],
  passenger: null ,

  loading: false,
  error: null,
};

const passengerSlice = createSlice({
  name: "passengerSlice",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPassengers.pending, (state) => {
        state.loading = true;
        state.passengers = []
      })
      .addCase(getAllPassengers.fulfilled, (state, action) => {
        state.loading = false;
        state.passengers = action.payload
      })
      .addCase(getAllPassengers.rejected, (state, action) => {
        state.loading = false;
        state.passengers = []
        state.error = action.error.message;
      });
    builder
      .addCase(getOnePassenger.pending, (state) => {
        state.loading = true;
        state.passenger = null
        state.error = null
      })
      .addCase(getOnePassenger.fulfilled, (state, action) => {
        state.loading = false;
        state.passenger = action.payload
        state.error = null
      })
      .addCase(getOnePassenger.rejected, (state, action) => {
        state.loading = false;
        state.passenger = null
        state.error = action.error.message;
      });




  },
  

});

export default passengerSlice.reducer;
