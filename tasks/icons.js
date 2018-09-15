const sharp = require('sharp');

var icons = [
    {size: 32, name: "favicon.ico"},
    {size: 96, name: "favicon.png"},
    {size: 144, name: "touchicon.png"},
    {size: 192, name: "icon-192x192.jpg"},
    {size: 512, name: "icon-512x512.jpg"}
];
var original = '../misc/icons/icon-raw.jpg';

for (let i = 0; i < icons.length; i++) {
    let icon = icons[i];
    let toFile = '../' + icon.name;
    sharp(original)
        .resize(icon.size, icon.size, {
            kernel: sharp.kernel.lanczos3,
            fastShrinkOnLoad: false
        })
        .jpeg({
            force: false,
            quality: 84,
            progressive: true,
            // only with mozjpeg:
            trellisQuantisation: true,
            overshootDeringing: true,
            optimiseScans: true
        })
        .png({
            force: false,
            compressionLevel: 9,
            progressive: true
        })
        .toFile(toFile)
        .then(function() {

        })
        .catch(err => function() {
            console.log(err)
        });
}
