#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import prompts from "prompts";

export const init = new Command()
  .name("init")
  .description("initialize svgl config file")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async () => {
    try {
      await promptForConfig();
      logger.info("");
      logger.info(`${chalk.green("Success!")} Configuration completed.`);
      logger.info("");
    } catch (error) {
      handleError(error);
    }
  });

export async function promptForConfig() {
  const highlight = (text: string) => chalk.cyan(text);

  const options = await prompts([
    {
      type: "text",
      name: "path",
      message: `Where you want to add ${highlight("svgs")}?`,
      initial: "public/svgs"
    }
  ]);

  const config = {
    path: options.path
  };

  const spinner = ora("Configuring...").start();
  const targetPath = path.resolve("svgls.json");
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8");
  spinner.succeed("Configuration completed");
}
