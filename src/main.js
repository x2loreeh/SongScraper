const { app, BrowserWindow} = require('electron');
const RPC = require('discord-rpc'); 
const clientId = '1328057808523890722'; 

let mainWindow;
let rpc;


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: "./src/assets/logo.png"
    });


  
    mainWindow.loadFile('./src/index.html');

    rpc = new RPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
        console.log('Discord RPC is ready!');
        rpc.setActivity({
            details: 'SongScraper',
            state: 'Listening music on SongScraper',
            startTimestamp: Date.now(),
            largeImageKey: 'logo',
            largeImageText: 'https://github.com/x2loreeh/SongScraper',
            smallImageKey: 'icon',
            smallImageText: 'https://github.com/x2loreeh/SongScraper',
            instance: true,
            buttons : [{label: "Ascolta con me", url: "https://github.com/x2loreeh/SongScraper"}] 
        });
    });

    rpc.login({ clientId });
    app.on('before-quit', () => {
        rpc.destroy();
    });

  
});
