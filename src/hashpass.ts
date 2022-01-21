import sha256, { Hash } from 'fast-sha256';
import { fromByteArray } from 'base64-js';

const rounds = Math.pow(2, 16);

export default function hashpass(
  domain: string,
  universalPassword: string,
): string {
  let bytes = new TextEncoder().encode(
    `${domain.trim().toLowerCase()}/${universalPassword}`,
  );

  for (let i = 0; i < rounds; i += 1) {
    bytes = sha256(bytes);
  }

  return fromByteArray(bytes).slice(0, 16);
}
