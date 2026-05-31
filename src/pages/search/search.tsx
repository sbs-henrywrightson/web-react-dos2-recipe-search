import { AppButton, RecipeCard } from '@components';
import { recipeService } from '@services';
import type { Recipe, RecipeGroup } from '@types';
import { useEffect, useMemo, useState } from 'react';

export default function SearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // user-controlled overrides only
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // load data
  useEffect(() => {
    recipeService
      .load()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // found recipes
  const filteredRecipes = useMemo(() => {
    const query = debouncedQuery.trim();
    if (!query || query.length < 3) {
      return [];
    }

    return recipes.filter((recipe) => recipe.searchTerms.includes(query));
  }, [recipes, debouncedQuery]);

  // grouped recipes by type
  const groupedRecipes = useMemo<RecipeGroup[]>(() => {
    const groups = new Map<string, RecipeGroup>();

    // make sure empty groups are created
    for (const recipe of recipes) {
      if (!groups.has(recipe.type)) {
        groups.set(recipe.type, {
          type: recipe.type,
          recipes: [],
        });
      }
    }

    // add filtered results
    for (const recipe of filteredRecipes) {
      groups.get(recipe.type)?.recipes.push(recipe);
    }

    return Array.from(groups.values());
  }, [recipes, filteredRecipes]);

  useEffect(() => {
    const types = new Set(filteredRecipes.map((r) => r.type));

    const reset = Object.fromEntries(
      [...types].map((type) => [type, false]), // all expanded
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsedGroups(reset);
  }, [filteredRecipes]);

  const toggleGroup = (type: string) => {
    console.log('toggle');
    setCollapsedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleIngredientClick = (ingredient: string) => {
    setQuery(ingredient.toLowerCase());
  };

  const handleGroupClick = (e: React.MouseEvent, recipeType: string) => {
    e.stopPropagation();
    setQuery(recipeType.toLowerCase());
  };

  return (
    <main className='mx-auto max-w-7xl px-4 py-8'>
      <header className='mb-8'>
        <h1 className='mb-4 text-center rounded-lg p-2 bg-[hsl(31,65%,26%)] dark:bg-[hsl(28,100%,10%)] text-[hsl(25,100%,50%)] dark:text-amber-700'>
          Divinity: Original Sin 2 Crafting Recipes
        </h1>

        <input
          id='search'
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          placeholder={loading ? 'Loading recipes...' : `Search ${recipes.length} recipes...`}
          className='w-full rounded-lg border bg-form-field-background border-form-field-border px-4 py-3'
          disabled={loading}
        />
      </header>

      {!loading && (
        <div>
          {groupedRecipes.map((group) => {
            const hasRecipes = group.recipes.length > 0;
            const collapsed = collapsedGroups[group.type] ?? !hasRecipes;

            return (
              <section
                key={group.type}
                className={
                  hasRecipes
                    ? 'my-6 rounded-lg border border-[hsl(0,0%,60%)] dark:border-[hsl(116,50%,20%)] bg-recipe-type-background'
                    : ''
                }
              >
                <div
                  className={[
                    hasRecipes
                      ? 'flex items-center justify-between px-2 pt-2 text-recipe-type cursor-pointer'
                      : 'text-recipe-type-muted w-max',
                    collapsed && hasRecipes ? 'pb-3' : '',
                  ].join(' ')}
                  onClick={() => toggleGroup(group.type)}
                >
                  <AppButton
                    buttonType='plain'
                    className={`text-xl font-semibold ${!hasRecipes ? 'text-recipe-type-muted' : ''} px-1 rounded hover:bg-recipe-type-hover`}
                    onClick={(e: React.MouseEvent) => handleGroupClick(e, group.type)}
                  >
                    {group.type}
                  </AppButton>

                  {hasRecipes && <p className='text-sm'>{collapsed ? 'Show' : 'Hide'}</p>}
                </div>

                {!collapsed && hasRecipes && (
                  <div className='grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {group.recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        query={query}
                        onIngredientClick={handleIngredientClick}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
