import gravatar from 'gravatar'

export default {
  url (email) {
    return gravatar.url(email, {
      protocol: 'http',
      default: 'retro',
      f: 'y'
    })
  }
}
