# nodejs-package-types
Customized Package Types
- @types/skelljs
- @types/through2
- @types/kill-port
- @types/markdown-it-abbr
- @types/markdown-it-footnote
- @types/markdown-it-image-figures
- @types/markdown-it-mark
- @types/markdown-it-sub
- @types/markdown-it-sup

Installation
yarn
```bash
yarn add https://github.com/dimaslanjaka/nodejs-package-types.git --dev
```
npm
```bash
npm i https://github.com/dimaslanjaka/nodejs-package-types.git -D
```

**OR** you can visit [GitPkg](https://gitpkg.vercel.app/) and insert which branch or subfolder you want to install

## Usages

add below codes to `tsconfig.json` for included in vscode types
```jsonc
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/nodejs-package-types/typings"
    ],
    "types": ["node", "nodejs-package-types"]
  }
}
```

**OR** add to single file
```ts
import 'nodejs-package-types/typings/index';
```
**OR** using triple slash reference at top JS or TS files
```ts
/// <reference types="nodejs-package-types" />
```

Using at local package (development)
```shell
git submodule add https://github.com/dimaslanjaka/nodejs-package-types.git packages/@types
npm i -D ./packages/@types/hexo
npm i -D ./packages/@types/hexo-bunyan
npm i -D ./packages/@types/hexo-log
```
