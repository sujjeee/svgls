# svgls

A CLI for adding svgs to your project.

## How to Use?

## init

> This is optional command. It's only needed if you want to set a default workspace path.

Use the `init` command to initialize config file for a new project.

This will prompt you to enter the path you want to use for your workspace, and save it in a .svgls.json file.

You can edit this file manually if you want to change the path later. The next time you run the add command, it will use the path from the config file.

```bash
npx svgls init
```

## add

Use the `add` command to add svgs to your project.

This will launch the interactive mode, where you can select the svgs you want.

You can use the arrow keys to navigate the list, the space bar to select or deselect items, and the enter key to confirm your selection.

```bash
npx svgls add [component]
```

### Example

```bash
npx shadcn-ui add aws
```

## Credits

SVGL uses the awesome open-source SVG repo from [pheralb](https://twitter.com/pheralb_).

Visit https://svgl.vercel.app to download svgs manually.
