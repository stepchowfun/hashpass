import execute from './execute';

export default async function getDomain(): Promise<string | null> {
  const domain = await execute(
    (_argument: null) => window.location.hostname,
    null,
  );

  return domain ?? null;
}
