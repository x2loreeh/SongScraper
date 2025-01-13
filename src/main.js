const { app, BrowserWindow, Menu, shell } = require('electron');
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
    },
);


const menuSS = [
    {
      label: "SongScraper",
      submenu: [
        {
          label: "Changelogs",
          accelerator: process.platform === "darwin" ? "Command+M" : "Ctrl+M",
          click: () => {
            shell.openExternal("https://github.com/x2loreeh/SongScraper");
          },
        },
        {
          label: "Wiki",
          accelerator: process.platform === "darwin" ? "Command+?" : "Ctrl+?",
          click: () => {
            shell.openExternal("https://github.com/x2loreeh/SongScraper");
          },
        },
        {
          role: "reload",
        },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+W",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Support",
      submenu: [
        {
          label: "Donations",
          click: () => {
            shell.openExternal("https://paypal.me/x2loreeh");
          },
        },
      ],
    },
  ];

    const menuSongScraper = Menu.buildFromTemplate(menuSS);
    Menu.setApplicationMenu(menuSongScraper);
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
