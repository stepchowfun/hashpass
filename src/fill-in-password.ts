import execute from "./execute.ts";

export default async function fillInPassword(generatedPassword: string): Promise<undefined | null> {
  return await execute((newPassword: string) => {
    let element = document.activeElement;
    let iframeElementType = HTMLIFrameElement;
    let inputElementType = HTMLInputElement;

    // If the active element is an iframe, descend into it to find the innermost active element.
    while (element instanceof iframeElementType) {
      const contentDocument = element.contentDocument;
      const contentWindow = element.contentWindow as (Window & typeof globalThis) | null;

      if (contentDocument !== null && contentWindow !== null) {
        element = contentDocument.activeElement;
        iframeElementType = contentWindow.HTMLIFrameElement;
        inputElementType = contentWindow.HTMLInputElement;
      }
    }

    if (element instanceof inputElementType) {
      element.value = newPassword;
      return undefined;
    }

    return null;
  }, generatedPassword);
}
