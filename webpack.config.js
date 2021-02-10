const path = require('path');
// Плагіни
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Видаляє папку dist

module.exports = {
   // вказує на папку з вихідними файлами. Тут далі src можна видалити з початку шляхів
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: {
      main: './index.js',
      analytics: './analytics.js'
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
         template: "./index.html"
      }),
      new CleanWebpackPlugin()
   ],
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader','css-loader']
         }
      ]
   }

}
