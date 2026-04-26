import execute from './execute';

const isFrameElement = (
  activeElement: Element | null,
): activeElement is HTMLIFrameElement =>
  activeElement !== null && activeElement.tagName === 'IFRAME';

const isInputElement = (
  activeElement: Element | null,
): activeElement is HTMLInputElement =>
  activeElement !== null && activeElement.tagName === 'INPUT';

export default async function getIsPasswordFieldActive(): Promise<
  boolean | null
> {
  const isPasswordFieldActive = await execute((_argument: null) => {
    let element = document.activeElement;

    while (isFrameElement(element)) {
      const { contentDocument, contentWindow } = element;

      if (contentDocument === null || contentWindow === null) {
        break;
      }

      element = contentDocument.activeElement;
    }

    if (isInputElement(element)) {
      return element.type.trim().toLowerCase() === 'password';
    }

    return false;
  }, null);

  return isPasswordFieldActive ?? null;
}
