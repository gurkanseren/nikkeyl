import { plugins } from '../settings/plugins.js'
import { paths } from '../settings/paths.js'

import { extensionsAndAliases } from './plugins/extensionsAndAliases.js'
import { replaceLoaderOptions } from './plugins/replaceLoaderOptions.js'
import { cssLoaderOptions } from './plugins/cssLoaderOptions.js'
import { output } from './plugins/webPackOutputFile.js'
import { pugPages } from './plugins/pugPages.js'

const config = {
	mode: 'development',
	devtool: 'inline-source-map',
	stats: 'errors-warnings',
	optimization: {
		minimize: false
	},
	entry: `${paths.srcFolder}/js/app.js`,
	output: output('js/app.min.js'),
	devServer: {
		static: paths.buildFolder,
		historyApiFallback: true,
		compress: true,
		port: 3000,
		open: true,

		watchFiles: [
			`${paths.srcFolder}/img/**/*.*`,
			`${paths.srcFolder}/**/*.json`,
			`${paths.srcFolder}/**/*.pug`
		]
	},
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
				exclude: `${paths.srcFolder}/fonts`,
				use: [
					'style-loader',
					{
						loader: 'string-replace-loader',
						options: replaceLoaderOptions('../')
					}, {
						loader: 'css-loader',
						options: cssLoaderOptions(1, true, '/')
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}, {
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader',
						options: {
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
		...pugPages.map(pugPage => new plugins.HtmlWebpackPlugin({
			minify: false,
			inject: false,
			template: `${paths.srcFolder}/${pugPage}`,
			filename: pugPage.replace(/\.pug$/, '.html'),
			production: false
		})),
		new plugins.CopyPlugin({
			patterns: [
				{
					from: `${paths.srcFolder}/img`,
					to: 'img',
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${paths.srcFolder}/static`,
					to: 'static',
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${paths.srcFolder}/favicon.ico`,
					to: './',
					noErrorOnMissing: true
				}
			]
		})
	],
	resolve: extensionsAndAliases
}

export default config