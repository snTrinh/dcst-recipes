import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cuisine } from "@prisma/client";


interface SearchState {
  query: string;
  cuisine: Cuisine | "ALL"; 
}

const initialState: SearchState = {
  query: "",
  cuisine: "ALL",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setCuisine: (state, action: PayloadAction<Cuisine | "ALL">) => {
      state.cuisine = action.payload;
    },
    clearFilters: (state) => {
      state.query = "";
      state.cuisine = "ALL";
    },
  },
});

export const { setQuery, setCuisine, clearFilters } = searchSlice.actions;
export default searchSlice.reducer;
