export async function fetchSvg(paths: string[]) {
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
        return await response.text();
      })
    );

    console.log("resluts", results);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to fetch svg from github. Please visit https://svgl.vercel.app to download svgs manually.`
    );
  }
}
