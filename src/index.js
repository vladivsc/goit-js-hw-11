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

refs.searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(evt) {
  evt.preventDefault();

  const searchValue = evt.target.elements.searchQuery.value
    .trim()
    .toLowerCase();

  page = 1;

  const fetchImagesValue = await fetchImages(searchValue);

  if (fetchImagesValue.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchForm.reset();
    return;
  }

  const createMarkup = createGalleryItemsMarkup(fetchImagesValue);
  refs.gallery.innerHTML = createMarkup;

  console.log(fetchImagesValue);
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});
