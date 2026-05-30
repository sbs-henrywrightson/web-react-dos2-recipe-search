import type { Recipe } from '../../types';
import { Pill } from '../pill/pill';

type Props = {
  recipe: Recipe;
  query: string;
  onPillClick: (value: string) => void;
};

export function IngredientsList({ recipe, query, onPillClick }: Props) {
  return (
    <div className='flex flex-wrap gap-1 mt-1'>
      {recipe.tool && (
        <Pill
          key={`${recipe.id}tool`}
          onPillClick={onPillClick}
          value={recipe.tool}
          className='bg-button-tool-background border-button-tool-border hover:bg-button-tool-hover'
          highlight={recipe.tool.toLowerCase().includes(query)}
        ></Pill>
      )}
      {recipe.ingredients.map((ingredient, i) => {
        return (
          <Pill
            key={i}
            onPillClick={onPillClick}
            value={ingredient}
            highlight={ingredient.toLowerCase().includes(query)}
          ></Pill>
        );
      })}
    </div>
  );
}
