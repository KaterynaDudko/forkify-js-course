import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query! Please try another one!';
  _successMessage;

  _generateMarkup() {
    return this._data.map(recipe => previewView.render(recipe, false)).join('');
  }
}

export default new ResultsView();
