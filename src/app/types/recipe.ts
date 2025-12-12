import { Cuisine } from "@prisma/client";

export type Recipe = {
  id: string;          
  title: string;
  ingredients: string[];
  instructions: string;
  cuisine: Cuisine;
  inspoLink?: string;
  ownerEmail?: string;
};
