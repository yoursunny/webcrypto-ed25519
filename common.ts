export const C = {
  wicgAlgorithm: "Ed25519",
  kty: "OKP",
  crv: "Ed25519",
  oid: "2b6570",
} as const;

export function isEd25519Algorithm(a: AlgorithmIdentifier): boolean {
  return a === C.wicgAlgorithm || (a as KeyAlgorithm).name === C.wicgAlgorithm;
}
