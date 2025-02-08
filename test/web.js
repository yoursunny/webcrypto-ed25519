import { Ed25519Algorithm, hasNativeSupport, polyfillEd25519, ponyfillEd25519 } from "../browser.js";
import { testSubtleCrypto } from "./body.js";

document.querySelector("#mode").textContent = hasNativeSupport ? "native" : "polyfill";
const $message = document.querySelector("#message");

try {
  const t0 = Date.now();

  await testSubtleCrypto(ponyfillEd25519(), Ed25519Algorithm);

  polyfillEd25519();
  await testSubtleCrypto(crypto.subtle, Ed25519Algorithm);

  $message.textContent = `PASS ${Date.now() - t0}ms`;
} catch (err) {
  $message.textContent = err.message;
}
