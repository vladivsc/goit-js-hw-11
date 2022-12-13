import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createGalleryItemsMarkup } from './js/template';
import { scrollFunction } from './js/scroll-to-top';

const debounce = require('lodash.debounce');

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.submit-btn'),
  gallery: document.querySelector('.gallery'),
};

let page = 1;

const fetchImagesValue = [];
let searchValue = '';

refs.searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(evt) {
  evt.preventDefault();

  searchValue = evt.target.elements.searchQuery.value.trim().toLowerCase();

  page = 1;

  const images = await fetchImages(searchValue, page);
  fetchImagesValue.push(...images.hits);
  // fetchImagesValue = await fetchImages(searchValue);

  console.log(fetchImagesValue);

  if (fetchImagesValue.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchForm.reset();
    refs.gallery.innerHTML = '';
    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${images.total} images.`);

  render(images.hits);

  lightbox.refresh();
}

function render(toAdd) {
  const createMarkup = createGalleryItemsMarkup(toAdd);
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup);
}

async function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

window.onscroll = debounce(async function (ev) {
  scrollFunction();
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    page += 1;
    const images = await fetchImages(searchValue, page);

    fetchImagesValue.push(images.hits);

    render(images.hits);

    lightbox.refresh();
  }
}, 3000);
