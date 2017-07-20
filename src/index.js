import 'font-awesome/scss/font-awesome.scss'
import 'index.scss'

import choo from 'choo'
import chooLog from 'choo-log'

import appService from 'services/app'
import timerService from 'services/timer'
import userService from 'services/user'

const app = choo()

app.use(chooLog())
app.use(userService)

appService.init(app)
timerService.init(app)

app.mount('body')
