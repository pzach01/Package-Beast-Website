var fs = require('fs');
someFile = 'src/app/_models/timestamp.ts'

var dateTime = new Date();

timestamp = `export class Timestamp {
    public static timestamp: string = "${dateTime}"
}`

fs.unlink(someFile, function (err) {
    if (err) throw err;
    console.log('Last timestamp deleted.');
});

fs.appendFile(someFile, timestamp, function (err) {
    if (err) throw err;
    console.log('Current timestamp saved');
});