'use strict';
var metadata = require('./package.json')
var fs = require('fs');
var execa = require('execa');
var semver = require('semver');
var dateformat = require('dateformat');
var CHANGELOG_PATH = './CHANGELOG.md';

generateChangelog();

function generateChangelog() {
    // get most recent two tags
    getVersionTags()
        .then(function (tags) {
            return tags.length > 0 ? 'HEAD..' + tags.pop() : ''
        })
        .then(function (tagRange) {
            // get log statements
            return execa.stdout('git', ['log', '--no-merges', '--pretty=format:* %s (%an)', tagRange]).then(function (result) {
                var logs = result.split(/\n/g);
                logs.unshift(metadata.version + ' - ' + dateformat(new Date(), 'mmmm d, yyyy') + '\n')
                return logs;
            });
        })
        .then(function (logs) {
            // output log statements
            fs.readFile(CHANGELOG_PATH, function (err, oldLogs) {
                var str = logs.join('\n') + '\n\n' + oldLogs;
                fs.writeFile(CHANGELOG_PATH, str);
            });
        })
        .catch(function (err) {
            console.error(err);
        });
}
function getVersionTags() {
    return execa.stdout('git', ['tag', '--list']).then(function (result) {
        var tags = result.split('\n');
        return tags.reduce(function (list, tag) {
            if (semver.valid(tag)) {
                list.push(tag);
            }
            return list;
        }, []).sort(semver.compare);
    });
}