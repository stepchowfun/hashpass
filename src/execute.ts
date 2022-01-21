export default async function execute<T, U>(
  func: (argument: T) => U,
  argument: T,
): Promise<U | null> {
  let tab;

  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch (e) {
    return null;
  }

  const tabId = tab.id;

  if (tabId === undefined) {
    return null;
  }

  let result;

  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func,
      args: [argument],
    });
  } catch (e) {
    return null;
  }

  return result;
}
