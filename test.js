const fs = require('fs')
const tape = require('tape')
const jsonist = require('jsonist')

const fileHelpers = require("./helpers/file.helpers")

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const student = 'aderabiruk';
const recordFilepath = fileHelpers.getStudentStorageFilepath(student)

tape('health', async function (t) {
    const url = `${endpoint}/health`
    jsonist.get(url, (err, body) => {
        if (err) t.error(err)
        t.ok(body.success, 'should have successful healthcheck')
        t.end()
    })
})


tape('saveStudentProperty: should create file and store record', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { "courses": {"calculus": {"quizzes": {"ye0ab61": {"score": "80"}}}}}
    jsonist.put(url, { "score": "80" }, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.true(fs.existsSync(recordFilepath))
        t.end()
    })
})

tape('saveStudentProperty: should update file if it already exists', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { "courses": {"calculus": {"quizzes": {"ye0ab61": {"score": "10"}}}}}
    jsonist.put(url, { "score": "10" }, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.end()
    })
})

tape('getStudentProperty: should return store record', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { "score": "10" }
    jsonist.get(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.end()
    })
})

tape('getStudentProperty: should return error if file doesn\'t exist', async function (t) {
    const url = `${endpoint}/adera/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { message: "Student record not found!" }
    jsonist.get(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.true(fs.existsSync(recordFilepath))
        t.end()
    })
})

tape('getStudentProperty: should return error if property doesn\'t exist', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/exam`
    const expectedResult = { message: "Student property not found!" }
    jsonist.get(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.true(fs.existsSync(recordFilepath))
        t.end()
    })
})

tape('deleteStudentProperty: should return error if file doesn\'t exist', async function (t) {
    const url = `${endpoint}/adera/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { message: "Student record not found!" }
    jsonist.delete(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.true(fs.existsSync(recordFilepath))
        t.end()
    })
})

tape('deleteStudentProperty: should return error if property doesn\'t exist', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/exam`
    const expectedResult = { message: "Student property not found!" }
    jsonist.delete(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.true(fs.existsSync(recordFilepath))
        t.end()
    })
})

tape('deleteStudentProperty: should delete property', async function (t) {
    const url = `${endpoint}/${student}/courses/calculus/quizzes/ye0ab61`
    const expectedResult = { "courses": {"calculus": {"quizzes": {}}}}
    jsonist.delete(url, (err, body) => {
        if (err) t.error(err)
        t.deepEqual(body, expectedResult)
        t.end()
    })
})

tape('cleanup', function (t) {
    fs.unlinkSync(recordFilepath)
    server.close()
    t.end()
})
