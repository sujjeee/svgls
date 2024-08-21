#!/usr/bin/env node

import { add } from "@/src/commands/add"
import { init } from "@/src/commands/init"
import { getPackageInfo } from "@/src/utils/get-package-info"
import { Command } from "commander"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const packageInfo = await getPackageInfo()

  const program = new Command()
    .name("svgls")
    .description("a beautiful library with svg logos.")
    .version(
      packageInfo.version || "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program.addCommand(init).addCommand(add)

  program.parse()
}

main()
