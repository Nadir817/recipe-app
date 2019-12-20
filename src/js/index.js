import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
/*  Global State of the App
 *Search Object
 *Current Recipe
 *Shoping List
 *Liked recipe
 */
export const state = {};

const controllerSearch = async () => {
  //get query
  const query = searchView.getInput();
  if (query) {
    state.search = new Search(query);
    //prepare UI
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    await state.search.getResult();
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

// const controllerRecipe = async n => {
//   await state.search.getResult();
//   const r = new Recipe(state.search.result[n]);
//   r.getRecipe();
//   console.log(r);
// };

elements.searchForm.addEventListener("submit", event => {
  event.preventDefault();
  controllerSearch();
  controllerRecipe();
});

elements.searchResPages.addEventListener("click", event => {
  const btn = event.target.closest(".btn-inline");
  if (btn) {
    const goToPage = Number(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// elements.searchResList.addEventListener("click", event => {
//   const btn = event.target.closest(".results__link");
//   if (btn) {
//     const index = Number(btn.dataset.index);
//     controllerRecipe(index);
//   }
// });

const controllerRecipe = () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    clearLoader();
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    searchView.highlightSelected(id);
    state.recipe = new Recipe(state.search.result[id]);

    state.recipe.getRecipe();

    state.recipe.calcTime();
    state.recipe.calcServings();
    state.recipe.parseIngredients();

    clearLoader();
    recipeView.renderRecipe(state.recipe);
  }
};

window.addEventListener("hashchange", controllerRecipe);
