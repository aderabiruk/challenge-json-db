const path = require("path")

module.exports = {
    getStudentStorageFilepath
}

function getStudentStorageFilepath(studentId) {
    return path.join('./data', `${studentId}.json`)
}