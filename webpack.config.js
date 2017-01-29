// This lets us require files with JSX/ES6 in them
require('babel-core/register')

var fs = require('fs')
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var getConfig = require('hjs-webpack')
var sizeOf = require('image-size')
var Layout = require('./src/components/Layout').default
var Index = require('./src/pages/index').default
var data = require('./src/data')
var ogImage = sizeOf('./build/media/og-image.png')
var pkg = require('./package.json')

var hjsConfig = getConfig({
  in: 'src/app.js',
  out: 'build',
  clearBeforeBuild: '!(css|fonts|media|favicon.ico|apple-touch-icon.png|AUTH)',
  html: function (context) {
    // Use React's `renderToString` method to return an HTML string from our
    // components (dynamic values can be passed into `createElement` too)
    var renderPage = function (page) {
      var pageHtmlString = page ? ReactDOMServer.renderToString(React.createElement(Layout, {}, React.createElement(page))) : ''

      return context.defaultTemplate({
        html: `<link href="https://fonts.googleapis.com/css?family=Fira+Sans:400,400i&amp;subset=latin-ext" rel="stylesheet"><div id="js-root">${pageHtmlString}</div>`,
        title: data.title,
        lang: 'en',
        metaTags: {
          description: data.description,
          'og:url': data.url,
          'og:title': data.og.title || data.title,
          'og:description': data.og.description || data.description,
          'og:site_name': data.og.site_name || data.title,
          'article:author': data.author.name,
          'twitter:card': 'summary_large_image',
          'twitter:image': data.url + '/media/og-image.png?' + pkg.version,
          'og:image': data.url + '/media/og-image.png',
          'og:image:type': 'image/png',
          'og:image:width': ogImage.width,
          'og:image:height': ogImage.height
          // , 'twitter:creator': '@' + data.author.twitter,
          // 'twitter:site': data.og.twitter ,
          // 'apple-mobile-web-app-title': data.name
        }
      })
    }

    return {
      '200.html': renderPage(),
      'index.html': renderPage(Index)
    }
  }
})

// Having hmre present in the .babelrc will break with the `babel-core/register` above
// so wait until that is done and then add it here via the loader query
if (process.env.NODE_ENV === 'development') {
  const babelrc = JSON.parse(fs.readFileSync('./.babelrc'))
  babelrc.env = {development: {presets: ['react-hmre']}}
  hjsConfig.module.loaders[0].query = babelrc
}

module.exports = hjsConfig
