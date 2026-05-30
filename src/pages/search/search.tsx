import { RecipeCard } from '@components';
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
    if (!query || query.length <= 3) {
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

  function toggleGroup(type: string) {
    setCollapsedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }

  if (loading) {
    return (
      <main className='mx-auto max-w-7xl px-4 py-8'>
        <p>Loading recipes…</p>
      </main>
    );
  }

  const handleIngredientClick = (ingredient: string) => {
    setQuery(ingredient.toLowerCase());
  };

  return (
    <main className='mx-auto max-w-7xl px-4 py-8'>
      <header className='mb-8'>
        <h1 className='mb-4 text-3xl font-bold'>Divinity: Original Sin 2 Crafting Recipes</h1>

        <input
          id='search'
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          placeholder={`Search ${recipes.length} recipes...`}
          className='w-full rounded-lg border bg-form-field-background px-4 py-3'
        />
      </header>

      <div>
        {groupedRecipes.map((group) => {
          const hasRecipes = group.recipes.length > 0;
          const collapsed = collapsedGroups[group.type] ?? !hasRecipes;

          return (
            <section key={group.type} className={hasRecipes ? 'my-6 rounded-lg border bg-recipe-type-background' : ''}>
              <div
                className={[
                  hasRecipes
                    ? 'flex items-center justify-between px-2 pt-2 text-recipe-type'
                    : 'flex items-center justify-between text-recipe-type-muted',
                  collapsed && hasRecipes ? 'pb-3' : '',
                ].join(' ')}
                onClick={() => toggleGroup(group.type)}
              >
                <h2 className='text-xl font-semibold'>{group.type}</h2>

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
    </main>
  );
}
