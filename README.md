# Nuxt > Basic example

Afin de testay le HMR sur une base saine.

## Usual commands

```bash
# 📌📝 Testé depuis le terminal de VSCode > WSL
cd tastytest

# 📌💩 / export NODE_OPTIONS=--openssl-legacy-provider

# ⏳ Note : ça prend ~2-3 minutes de build, c'normal
yarn dev
# http://localhost:3000

# Changer un fichier, ~/components/Tutorial.vue
```

## Installation

```bash
yarn create nuxt-app tastytest
# > tout par defaut
```

---

## 🐛 FIX HMR avec WSL2

Maj `nuxt.config.js`

cf. [GH issues](https://github.com/nuxt/nuxt/issues/5550)

```js
// Ajout de 
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

// ✔ Client
//   Compiled successfully in 229.03ms

// ✔ Server
//   Compiled successfully in 170.37ms
```

---

## ✨ Test pour perf > Change rieng

[GH issue aussi](https://github.com/nuxt/nuxt/issues/7553#issuecomment-646589883)

Projet

```bash
## Pas de chokidar dans le projet ?
# npm uninstall chokidar # v3.4.0
# npm install chokidar@3.3.1

# v3.4.0
# yarn remove chokidar 
# yarn add chokidar@3.3.1
```

File modifications:

```js
{
// folder-name/package.json
// ...
  "config": {
    "nuxt": {
      "host": "0.0.0.0", // 192.168.10.10
      "port": "3000"
    }
  },
// ...
}
```

&&

```js
// folder-name/nuxt.config.js
{
// ...
  watchers: {
    chokidar: {
      usePolling: true,
      useFsEvents: false
    },
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
// ...
}
```

Change trop rien, ajout de la dep chokidar:latest.

---

### 📌 Test lancement avec plugin addblock

✅ yeah osef

---

### 📌 Test lancement depuis console WSL2 plutôt que depuis VSCode

✅ yeah osef

---

## ⚡️💩 Optimisation

cf. [Webpack > docs > watch](https://webpack.js.org/configuration/watch/)

webpack.watchOptions.[aggregateTimeout](https://webpack.js.org/configuration/watch/#watchoptionsaggregatetimeout)

number = 20

Add a delay before rebuilding once the first file changed. This allows webpack to aggregate any other changes made during this time period into one rebuild. Pass a value in milliseconds:

---

webpack.watchOptions.[poll](https://webpack.js.org/configuration/watch/#watchoptionspoll)

Turn on polling by passing true which would set the default poll interval to 5007, or specifying a poll interval in milliseconds:

poll: 1000, // Check for changes every second

```js
// nuxt.config.js
webpack: {
    // aggregateTimeout: 300,
    // poll: 1000
    aggregateTimeout: 50,
    poll: 200
}
// 💩 M'lol
// ✔ Client
//   Compiled successfully in 2.46s

// ✔ Server
//   Compiled successfully in 2.46s
```

---

## ⚡️🧽 Optimisation yarn

```bash
## Après avoir  viré chokidar qui pèse un âne mort
#       @see    https://classic.yarnpkg.com/lang/en/docs/cli/autoclean/
yarn autoclean --init
yarn autoclean --force

yarn install

#       @see    https://yarnpkg.com/cli/cache/clean
yarn cache clean
yarn cache clean --mirror
```

---

## ⚡️ Optimisation build & HMR

📌🕐⏳ Avant Build  ~2 min

📌🕐⏳ Avant HMR    ~300 ms

Package [nuxt-webpack-optimisations](https://github.com/harlan-zw/nuxt-webpack-optimisations)

```bash
yarn add -D nuxt-webpack-optimisations
```

& Maj de `nuxt.config.js`

```js
  buildModules: [
    'nuxt-webpack-optimisations',
  ],

  webpackOptimisations: {
    features: {
      // enable risky optimisations in dev only
      // hardSourcePlugin: process.env.NODE_ENV === 'development',
      // parallelPlugin: process.env.NODE_ENV === 'development',
      // 💩
      hardSourcePlugin: true,
      parallelPlugin: true,
    }
  },
```

💩 risky > false

📌🕐⏳ Après Build  ✅ ~1mn30 min

📌🕐⏳ Après HMR    ✅ ~150 ms

📌✅ Cékassay ? Nope

```bash
# 💩
# export NODE_ENV=development
# 💩
# export NODE_ENV='development'
yarn dev
# nuxt-webpack-optimisations v2.2.8 running risky optimisations: false.

# 💩
# Something isn't working
rm -rf node_modules/.cache
yarn dev
```

À la maing

```js
// Tout simplement ?
// nuxt.config.js
build: {
    hardSource: true,
    parallel: true,
}
```

Note : pas besoin d'installer les plugins, déjà compris dans nuxt

doc [plugin pour parrallel](https://github.com/webpack-contrib/thread-loader#thread-loader)

doc [plugin pour hardSource](https://github.com/mzgoddard/hard-source-webpack-plugin)

```bash
# npm install --save-dev thread-loader
# yarn add -D thread-loader

# 💩 Crash le projet
#       extractCSS: true,
#           🚨 extractCSS cannot work with parallel build due to limited work pool in thread-loader

# npm install --save-dev hard-source-webpack-plugin
# yarn add -D hard-source-webpack-plugin
```

## ⚡️ Optimisation build > virer minify

Article [yay](https://www.voorhoede.nl/en/blog/10x-faster-nuxt-builds-on-netlify/)

```js
build: {
  html: {
    minify: {
      collapseBooleanAttributes: true,
      decodeEntities: true,
-     minifyCSS: true,
+     minifyCSS: false,
-     minifyJS: true,
+     minifyJS: false,
      processConditionalComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      trimCustomFragments: true,
      useShortDoctype: true
    }
  },

    // Max
    cssSourceMap: false,
}
```

css [source maps 600ms](https://nuxtjs.org/docs/configuration-glossary/configuration-build/#csssourcemap)

build 17h20m26 > 17h22m54s > 2m30

📌🕐⏳ Après Build  ✅ ~2mn min may des pics à 4mn wtf

📌🕐⏳ Après HMR    ✅ ~150-200 ms // change rieng

## Unmet dependancies pour le plugin d'opti de build

```bash
# warning "nuxt > @nuxt/components@2.2.1" has unmet peer dependency "consola@*".
# warning " > hard-source-webpack-plugin@0.13.1" has unmet peer dependency "webpack@*".
# warning " > nuxt-webpack-optimisations@2.2.8" has unmet peer dependency "webpack@*".
# warning "nuxt-webpack-optimisations > esbuild-loader@2.21.0" has unmet peer dependency "webpack@^4.40.0 || ^5.0.0".
# warning "nuxt-webpack-optimisations > speed-measure-webpack-plugin@1.5.0" has unmet peer dependency "webpack@^1 || ^2 || ^3 || ^4 || ^5".

# yarn add consola
# yarn add -D webpack

# Installé en tant que peerDep
```

## ⚡️🕐 Check perfs moduiles builds

```bash
yarn nuxt build --analyze
```

Rien de nouveau sous le soleil

## ⚡️🐳 Pas sûr qu'il y a besoin de WSL en fait >_>, go tests sans env pour docker

```bash
#     /mnt/c/                                                           /nux
cp -R /mnt/c/Users/masam/Documents/_dev/_current/nuxt-basic-example/tastytest /home/youpiwaza/_dev/nuxt-basic-example/tastytest
```

build 17h49m49 > 17h52m20s > 2m30

HMR 150ms

Rieng changé

## Ptet lié à la version de Node blah blah 🧠💥

`export NODE_OPTIONS=--openssl-legacy-provider`

build 17h54m31 > 17h56m29 > 2m30

HMR 150-200ms

## Checker config WSL2

yay [fun](https://itnext.io/wsl2-tips-limit-cpu-memory-when-using-docker-c022535faf6f)

Actuellement

```ini
[wsl2]
memory=6GB
```

Up

```ini
[wsl2]
memory=16GB   # Limits VM memory in WSL 2 up to 3GB
processors=8  # Makes the WSL 2 VM use two virtual processors
```

build 18h01m37 > 18h04m41 > 3mn > ...

HMR 200ms

Sinon le suicide c'bien aussi

## parallel / hardsource soit l'un soit l'autre

```js
hardSource: true,
// parallel: true,
```

build 18h07m26 > 18h09m16 > 1mn50

⚡️ HMR 130ms

---

```js
hardSource: true,
// parallel: true,
```

build 18h11m12 > 18h12m54 > 1mn40

HMR 150ms-200ms selon le terminal > may browser = cancer

---

```js
// hardSource: true,
// parallel: true,
```

build 18h15m14 > 18h17m12 > 2mn

HMR ~110ms mais browser cancer

---

Virer webpackOptimisations > debug

⚡️⚡️ build 18h21m58 > 18h22m58 > 1mn

HMR ~110ms mais browser ~okay

---

Virer tout sauf hardSource

build 18h24m43 > 18h25m45 > 1mn

HMR 150 - 250 & browser nope

---

## Virer cache nuxt 🐬🐬🐬🐬⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️

[bof](https://nuxt.com/docs/api/commands/cleanup)

```bash
rm -R .nuxt && rm -R .output && rm -R node_modules/.vite && rm -R node_modules/.cache
```

build 18h29m45 > 18h30m44 > 1mn

🐬🐬🐬🐬🐬 HMR 100ms > BROWSER IDEM YAYYYYYYYYYY Joie & félicité sur le monde 🐬🐬🐬🐬🐬🐬

### 🔒️ Sensible informations

Sensible files won't be versionned in this public project.

You can use the `_secret` suffix in your 'secret' file name.

Instead, they will be stored on a *private* repository, containing the same tree folder.

Just copy/paste the 'secrets' repository on top of this one **on your local machine only**.

And don't forget to update it if some creditentials changes.

## Documentation

This project's documentation can be found in the [_docs](./_docs/) folder.

## Technologies

- html

## Ressources

- [html](https://developer.mozilla.org/fr/docs/Web/HTML)

## Credits

Masamune / Maxime Chevasson
