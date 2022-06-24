import { Ed25519Algorithm, polyfillEd25519, ponyfillEd25519 } from "../browser.js";
import { testSubtleCrypto } from "./body.js";

(async () => {
await testSubtleCrypto(ponyfillEd25519(), Ed25519Algorithm);

polyfillEd25519();
await testSubtleCrypto(crypto.subtle, Ed25519Algorithm);
})();
