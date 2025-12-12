import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "@/lib/slices/recipesSlice";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      ingredients {
        section
        items
      }
      instructions
      cuisine
      inspoLink
    }
  }
`;

const SEARCH_RECIPES = gql`
  query SearchRecipes($title: String!) {
    searchRecipes(title: $title) {
      id
      title
      ingredients {
        section
        items
      }
      instructions
      cuisine
      inspoLink
    }
  }
`;

export function useFetchRecipes(search: string, token?: string, refreshKey = 0) {
  const dispatch = useDispatch();
  const recipes = useSelector((state: any) => state.recipes.recipes);

  useEffect(() => {
    if (!token) return;

    const fetchRecipes = async () => {
      const client = createApolloClient(token);

      const { data } =
        search && search.trim() !== ""
          ? await client.query({
              query: SEARCH_RECIPES,
              variables: { title: search },
              fetchPolicy: "no-cache",
            })
          : await client.query({
              query: GET_RECIPES,
              fetchPolicy: "no-cache",
            });

      dispatch(setRecipes(data.searchRecipes || data.recipes));
    };

    fetchRecipes();
  }, [token, search, refreshKey]);

  return recipes;
}
