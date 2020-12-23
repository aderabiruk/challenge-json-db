const fs = require("fs")

module.exports = {
    read,
    write,
    exists,
    parseObject,
    createObject,
    deleteObject
}

function exists (filepath) {
    return fs.existsSync(filepath)
}

function read (filepath) {
    if (exists(filepath)) {
        let data = fs.readFileSync(filepath)
        return JSON.parse(data)
    }
    else {
        return { }
    }
}

function write (filepath, payload) {
    let data = JSON.stringify(payload)
    fs.writeFileSync(filepath, data)
}

function parseObject (object, path) {
    return path.reduce((item, key) => (item && item[key] != null) ? item[key] : null, object)
}

function createObject (object, path, value) {
    for (let i = 0; i < path.length - 1; ++i) {
       key  = path[i]
        if (!(key in object)) {
            object[key] = {}
        } 
        object = object[key]
    }
    object[path[path.length - 1]] = value
}

function deleteObject (object, path) {
    lastItem = path.pop()
    lastKey = path.length - 1

    currentObject = object
    for (let i = 0; i <= lastKey; ++i) {
        currentObject = currentObject[path[i]]
        if (!currentObject) {
            return
        }
    }
    delete currentObject[lastItem]
}