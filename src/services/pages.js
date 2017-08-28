export default function loadPage (name, cb) {
  if (name === 'main') {
    import(/* webpackChunkName: "main" */ 'pages/main').then(cb)
  }
  else if (name === 'login') {
    import(/* webpackChunkName: "login" */ 'pages/login').then(cb)
  }
  else if (name === 'register') {
    import(/* webpackChunkName: "register" */ 'pages/register').then(cb)
  }
  else if (name === 'settings') {
    import(/* webpackChunkName: "settings" */ 'pages/settings').then(cb)
  }
  else if (name === 'profile') {
    import(/* webpackChunkName: "profile" */ 'pages/profile').then(cb)
  }
  else if (name === 'details') {
    import(/* webpackChunkName: "details" */ 'pages/details').then(cb)
  }
}
