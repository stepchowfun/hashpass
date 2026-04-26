import execute from './execute';

const isFrameElement = (
  activeElement: Element | null,
): activeElement is HTMLIFrameElement =>
  activeElement !== null && activeElement.tagName === 'IFRAME';

const isInputElement = (
  activeElement: Element | null,
): activeElement is HTMLInputElement =>
  activeElement !== null && activeElement.tagName === 'INPUT';

export default async function fillInPassword(
  generatedPassword: string,
): Promise<undefined | null> {
  return execute((passwordToFill: string) => {
    let element = document.activeElement;

    while (isFrameElement(element)) {
      const { contentDocument, contentWindow } = element;

      if (contentDocument === null || contentWindow === null) {
        break;
      }

      element = contentDocument.activeElement;
    }

    if (isInputElement(element)) {
      element.value = passwordToFill;
      return undefined;
    }

    return null;
  }, generatedPassword);
}
