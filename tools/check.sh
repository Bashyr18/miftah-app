#!/bin/bash
# Everything that must stay true before a build is trusted. Needs the dev server on 5191 for the browser check.
cd "$(dirname "$0")/.."
node tools/test.js | tail -1
node tools/smoke.js | tail -1
node tools/teach-check.js | tail -1
node tools/strings.js | head -1
node tools/cdp.js tools/e2e-honesty.js build/e2e
node tools/cdp.js tools/teach-screens.js build/e2e
