import { fontConverter } from './fontConverter.js'

const ttfToWoff2 = () =>
	fontConverter({
		taskName: 'ttfToWoff2',
		fontExt: 'ttf'
	})

export { ttfToWoff2 }
