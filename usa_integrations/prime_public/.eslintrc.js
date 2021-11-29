module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console": 1,
        "indent": ["error", 4],
        "no-unused-vars": ["error", {
            "vars": "all",
            "args": "after-used",
            "varsIgnorePattern":  "^_"
        }]
    }
};