const fileHelpers = require("./helpers/file.helpers")
const storageHelpers = require("./helpers/storage.helpers")

module.exports = {
    getHealth,

    // Student Property
    getStudentProperty,
    saveStudentProperty,
    deleteStudentProperty
}

async function getHealth (req, res, next) {
    res.json({ success: true })
}

async function getStudentProperty (req, res, next) {
    // Get Student Storage Filepath
    const filepath = fileHelpers.getStudentStorageFilepath(req.params.student)

    if (storageHelpers.exists(filepath)) {
        let path = req.params[0].split("/")

        // Read and Parse Student Record
        let studentRecord = storageHelpers.read(filepath)
        let result = storageHelpers.parseObject(studentRecord, path)
        if (result) {
            res.status(200).json(result)
        }
        else {
            res.status(404).json({
                message: "Student property not found!"
            })
        }
    }
    else {
        res.status(404).json({
            message: "Student record not found!"
        })
    }
}

async function saveStudentProperty (req, res, next) {
    // Get Student Storage Filepath
    const filepath = fileHelpers.getStudentStorageFilepath(req.params.student)

    // Create Student Object
    let path = req.params[0].split("/")
    let studentRecord = storageHelpers.read(filepath)

    // Build Student Record Object
    storageHelpers.createObject(studentRecord, path, req.body)

    // Write to JSON
    storageHelpers.write(filepath, studentRecord)

    res.status(200).json(studentRecord)
}

async function deleteStudentProperty (req, res, next) {
    // Get Student Storage Filepath
    const filepath = fileHelpers.getStudentStorageFilepath(req.params.student)

    if (storageHelpers.exists(filepath)) {
        let path = req.params[0].split("/")

        // Read and Parse Student Record
        let studentRecord = storageHelpers.read(filepath)
        let result = storageHelpers.parseObject(studentRecord, path)
        if (result) {
            storageHelpers.deleteObject(studentRecord, path)
            storageHelpers.write(filepath, studentRecord)
            res.status(200).json(studentRecord)
        }
        else {
            res.status(404).json({
                message: "Student property not found!"
            })
        }
    }
    else {
        res.status(404).json({
            message: "Student record not found!"
        })
    }
}