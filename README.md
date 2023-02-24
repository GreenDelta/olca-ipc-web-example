# olca-ipc-web-example

This is a small example application that demonstrates how the openLCA IPC API
can be called and integrated into a web-application. The example uses the
olca-ipc npm package, React, and Pico.css, is written in TypeScript, and
packaged with webpack. It just provides a small dialog for connecting to an IPC
server and calculating a product system. You can test the example application
here:

<strong>https://greendelta.github.io/olca-ipc-web-example</strong>

## Building from source

If you have a current version of Node.js and npm installed, you can build it
from source like this:

```bash
cd olca-ipc-web-example
npm install
npx webpack
```
