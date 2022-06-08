const yargs = require("yargs");
const Jimp = require("jimp");
const fs = require("fs");
const http = require("http");
const url = require("url");

const key = 123;
const argv = yargs
  .command(
    "acceso",

    "Comando para acceder al server",
    {
      key: {
        describe: "key para acceder",
        demand: true,
        alias: "k",
      },
    },
    (args) => {
      args.key == key
        ? http
            .createServer((req, res) => {
              const params = url.parse(req.url, true).query;
              let urlImage = params.img;
              if (req.url == "/") {
                res.writeHead(200, { "content-Type": "text/html" });
                fs.readFile("index.html", "utf-8", (err, html) => {
                  res.end(html);
                });
              }

              if (req.url == "/style") {
                res.writeHead(200, { "content-Type": "text/css" });
                fs.readFile("./assets/css/style.css", (err, css) => {
                  res.end(css);
                });
              }

              //proc de imagen
              if (req.url.includes("/img")) {
                if (urlImage === "") {
                  res.writeHead(200, { "content-Type": "text/html" });
                  fs.readFile("error.html", "utf-8", (err, html) => {
                    res.end(html);
                  });
                } else {
                  Jimp.read(`${urlImage}`, (err, imagen) => {
                    imagen
                      .resize(350, Jimp.AUTO)
                      .grayscale()
                      .quality(60)
                      .writeAsync("./assets/img/newImg.png")
                      .then(() => {
                        fs.readFile(
                          "./assets/img/newImg.png",
                          (err, Imagen) => {
                            res.writeHead(200, {
                              "Content-Type": "image/jpeg",
                            });
                            res.end(Imagen);
                          }
                        );
                      });
                  });
                }
              }
            })
            .listen(3000, () => console.log("Server on"))
        : console.log("key incorrecta");
    }
  )
  .help().argv;
