import fs from "fs"
import path from "path"

const rmdir = (dir:string) => {
    //NOT USED
    const list = fs.readdirSync(dir);
    for(let i = 0; i < list.length; i++) {
        const filename = path.join(dir, list[i]);
        const stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            rmdir(filename);
        } else {
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

export {rmdir}