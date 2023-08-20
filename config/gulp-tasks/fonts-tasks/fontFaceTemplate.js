const variableFont = /(?:_|__|-|\s)?(var)/i

const fontFaceTemplate = (fileName, fontFamily, fontWeight, fontStyle) => {
	if (variableFont.test(fileName)) {
		return `@font-face {\n\tsrc: url("../fonts/${fileName}.woff2") format("woff2-variations");\n\tfont-family: "${fontFamily}";\n\tfont-weight: 100 1000;\n\tfont-display: swap;\n}\n\n`
	}

	return `@font-face {\n\tsrc: url("../fonts/${fileName}.woff2") format("woff2");\n\tfont-family: "${fontFamily}";\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n\tfont-display: swap;\n}\n\n`
}

export { fontFaceTemplate }
