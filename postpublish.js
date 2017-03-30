'use strict';

const fs = require('fs')
const execa = require('execa')
const semver = require('semver')
const dateformat = require('dateformat')

const CHANGELOG_PATH = './CHANGELOG.md'

generateChangelog()

function generateChangelog() {
    // get most recent two tags
    let rangeTags,
        now = new Date(),
        timestamp = dateformat(now, 'mmmm d, yyyy')

    getVersionTags()
        .then(function (tags) {
            let header
            if (tags.length > 1) {
                rangeTags = tags.slice(tags.length - 2)
                header = rangeTags[1] + ' - ' + timestamp + '\n'
            }
            else if (tags.length === 1) {
                rangeTags = tags.slice(tags.length - 1)
                header = rangeTags[0] + ' - ' + timestamp + '\n'
            }
            else {
                rangeTags = []
                header = timestamp + '\n'
            }

            return {header, rangeTags}
        })
        .then(function ({header, rangeTags}) {
            // get log statements
            return execa.stdout('git', ['log', '--no-merges', '--pretty=format:%s\t(%an)\t%ci', rangeTags.join("..")]).then(function (result) {
                result = result.split(/\n/g)
                let logs = []
                result.forEach(function (log) {
                    let [msg, author, date] = log.split(/\t/g)
                    if (semver.valid(msg)) {
                        logs.push('')
                        let timestamp = dateformat(date, 'mmmm d, yyyy')
                        logs.push('v' + msg + ' - ' + timestamp)
                        logs.push('')
                    }
                    logs.push('* ' + msg + ' ' + author)
                })
                return logs
            })
        })
        .then(function (logs) {
            // output log statements
            fs.readFile(CHANGELOG_PATH, function (err, oldLogs) {
                let str = logs.join('\n') + '\n\n' + oldLogs
                fs.writeFile(CHANGELOG_PATH, str)
            })
        })
        .catch(function (err) {
            console.error(err)
        })

}

function getVersionTags() {
    return execa.stdout('git', ['tag', '--list']).then(function (result) {
        let tags = result.split('\n')

        return tags.reduce(function (list, tag) {
            if (semver.valid(tag)) {
                list.push(tag)
            }
            return list
        }, []).sort(semver.compare)
    })
}