import path from "path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { existsSync, promises as fs } from "fs";
import prompts from "prompts";
import { z } from "zod";
import getSvgInfo from "@/src/utils/get-svgs-info";
import { logger } from "@/src/utils/logger";
import { handleError } from "@/src/utils/handle-error";
import { copySvgs } from "@/src/utils/copy-svgs";

const addOptionsSchema = z.object({
  svgs: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
});

export const test = new Command()
  .name("test")
  .description("add a svg to your project")
  .argument("[svgs...]", "the svg to add")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available svg", false)
  .option("-p, --path <path>", "the path to add the svg to.")
  .action(async (inputSvgs, opts) => {
    try {
      const options = addOptionsSchema.parse({
        inputSvgs,
        ...opts,
      });

      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const svgIndex = getSvgInfo();

      let selectedSvgs = options.all
        ? svgIndex.map((entry) => entry.name)
        : options.svgs;

      if (!options.svgs?.length && !options.all) {
        const { svgs } = await prompts({
          type: "multiselect",
          name: "svgs",
          message: "Which svgs would you like to add?",
          hint: "Space to select. A to toggle all. Enter to submit.",
          instructions: false,
          choices: svgIndex.map((entry) => ({
            title: entry.name,
            value: entry.name,
            selected: options.all ? true : options.svgs?.includes(entry.name),
          })),
        });

        selectedSvgs = svgs;
      }

      if (!selectedSvgs?.length) {
        logger.warn("No svgs selected. Exiting.");
        process.exit(0);
      }

      // const tree = await resolveTree(svgIndex, selectedSvgs);
      // const payload = await fetchTree(config.style, tree);

      copySvgs(selectedSvgs);
      const spinner = ora(`Getting SVG...`).start();
      spinner.succeed(`Done.`);
    } catch (error) {
      handleError(error);
    }
  });
