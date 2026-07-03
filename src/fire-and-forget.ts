export default function fireAndForget(promise: Promise<void>): void {
  // If the promise fails, just log the error and continue.
  promise.catch((error: unknown) => {
    window.requestAnimationFrame(() => {
      throw error;
    });
  });
}
