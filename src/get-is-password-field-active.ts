// oxlint-disable oxc/no-async-await -- This wrapper preserves the async Chrome execution flow.
import execute from './execute.ts';

export default async function getIsPasswordFieldActive(): Promise<boolean | null> {
  return await execute(() => {
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
      return element.type.trim().toLowerCase() === 'password';
    }

    return false;
  }, null);
}
