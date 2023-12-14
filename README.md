# svgls

A CLI for easily adding SVG icons to your project.

## Usage

### Initialize Config

> This is optional command. It's only needed if you want to set a default workspace path.

Use the `init` command to initialize a config file for a new project:

```bash
npx svgls init
```

This will prompt you to enter the path you want to use for your workspace and save it in a `svgls.json` file.

You can edit this file manually later if you want to change the path.

### Add SVGs

Use the `add` command to interactively add SVGs to your project:

```bash
npx svgls add
```

This launches an interactive mode where you can:

- Use arrow keys to navigate the SVG list
- Press spacebar to select/deselect SVGs
- Press enter to confirm selection


You can also pass a space-separated list of SVG names on the command line:

### Example

```bash
npx svgls add aws dub github
```

## Credits

SVG icons from [pheralb's](https://twitter.com/pheralb_) open-source SVG repository.

Visit https://svgl.vercel.app to browse and download SVGs manually.
