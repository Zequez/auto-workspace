# Frontend Workshop

Instead of configuring and storing frontend tooling for each project I create,
I built this workshop that has the following things included:

- Vite for bundling and dev server
- Eleventy.js for compiling and building static pages
- Included frameworks: React, Vue, Elm
- Pug for HTML templates
- WindiCSS
- TypeScript by default
- Automatic deploy script for Github Pages
- YAML

New apps are then added to `/apps/<app_name>` and I don't need to install anything
or configure any tooling, I can just have a clean repo with only the essential
app code.

## Features wishlist

- Graphical UI to manage apps, dependencies and deployments.
- PWA support
- Fix the way WindiCSS works in which it accumulates classes until I restart the dev serve
- Fix favicon not loading

## Usage

Create a new app at `/apps/<app_name>`

### Development

```bash
APP=AppName yarn dev
```

### Production build

```bash
APP=AppName yarn build
```

If you want to serve the production files locally for testing

```bash
APP=AppName yarn serve
```

### Deploy to Github pages

Make sure you include a CNAME file on the root of the app with the domain
name you want. Then configure the domain name on your registrar to point to Github pages to point to `your-username.github.com`

```bash
APP=AppName yarn deploy
```

### Default app

Add `.env` file with APP=AppName
