"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { gql } from "@apollo/client";
import { createApolloClient } from "@/lib/apolloClient";
import { Cuisine, Recipe } from "@prisma/client";
import { useAppSelector } from "@/lib/hooks";

interface IngredientSection {
  name: string;
  items: string; 
}

interface RecipeDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;       
  recipe?: Recipe;           
  token?: string;
}


const ADD_RECIPE = gql`
  mutation AddRecipe($input: RecipeInput!) {
    addRecipe(input: $input) {
      id
      title
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
    }
  }
`;

export default function RecipeDialog({ open, onClose, onSaved, recipe }: RecipeDialogProps) {
  const [title, setTitle] = useState("");
  const [ingredientsSections, setIngredientsSections] = useState<IngredientSection[]>([
    { name: "Main", items: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine>(Cuisine.VIETNAMESE);
  const [inspoLink, setInspoLink] = useState("");

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setInstructions(recipe.instructions);
      setCuisine(recipe.cuisine);
      setInspoLink(recipe.inspoLink || "");

      if (Array.isArray(recipe.ingredients) && recipe.ingredients.length) {
        setIngredientsSections(
          recipe.ingredients.map((section: any) => ({
            name: section.section,
            items: section.items.join(", "),
          }))
        );
      } else {
        setIngredientsSections([{ name: "Main", items: "" }]);
      }
    } else {
      setTitle("");
      setIngredientsSections([{ name: "Main", items: "" }]);
      setInstructions("");
      setCuisine(Cuisine.VIETNAMESE);
      setInspoLink("");
    }
  }, [recipe, open]);

  const handleAddSection = () => {
    setIngredientsSections([...ingredientsSections, { name: "", items: "" }]);
  };

  const handleRemoveSection = (index: number) => {
    setIngredientsSections(ingredientsSections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: "name" | "items", value: string) => {
    const updated = [...ingredientsSections];
    updated[index][field] = value;
    setIngredientsSections(updated);
  };

  const handleSave = async () => {
    if (!token) return alert("Not authenticated");

    const client = createApolloClient(token);

    const input = {
      title,
      ingredients: ingredientsSections.map((section) => ({
        section: section.name,
        items: section.items
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      })),
      instructions,
      cuisine,
      inspoLink,
    };

    try {
      if (recipe) {
        await client.mutate({
          mutation: UPDATE_RECIPE,
          variables: { id: recipe.id, input },
        });
      } else {
        await client.mutate({ mutation: ADD_RECIPE, variables: { input } });
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{recipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

        {ingredientsSections.map((section, index) => (
          <Box key={index} sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                label="Section Name"
                value={section.name}
                onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <IconButton
                onClick={() => handleRemoveSection(index)}
                disabled={ingredientsSections.length === 1}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
            <TextField
              label="Ingredients (comma separated)"
              value={section.items}
              onChange={(e) => handleSectionChange(index, "items", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddSection}>
          Add Section
        </Button>

        <TextField
          label="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select
            labelId="cuisine-label"
            value={cuisine}
            label="Cuisine"
            onChange={(e) => setCuisine(e.target.value as Cuisine)}
          >
            {Object.values(Cuisine).map((c) => (
              <MenuItem key={c} value={c}>
                {c[0] + c.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Inspiration Link" value={inspoLink} onChange={(e) => setInspoLink(e.target.value)} fullWidth />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {recipe ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
