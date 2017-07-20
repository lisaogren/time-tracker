import html from 'choo/html'

export default () => {
  return html`
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          Made by <a href="https://carlogren.com" title="Carl Ogren's homepage">Carl Ogren</a><br>
          <a href="https://twitter.com/@CarlOGREN" title="Twitter">
            <i class="fa fa-twitter"></i>
          </a>
          <a href="https://github.com/RasCarlito" title="Github">
            <i class="fa fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  `
}
