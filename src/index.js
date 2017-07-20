import 'font-awesome/scss/font-awesome.scss'
import 'index.scss'

import choo from 'choo'

import appService from 'services/app'
import timerService from 'services/timer'

const app = choo()

appService.init(app)
timerService.init(app)

app.mount('body')
