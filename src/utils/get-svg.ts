export async function getSvg(paths: string[]) {
  const baseUrl =
    "https://api.github.com/repos/pheralb/svgl/contents/static/library";

  const headers = {
    Accept: "application/vnd.github.v3.raw",
  };

  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/${path}.svg?ref=main`, {
          headers,
        });
        if (!response.ok) {
          return { path, svg: null };
        }
        const svg = await response.text();
        return { path, svg };
      })
    );

    return results;
  } catch (error) {
    throw new Error(
      `Failed to fetch svg from github. Please visit https://svgl.vercel.app to download svgs manually.`
    );
  }
}
