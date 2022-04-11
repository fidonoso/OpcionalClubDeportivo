const fs =require('fs');

//Reseteo del archivo deportes.json
let dep={
    deportes: []
}

fs.writeFileSync('./db/deportes.json', JSON.stringify(dep), 'utf8')