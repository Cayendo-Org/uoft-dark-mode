const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const moveProps = require("postcss-move-props-to-bg-image-query");
const autoPrefixer = require("autoprefixer");
const inputRange = require('postcss-input-range');
const { NODE_ENV = "production" } = process.env;

module.exports = {
  plugins: [
    new MiniCssExtractPlugin(),
    new RemoveEmptyScriptsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
      chunks: ["index"],
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "src", "CNAME"), to: "" }
      ],
    })
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../docs"),
    },
    compress: true,
    port: 25565,
    liveReload: true,
    watchFiles: ["src/**/*", "../docs/**/*"],
  },
  entry: {
    index: path.join(__dirname, "src", "index.ts"),
  },
  mode: NODE_ENV,
  // target: "node",
  output: {
    path: path.resolve(__dirname, "../docs"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.svg(\?.*)?$/,
        use: ["svg-transform-loader"],
        type: "asset/inline",
      },
      {
        test: /\.(png|jpg|gif|webp|pdf)$/,
        type: "asset/resource",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [moveProps(), autoPrefixer(), inputRange()],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "inline-source-map",
  watch: NODE_ENV === "development",
};
