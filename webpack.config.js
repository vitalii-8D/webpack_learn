// For the first do the next:
// npm i -D webpack webpack-cli

const path = require('path');
// Плагіни
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Видаляє папку dist
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// мініфікатори css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// Мінімізує й агліфає JS
const TerserWebpackPlugin = require('terser-webpack-plugin')
// Analizer
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
// BrowserSync
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Функція додає мініфікатори файлів якщо збірка відбувається в режимі production
const optimization = () => {
   let config = {
      splitChunks: {
         // виносе загальний код такий як бібліотеки в окремий файл, зменшуючи розмір модулів
         chunks: "all"
      }
   }
   if (isProd) {
      config.minimizer = [
         new OptimizeCssAssetsWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }

   return config
}
// В дев розробці нам не треба незрозумілі назви з хешами, тому робим так:
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// Функція яка тупо зменшує код нашого конфігу
const cssLoaders = extra => {
   const loaders = [{
      loader: MiniCssExtractPlugin.loader,
      options: {
         publicPath: './',
      },
   }, 'css-loader'
   ]

   if (extra) {
      loaders.push(extra);
   }

   return loaders;
}

const babelOptions = preset => {
   let options = {
      presets: [
         // цей пресет адаптує код під різні браузери, треба прописати в package.json властивість
         // "browserslist": "> 0.25%, not dead",  або щось інакше з документашки
         '@babel/preset-env'
      ],
      plugins: [
         // для статичних полів в класах і т.д
         '@babel/plugin-proposal-class-properties'
      ]
   }

   if (preset) {
      options.presets.push(preset);
   }

   return options;
}

const jsLoaders = () => {
   const loaders = [{
      loader: "babel-loader",
      options: babelOptions()
   }]

   if (isDev) {
      loaders.push('eslint-loader');
   }

   return loaders;
}

const plugins = () => {
   const base = [
      // Без початкових налаштувань сам створює індекс файл та підключає всі скрипти
      // При створенні хешованих js айлів одразу підключає новостворені
      new HTMLWebpackPlugin({
         // title: "Webpack Vitalik",  при template ключ title не задає заголовок
         template: "./index.html",
         // Робить html дним рядочком
         minify: {
            collapseWhitespace: isProd
         }
      }),
      new CleanWebpackPlugin(),
      // копіює вказані файли у вказану папку
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, 'src/favicon.ico'),
               to: path.resolve(__dirname, 'dist')
            }
         ]
      }),
      new MiniCssExtractPlugin({
         filename: filename('css')
      })
   ]

   if (isProd) {
      base.push(new BundleAnalyzerPlugin())
   }
   if (isDev) {
      base.push(new BrowserSyncPlugin({
         // browse to http://localhost:3000/ during development,
         host: 'localhost',
         port: 3000,
         server: { baseDir: ['dist'] }
      }))
   }

   return base;
}

module.exports = {
   // вказує на папку з вихідними файлами.
   // Тут далі src можна видалити з початку шляхів
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: {
      // '@babel/polyfill' потрібен для коректної обробки async запитів
      main: ['@babel/polyfill', './index.jsx'],
      analytics: './analytics.ts'
   },
   output: {
      // [name] - патерн вставляє імена з entry вище
      // filename: '[name].bundle.js',
      // [contenthash] - ставляє в назву новий хеш при білді якщо змінився вихідний файл
      filename: filename('js'),
      path: path.resolve(__dirname, 'dist')
   },
   resolve: {
      // розширення за замовчуванням (можна не писати розширення в імпортах)
      extensions: ['.js', '.json', '.png'],
      // дозволяє прописати еліаси і робити за їх допомоги імпорти
      alias: {
         '@models': path.resolve(__dirname, 'src/models'),
         '@': path.resolve(__dirname, 'src')
      }
   },
   optimization: optimization(),
   /*devServer: {
      // port: 4200,
      // Штука знизу не дає автоматично перезавантажуватись браузеру, тому закоментував
      // hot: isDev,
      contentBase: './dist'
   },*/
   // Ну соурс меп, ясно шо
   // devtool: isDev ? 'source-map' : '',
   plugins: plugins(),
   module: {
      rules: [
         {
            test: /\.css$/,
            // use: ['style-loader', 'css-loader']
            use: cssLoaders()
         },
         {
            test: /\.less$/,
            use: cssLoaders('less-loader')
         },
         {
            test: /\.s[ac]ss$/,
            use: cssLoaders('sass-loader')
         },
         {
            // цей лоадер імпортує картинку і автоматично в білді замість
            // імпорту проставляє шлях до картинки
            test: /\.(png|jpg|svg|gif)$/,
            use: ['file-loader']
         },
         {
            test: /\.(ttf|woff|woff2|eot)$/,
            use: ['file-loader']
         },
         {
            test: /\.xml$/,
            use: ['xml-loader']
         },
         {
            test: /\.csv$/,
            use: ['csv-loader']
         },
         {  // Стандартне підключення babel-loader і '@babel/preset-env'
            test: /\.m?js$/,
            exclude: /node_modules/,
            // loader: 'babel-loader'
            use: jsLoaders()
         },
         {  // Type Script
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: babelOptions('@babel/preset-typescript')
            }
         },
         {  // JSX react
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: babelOptions('@babel/preset-react')
            }
         }
      ]
   }
   // Babel - basic
   //npm install --save-dev babel-loader @babel/core
   //npm install --save-dev @babel/preset-env
      // needed to ad to loaders options: {presets: ["@babel/preset-env"]}
   //npm install --save @babel/polyfill   not a devDep!!!
      // needs to change entry: ['@babel/polyfill', './index.jsx'],
   //npm install --save-dev @babel/plugin-proposal-class-properties
      // needed to ad to loaders options: {plugins: ["@babel/plugin-proposal-class-properties"]}
}
