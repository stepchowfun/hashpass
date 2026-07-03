import execute from "./execute.ts";

export default async function getDomain(): Promise<string | null> {
  return await execute(() => window.location.hostname, null);
}
