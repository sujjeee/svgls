import { existsSync, promises as fs } from "fs";
import path from "path";
import { getConfigInfo } from "@/src/utils/get-config-info";
import { getSvg } from "@/src/utils/get-svg";
import { getSvgsList } from "@/src/utils/get-svgs-list";
import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import { Command } from "commander";
import { default as create } from "fs-extra";
import ora from "ora";
import prompts from "prompts";
import { z } from "zod";

const addOptionsSchema = z.object({
  svgs: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional()
});

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
  .option("-p, --path <path>", "the path to add the svg to.")
  .action(async (svgs, opts) => {
    try {
      const options = addOptionsSchema.parse({
        svgs,
        ...opts
      });

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const svgIndex = await getSvgsList();

      let selectedSvgs = options.all
        ? svgIndex.map((name) => name)
        : options.svgs;

      if (!options.svgs?.length && !options.all) {
        const { svgs } = await prompts({
          type: "multiselect",
          name: "svgs",
          message: "Which svgs would you like to add?",
          hint: "Space to select. A to toggle all. Enter to submit.",
          instructions: false,
          choices: svgIndex.map((name) => ({
            title: name,
            value: name,
            selected: options.all ? true : options.svgs?.includes(name)
          }))
        });

        selectedSvgs = svgs;
      }

      if (!selectedSvgs?.length) {
        logger.warn("No svgs selected. Exiting.");
        process.exit(0);
      }

      const spinner = ora("Fetching SVGs...").start();
      const payload = await getSvg(selectedSvgs);

      for (const item of payload) {
        const workSpacePath = await getConfigInfo();

        const targetDir = options.path
          ? path.resolve(cwd, options.path)
          : workSpacePath?.path
            ? workSpacePath.path
            : "public/svg";

        if (!targetDir) {
          continue;
        }

        if (!existsSync(targetDir)) {
          await fs.mkdir(targetDir, { recursive: true });
        }

        if (!item.svg) {
          spinner.stop();
          logger.warn(`SVG for ${item.path} is not available.`);
        } else {
          const filePath = path.resolve(targetDir, `${item.path}.svg`);
          create.writeFileSync(filePath, item.svg);
          spinner.text = `Adding ${item.path}...`;
        }
      }
      spinner.succeed("Done.");
    } catch (error) {
      handleError(error);
    }
  });
