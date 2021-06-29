# Auto-workspace

This is a starter, but the intention is for it to work not as a starter but as
a workspace so that it doesn't have to be committed into every new app.

# The goals

- Not opinionated about routing; must enable apps to work on their individual routes, but also enable me to mount different mini-apps on different parts
- Should have multiple entry-points
- Should enable me to do static rendering of at least the entry points; and if I can render individual apps sub-routes all the better.
- Should be able to use multiple frameworks and libraries such as Elm, React, Svelte; so I can experiment
- When I load each app, I should not need to load all apps, so code-splitting would be a nice addition
- Should allow me to store data on .yml file and feed it to entry points, similarly of how 11ty does it, but less complexity
- Also would be nice to be able to write individual pages with Pug
- Integrated with Tailwind (or WindiCSS)
- Plus points if it runs on the Deno runtime
- Should allow me to create PWA out of the box
- Should have a deployment strategy that allows me to deploy sub-apps to different places
- Would be amazing for it to be a sort of standalone app that I can keep improving and I don't need to copy it to a new project, I can sort of link it, and allow the starter to be improved upon independently; maybe I can make a sort of "workspace" convention; and then I can change the whole workspace without even modifying the project.
- Dependencies would work like they work on Deno; ideally we don't needa package.json or elm.json. We just import the dependency we want, and the workspace takes care of the rest
