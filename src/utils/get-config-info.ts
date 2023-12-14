import path from "path";
import fs from "fs-extra";

export function getConfigInfo() {
  const configInfoPath = path.join("svgls.json");

  if (!fs.existsSync(configInfoPath)) {
    return null;
  }

  return fs.readJSONSync(configInfoPath);
}
