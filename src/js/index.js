import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

import { elements, renderLoader, clearLoader } from "./views/base";
/*  Global State of the App
 *Search Object
 *Current Recipe
 *Shoping List
 *Liked recipe
 */
export const state = {};

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//testing delete later

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
    recipeView.renderRecipe(
      state.recipe,
      state.likes.isLiked(state.recipe.title)
    );
  }
};

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentTitle = state.recipe.title;
  const url = state.recipe.url;
  if (!state.likes.isLiked(currentTitle)) {
    const newLike = state.likes.addLike(
      state.recipe.url,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    likesView.toggleLikeBtn(true);

    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(currentTitle);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(url);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
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

window.addEventListener("hashchange", controllerRecipe);

const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete,.shopping__delete *")) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

elements.recipe.addEventListener("click", event => {
  if (event.target.matches(".btn-decrese, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (event.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

window.l = state;
