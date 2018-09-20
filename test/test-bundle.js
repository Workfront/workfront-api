'use strict'

require('isomorphic-fetch')

// require all modules ending in ".spec.js", ".spec.ts" from the
// current directory and all subdirectories
var testsContext = require.context('.', true, /\.spec\.[t]s$/)
testsContext.keys().forEach(testsContext)
