require("webpack");

let config = {
    entry: './bin/echobot.js',
    output: {
        filename: "echobot.js"
    },
    node: {
        fs: 'empty'
    },
    target: "node"
};

module.exports = config;