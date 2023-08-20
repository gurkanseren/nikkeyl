import { plugins } from '../../settings/plugins.js'
import { paths } from '../../settings/paths.js'

import { fontFaceTemplate } from './fontFaceTemplate.js'

const fontFacesFile = paths.fontFacesFile
const findItalic = /(?:_|__|-|\s)?(italic)/i
const fontWeights = {
	thin: 100,
	hairline: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	black: 900,
	heavy: 900,
	extrablack: 950,
	ultrablack: 950
}

const fontsStyles = async () => {
	try {
		if (plugins.fs.existsSync(fontFacesFile)) {
			return plugins.logger.warning('File (font-face.scss) already exists')
		}

		const fontsFolder = await plugins.fs.promises.readdir(paths.build.fonts)

		if (!fontsFolder) {
			return plugins.logger.error('No fonts files or [fonts/] folder')
		}

		await plugins.fs.promises.writeFile(fontFacesFile, '')

		let newFileOnly

		for (const fontFile of fontsFolder) {
			const [fileName] = fontFile.split('.')

			if (newFileOnly !== fileName) {
				const [fontFamily, fontWeight = 'regular'] = fileName.split('-')
				const fontWeightValue =
					fontWeights[fontWeight.replace(findItalic, '').toLowerCase()]
				const fontStyle = findItalic.test(fileName) ? 'italic' : 'normal'

				await plugins.fs.promises.appendFile(
					fontFacesFile,
					fontFaceTemplate(fileName, fontFamily, fontWeightValue, fontStyle)
				)

				newFileOnly = fileName
			}
		}

		plugins.logger.success('File (font-face.scss) written')
	} catch (error) {
		plugins.logger.error('Processing fonts', error)
	}
}

export { fontsStyles }
