import getRefs from './get-refs';
import API from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Handlebars from 'handlebars';
import rawTemplate from '../templates/gallery-card.hbs';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();
let requestInput;
let currentPage = 1;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

hiddenButtonLoadMore();

refs.searchForm.addEventListener('submit', getInput);
refs.buttonLoadMore.addEventListener('click', loadMore);

function getInput(evt) {
  evt.preventDefault();
  hiddenButtonLoadMore();
  refs.gallery.innerHTML = '';
  currentPage = 1;
  const inputValue = evt.currentTarget.elements.searchQuery.value;
  requestInput = inputValue;
  API.fetchImjByRequest(requestInput, currentPage).then(data => {
    if (data.hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      makeCard(data.hits);
      if (data.hits.length === 10) {
        showButtonLoadMore();
      }
      // Оновлення SimpleLightbox після створення карток
      lightbox.refresh();
    }
  });
}

function makeCard(hits) {
  const cardTemplate = Handlebars.compile(rawTemplate);
  const markup = cardTemplate(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const images = document.querySelectorAll('.gallery .hidden-image');
  images.forEach(img => {
    img.addEventListener('load', () => {
      const skeleton = img.closest('.image-wrapper').querySelector('.skeleton');
      skeleton.style.display = 'none'; // Ховаємо скелетон
      img.style.display = 'block'; // Відображаємо зображення
    });
  });

  // Оновлення SimpleLightbox після створення карток
  lightbox.refresh();
}

function showButtonLoadMore() {
  refs.buttonLoadMore.classList.remove('hidden');
}

function hiddenButtonLoadMore() {
  refs.buttonLoadMore.classList.add('hidden');
}

function loadMore() {
  currentPage += 1;

  API.fetchImjByRequest(requestInput, currentPage).then(data => {
    hiddenButtonLoadMore();
    makeCard(data.hits);
    if (data.hits.length === 10) {
      showButtonLoadMore();
    }
    // Оновлення SimpleLightbox після створення карток
    lightbox.refresh();
  });
}
