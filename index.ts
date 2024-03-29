import { satisfies } from "compare-versions";

import { C } from "./common.js";

const wicgKeyAlgorithm: KeyAlgorithm = {
  name: C.wicgAlgorithm,
};

const nodeKeyAlgorithm: EcKeyAlgorithm = {
  name: C.nodeAlgorithm,
  namedCurve: C.nodeNamedCurve,
};

export const Ed25519Algorithm: KeyAlgorithm =
  satisfies(process.version, "<18.4.0") && !satisfies(process.version, "^16.17.0") ?
    nodeKeyAlgorithm : wicgKeyAlgorithm;

export function ponyfillEd25519(subtle = crypto.subtle): SubtleCrypto {
  return subtle;
}

export function polyfillEd25519(): void {
  //
}
