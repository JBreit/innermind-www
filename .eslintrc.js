module.exports = {
  "name": "innermind-www",
  "version": "0.0.1",
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true,
    "jasmine": true,
    "phantomjs": true,
    "protractor": true,
    "serviceworker": true
  },
  "globals": {
    "document": true,
    "window": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "plugins": [
    "import",
    "react"
  ],
  "root": true,
  "rules": {
    "comma-dangle": ["error", "never"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", process.env.NODE_ENV === "production" ? "unix" : "windows"]
  }
};