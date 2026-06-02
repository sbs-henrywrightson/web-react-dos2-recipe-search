import { AppButton, IngredientsList } from '@components';
import type { Recipe } from '@types';

type RecipeCardProps = {
  recipe: Recipe;
  query: string;
  onIngredientClick: (ingredient: string) => void;
};

export default function RecipeCard({ recipe, query, onIngredientClick }: RecipeCardProps) {
  return (
    <div className='rounded-md border border-[hsl(0,0%,70%)] dark:border-[hsl(116,50%,15%)] bg-surface p-1.5 hover:shadow-md transition'>
      <div className='flex items-center justify-between'>
        <AppButton
          buttonType='plain'
          className='text-left text-xl font-semibold px-1 rounded hover:bg-recipe-type-hover'
          onClick={() => onIngredientClick(recipe.result.toLowerCase())}
        >
          {recipe.result}
        </AppButton>
        {recipe.subtype && <p className='text-xs'>({recipe.subtype})</p>}
      </div>

      <IngredientsList key={recipe.id} recipe={recipe} query={query} onPillClick={onIngredientClick}></IngredientsList>
    </div>
  );
}
