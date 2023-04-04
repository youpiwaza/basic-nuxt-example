export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tastytest',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // ⚡️
    //    @see    https://github.com/harlan-zw/nuxt-webpack-optimisations
    'nuxt-webpack-optimisations',
  ],

  // ⚡️++ 💩 ?
  //    @see    https://github.com/harlan-zw/nuxt-webpack-optimisations#usage
  webpackOptimisations: {
    features: {
      debug: true,
      
      // enable risky optimisations in dev only
      // hardSourcePlugin: process.env.NODE_ENV === 'development',
      // parallelPlugin: process.env.NODE_ENV === 'development',
      hardSourcePlugin: true,
      parallelPlugin: true,
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // ✅🐛 Refresh inline css
    //          🚨 extractCSS cannot work with parallel build due to limited work pool in thread-loader
    // extractCSS: true,
    
    // ⚡️++ 
    hardSource: true,
    parallel: true,
  },

  // ✅🐛 HMR KO w. WSL2
  //    @see    https://github.com/nuxt/nuxt/issues/5550#issuecomment-748667028
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  // ⚡️💩 Test voir perfs /  Nah
  //    @see    https://github.com/nuxt/nuxt/issues/5550#issuecomment-748667028
  // watchers: {
  //   chokidar: {
  //     usePolling: true,
  //     useFsEvents: false
  //   },
  //   webpack: {
  //     // aggregateTimeout: 300,
  //     // poll: 1000
  //     aggregateTimeout: 50,
  //     poll: 200
  //   }
  // }

}
