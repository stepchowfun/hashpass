// oxlint-disable oxc/no-async-await -- Chrome extension APIs are clearer with async/await.
function hasResult<T>(
  injectionResult: chrome.scripting.InjectionResult<T>,
): injectionResult is chrome.scripting.InjectionResult<T> & { result: T } {
  return Object.hasOwn(injectionResult, 'result');
}

export default async function execute<T, U>(
  func: (argument: T) => U,
  argument: T,
): Promise<chrome.scripting.Awaited<U> | null> {
  let tab;

  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch {
    return null;
  }

  const tabId = tab.id;

  if (typeof tabId !== 'number') {
    return null;
  }

  let injectionResult: chrome.scripting.InjectionResult<chrome.scripting.Awaited<U>>;

  try {
    [injectionResult] = await chrome.scripting.executeScript<[T], U>({
      target: { tabId },
      func,
      args: [argument],
    });
  } catch {
    return null;
  }

  if (!hasResult(injectionResult)) {
    return null;
  }

  return injectionResult.result;
}
