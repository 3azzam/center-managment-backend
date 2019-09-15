const fs = require("fs") ; 

function deleteImage(uri) {
    let imageName = uri.split("uploads/")[1];
    fs.unlink( "./uploads/"+imageName , (err) => {
        if (err)
            return err
        return true ;
    });
}

module.exports = deleteImage ; 