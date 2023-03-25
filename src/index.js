import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countriesBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countriesData = document.querySelector('.country-info');
const bodyBackground = document.querySelector("body");

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(countriesList);
    cleanMarkup(countriesData);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(error => {
      cleanMarkup(countriesList);
      cleanMarkup(countriesData);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length < 2) {
    cleanMarkup(countriesList);
    const showInfo = createInfo(data);
    countriesData.innerHTML = showInfo;
  } else {
    cleanMarkup(countriesData);
    const showList = createList(data);
    countriesList.innerHTML = showList;
  }
};

const createList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official} width="60" height="40">${name.official}</li>`
    )
    .join('');
};
const createInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.svg}" alt="${name.official} width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p> `
  );
};

countriesList.style.listStyleType = 'none';
bodyBackground.style.background = '#D8CFCF';
countriesBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
