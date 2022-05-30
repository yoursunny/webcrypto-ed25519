import { polyfillEd25519, ponyfillEd25519 } from "../browser.js";
import { testSubtleCrypto } from "./body.js";

(async () => {
await testSubtleCrypto(ponyfillEd25519());

polyfillEd25519();
await testSubtleCrypto(crypto.subtle);
})();
