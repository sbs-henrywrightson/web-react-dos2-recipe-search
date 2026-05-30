import type { Recipe } from './recipe';

export type RecipeGroup = {
  type: string;
  recipes: Recipe[];
};
