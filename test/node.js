import { webcrypto } from "node:crypto";

import { testSubtleCrypto } from "./body.js";

await testSubtleCrypto(webcrypto.subtle);
