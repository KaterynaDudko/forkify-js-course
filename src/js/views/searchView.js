import View from './View';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
