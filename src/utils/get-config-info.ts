import path from "path"
import { ConfigType } from "@/src/commands/init"
import fs from "fs-extra"

export function getConfigInfo() {
  const configInfoPath = path.join("svgls.json")

  if (!fs.existsSync(configInfoPath)) {
    return null
  }

  return fs.readJSONSync(configInfoPath) as ConfigType
}
