import prisma from "@/lib/prisma";
import { Cuisine, Prisma} from "@prisma/client";

interface IngredientSection {
  name: string;
  items: string[];
}

interface RecipeInput {
  title: string;
  ingredients: IngredientSection[];
  instructions: string;
  cuisine: Cuisine;
  inspoLink?: string;
}

interface Context {
  token?: string;
}

async function verifyFirebaseToken(token?: string): Promise<string | null> {
  if (!token) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    }
  );

  const data = await res.json();
  return data?.users?.[0]?.email || null;
}

export const resolvers = {
  Query: {
    recipes: async () =>
      prisma.recipe.findMany({ orderBy: { createdAt: "desc" } }),

    searchRecipes: async (_: any, { title }: { title: string }) =>
      prisma.recipe.findMany({
        where: title ? { title: { contains: title, mode: "insensitive" } } : {},
        orderBy: { createdAt: "desc" },
      }),
  },

  Mutation: {
    addRecipe: async (_: any, { input }: { input: RecipeInput }, context: Context) => {
      const userEmail = await verifyFirebaseToken(context.token);
      if (!userEmail) throw new Error("You must be logged in");

      return prisma.recipe.create({
        data: {
          title: input.title,
          ingredients: input.ingredients as unknown as Prisma.InputJsonValue, // now an array of { name, items[] }
          instructions: input.instructions,
          cuisine: input.cuisine,
          inspoLink: input.inspoLink,
          ownerEmail: userEmail,
        },
      });
    },

    updateRecipe: async (_: any, { id, input }: { id: string; input: RecipeInput }, context: Context) => {
      const userEmail = await verifyFirebaseToken(context.token);
      if (!userEmail) throw new Error("You must be logged in");

      const recipe = await prisma.recipe.findUnique({ where: { id } });
      if (!recipe) throw new Error("Recipe not found");
      if (recipe.ownerEmail !== userEmail) throw new Error("Not authorized");

      return prisma.recipe.update({
        where: { id },
        data: {
          title: input.title,
          ingredients: input.ingredients as unknown as Prisma.InputJsonValue, // update with sections
          instructions: input.instructions,
          cuisine: input.cuisine,
          inspoLink: input.inspoLink,
        },
      });
    },

    deleteRecipe: async (_: any, { id }: { id: string }, context: Context) => {
      const userEmail = await verifyFirebaseToken(context.token);
      if (!userEmail) throw new Error("You must be logged in");

      const recipe = await prisma.recipe.findUnique({ where: { id } });
      if (!recipe) throw new Error("Recipe not found");
      if (recipe.ownerEmail !== userEmail) throw new Error("Not authorized");

      return prisma.recipe.delete({ where: { id } });
    },
  },
};
