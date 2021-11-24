const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const WriteFilePlugin = require("write-file-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
    entry: [
        "./src/client/index.js",
        path.join(__dirname, "src", "client", "css", "style.css"),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
            serveIndex: false,
        },
        historyApiFallback: {
            verbose: true,
            htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
            rewrites: [
                {
                    from: /^\/.*$/,
                    to: (context) => {
                        const { pathname } = context.parsedUrl;
                        return `${
                            pathname.endsWith("/")
                                ? pathname.slice(0, -1)
                                : pathname
                        }.html`;
                    },
                },
            ],
        },
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
        new WriteFilePlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/client/assets",
                    to: "assets",
                },
            ],
        }),
    ],
};

module.exports = config;
