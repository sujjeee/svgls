import path from "path";
import { Command } from "commander";
import ora from "ora";
import { existsSync } from "fs";
import prompts from "prompts";
import { z } from "zod";
import { getSvgsInfo } from "@/src/utils/get-svgs-info";
import { logger } from "@/src/utils/logger";
import { handleError } from "@/src/utils/handle-error";
import { copySvgs } from "@/src/utils/copy-svgs";

const addOptionsSchema = z.object({
  svgs: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
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
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const svgIndex = await getSvgsInfo();

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
            selected: options.all ? true : options.svgs?.includes(name),
          })),
        });

        selectedSvgs = svgs;
      }

      if (!selectedSvgs?.length) {
        logger.warn("No svgs selected. Exiting.");
        process.exit(0);
      }

      const spinner = ora("Getting SVG...").start();
      copySvgs(selectedSvgs, options.path);
      spinner.succeed("Done.");
    } catch (error) {
      handleError(error);
    }
  });
