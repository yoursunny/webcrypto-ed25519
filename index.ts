import compareVersions from "compare-versions";
import { version as nodeVersion } from "node:process";

import { C } from "./common.js";

const wicgKeyAlgorithm: KeyAlgorithm = {
  name: C.wicgAlgorithm,
};

const nodeKeyAlgorithm: EcKeyAlgorithm = {
  name: C.nodeAlgorithm,
  namedCurve: C.nodeNamedCurve,
};

export const Ed25519Algorithm: KeyAlgorithm = compareVersions(nodeVersion, "18.4.0") >= 0 ? wicgKeyAlgorithm : nodeKeyAlgorithm;

export function ponyfillEd25519(subtle = crypto.subtle): SubtleCrypto {
  return subtle;
}

export function polyfillEd25519(): void {
  //
}
