# nodejs-package-types

Customized Package Types ([See all modules](:contentReference[oaicite:0]{index=0})). Since it is very difficult to do a pull request to [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped?utm_source=chatgpt.com), I made my own TypeScript file definitions. This module can make it easier for you to develop a program or library.

## Installation

> Using tarball is useful for git which not installed properly

| description                     | link                                                                                                                                              |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| short link                      | [bit.ly/nodejs-package-types](https://bit.ly/nodejs-package-types?utm_source=chatgpt.com)                                                         |
| full link tarball (recommended) | [nodejs-package-types.tgz](https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz?utm_source=chatgpt.com) |

### Modules

| package names                                                                                                                                                                                                      | link                                                                                                                                              | description                                                     |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------- |
| @types/skelljs, ~@types/rimraf,~ @types/kill-port, @types/markdown-it-abbr, @types/markdown-it-footnote, @types/markdown-it-image-figures, @types/markdown-it-mark, @types/markdown-it-sub, @types/markdown-it-sup | [nodejs-package-types.tgz](https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz?utm_source=chatgpt.com) | all sub modules automatically detected by VSCode and Typescript |
| @types/through2                                                                                                                                                                                                    | [types-through2.tgz](https://github.com/dimaslanjaka/nodejs-package-types/raw/through2/release/types-through2.tgz?utm_source=chatgpt.com)         | through2 type definitions                                       |

yarn

```bash
yarn add @types/through2@https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz --dev
```

npm

```bash
npm i https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz -D
```

**OR** you can visit [GitPkg](https://gitpkg.vercel.app/?utm_source=chatgpt.com) and insert which branch or subfolder you want to install.

## Troubleshooting

error case

```log
npm ERR! command git --no-replace-objects ls-remote ssh://git@github.com...
npm ERR! git@github.com: Permission denied (publickey).
npm ERR! fatal: Could not read from remote repository.
```

dump your ssh

```bash
ssh -vT git@github.com
```

fix by (source: [StackOverflow answer](https://stackoverflow.com/a/72906559?utm_source=chatgpt.com))

```bash
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://".insteadOf ssh://
npm install https://github.com/dimaslanjaka/nodejs-package-types.git#main --legacy-peer-deps
```

if `git` not installed properly, try installing from repository tarball (source: [StackOverflow answer](https://stackoverflow.com/a/32436218?utm_source=chatgpt.com))

```bash
npm i nodejs-package-types@https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz
```

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

**OR** just include the types to `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "types": ["nodejs-package-types"]
  }
}
```

**OR** add to single file

```ts
import 'nodejs-package-types';
// or
import 'nodejs-package-types/typings/index';
```

**OR** using triple slash reference at top JS or TS files

```ts
/// <reference types="nodejs-package-types" />
```

Using at local package (development)

```shell
git submodule add https://github.com/dimaslanjaka/nodejs-package-types.git packages/@types
npm i -D ./packages/@types/hexo-bunyan
```
