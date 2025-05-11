const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process")
const http = require("http")
const { PORT } = require("./config");

const SERVER_URL = `http://localhost:${PORT}`

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadURL(SERVER_URL)
}


function waitForServer() {
    const interval = setInterval(() => {
        http.get(SERVER_URL, () => {
            clearInterval(interval)
            createWindow()
        }).on('error', () => {
            console.error(`Error connecting to the server`)
        })
    }, 500)
}


function startExpressApp() {
    const serverProcess = exec("npm start");

    serverProcess.stdout.on("data", (data) => {
        console.log(`Server: ${data}`)
    })

    serverProcess.stderr.on("data", (data) => {
        console.error(`Server error: ${data}`)
    })
}

app.whenReady().then(async () => {
    startExpressApp()
    waitForServer() 
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})