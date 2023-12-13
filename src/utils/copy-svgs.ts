import fs from "fs-extra";
import path from "path";
import childProcess from "child_process";

// export function copySVGs(svgNames: any, destinationPath = "public/svgs") {
//   const srcDir = path.join(__dirname, "src/svgs");
//   const destDir = path.join(__dirname, destinationPath);

//   // Create the destination directory if it doesn't exist
//   if (!fs.existsSync(destDir)) {
//     fs.mkdirSync(destDir, { recursive: true });
//   }

//   // Copy each specified SVG file
//   svgNames.forEach((svgName: any) => {
//     const srcFile = path.join(srcDir, `${svgName}.svg`);
//     const destFile = path.join(destDir, `${svgName}.svg`);

//     // Check if the source SVG file exists
//     if (fs.existsSync(srcFile)) {
//       fs.copyFileSync(srcFile, destFile);
//       console.log(`Copied ${svgName}.svg to ${destinationPath}`);
//     } else {
//       console.error(`File ${svgName}.svg not found in src/svgs`);
//     }
//   });
// }

// export function copySvgs(names: string[], outPath = "public/svgs") {
//   const fullOutPath = path.join(process.cwd(), outPath);

//   if (!fs.existsSync(fullOutPath)) {
//     fs.mkdirSync(fullOutPath, { recursive: true });
//   }

//   childProcess.exec(
//     `cp src/svgs/${names.join(" ")} ${outPath}`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.log(error);
//         process.exit(1);
//       }

//       console.log(`SVGs copied to ${outPath} successfully!`);
//     }
//   );
// }

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

  console.log("SVGs copied successfully!");
}
