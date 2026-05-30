export type Recipe = {
  id: number;
  type: string;
  subtype: string | null;
  tool: string | null;
  result: string;
  ingredients: string[];
  searchTerms: string;
};
