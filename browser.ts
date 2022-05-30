import * as ed from "@noble/ed25519";
import * as asn1 from "@yoursunny/asn1";
// @ts-expect-error no typing
import { toBase64Url as b64encode, toBuffer as b64decode } from "b64u-lite";

function asUint8Array(b: BufferSource): Uint8Array {
  if (b instanceof Uint8Array) {
    return b;
  }
  if (b instanceof ArrayBuffer) {
    return new Uint8Array(b);
  }
  return new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
}

function asArrayBuffer(b: Uint8Array): ArrayBuffer {
  if (b.byteLength === b.buffer.byteLength) {
    return b.buffer;
  }
  return b.buffer.slice(b.byteOffset, b.byteLength);
}

const C = {
  algorithm: "NODE-ED25519",
  namedCurve: "NODE-ED25519",
  kty: "OKP",
  crv: "Ed25519",
  oid: "2B6570".toLowerCase(),
};

const slot = "8d9df0f7-1363-4d2c-8152-ce4ed78f27d8";

interface Ed25519CryptoKey extends CryptoKey {
  [slot]: Uint8Array;
}

class Ponyfill implements Record<keyof SubtleCrypto, Function> {
  constructor(private readonly super_: SubtleCrypto) {
    this.orig_ = {} as any;
    for (const method of ["generateKey", "exportKey", "importKey", "encrypt", "decrypt", "wrapKey", "unwrapKey", "deriveBits", "deriveKey", "sign", "verify", "digest"] as const) {
      if (this[method]) {
        this.orig_[method] = super_[method];
      } else {
        this[method] = super_[method].bind(super_) as any;
      }
    }
  }

  private readonly orig_: Record<keyof SubtleCrypto, Function>;

  public async generateKey(algorithm: EcKeyGenParams, extractable: boolean, keyUsages: Iterable<KeyUsage>): Promise<CryptoKeyPair> {
    if (algorithm.name === C.algorithm && algorithm.namedCurve === C.namedCurve) {
      const pvt = ed.utils.randomPrivateKey();
      const pub = await ed.getPublicKey(pvt);

      const usages = Array.from(keyUsages);
      const privateKey: Ed25519CryptoKey = {
        algorithm,
        extractable,
        type: "private",
        usages,
        [slot]: pvt,
      };
      const publicKey: Ed25519CryptoKey = {
        algorithm,
        extractable: true,
        type: "public",
        usages,
        [slot]: pub,
      };
      return { privateKey, publicKey };
    }
    return this.orig_.generateKey.apply(this.super_, arguments);
  }

  public async exportKey(format: KeyFormat, key: CryptoKey): Promise<JsonWebKey | ArrayBuffer> {
    if (key.algorithm.name === C.algorithm && key.extractable) {
      const raw = (key as Ed25519CryptoKey)[slot];
      switch (format) {
        case "jwk": {
          const jwk: JsonWebKey = {
            kty: C.kty,
            crv: C.crv,
          };
          if (key.type === "public") {
            jwk.x = b64encode(raw);
          } else {
            jwk.d = b64encode(raw);
            jwk.x = b64encode(await ed.getPublicKey(raw));
          }
          return jwk;
        }
        case "spki": {
          return asArrayBuffer(asn1.pack([
            "30",
            [
              ["30", [["06", "2B6570"]]],
              ["03", raw],
            ],
          ]));
        }
      }
    }
    return this.orig_.exportKey.apply(this.super_, arguments);
  }

  public async importKey(format: KeyFormat, keyData: JsonWebKey | BufferSource, algorithm: EcKeyImportParams, extractable: boolean, keyUsages: Iterable<KeyUsage>): Promise<CryptoKey> {
    if (algorithm.name === C.algorithm && algorithm.namedCurve === C.namedCurve) {
      const usages = Array.from(keyUsages);
      switch (format) {
        case "jwk": {
          const jwk = keyData as JsonWebKey;
          if (jwk.kty !== C.kty || jwk.crv !== C.crv || !jwk.x) {
            break;
          }

          const key: Ed25519CryptoKey = {
            algorithm,
            extractable,
            type: jwk.d ? "private" : "public",
            usages,
            [slot]: b64decode(jwk.d ?? jwk.x),
          };
          return key;
        }
        case "spki": {
          const der = asn1.parseVerbose(asUint8Array(keyData as BufferSource));
          const algo = der.children?.[0]?.children?.[0]?.value;
          const raw = der.children?.[1]?.value;
          if (!(algo instanceof Uint8Array) || ed.utils.bytesToHex(algo) !== C.oid || !(raw instanceof Uint8Array)) {
            break;
          }
          const key: Ed25519CryptoKey = {
            algorithm,
            extractable: true,
            type: "public",
            usages,
            [slot]: raw,
          };
          return key;
        }
      }
    }
    return this.orig_.importKey.apply(this.super_, arguments);
  }

  public async sign(algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer> {
    if (algorithm === C.algorithm && key.algorithm.name === C.algorithm && key.type === "private" && key.usages.includes("sign")) {
      return asArrayBuffer(await ed.sign(asUint8Array(data), (key as Ed25519CryptoKey)[slot]));
    }
    return this.orig_.sign.apply(this.super_, arguments);
  }

  public async verify(algorithm: AlgorithmIdentifier, key: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean> {
    if (algorithm === C.algorithm && key.algorithm.name === C.algorithm && key.type === "public" && key.usages.includes("verify")) {
      return ed.verify(asUint8Array(signature), asUint8Array(data), (key as Ed25519CryptoKey)[slot]);
    }
    return this.orig_.verify.apply(this.super_, arguments);
  }
}
interface Ponyfill extends Record<keyof SubtleCrypto, Function> {}

export function ponyfillEd25519(subtle = crypto.subtle): SubtleCrypto {
  return new Ponyfill(subtle) as unknown as SubtleCrypto;
}

export function polyfillEd25519(): void {
  Object.defineProperty(globalThis.crypto, "subtle", {
    value: ponyfillEd25519(),
    configurable: true,
  });
}
