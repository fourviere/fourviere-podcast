/* This script alters the /packages/app/src-tauri/tauri.conf.json 
   for disabling tauri updater feature.
   Required for nightly builds
*/ 
const fs = require("fs");
const path = "./packages/app/src-tauri/tauri.conf.json";
fs.readFile(path, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  let config = JSON.parse(data);
  config.tauri.updater.active = false;
  
  fs.writeFile(path, JSON.stringify(config, null, 2), (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  });
});
