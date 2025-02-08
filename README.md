# Ed25519 Ponyfill & Polyfill for WebCrypto

`@yoursunny/webcrypto-ed25519` package adds [Ed25519](https://ed25519.cr.yp.to/) crypto algorithm to [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) in browsers.
The crypto implementation comes from [@noble/ed25519](https://www.npmjs.com/package/@noble/ed25519) library.

## Caution

This library should be considered suitable for research and experimentation.
Further code and security review is needed before utilization in a production application.

## Usage

```js
import { Ed25519Algorithm, polyfillEd25519, ponyfillEd25519 } from "@yoursunny/webcrypto-ed25519";

// ponyfill: crypto.subtle remains unchanged; call methods on the returned SubtleCrypto instance.
const subtlePonyfill = ponyfillEd25519();
subtlePonyfill.generateKey(Ed25519Algorithm, true, ["sign", "verify"]);

// polyfill: crypto.subtle is patched to support Ed25519 and NODE-ED25519 algorithms.
polyfillEd25519();
crypto.subtle.generateKey(Ed25519Algorithm, true, ["sign", "verify"]);
```

## Algorithm Identifier

The ponyfill and polyfill for browser recognize the algorithm identifier `{ name: "Ed25519" }`, as specified in [Secure Curves in the Web Cryptography API](https://wicg.github.io/webcrypto-secure-curves/) draft.

The same algorithm identifier is supported in Node.js since v18.4.0.
This package does not provide any ponyfill or polyfill for Node.js.

## Features

* `subtle.generateKey`
* `subtle.exportKey`
  * format: `"jwk"` or `"spki"`
* `subtle.importKey`
  * format: `"jwk"` or `"spki"`
* `subtle.sign`
* `subtle.verify`

All other methods and non-Ed25519 keys are passed to the original `SubtleCrypto` implementation.
