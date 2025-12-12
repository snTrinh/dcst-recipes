
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "@/app/types/recipe";

interface RecipesState {
  recipes: Recipe[];
  lastFetched: number | null; // timestamp
}

const initialState: RecipesState = {
  recipes: [],
  lastFetched: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
      state.lastFetched = Date.now();
    },
    clearRecipes: (state) => {
      state.recipes = [];
      state.lastFetched = null;
    },
  },
});

export const { setRecipes, clearRecipes } = recipesSlice.actions;
export default recipesSlice.reducer;
