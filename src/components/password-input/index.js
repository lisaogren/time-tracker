import $ from 'dominus'
import html from 'choo/html'

import './index.scss'

export default (options = {}) => {
  return html`
    <div class="field password-component">
      <label class="label">Mot de passe</label>
      <p class="control has-icons-right">
        <input type="password" name="password" class="input ${options.error ? 'is-danger' : ''}" placeholder="1 m0t D3 PaSs3 Tr3s C0mpL!qu3" required />
        <a class="icon is-small is-right" onclick=${togglePassword}>
          <i class="fa fa-eye"></i>
        </a>
      </p>
      ${options.error}
    </div>
  `

  function togglePassword (e) {
    e.preventDefault()

    const $el = $(e.currentTarget)
    const $input = $el.prev()

    const currentType = $input.attr('type')

    $el.find('i.fa')
      .removeClass(currentType === 'password' ? 'fa-eye' : 'fa-eye-slash')
      .addClass(currentType === 'password' ? 'fa-eye-slash' : 'fa-eye')

    $input.attr('type', currentType === 'password' ? 'text' : 'password').focus()
  }
}
