import { SvglAPIResponse } from "@/src/utils/get-svgs-list"

export async function getSvg(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(path)

        if (!response.ok) {
          return { path, svg: null }
        }

        const svg = await response.text()
        return { path, svg }
      }),
    )

    return results
  } catch (error) {
    throw new Error(
      "Failed to fetch svg from github. Please visit https://svgl.vercel.app to download svgs manually.",
    )
  }
}

interface FilterSvgsProps {
  selectedSvgs: SvglAPIResponse["route"][]
  select: "light" | "dark" | "both"
}

export function filterSvgs({
  selectedSvgs,
  select,
}: FilterSvgsProps): string[] {
  return selectedSvgs.flatMap((svg) => {
    if (typeof svg === "object" && svg.light && svg.dark) {
      if (select === "light") {
        return [svg.light]
      } else if (select === "dark") {
        return [svg.dark]
      } else {
        return [svg.light, svg.dark]
      }
    } else if (typeof svg === "string") {
      return [svg]
    }
    return []
  })
}

export function getSVGNameFromUrl(url: string) {
  const baseUrl = "https://svgl.app/library/"

  if (url.startsWith(baseUrl)) {
    return url.substring(baseUrl.length)
  }
}
