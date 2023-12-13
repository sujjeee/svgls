import fs from "fs-extra";
import path from "path";

export function copySvgs(names: string[], outDir = "public/svgs") {
  const fullOutPath = path.join(process.cwd(), outDir);

  if (!fs.existsSync(fullOutPath)) {
    fs.mkdirSync(fullOutPath, { recursive: true });
  }

  names.forEach((name) => {
    const svgPath = path.join("src/svgs", `${name}.svg`);
    const outPath = path.join(fullOutPath, `${name}.svg`);
    fs.copySync(svgPath, outPath);
  });
}
