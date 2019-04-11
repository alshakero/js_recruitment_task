let testingDoc;

const specs = [
  describe('Should render as many articles as there in the response', function(message) {
    assertEqual(
      $$('.newsItem').length,
      fakeResponse.response.results.length,
      message
    );
  }),
  describe('Stories should have the same title as the response dictates', function(message) {
    const renderedStories = $$('.newsItem');
    fakeResponse.response.results.forEach((story, index) => {
      assertEqual(
        story.webTitle,
        renderedStories[index].querySelector('h3').textContent,
        message
      );
    });
  }),
  describe('Clicking Read Later should add the story to read-later section', function(message) {
    const renderedStories = $$('.newsItem');
    const readLaterCount = $$('.readLaterList li').length;

    const addToReadLaterButton = renderedStories[0].querySelector(
      '.button.button-outline'
    );

    addToReadLaterButton.click();
    assertEqual($$('.readLaterList li').length, readLaterCount + 1, message);
  }),
  describe('Clicking Remove should remove the story from the read-later section', function(message) {
    const readLaterCount = $$('.readLaterList li').length;

    const removeReadLaterButton = $$('.removeButton')[0];

    removeReadLaterButton.click();
    assertEqual($$('.readLaterList li').length, readLaterCount - 1, message);
  }),
  describe('When there are no stories, information about it should appear', async function(message) {
    const origialCount = fakeResponse.response.total;
    fakeResponse.response.total = 0;
    // trigger fetching articles
    testingDoc.dispatchEvent(new CustomEvent('DOMContentLoaded'));

    // wait for fake fetch to finish
    await sleep();

    // element is not null
    assert(Boolean($$('.errorMessage')[0]));

    assert(
      $$('.errorMessage')[0].textContent.includes(
        `There isn't any news stories matching the current criteria`
      ),
      message
    );

    // restore
    fakeResponse.response.total = origialCount;

    // trigger fetching articles for the next test
    testingDoc.dispatchEvent(new CustomEvent('DOMContentLoaded'));
    await sleep(10);
  }),
  describe('Changing the section should trigger fetch', async function(message) {
    const orignialFetch = testingDoc.defaultView.fetch;
    let called = false;
    let calledWith;

    const spy = function fakeFakeFetch() {
      called = true;
      calledWith = arguments;
      return orignialFetch.call(testingDoc.defaultView, ...arguments);
    };

    testingDoc.defaultView.fetch = spy;
    $$('#sectionSelect')[0].selectedIndex = 1;
    $$('#sectionSelect')[0].dispatchEvent(new CustomEvent('change'));

    // wait for fake fetch
    await sleep();

    assert(called, message);
    assert(calledWith[0].includes('section=books'), message);

    // restore
    testingDoc.defaultView.fetch = orignialFetch;
  }),
  describe('Changing the page should trigger fetch', async function(message) {
    const orignialFetch = testingDoc.defaultView.fetch;
    let called = false;
    let calledWith;

    const spy = function fakeFakeFetch() {
      called = true;
      calledWith = arguments;
      return orignialFetch.call(testingDoc.defaultView, ...arguments);
    };

    testingDoc.defaultView.fetch = spy;
    $$('#activePageSelect')[0].selectedIndex = 1;
    $$('#activePageSelect')[0].dispatchEvent(new CustomEvent('change'));

    // wait for fake fetch
    await sleep();

    assert(called, message);
    assert(calledWith[0].includes('page=2'), message);

    // restore
    testingDoc.defaultView.fetch = orignialFetch;
  }),
  describe('Writing a search query should trigger fetch with q=query', async function(message) {
    const orignialFetch = testingDoc.defaultView.fetch;
    let called = false;
    let calledWith;

    const spy = function fakeFakeFetch() {
      called = true;
      calledWith = arguments;
      return orignialFetch.call(testingDoc.defaultView, ...arguments);
    };

    testingDoc.defaultView.fetch = spy;
    $$('#newsContentSearch')[0].value = 'someRandomQuery';
    $$('#newsContentSearch')[0].dispatchEvent(new CustomEvent('search'));

    // wait for fake fetch
    await sleep();

    assert(called, message);
    assert(calledWith[0].includes('q=someRandomQuery'), message);

    // restore
    testingDoc.defaultView.fetch = orignialFetch;
  }),
  describe('Dobouncing: writing a search query should trigger fetching only once for a series of changes', async function(message) {
    const orignialFetch = testingDoc.defaultView.fetch;
    let calledCount = 0;

    const spy = function fakeFakeFetch() {
      calledCount++;
      return orignialFetch.call(testingDoc.defaultView, ...arguments);
    };

    testingDoc.defaultView.fetch = spy;

    for (let i = 0; i < 10; i++) {
      $$('#newsContentSearch')[0].value = 'someRandomQuery';
      $$('#newsContentSearch')[0].dispatchEvent(new CustomEvent('keyup'));
    }

    // wait for fake fetch + debouncing delay
    await sleep(200);

    assertEqual(calledCount, 1, message);

    // restore
    testingDoc.defaultView.fetch = orignialFetch;
  }),
];

async function runSpecs(doc, onResult, onDone) {
  testingDoc = doc;
  const results = [];
  for (const spec of specs) {
    const result = await spec();
    results.push(result);
    onResult(result);
    await sleep(100); // delay each test 100ms because it looks way nicer. Bad idea for production. Good idea for skills showcasing :D 
  }
  onDone(results);
}
