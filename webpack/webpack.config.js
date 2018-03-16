require("webpack");

let config = {
    entry: './bin/echobot.js',
    output: {
        filename: "echobot-bundle.js"
    },
    node: {
        fs: 'empty'
    }
};

module.exports = config;