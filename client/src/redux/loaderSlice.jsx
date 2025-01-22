import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: 'loader',
    initialState: { loader: false }, // Initial state should be an object
    reducers: {
        showLoader: (state) => {
            state.loader = true;
        },
        hideLoader: (state) => {
            state.loader = false;
        },
    },
});

// Export the actions
export const { showLoader, hideLoader } = loaderSlice.actions;

// Export the reducer
export default loaderSlice.reducer;
