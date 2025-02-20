const http = require('http') // Чтобы использовать HTTP-интерфейсы в Node.js
const fs = require('fs') // Для взаимодействия с файловой системой
const path = require('path') // Для работы с путями файлов и каталогов
const url = require('url') // Для разрешения и разбора URL 

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
}

const server = http.createServer()

server.on('request', (req, res) => {
    const parsedUrl = new URL(req.url, 'https://node-http.glitch.me/')
    let pathName = parsedUrl.pathname
    let ext = path.extname(pathName)

    if (pathName !== '/' && pathName[pathName.length - 1] === '/') {
        res.writeHead(302, { 'Location': pathName.slice(0, -1) })
        res.end()
        return
    }

    if (pathName === '/') {
        ext = '.html'
        pathName = '/main.html'
    } else if (!ext) {
        ext = '.html'
        pathName += ext
    }

    const filePath = path.join(process.cwd(), '/', pathName)

    fs.exists(filePath, function (exists, err) {

        if (!exists || !mimeTypes[ext]) {
            const notFoundPath = path.join(process.cwd(), '/404.html');
            fs.readFile(notFoundPath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.write('404 Not Found');
                    res.end();
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                }
            });
            return;
        }

        res.writeHead(200, { 'Content-Type': mimeTypes[ext] })

        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    })
})

server.listen(3000)