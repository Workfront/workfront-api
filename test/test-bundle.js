'use strict'

// require all modules ending in ".spec.js", ".spec.ts" from the
// current directory and all subdirectories
const testsContext = require.context('.', true, /\.spec\.[t]s$/)
testsContext.keys().forEach(testsContext)