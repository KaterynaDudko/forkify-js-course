import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObj(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const updateBookmarksInLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  updateBookmarksInLocalStorage();
};

export const deleteBookmark = function (id) {
  //Remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  updateBookmarksInLocalStorage();
};

const init = function () {
  const bookmarksInStorage = localStorage.getItem('bookmarks');
  if (bookmarksInStorage) state.bookmarks = JSON.parse(bookmarksInStorage);
};

init();

export const uploadRecipe = async function (recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredientsArr = ing[1].split(',').map(ing => ing.trim());
        if (ingredientsArr.length !== 3)
          throw new Error(
            'Wrong ingredients format. Please use the correct format as in the example'
          );
        const [quantity, unit, description] = ingredientsArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const newRecipe = {
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
      ingredients,
    };
    const res = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);
    console.log(res);
    state.recipe = createRecipeObj(res);
    console.log(state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

//For deleting all bookmarks from local storage if needed
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();
