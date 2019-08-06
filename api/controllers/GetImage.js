const Jimp = require("jimp")
const path = require('path')

const checkInput = (width = undefined, height = undefined, blur = undefined, res) => {
    if (width != undefined && isNaN(parseInt(width)) == true) {
        return res.status(404).json({ err: 404, message: "Width Not Integer" });
    } else if (height != undefined && isNaN(parseInt(height)) == true) {
        return res.status(404).json({ err: 404, message: "Height Not Integer" });
    } else if (blur != undefined && isNaN(parseInt(blur)) == true) {
        return res.status(404).json({ err: 404, message: "Blur Not Integer" });
    } else {
        return true
    }
}

const resizeWidth = (width, img) => {
    let wpercent = (parseInt(width) / parseFloat(img.bitmap.width))
    let hsize = parseInt((parseFloat(img.bitmap.height) * parseFloat(wpercent)))
    if (hsize < 1) {
        hsize = 1
    }
    return img.resize(parseInt(width), hsize)
}
const resizeHeight = (height, img) => {
    let hpercent = (parseInt(height) / parseFloat(img.bitmap.height))
    let wsize = parseInt((parseFloat(img.bitmap.width) * parseFloat(hpercent)))
    if (wsize < 1) {
        wsize = 1
    }
    return img.resize(wsize, parseInt(height))
}

const resizeWidthHeight = (width, height, img) => {
    if (width < 1) {
        width = 1
    }
    if (height < 1) {
        height = 1
    }
    return img.resize(parseInt(width), parseInt(height))
}

const renderBase64 = (img, res) => {
    img.getBase64(Jimp.AUTO, function (e, img64) {
        if (e) throw res.status(500).json(e);
        // res.send(img64)
        var tempImg = Buffer.from(img64.split(',')[1], 'base64');
        try {
            res.writeHead(200, {
                // 'Content-Type': 'image/png|image/jpg',
                'Content-Length': tempImg.length
            });
            res.end(tempImg);
        } catch (exceptionError) {
            if (exceptionError) return res.status(500).json(exceptionError);
        }


    });
}
exports.manipultaion = (req, res, next) => {
    let imageName = req.params.imageName
    let width = Array.isArray(req.query.width) ? req.query.width[req.query.width.length - 1] : req.query.width
    let height = Array.isArray(req.query.height) ? req.query.height[req.query.height.length - 1] : req.query.height
    let blur = Array.isArray(req.query.blur) ? req.query.blur[req.query.blur.length - 1] : req.query.blur
    // wpercent = (new_width / float(img_obj.size[0]))
    // hsize = parseInt((parseInt(img_obj.size[1]) * float(wpercent)))
    // console.log(imageName)
    Jimp.read(path.join(__dirname + "../../../uploads/" + imageName), function (err, img) {
        if (err) return res.status(500).json({err : "image notfound"});

        if (width != undefined && height != undefined && blur != undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeWidthHeight(width, height, img.blur(parseInt(blur) < 1 ? 1 : parseInt(blur))), res)
            }
        } else if (width != undefined && height != undefined && blur == undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeWidthHeight(width, height, img), res)
            }

        } else if (width != undefined && height == undefined && blur == undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeWidth(width, img), res)
            }
        } else if (width != undefined && height == undefined && blur != undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeWidth(width, img.blur(parseInt(blur) < 1 ? 1 : parseInt(blur))), res)
            }
        } else if (width == undefined && height != undefined && blur != undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeHeight(height, img.blur(parseInt(blur) < 1 ? 1 : parseInt(blur))), res)
            }
        } else if (width = undefined && height != undefined && blur == undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(resizeHeight(height, img), res)
            }
        } else if (width == undefined && height == undefined && blur != undefined) {
            if (checkInput(width, height, blur, res) == true) {
                renderBase64(img.blur(parseInt(blur) < 1 ? 1 : parseInt(blur)), res)
            }
        }

    });
}
