const os = require('os');
const fs = require("fs");
const path = "./packages/app/src-tauri/tauri.conf.json";
fs.readFile(path, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  let config = JSON.parse(data);

  let ovverride = process.argv[2];

  if (ovverride === undefined) {
    const opsys = process.platform;
    if (opsys == "darwin") {
      config.build.features = ["metal"];
    } else if (opsys == "linux") {
      config.build.features = ["mkl"];
    } else if (opsys == "win32") {
      config.build.features = ["mkl"];
      config.tauri.bundle.resources = ["./libiomp5md.dll"];
      fs.copyFileSync("C:\\Program Files (x86)\\Intel\\oneAPI\\compiler\\2024.0\\bin\\libiomp5md.dll","./packages/app/src-tauri/libiomp5md.dll");
    }
  }
  else {
    config.build.features = [ovverride];
    if( ovverride === "cuda") {
      //Disable AppImage bundle to avoid issues collecting libcuda1.so (only avaialable when the nvidia driver is installed)
      config.tauri.bundle.targets = ["deb", "msi", "nsis"];
    }
  }

  fs.writeFile(path, JSON.stringify(config, null, 2), (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  });
});
