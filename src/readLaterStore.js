import { removeAllNodeChildren } from './utils';

/** A `p` element that we inject when an error occurs */
const noReadLaterElement = document.createElement('p');
noReadLaterElement.innerHTML = 'There is no stories to read later...';

/** localStorage version key. Bump whenever there is a breaking change in structure */
const LOCAL_STORAGE_KEY = 'read-later-stories-v1';

/** an array containing all saved stories */
const readLaterStoriesStore = loadReadLaterStories();

/** The `ul` where read-later stories are rendered */
const readLaterListUL = document.querySelector('.readLaterList');

/**
 * Renders all stories stored in readLaterStoriesStore
 */
export function renderAllReadLaterStories() {
  removeAllNodeChildren(readLaterListUL);
  if (readLaterStoriesStore.length) {
    noReadLaterElement.remove();
    readLaterStoriesStore
      .map(renderReadLaterStory)
      .forEach(readLaterListUL.appendChild, readLaterListUL);
  } else {
    readLaterListUL.insertAdjacentElement('beforebegin', noReadLaterElement);
  }
}

/**
 * Syncs up localStorage with readLaterStoriesStore array (readLaterStoriesStore => localStorage[LOCAL_STORAGE_KEY])
 */
function saveReadLaterStories() {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(readLaterStoriesStore)
  );
}

/**
 * returns an array containing all saved readLater stories
 */
function loadReadLaterStories() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
}

/**
 * Renders and injects a new readLater story object. Highlights it if it already exists
 * @param {Object} story
 * @param {HTMLLIElement} originalStoryElement the original story `li`. This is used to animate read-later story element
 */
export function injectReadLaterStory(story, originalStoryElement) {
  const { id, webTitle, webUrl } = story;
  // make sure the story isn't already added
  const index = readLaterStoriesStore.findIndex(story => story.id === id);
  if (index < 0) {
    readLaterStoriesStore.push({ id, webTitle, webUrl });
    const rendered = renderReadLaterStory({ id, webTitle, webUrl });
    readLaterListUL.appendChild(rendered);

    /* 
        we measure the difference in position between original story and injected read-later story,
        then we transform the read-later story with that difference,
        the `appear` CSS animation will take care of removing the offset and the element will fall in place nicely
        only works in Chromium and FF but still worth the 5 lines of code :D 
    */
    const origianlElementRect = originalStoryElement.getBoundingClientRect();
    const readLaterElementRect = rendered.getBoundingClientRect();

    const xOffset = Math.floor(
      readLaterElementRect.left - origianlElementRect.left
    );
    const yOffset = Math.floor(
      readLaterElementRect.top - origianlElementRect.top
    );

    rendered.style.transform = `translate(-${xOffset}px, ${-yOffset}px)`;

    noReadLaterElement.remove();
    saveReadLaterStories();
  } else {
    // the story already exists, let's highlight it for a better UX
    // add highlight class
    readLaterListUL.children[index].classList.add('highlighted');
    // scroll to the highlighted story if needed
    readLaterListUL.children[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

    // remove the highlight styling after 500ms
    setTimeout(
      () => readLaterListUL.children[index].classList.remove('highlighted'),
      500
    );
  }
}

/**
 * Removes a read-later story. From the UI and the local storage.
 * @param {string} storyId
 */
function removeReadLaterStory(storyId) {
  const index = readLaterStoriesStore.findIndex(s => s.id === storyId);
  if (index > -1) {
    readLaterStoriesStore.splice(index, 1);
    saveReadLaterStories();
    readLaterListUL.children[index].remove();
  }
  if (readLaterStoriesStore.length < 1) {
    readLaterListUL.insertAdjacentElement('beforebegin', noReadLaterElement);
  }
}

/**
 * Renders a `li` element representing a read-later story
 * @param {Object} story the story object
 */
function renderReadLaterStory({ id, webTitle, webUrl }) {
  const HTML = `
          <h4 class="readLaterItem-title">${webTitle}</h4>
          <section>
              <a rel="noopener noreferrer" target="_blank" href="${webUrl}" class="button button-clear">Read</a>
              <button class="removeButton button button-clear">Remove</button>
          </section>
      `;
  const li = document.createElement('li');
  li.innerHTML = HTML;
  li.className = 'readLaterItem';
  li.querySelector('section .removeButton').addEventListener('click', () =>
    removeReadLaterStory(id)
  );
  return li;
}
