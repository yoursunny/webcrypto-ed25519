import { webcrypto } from "node:crypto";

import { Ed25519Algorithm } from "../index.js";
import { testSubtleCrypto } from "./body.js";

await testSubtleCrypto(webcrypto.subtle, Ed25519Algorithm);
