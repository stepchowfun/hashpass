import execute from './execute';

export default async function getIsPasswordFieldActive(): Promise<
  boolean | null
> {
  return await execute((argument: null) => {
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
      return element.type.trim().toLowerCase() === 'password';
    }

    return false;
  }, null);
}
