
exports.uploadSingleImage = (req, res, next) => {
    if (req.file != undefined) {
        return res.status(200).json({ message: "berhasil" })

    } else {
        return res.status(500).json({ error: "image not found" })

    }

}