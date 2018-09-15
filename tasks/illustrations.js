const fs = require('fs');
const sharp = require('sharp');


var origin = '../misc/illustrations/';
var destination = '../images/posts/';
let maxSize = 700;




let files = fs.readdirSync(origin);
files.forEach(function(file) {
    if (fs.statSync(origin + file).isDirectory()) {

        let illustrationName = file + ".jpg";
        let illustration = origin + file + "/" + illustrationName;
        if (fs.statSync(illustration).isFile()) {
            sharp(illustration)
                .resize(maxSize, maxSize, {
                    kernel: sharp.kernel.lanczos3,
                    fastShrinkOnLoad: false
                })
                .max()
                .jpeg({
                    quality: 84,
                    progressive: true,
                    // only with mozjpeg:
                    trellisQuantisation: true,
                    overshootDeringing: true,
                    optimiseScans: true
                })
                .toFile(destination + illustrationName)
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
