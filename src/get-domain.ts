// oxlint-disable oxc/no-async-await -- This wrapper preserves the async Chrome execution flow.
import execute from './execute.ts';

export default async function getDomain(): Promise<string | null> {
  return await execute(() => window.location.hostname, null);
}
