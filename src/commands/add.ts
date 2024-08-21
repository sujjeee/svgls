import { existsSync, promises as fs } from "fs"
import path from "path"
import { getConfigInfo } from "@/src/utils/get-config-info"
import { filterSvgs, getSvg, getSVGNameFromUrl } from "@/src/utils/get-svg"
import { getSvgsList } from "@/src/utils/get-svgs-list"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"
import { default as create } from "fs-extra"
import ora from "ora"
import prompts from "prompts"
import { z } from "zod"

const addOptionsSchema = z.object({
  svgs: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
  theme: z.enum(["light", "dark", "both"]).optional()
})

export const add = new Command()
  .name("add")
  .description("add a svg to your project")
  .argument("[svgs...]", "the svg to add")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available svg", false)
  .option("-p, --path <path>", "the path to add the svg to")
  .option("-t, --theme <theme>", "select svg theme")
  .action(async (svgs, opts) => {
    try {
      const options = addOptionsSchema.parse({ svgs, ...opts })

      const cwd = path.resolve(options.cwd)

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      const availableSvgs = await getSvgsList()

      let selectedSvgs = options.all
        ? availableSvgs.map((svgs) => svgs.route)
        : options.svgs

      if (!options.svgs?.length && !options.all) {
        const { svgs } = await prompts({
          type: "multiselect",
          name: "svgs",
          message: "Which svgs would you like to add?",
          hint: "Space to select. A to toggle all. Enter to submit.",
          instructions: false,
          choices: availableSvgs.map((svgs) => ({
            title: svgs.title,
            value: svgs.route,
            selected: options.all ? true : options.svgs?.includes(svgs.title)
          }))
        })

        selectedSvgs = svgs
      }

      const workSpacePath = getConfigInfo()

      if (!selectedSvgs?.length) {
        logger.warn("No svgs selected. Exiting.")
        process.exit(0)
      }

      const filteredSvgs = filterSvgs({
        select: options.theme || workSpacePath?.theme || "both",
        selectedSvgs
      })

      const spinner = ora("Fetching SVGs...").start()
      const payload = await getSvg(filteredSvgs)

      for (const item of payload) {
        const targetDir = options.path
          ? path.resolve(cwd, options.path)
          : workSpacePath?.path
            ? workSpacePath.path
            : "public/svg"

        if (!targetDir) {
          continue
        }

        if (!existsSync(targetDir)) {
          await fs.mkdir(targetDir, { recursive: true })
        }

        if (!item.svg) {
          spinner.stop()
          logger.warn(
            `SVG for ${getSVGNameFromUrl(item.path)} is not available.`
          )
        } else {
          const filePath = path.resolve(targetDir, getSVGNameFromUrl(item.path))

          create.writeFileSync(filePath, item.svg)
          spinner.text = `Adding ${item.path}...`
        }
      }

      spinner.succeed("Done.")
    } catch (error) {
      handleError(error)
    }
  })
