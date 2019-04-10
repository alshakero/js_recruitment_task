const API_KEY = '0799ee2a-183d-4acf-82a7-9379bf638615';

/**
 * Removes all the children of `node`
 * @param {HTMLElement} node
 */
export function removeAllNodeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Goes back 30 days in history and returns the date from then in YYYY-MM-DD format (as Guardian API requires)
 * @returns {String} the date
 */
export function calculateAndFormatLastMonthDate() {
  const date = new Date(Date.now() - 2.628e9); // 2.628e+9 is a month in ms
  const year = date.getFullYear();
  const day = date.getDate();
  let month = date.getMonth() + 1; // month is zero based

  if (month < 10) {
    month = `0${month}`;
  }

  return `${year}-${month}-${day}`;
}

/**
 * Construct the URL needed to reach the Guardian API around `query` and `section`
 * @param {String} [query] search query
 * @param {Array<String>} [sections] sections you want to include in your query
 */
function constructAPIEndpoint(
  page = 1,
  query = '',
  section = defaultSectionsParam
) {
  const date = calculateAndFormatLastMonthDate();
  return `https://content.guardianapis.com/search?section=${section}&order-by=newest&api-key=${API_KEY}&q=${query}&page=${page}&from-date=${date}`;
}

/**
 * Initiate an HTTP request to the API
 * @param {Number} page desired page number
 * @param {String} query search query
 * @param {Array<String>} sections sections you want to include in your query
 * @throws {Error} either a network error of the request failed or `SyntaxError` if the response wasn't JSON
 */
export async function fetchFromAPI(page, query, section) {
  const url = constructAPIEndpoint(page, query, section);
  const result = await fetch(url);
  const json = await result.json();
  return json.response;
}

/**
 * Debouces a function by `duration` ms.
 * @param {Function} origialFunction the function you want called after `duration`ms passes. Make sure to `bind` your callback before passing if you use `this` in it.
 * @param {Number} duration delay in milliseconds
 * @returns {Function} the debounced function
 */
export function debounce(origialFunction, duration) {
  let timeoutRef;
  return function() {
    clearTimeout(timeoutRef);
    timeoutRef = setTimeout(origialFunction, duration, ...arguments);
  };
}
