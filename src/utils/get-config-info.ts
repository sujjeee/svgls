import path from "path"
import fs from "fs-extra"
import { ConfigType } from "@/src/commands/init"

export function getConfigInfo() {
  const configInfoPath = path.join("svgls.json")

  if (!fs.existsSync(configInfoPath)) {
    return null
  }

  return fs.readJSONSync(configInfoPath) as ConfigType
}
