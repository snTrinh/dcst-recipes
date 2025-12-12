
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setRecipes } from "@/lib/slices/recipesSlice";
import { gql } from "@apollo/client";
import { createApolloClient } from "@/lib/apolloClient";
import { useEffect } from "react";
import { Recipe } from "@/app/types/recipe";

const GET_RECIPES = gql`
  query GetRecipes($title: String!) {
    searchRecipes(title: $title) {
      id
      title
      instructions
      cuisine
      inspoLink
      ingredients {
        section
        items
      }
    }
  }
`;

export function useFetchRecipes(search: string, token?: string) {
  const dispatch = useAppDispatch();
  const { recipes, lastFetched } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) return;

      // Cache: only fetch if never fetched or older than 5 mins
      const now = Date.now();
      if (lastFetched && now - lastFetched < 5 * 60 * 1000) return;

      const client = createApolloClient(token);
      try {
        const { data } = await client.query<{ searchRecipes: Recipe[] }>({
          query: GET_RECIPES,
          variables: { title: search },
          fetchPolicy: "network-only",
        });
        dispatch(setRecipes(data.searchRecipes));
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };

    fetchRecipes();
  }, [dispatch, search, token, lastFetched]);

  return recipes;
}
