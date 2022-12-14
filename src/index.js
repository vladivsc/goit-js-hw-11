import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createGalleryItemsMarkup } from './js/template';
import { scrollFunction } from './js/scroll-to-top';
import { refs } from './js/reference';

const debounce = require('lodash.debounce');

refs.searchForm.addEventListener('submit', onSearchForm);

let page = 1;

let fetchImagesValue = [];
let searchValue = '';

async function onSearchForm(evt) {
  evt.preventDefault();
  fetchImagesValue = [];
  refs.gallery.innerHTML = '';

  searchValue = evt.target.elements.searchQuery.value.trim().toLowerCase();

  page = 1;

  const images = await fetchImages(searchValue, page);
  fetchImagesValue.push(...images.hits);

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

window.onscroll = debounce(async function (ev) {
  scrollFunction();
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    page += 1;

    const images = await fetchImages(searchValue, page);

    fetchImagesValue.push(images.hits);

    render(images.hits);

    lightbox.refresh();
  }
}, 100);

function render(toAdd) {
  const createMarkup = createGalleryItemsMarkup(toAdd);
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup);
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

async function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
