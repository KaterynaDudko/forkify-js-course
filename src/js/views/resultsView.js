import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query! Please try another one!';
  _successMessage;

  _generateMarkup() {
    return this._data.map(this._generatePreviewMarkup).join('');
  }

  _generatePreviewMarkup(recipe) {
    return `
        <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>`;
  }
}

export default new ResultsView();
