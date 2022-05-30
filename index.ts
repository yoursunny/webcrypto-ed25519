export function ponyfillEd25519(subtle = crypto.subtle): SubtleCrypto {
  return subtle;
}

export function polyfillEd25519(): void {
  //
}
