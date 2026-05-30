import { AppButton, IngredientsList } from '@components';
import type { Recipe } from '@types';

type RecipeCardProps = {
  recipe: Recipe;
  query: string;
  onIngredientClick: (ingredient: string) => void;
};

export default function RecipeCard({ recipe, query, onIngredientClick }: RecipeCardProps) {
  return (
    <div className='rounded-md border border-gray-500 bg-surface p-1.5 hover:shadow-md transition'>
      <div className='flex items-center justify-between'>
        <AppButton
          buttonType='plain'
          className='text-xl font-semibold px-1 rounded hover:bg-recipe-type-hover'
          onClick={() => onIngredientClick(recipe.result.toLowerCase())}
        >
          {recipe.result}
        </AppButton>
        {recipe.subtype && <p className='text-xs'>({recipe.subtype})</p>}
      </div>

      {/* <p className='text-sm text-muted-foreground text-amber-600'>{recipe.ingredients.join(', ')}</p> */}
      <IngredientsList key={recipe.id} recipe={recipe} query={query} onPillClick={onIngredientClick}></IngredientsList>
    </div>
  );
}
