import execute from './execute.ts';

export default async function fillInPassword(generatedPassword: string): Promise<undefined | null> {
  return await execute((newPassword: string) => {
    let element = document.activeElement;
    let iframeElementType = HTMLIFrameElement;
    let inputElementType = HTMLInputElement;

    // If the active element is an iframe, descend into it to find the innermost active element.
    while (element instanceof iframeElementType) {
      const contentDocument = element.contentDocument;
      const contentWindow = element.contentWindow;

      if (contentDocument !== null && contentWindow !== null) {
        element = contentDocument.activeElement;
        iframeElementType = contentWindow.window.HTMLIFrameElement;
        inputElementType = contentWindow.window.HTMLInputElement;
      }
    }

    if (element instanceof inputElementType) {
      element.value = newPassword;
      // oxlint-disable-next-line no-undefined -- A successful script result is explicitly void.
      return undefined;
    }

    return null;
  }, generatedPassword);
}
