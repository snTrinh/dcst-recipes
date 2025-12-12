"use client";

import { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoginDialog from "../loginDialog/LoginDialog";
import RecipeDialog from "../recipeDialog/RecipeDialog";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setAuth } from "@/lib/slices/authSlice";
import SearchBar from "../searchBar/SearchBar";

interface NavBarProps {
  onRecipesUpdated?: () => void;
}

export default function NavBar({ onRecipesUpdated }: NavBarProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { token, email } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedToken && storedEmail) {
      dispatch(setAuth({ token: storedToken, email: storedEmail }));
    }
  }, [dispatch]);

  const handleLoginSuccess = (email: string, token: string) => {
    dispatch(setAuth({ token, email }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>My Recipes</Typography>

          <SearchBar/>


          {token && (
            <Button color="secondary" variant="contained" onClick={() => setDialogOpen(true)} sx={{ ml: 2 }}>
              Add Recipe
            </Button>
          )}

          <Button color="secondary" variant="contained" onClick={() => setLoginOpen(true)} sx={{ ml: 2 }}>
            {email ? "Logged in" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>

      <RecipeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdded={onRecipesUpdated} />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </Box>
  );
}
