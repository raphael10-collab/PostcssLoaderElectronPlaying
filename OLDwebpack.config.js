const path = require('path');
const cwd = process.cwd();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');


function srcPaths(src) {
  return path.join(__dirname, src);
}

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

  // main process
var main_config = {
    mode: isEnvProduction ? 'production' : 'development',
    entry: './src/main/main.ts',
    target: 'electron-main',
    resolve: {
      extensions: ['.jsx', '.js', 'ts'],
    },
    externals: [
      {
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      },
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.(sass|less|css)$/i,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/css/'
          },
        },
        {
          test: /\.s?css$/,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/css/'
          },
        },


        {
          test: /\.pcss$/,
          type: 'asset',
          use: [
              { // https://github.com/webpack-contrib/postcss-loader#getting-started
                  loader: 'postcss-loader',
                  options: {
                      postcssOptions: {
                        plugins: [
                          "postcss-preset-env",
                        ],
                      },
                      //sourceMap: true,
                  },
              },
          ],
        },


        {
          test: /\.(svg)$/i,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/svg/'
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/pics/'
          },
        },

        {
          test: /\.geojson$/,
           use: [
             {
               loader: "json-loader",
             }
          ],
        }
      ]
    },
    output: {
      path: __dirname + '/dist',
      filename: 'main.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
};

  // renderer process
var renderer_config =  {
    mode: isEnvProduction ? 'production' : 'development',
    entry: {
      app: ['./src/app/index.tsx', 'react-app-polyfill/stable'],
      style: [
        './src/app/styles/index.css',
        path.resolve(__dirname, 'node_modules/leaflet/dist/leaflet.css')
      ]
    },
    //target: 'electron-renderer',
    //target: 'web',
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.jsx', '.js', '.tsx', '.ts'],
    },
    output: {
      path: __dirname + '/dist/',
      	//filename: 'renderer.js'
      filename: '[name].js',
    },
    externals: [
      {
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      },
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          // css files
          test: /\.css$/i,
          use: [
            //{
              //loader: 'style-loader'
            //},
            //{
              //loader: 'css-loader'
            //},
            isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ],
        },

        {
          test: /\.pcss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            { // https://github.com/webpack-contrib/postcss-loader#getting-started
                  loader: 'postcss-loader',
                  options: {
                      //config: {
                        //path: `${__dirname}/postcss.config.js`,
                      //},
                      postcssOptions: {
                        plugins: [
                          "postcss-preset-env",
                        ],
                      },
                      //sourceMap: true,
                  },
            },
          ],
        },

        {
          test: /\.(svg)$/i,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/svg/'
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/pics/'
          },
        },
        {
          // Font files
          test: /\.(woff|woff2|ttf|otf)$/,
          type: 'asset',
          generator: {
            outputPath: 'dist/assets/css/'
          },
        },
      ],
    },
    node: {
      __dirname: false,
      __filename: false
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/app/index.html',
        inject:'body',
        chunks: ['app'],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        linkType: 'text/css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./src/assets/css"),
            to: path.resolve(__dirname, "./dist/assets/css")
          },
        ],
        options: {
          concurrency: 100,
        },
      }),
    ]
}

module.exports = [
  main_config,
  renderer_config,
];
