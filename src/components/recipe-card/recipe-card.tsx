import type { Recipe } from '../../types';
import { IngredientsList } from '../ingredients-list/ingredients-list';

type RecipeCardProps = {
  recipe: Recipe;
  query: string;
  onIngredientClick: (ingredient: string) => void;
};

export function RecipeCard({ recipe, query, onIngredientClick }: RecipeCardProps) {
  return (
    <div className='rounded-md border border-gray-500 bg-surface p-1.5 hover:shadow-md transition'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold mb-1'>{recipe.result}</h3>
        {recipe.subtype && <p className='text-xs'>({recipe.subtype})</p>}
      </div>

      {/* <p className='text-sm text-muted-foreground text-amber-600'>{recipe.ingredients.join(', ')}</p> */}
      <IngredientsList key={recipe.id} recipe={recipe} query={query} onPillClick={onIngredientClick}></IngredientsList>
    </div>
  );
}
