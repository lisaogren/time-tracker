import 'font-awesome/scss/font-awesome.scss'
import 'index.scss'

import choo from 'choo'
import chooLog from 'choo-log'

import appService from 'services/app'
import timerService from 'services/timer'
import userService from 'services/user'
import settingsService from 'services/settings'

const app = choo()

// if (debug) !
app.use(chooLog())

app.use(userService)
app.use(settingsService)
app.use(timerService)

appService.init(app)

app.mount('body')
