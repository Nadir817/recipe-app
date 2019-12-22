import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
  const resultArr = Array.from(document.querySelectorAll(".results__link"));
  resultArr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href='#${id}']`)
    .classList.add("results__link--active");
};

// const renderRecipe = data => {
//   const markUp = `<li>
//                           <a class="results__link" href="#${data}">
//                               <figure class="results__fig">
//                                   <img src="${data.recipe.image}" alt="${data.recipe.label}">
//                               </figure>
//                               <div class="results__data">
//                                   <h4 class="results__name">${data.recipe.label}</h4>
//                                   <p class="results__author">${data.recipe.source}</p>
//                               </div>
//                           </a>
//                       </li>`;
//   elements.searchResList.insertAdjacentHTML("beforeend", markUp);
// };

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${
                  type === "prev" ? "left" : "right"
                }"></use>
        </svg>
</button>
`;

const renderButton = (page, numOfRes, resPerPage) => {
  const pages = Math.ceil(numOfRes / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, "next");
  } else if (page < pages) {
    button = `
        ${creatButton(page, "prev")}
        ${creatButton(page, "next")}
        `;
  } else if (page === pages && page > 1) {
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 8) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(data => {
    const markUp = `<li>
                          <a class="results__link" href="#${recipes.indexOf(
                            data
                          )}" data-index=${recipes.indexOf(data)}>
                              <figure class="results__fig">
                                  <img src="${data.recipe.image}" alt="${
      data.recipe.label
    }">
                              </figure>
                              <div class="results__data">
                                  <h4 class="results__name">${
                                    data.recipe.label
                                  }</h4>
                                  <p class="results__author">${
                                    data.recipe.source
                                  }</p>
                              </div>
                          </a>
                      </li>`;
    elements.searchResList.insertAdjacentHTML("beforeend", markUp);
  });

  renderButton(page, recipes.length, resPerPage);
};
