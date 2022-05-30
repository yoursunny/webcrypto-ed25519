import assert from "minimalistic-assert";

const algo = {
  name: "NODE-ED25519",
  namedCurve: "NODE-ED25519",
};

const plaintext = new TextEncoder().encode("eyJhbGciOiJFZERTQSJ9.RXhhbXBsZSBvZiBFZDI1NTE5IHNpZ25pbmc");
const expectedSignature = Uint8Array.of(
  0x86, 0x0C, 0x98, 0xD2, 0x29, 0x7F, 0x30, 0x60, 0xA3, 0x3F, 0x42, 0x73, 0x96, 0x72, 0xD6, 0x1B,
  0x53, 0xCF, 0x3A, 0xDE, 0xFE, 0xD3, 0xD3, 0xC6, 0x72, 0xF3, 0x20, 0xDC, 0x02, 0x1B, 0x41, 0x1E,
  0x9D, 0x59, 0xB8, 0x62, 0x8D, 0xC3, 0x51, 0xE2, 0x48, 0xB8, 0x8B, 0x29, 0x46, 0x8E, 0x0E, 0x41,
  0x85, 0x5B, 0x0F, 0xB7, 0xD8, 0x3B, 0xB1, 0x5B, 0xE9, 0x02, 0xBF, 0xCC, 0xB8, 0xCD, 0x0A, 0x02);

/**
 * @param {SubtleCrypto} subtle
 * @param {CryptoKey} privateKey
 * @param {CryptoKey} publicKey
 */
async function testKeyPair(subtle, privateKey, publicKey) {
  const pvtJwk = await subtle.exportKey("jwk", privateKey);
  privateKey = await subtle.importKey("jwk", pvtJwk, algo, true, ["sign"]);
  const pubJwk = await subtle.exportKey("jwk", publicKey);
  publicKey = await subtle.importKey("jwk", pubJwk, algo, true, ["verify"]);
  console.log(pvtJwk);
  console.log(pubJwk);
  const pubSpki = await subtle.exportKey("spki", publicKey);
  publicKey = await subtle.importKey("spki", pubSpki, algo, true, ["verify"]);

  const sig = await subtle.sign(algo.name, privateKey, plaintext);
  const verified = await subtle.verify(algo.name, publicKey, sig, plaintext);
  assert(verified);
  return sig;
}

/**
 * @param {SubtleCrypto} subtle
 * @returns {Promise<void>}
 */
export async function testSubtleCrypto(subtle) {
  const { privateKey, publicKey } = await subtle.generateKey(algo, true, ["sign", "verify"]);
  await testKeyPair(subtle, privateKey, publicKey);

  // https://datatracker.ietf.org/doc/html/rfc8037#appendix-A
  const pvt = await subtle.importKey("jwk", {
    kty: "OKP",
    crv: "Ed25519",
    d: "nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A",
    x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
  }, algo, true, ["sign"]);
  const pub = await subtle.importKey("jwk", {
    kty: "OKP",
    crv: "Ed25519",
    x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
  }, algo, true, ["verify"]);
  const sig = new Uint8Array(await testKeyPair(subtle, pvt, pub));
  assert.equal(sig.length, expectedSignature.length);
  for (const [i, element] of sig.entries()) {
    assert.equal(element, expectedSignature[i]);
  }
}