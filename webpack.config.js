const path = require('path');
// Плагіни
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Видаляє папку dist
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// мініфікатори css
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

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
         new OptimizeCssAssetWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }

   return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

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
   devServer: {
      // port: 4200,
      // Штука знизу не дає автоматично перезавантажуватись браузеру, тому закоментував
      // hot: isDev,
      contentBase: './dist'
   },
   plugins: [
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
   ],
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
         }
      ]
   }

}
