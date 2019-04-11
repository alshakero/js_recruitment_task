import 'babel-polyfill'; // add babel polyfill to support async/await. see https://github.com/parcel-bundler/parcel/issues/871#issuecomment-367899522
import './styles/main.css';
import {
  renderAllReadLaterStories,
  injectReadLaterStory,
} from './readLaterStore';

import {
  removeAllNodeChildren,
  calculateAndFormatLastMonthDate,
  fetchFromAPI,
  debounce,
} from './utils';

/** A `p` element that we inject when an error occurs */
const errorElement = document.createElement('p');
errorElement.className = 'errorMessage';

const networkErrorMessage = `Sorry. Couldn't reach the Guardian API due to a connection issue. Please try again later.`;
const noItemsErrorMessage = `There isn't any news stories matching the current criteria published after ${calculateAndFormatLastMonthDate()} (in the last month).`;

/** The `ul` where stories are rendered  */
const storiesListUL = document.querySelector('.newsList');

/** the pagination `select` element */
const pageSelect = document.querySelector('#activePageSelect');

/** the search query `input` */
const searchInput = document.querySelector('#newsContentSearch');

/** the section `select` element */
const sectionSelect = document.querySelector('#sectionSelect');

/** the required sections encoded URI param */
const defaultSectionsParam = encodeURIComponent(
  `(${['sport', 'books', 'business', 'culture'].join('|')})`
);

/**
 * Generates a `li` element ready to be injected in the DOM represeting a story
 * @param {Object} story
 */
function renderStory(story) {
  const HTML = `
        <article class="news">   
            <header>
                <h3>${story.webTitle}</h3>
            </header>
            <section class="newsDetails">
            <ul>
                <li><strong>Section Name:</strong> ${story.sectionName}</li>
                <li><strong>Publication Date:</strong> ${new Date(
                  story.webPublicationDate
                ).toLocaleDateString('en-GB')}</li>
            </ul>
            </section>
            <section class="newsActions">
                <a rel="noopener noreferrer" target="_blank" href="${
                  story.webUrl
                }" class="button">Full article</a>
                <button class="button button-outline">Read Later</button>
            </section>
        </article>
    `;
  const li = document.createElement('li');
  li.className = 'newsItem';
  li.innerHTML = HTML;
  li.querySelector('.newsActions .button.button-outline').addEventListener(
    'click',
    () => injectReadLaterStory(story, li)
  );
  return li;
}

/**
 * Shows a connection error message
 * @param {string} message message shown in the error alert panel
 */
function showErrorMessage(message) {
  errorElement.innerHTML = message;
  if (!document.contains(errorElement)) {
    storiesListUL.insertAdjacentElement('beforeBegin', errorElement);
  }
}
/**
 * Hides the error message
 */
function hideErrorMessage() {
  errorElement.remove();
}

/**
 * Initiates an API call and renderes the received stories
 */
async function fetchArticles() {
  const page = pageSelect.value;
  const query = searchInput.value;
  const sections =
    sectionSelect.value === 'all' ? defaultSectionsParam : sectionSelect.value;

  try {
    const { results, total } = await fetchFromAPI(page, query, sections);

    // since fetchFromAPI didn't throw an exception. We can remove the error message element
    hideErrorMessage();

    // remove already rendered stories
    removeAllNodeChildren(storiesListUL);

    if (total > 0) {
      const renderedStories = results.map(renderStory);
      renderedStories.forEach(storiesListUL.appendChild, storiesListUL);
    } else { // no stories for this criteria
      showErrorMessage(noItemsErrorMessage);
    }
  } catch (error) { // probably a network error
    showErrorMessage(networkErrorMessage);
    console.error(error); // log for easy debugging
  }
}

pageSelect.addEventListener('change', fetchArticles);
sectionSelect.addEventListener('change', fetchArticles);
searchInput.addEventListener('keyup', debounce(fetchArticles, 200));
// to cover for the x button in the field
searchInput.addEventListener('search', fetchArticles);

document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
    renderAllReadLaterStories();
})