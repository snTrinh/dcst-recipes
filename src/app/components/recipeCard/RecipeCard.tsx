"use client";

import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { Recipe } from "@/app/types/recipe";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { capitalize } from "@/app/utils/stringUtils";
import RecipeDialog from "../recipeDialog/RecipeDialog";

interface RecipeCardProps {
  recipe: Recipe;
  onUpdated: () => void;
  token?: string;
}

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`;

export default function RecipeCard({ recipe, onUpdated, token }: RecipeCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!token) return alert("You must be logged in to delete");

    const client = createApolloClient(token);
    if (!confirm(`Are you sure you want to delete "${recipe.title}"?`)) return;

    try {
      await client.mutate({ mutation: DELETE_RECIPE, variables: { id: recipe.id } });
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe");
    }
  };

  return (
    <div className="notebook-card border border-gray-300 rounded-lg p-4 relative bg-white overflow-hidden">
      <div className="absolute top-0 left-6 bottom-0 w-[2px] bg-red-500"></div>

      {token && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <IconButton size="small" onClick={() => setEditOpen(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDelete}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      <h2 className="text-xl font-semibold ml-10">{recipe.title}</h2>

      <div className="ml-10 mt-2 space-y-2">
        <strong>Ingredients:</strong>
        {recipe.ingredients.map((section: any, idx: number) => (
          <div key={idx} className="ml-4">
            <p className="font-semibold">{section.section}</p>
            <ul className="ml-4 list-none space-y-1">
              {Array.isArray(section.items) &&
               section.items.flatMap((item: string) =>
  item.split(/[\n,]+/).map((subItem) => subItem.trim()).filter(Boolean)
).map((subItem, i) => (
  <li key={i} className="flex items-center space-x-2">
    <label className="flex items-center space-x-2 w-full">
      <input type="checkbox" className="form-checkbox h-4 w-4 text-green-500" />
      <span>{subItem}</span>
    </label>
  </li>
))

                
                }
            </ul>
          </div>
        ))}
      </div>

      <p className="ml-10 mt-2">
  <strong>Instructions:</strong>
  <span className="block whitespace-pre-line">{recipe.instructions}</span>
</p>
      <p className="ml-10 mt-2"><strong>Cuisine:</strong> {capitalize(recipe.cuisine)}</p>
      <p className="ml-10 mt-2"><strong>Inspo:</strong> {recipe.inspoLink}</p>

      <RecipeDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        recipe={recipe}      
        onSaved={onUpdated}   
      />
    </div>
  );
}
