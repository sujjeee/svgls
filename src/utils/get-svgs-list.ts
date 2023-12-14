import fetch from "node-fetch";

interface File {
  name: string;
}

export async function getSvgsList() {
  const headers = {
    Accept: "application/vnd.github.v3.raw"
  };

  const response = await fetch(
    "https://api.github.com/repos/pheralb/svgl/contents/static/library?ref=main",
    {
      headers
    }
  );

  const files = (await response.json()) as File[];

  const names = files
    .map((file: File) => file.name)
    .map((name: string) => name.replace(".svg", ""));

  return names;
}
