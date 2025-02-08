import { C } from "./common.js";

export const Ed25519Algorithm: AlgorithmIdentifier = {
  name: C.wicgAlgorithm,
};

export function ponyfillEd25519(subtle = crypto.subtle): SubtleCrypto {
  return subtle;
}

export function polyfillEd25519(): void {
  //
}
