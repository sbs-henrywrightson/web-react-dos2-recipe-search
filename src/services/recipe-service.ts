import type { Recipe } from '../types/recipe';

class RecipeService {
  private cache: Recipe[] | null = null;

  async load(): Promise<Recipe[]> {
    // simple cache so we only fetch once
    if (this.cache) {
      return this.cache;
    }

    const res = await fetch('/dos2-recipes.json');

    if (!res.ok) {
      throw new Error('Failed to load recipes');
    }

    const data = (await res.json()) as Recipe[];
    const sorted = [...data].sort((a, b) => {
      const typeCompare = a.type.localeCompare(b.type, undefined, { sensitivity: 'base' });
      if (typeCompare !== 0) {
        return typeCompare;
      }

      const subtypeCompare = (a.subtype ?? '').localeCompare(b.subtype ?? '', undefined, { sensitivity: 'base' });
      if (subtypeCompare !== 0) {
        return subtypeCompare;
      }

      return a.result.localeCompare(b.result, undefined, { sensitivity: 'base' });
    });

    this.cache = sorted;
    return sorted;
  }
}

export const recipeService = new RecipeService();
