import fs from 'fs'
import * as rd from 'readline'

function readLinesFromFile(fileName: string, func: (line:string) => void) {
    var array = fs.readFileSync(fileName).toString().split("\n");
    if(array[array.length - 1] ===""){
        array.pop()
    }
    for(const line of array) {
        func(line)
    }
}

export { readLinesFromFile }