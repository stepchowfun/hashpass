export default async function execute<T, U>(
  func: (argument: T) => U,
  argument: T,
): Promise<Awaited<U> | null | undefined> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs.length === 0 || tabs[0].id === undefined) {
      return null;
    }

    const tabId = tabs[0].id;

    const [result] = await chrome.scripting.executeScript<[T], U>({
      target: { tabId },
      func,
      args: [argument],
    });

    if ('error' in result) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Chrome loses U.
    return result.result as Awaited<U> | undefined;
  } catch (_error) {
    return null;
  }
}
