import View from './View.js';
import icons from 'url:../../img/icons.svg';

class addNewRecipyView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _successMessage = 'Recipe was successfully upload';

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerCloseModal();
  }

  toggleModal() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowModal() {
    this._btnOpenModal.addEventListener('click', this.toggleModal.bind(this));
  }

  _addHandlerCloseModal() {
    this._btnCloseModal.addEventListener('click', this.toggleModal.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = [...new FormData(this)];
      const data = Object.fromEntries(formData);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new addNewRecipyView();
