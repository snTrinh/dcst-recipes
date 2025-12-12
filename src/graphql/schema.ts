import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum Cuisine {
  CHINESE
  INDIAN
  ITALIAN
  MEXICAN
  VIETNAMESE
  WESTERN
  
}

input IngredientSectionInput {
  section: String!
  items: [String!]!
}

type IngredientSection {
  section: String!
  items: [String!]!
}

type Recipe {
    id: ID!
    title: String!
    ingredients: [IngredientSection!]!
    instructions: String!
    createdAt: String!
    cuisine: Cuisine
    inspoLink: String
    ownerEmail:  String
  }

  type Query {
    recipes: [Recipe!]!
    searchRecipes(title: String!): [Recipe!]!
  }

  input RecipeInput {
    title: String!
    ingredients: [IngredientSectionInput!]!
    instructions: String!
    cuisine: Cuisine
    inspoLink: String
  }

  type Mutation {
    addRecipe(input: RecipeInput!): Recipe!
     updateRecipe(id: ID!, input: RecipeInput!): Recipe! 
    deleteRecipe(id: ID!): Recipe!    
  }
`;
