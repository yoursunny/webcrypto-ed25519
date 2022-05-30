# Ed25519 Ponyfill & Polyfill for WebCrypto

`@yoursunny/webcrypto-ed25519` package adds [Ed25519](https://ed25519.cr.yp.to/) crypto algorithm to [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) in browsers.
The crypto implementation comes from [@noble/ed25519](https://www.npmjs.com/package/@noble/ed25519) library.

## Caution

This library should be considered suitable for research and experimentation.
Further code and security review is needed before utilization in a production application.

## Usage

```js
import { polyfillEd25519, ponyfillEd25519 } from "@yoursunny/webcrypto-ed25519";

// ponyfill: crypto.subtle remains unchanged; call methods on the returned SubtleCrypto instance.
const subtlePonyfill = ponyfillEd25519();
subtlePonyfill.generateKey({ name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
                           true, ["sign", "verify"]);

// polyfill: crypto.subtle is patched to support NODE-ED25519 algorithm.
polyfillEd25519();
crypto.subtle.generateKey({ name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
                          true, ["sign", "verify"]);
```

## Features

* `subtle.generateKey`:
  * algorithm: `{ name: "NODE-ED25519", namedCurve: "NODE-ED25519" }`
* `subtle.exportKey`:
  * format: `"jwk"` or `"spki"`
* `subtle.importKey`:
  * format: `"jwk"` or `"spki"`
* `subtle.sign`:
  * algorithm: `"NODE-ED25519"`
* `subtle.verify`:
  * algorithm: `"NODE-ED25519"`

All other methods and non-Ed25519 keys are passed to the original `SubtleCrypto` implementation.
