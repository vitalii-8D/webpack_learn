const path = require('path');
// Плагіни
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Видаляє папку dist

module.exports = {
   mode: 'development',
   entry: {
      main: './src/index.js',
      analytics: './src/analytics.js'
   },
   output: {
      // [name] - патерн вставляє імена з entry вище
      // filename: '[name].bundle.js',
      // [contenthash] - ставляє в назву новий хеш при білді якщо змінився вихідний файл
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
   },
   plugins: [
      // Без початкових налаштувань сам створює індекс файл та підключає всі скрипти
      // При створенні хешованих js айлів одразу підключає новостворені
      new HTMLWebpackPlugin({
         // title: "Webpack Vitalik",  при template ключ title не задає заголовок
         template: "./src/index.html"
      }),
      new CleanWebpackPlugin()
   ]
}
