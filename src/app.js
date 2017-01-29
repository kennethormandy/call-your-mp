import 'es6-shim'
import app from 'ampersand-app'
import Router from './router'

require('./css/index.scss')

window.app = app.extend({
  init () {
    this.router = new Router()
    this.router.history.start()
  }
})

app.init()
