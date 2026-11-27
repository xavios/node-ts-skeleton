## Node TypeScript Skeleton

### Requirements

- Node.js 24 (see `.nvmrc`, e.g. `nvm use`)
- Yarn 4 via Corepack: run `corepack enable` once, then `yarn install`

### Scripts

| Command             | What it does                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `yarn start`        | Hot reloading (nodemon + tsx) with the inspector enabled. Type `rs` to restart manually.            |
| `yarn debug`        | Run `src/index.ts` with `--inspect-brk`. Attach from VS Code with the **Attach** launch config.     |
| `yarn build`        | Compile to `dist/` with `tsc` (test files excluded).                                                |
| `yarn execute`      | Clean `dist/`, build, and run the compiled output with Node.                                        |
| `yarn test`         | Run the tests once with Vitest. Run a single file with `yarn test ./path-to/file.test.ts`.          |
| `yarn test:watch`   | Run Vitest in watch mode.                                                                           |
| `yarn test:debug`   | Run tests with `--inspect-brk` in a single process.                                                 |
| `yarn lint`         | Lint with ESLint (`yarn lint:fix` to auto-fix).                                                     |
| `yarn format`       | Format with Prettier (`yarn format:check` to verify only).                                          |
| `yarn eject:danger` | Turn this clone into a new project: `yarn eject:danger my-project` (name is prompted if not given). |

### Notes

- With Yarn 4, do not put `--` before extra arguments (`yarn test -- file` would run every test); use `yarn test file`.
- After `yarn eject:danger`, run `yarn install` inside the renamed folder.
- The project is ESM (`"type": "module"`, `module: nodenext`). Relative imports need an explicit `.js` extension, e.g. `import { x } from "./x/index.js"`.
- `.ts` sources are executed directly by [tsx](https://tsx.is) in development and compiled by `tsc` for production.
