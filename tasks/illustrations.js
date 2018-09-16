const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

let appDir = path.dirname(require.main.filename);

let options = {
    origin: appDir + '/../misc/illustrations/',
    destination: appDir + '/../images/posts/',
    maxSize: 700,
    resize: {
        kernel: sharp.kernel.lanczos3,
        fastShrinkOnLoad: false
    },
    jpeg: {
        quality: 84,
        progressive: true,
        // only with mozjpeg:
        trellisQuantisation: true,
        overshootDeringing: true,
        optimiseScans: true
    }
};

let files = fs.readdirSync(options.origin);
files.forEach(function(file) {
    if (fs.statSync(options.origin + file).isDirectory()) {

        let illustrationName = file + ".jpg";
        let illustration = options.origin + file + "/" + illustrationName;
        if (fs.statSync(illustration).isFile()) {
            sharp(illustration)
                .resize(options.maxSize, options.maxSize, options.resize)
                .max()
                .jpeg(options.jpeg)
                .toFile(options.destination + illustrationName)
                .then(function() {
                    console.log(illustrationName + ": ok");
                })
                .catch(err => function() {
                    console.log(illustrationName + ": error!");
                    console.log(err)
                });
        }
    }
});
