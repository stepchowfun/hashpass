import execute from './execute';

export default async function fillInPassword(
  generatedPassword: string,
): Promise<undefined | null> {
  return await execute((generatedPassword: string) => {
    let element = document.activeElement;
    let iframeElementType = HTMLIFrameElement;
    let inputElementType = HTMLInputElement;

    while (element instanceof iframeElementType) {
      const contentDocument = element.contentDocument;
      const contentWindow = element.contentWindow;

      if (contentDocument !== null && contentWindow !== null) {
        element = contentDocument.activeElement;
        iframeElementType = (contentWindow as any).HTMLIFrameElement;
        inputElementType = (contentWindow as any).HTMLInputElement;
      }
    }

    if (element instanceof inputElementType) {
      element.value = generatedPassword;
      return undefined;
    }

    return null;
  }, generatedPassword);
}
