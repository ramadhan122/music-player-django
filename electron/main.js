const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let djangoProcess;

function startDjango() {
    const serverPath = app.isPackaged
        ? path.join(process.resourcesPath, 'django-server', 'musicplayer-server.exe')
        : path.join(
            __dirname,
            '..',
            'dist',
            'musicplayer-server',
            'musicplayer-server.exe'
        );

    const djangoCwd = app.isPackaged
        ? path.join(process.resourcesPath, 'django-server')
        : path.join(__dirname, '..');

    djangoProcess = spawn(serverPath, [], {
        cwd: djangoCwd
    });

    djangoProcess.stdout.on('data', (data) => {
        console.log(`Django: ${data}`);
    });

    djangoProcess.stderr.on('data', (data) => {
        console.error(`Django: ${data}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true
        }
    });

    win.loadURL('http://127.0.0.1:8000');
}

app.whenReady().then(() => {
    startDjango();

    setTimeout(createWindow, 3000);
});

app.on('before-quit', () => {
    if (djangoProcess) {
        djangoProcess.kill();
    }
});