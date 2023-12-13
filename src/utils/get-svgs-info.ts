import fetch from "node-fetch";

interface File {
  name: string;
}

export async function getSvgsInfo() {
  const response = await fetch(
    "https://api.github.com/repos/pheralb/svgl/contents/static/library?ref=main"
  );

  const files = (await response.json()) as File[];

  const names = files
    .map((file: File) => file.name)
    .map((name: string) => name.replace(".svg", ""))
    .map((name: string) => name.toLowerCase());

  return names;
}
