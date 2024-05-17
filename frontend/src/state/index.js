import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem('currentMode'),
  userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
}

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("currentMode", state.mode);
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;