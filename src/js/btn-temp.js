import Notiflix from 'notiflix';
import { galleryTemplate } from "./template";
import { PixabayAPI } from './axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  formEL: document.querySelector('#form'),
  galleryListEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
}

const simple = new SimpleLightbox('.gallery a');
const pixabayApi = new PixabayAPI();

refs.formEL.addEventListener('submit', onFormElSubmit);
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

async function onFormElSubmit(event) {
  event.preventDefault();

  pixabayApi.q = event.target.elements.searchQuery.value.trim();
  pixabayApi.page = 1;

  if (pixabayApi.q === '') {
    Notiflix.Notify.failure('Enter a word to search for');
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  try {
    const data = await pixabayApi.getGalleryCard();

    if (data.total === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      refs.loadMoreBtn.classList.add('is-hidden');
      event.target.reset();
      refs.galleryListEl.innerHTML = '';
      return;
    }

    if (pixabayApi.page === 1) {
      if (data.hits.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden');
      }
      refs.galleryListEl.innerHTML = galleryTemplate(data.hits);
      simple.refresh();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

async function onloadMoreBtnClick(event) {
  pixabayApi.page += 1;
  try {
    const data = await pixabayApi.getGalleryCard();
    refs.galleryListEl.insertAdjacentHTML('beforeend', galleryTemplate(data.hits));
    simple.refresh();
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    const lastPage = Math.ceil(data.totalHits / pixabayApi.per_page);

    if (pixabayApi.page === lastPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info('Sorry, but you have reached the end of the search results');
    } else if (data.hits.length < 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
    } else {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}
