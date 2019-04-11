function assert(result, message) {
  if (!result) {
    const error = new Error(message);
    console.error(error);
    throw error;
  }
}
function assertEqual(a, b, message) {
  if (a !== b) {
    const error = new Error(message + ` a:${a}, b:${b}`);
    console.error(error);
    throw error;
  }
}

function describe(message, callback) {
  return async function() {
    try {
      await callback(message);
      return { message, passed: true };
    } catch (e) {
      return { message: e.message, passed: false };
    }
  };
}

function $$(selector) {
  return testingDoc.querySelectorAll(selector);
}
async function sleep(duration) {
  return new Promise(r => setTimeout(r, duration));
}

function renderResult(result) {
  const li = document.createElement('li');
  li.innerHTML = result.message;
  li.className = result.passed ? 'passed' : 'failed';
  return li;
}
