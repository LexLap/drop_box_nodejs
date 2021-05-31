
const getFileType = (fileName) => {
    const fileNameParts = fileName.split('.')
    const extension = fileNameParts[fileNameParts.length-1]
    const fileType = extension.toLowerCase()

    return fileType
}

module.exports = getFileType