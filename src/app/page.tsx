"use client";
import { useAppSelector } from "@/lib/hooks";
import { useFetchRecipes } from "@/lib/hooks/useFetchRecipes";
import NavBar from "@/app/components/navigation/NavBar";
import RecipeCard from "./components/recipeCard/RecipeCard";
import { useState } from "react";

export default function HomePage() {
  const token = useAppSelector((state) => state.auth.token);
  const search = useAppSelector((state) => state.search.query);

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  const recipes = useFetchRecipes(search, token, refreshKey);

  return (
    <div>
      <NavBar onRecipesUpdated={refresh}/>

      <div className="p-4 max-w-2xl mx-auto space-y-4 mt-4">
        {recipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          recipes.map((r) => (
            <RecipeCard 
              key={r.id} 
              recipe={r} 
              token={token} 
              onUpdated={refresh}
            />
          ))
        )}
      </div>
    </div>
  );
}
