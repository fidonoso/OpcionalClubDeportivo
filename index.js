const http = require("http");
const fs = require("fs");
const url = require("url");
const { v4: uuidv4 } = require("uuid");

// node index.js  ó  npm start

http
  .createServer(async (req, res) => {
    // ruta para cargar la pagina HTML en localhost:3000/
    if (req.url == "/" && req.method === "GET") {
      try {
        res.setHeader("content-type", "text/html");
        fs.readFile("./public/index.html", "utf8", (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end();
          }
          res.statusCode = 200;
          res.end(data);
        });
      } catch (e) {
        res.statusCode = 500;
        res.end(`Falló la carga: ${e}`);
      }
    }

    //ruta para insertar en la base de datos
    if (req.url.startsWith("/agregar?") && req.method === "GET") {
      try {
        const { nombre, precio } = url.parse(req.url, true).query;
        let obj = {
          id: uuidv4().slice(30),
          nombre,
          precio,
        };
        let deportes = JSON.parse(
          fs.readFileSync("./db/deportes.json", "utf8")
        );
        deportes.deportes.push(obj);
        fs.writeFileSync(
          "./db/deportes.json",
          JSON.stringify(deportes),
          "utf8"
        );
        res.end("Registro creado exitosamente");
      } catch (e) {
        res.statusCode = 500;
        res.end(`Falló el registro : ${e}`);
      }
    }
    // ruta para leer todos desde la base de datos y pintar en HTML
    if (req.url == "/deportes" && req.method === "GET") {
      try {
        const deportes = fs.readFileSync("./db/deportes.json", "utf8");
        res.end(deportes);
      } catch (e) {
        res.statusCode = 500;
        res.end(`Falló la carga desde la base de datos : ${e}`);
      }
    }

    //ruta para editar un registro (incluí id en el envio desde el frontEnd)
    if (req.url.startsWith("/editar?") && req.method == "GET") {
      try {
        const { nombre, precio, id } = url.parse(req.url, true).query;
        const sports = JSON.parse(
          fs.readFileSync("./db/deportes.json", "utf8")
        );
        const deportes = {
          deportes: sports.deportes.map((el) => {
            if (el.id == id) {
              el.nombre = nombre;
              el.precio = precio;
              return el;
            }
            return el;
          }),
        };
        fs.writeFileSync(
          "./db/deportes.json",
          JSON.stringify(deportes),
          "utf8"
        );
        res.end("Actualizacion exitosa");
      } catch (e) {
        res.status(500);
        res.end(`Falló la Actualizacion: ${e}`);
      }
    }
    //Ruta para eliminar un registro
    if (req.url.startsWith("/eliminar?id") && req.method == "GET") {
      try {
        const { id } = url.parse(req.url, true).query;
        const sports = JSON.parse(
          fs.readFileSync("./db/deportes.json", "utf8")
        );
        const deportes = {
          deportes: sports.deportes.filter((el) => el.id !== id),
        };
        fs.writeFileSync(
          "./db/deportes.json",
          JSON.stringify(deportes),
          "utf8"
        );
        res.end("Eliminación correcta");
      } catch (e) {
          res.statusCode(500)
          res.end(`Falló la eliminacion : ${e}`)
      }
    }
  })
  .listen(3000, () => {
    console.log(`Servidor escuchando en el puerto 300 con PID: ${process.pid}`);
  });
