export type RecipeActionData = {
  errors?: {
    title?: string[];
    content?: string[];
    ingredients?: string[];
    publish?: string[];
  };
  formErrors?: string[];
  values?: Record<string, unknown>;
};
