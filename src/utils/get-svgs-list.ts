import fetch from "node-fetch"

export interface SvglAPIResponse {
  id: number
  title: string
  category: string
  route:
    | {
        light: string
        dark: string
      }
    | string
  wordmark?: {
    light: string
    dark: string
  }
  url: string
}

export async function getSvgsList() {
  const response = await fetch("https://api.svgl.app")
  const svgs = (await response.json()) as SvglAPIResponse[]

  return svgs
}
