const sharp = require('sharp');
const path = require('path');
const fileSys = require('fs');

const optimizeImage = async (req, res, next) =>{
    //If there is no file, move the process along normally to the controller
    if(!req.file){
        return next();
    }
    //
    const fileObj = req.file;
    const tempPath = req.file.path;
    const optimizedDir = path.resolve(__dirname, '..', 'images');

    const optimizedPath = path.join(
        optimizedDir,         //replace the original path's extension with .webp
        fileObj.filename.replace(path.extname(fileObj.filename), '.webp')
    );

    try {
        //original image size
        const originalStat = await fileSys.promises.stat(tempPath);

        await sharp(tempPath)
            .resize({width: 800, withoutEnlargement: true}) // resize the image to a width of 800px
            .withMetadata(false)
            .toFormat('webp') //convert to webp
            .webp({quality: 80, effort: 6}) //80 is a good compromise for quality and size
            .toFile(optimizedPath);
            
            
           //Efficiency comparison
           const optimizedStat = await fileSys.promises.stat(optimizedPath);
            //If the the optimized file's size is larger than it was originally...
           if(optimizedStat.size >= originalStat.size){
                //keep the original file
                await fileSys.promises.unlink(optimizedPath);
                req.file.filename = fileObj.filename;
                req.file.path = tempPath;
            }else {
                //keep the optimized file
                await fileSys.promises.unlink(tempPath);
                req.file.filename = path.basename(optimizedPath);
                req.file.path = optimizedPath;
            }
            console.log(`Original size: ${originalStat.size} bytes, Optimized size: ${optimizedStat.size} bytes`);
            //pass the newly converted image along 
            next();
    } catch (error) {
        console.error('Image processing failed: ', error);
        return res.status(500).json({error: 'Image processing failed!'})
    }

}

module.exports = optimizeImage;