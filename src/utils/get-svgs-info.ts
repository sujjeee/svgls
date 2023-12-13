import fs from "fs";
import type { SVGJSON } from "../types";

export default function getSvgInfo() {
  const json: SVGJSON[] = [];

  fs.readdirSync("./src/svgs").forEach((file, index) => {
    const name = file.replace(/\.svg$/, "");
    json.push({
      index,
      name,
    });
  });

  return json;
}
