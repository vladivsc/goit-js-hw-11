import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createGalleryItemsMarkup } from './js/template';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.submit-btn'),
  gallery: document.querySelector('.gallery'),
};

let page = 1;

let fetchImagesValue = [];

refs.searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(evt) {
  evt.preventDefault();

  const searchValue = evt.target.elements.searchQuery.value
    .trim()
    .toLowerCase();

  page = 1;

  fetchImagesValue = await fetchImages(searchValue);

  console.log(fetchImagesValue.hits);

  if (fetchImagesValue.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchForm.reset();
    refs.gallery.innerHTML = '';
    return;
  }

  render();

  lightbox.refresh();
}

function render() {
  const createMarkup = createGalleryItemsMarkup(fetchImagesValue.hits);
  refs.gallery.innerHTML = createMarkup;
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
