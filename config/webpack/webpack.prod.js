import { plugins } from '../settings/plugins.js'
import { paths } from '../settings/paths.js'

import { extensionsAndAliases } from './plugins/extensionsAndAliases.js'
import { replaceLoaderOptions } from './plugins/replaceLoaderOptions.js'
import { cssLoaderOptions } from './plugins/cssLoaderOptions.js'
import { output } from './plugins/webPackOutputFile.js'
import { pugPages } from './plugins/pugPages.js'
import { linters } from './plugins/linters.js'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const config = {
	mode: 'production',
	cache: {
		type: 'filesystem'
	},
	optimization: {
		minimizer: [
			new plugins.TerserPlugin({
				extractComments: false
			})
		]
	},
	output: output('app.min.js'),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				resolve: {
					fullySpecified: false
				}
			}, {
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'string-replace-loader',
						options: replaceLoaderOptions('../')
					}, {
						loader: 'css-loader',
						options: cssLoaderOptions()
					}, {
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: 'expanded'
							}
						}
					}
				]
			}, {
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader',
						options: {
							pretty: true,
							self: true
						}
					}, {
						loader: 'string-replace-loader',
						options: replaceLoaderOptions('')
					}
				]
			}
		]
	},
	plugins: [
		linters.styleLint,
		linters.esLint,

		...pugPages.map(pugPage => new plugins.HtmlWebpackPlugin({
			minify: false,
			inject: false,
			template: `${paths.srcFolder}/views/${pugPage}`,
			filename: `../${pugPage.replace(/\.pug$/, '.html')}`,
			production: true
		})),
		new MiniCssExtractPlugin({
			filename: '../css/style.css'
		}),
		new plugins.CopyPlugin({
			patterns: [
				{
					from: paths.src.static,
					to: '../static',
					noErrorOnMissing: true
				}, {
					from: paths.src.favicon,
					to: '../',
					noErrorOnMissing: true
				}
			]
		})
	],
	resolve: extensionsAndAliases
}

export default config
