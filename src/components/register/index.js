import $ from 'dominus'
import html from 'choo/html'
import first from 'lodash/first'
import log from 'utils/log'
import serialize from 'utils/form-serialize'

import passwordInput from 'components/password-input'

import './index.scss'

export default (state, emit) => {
  // const error = state.user.register.error
  const invalidAttributes = state.user.register.invalidAttributes

  return html`
    <section class="section register-component">
      ${state.user.register.success ? registerSuccess() : registerForm()}
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function registerSuccess () {
    return html`
      <div class="container">
        <div class="content has-text-centered">
          <h3>
            <span>Hey ! Bienvenue ${state.user.register.username}</span>
            <span class="icon">
              <i class="fa fa-smile-o"></i>
            </span>
          </h3>
          <p>
            Il ne te reste plus qu'a te connecter via <a href="/login" onclick=${goToLogin}>le formulaire de connexion</a> pour utiliser Time Tracker !
          </p>
        </div>
      </div>
    `
  }

  function registerForm () {
    const passwordError = invalidationMessage({
      field: 'password',
      invalidation: first(invalidAttributes.password)
    })

    return html`
      <div class="container">
        <h1 class="title has-text-centered">Créer ton compte !</h1>
        <hr>
        <form class="register" onsubmit=${submitRegister}>
          <div class="columns">
            <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
              ${usernameInput()}
              ${emailInput()}
              ${passwordInput({ error: passwordError })}
              <div class="field">
                <div class="control actions">
                  <button class="button is-primary">S'inscrire</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr>
        <div class="content has-text-centered">
          <h3>Tu as déjà un compte ?!</h3>
          <p>
            Mais quesque tu fais là !
            <a href="/login" class="login-link">
              <span class="icon">
                <i class="fa fa-sign-in"></i>
              </span>
              <span>Connectes-toi</span>
            </a>
          </p>
        </div>
      </div>
    `
  }

  function usernameInput () {
    const invalidation = first(invalidAttributes.username)

    return html`
      <div class="field">
        <label class="label">Nom d'utilisateur</label>
        ${input({ type: 'text', name: 'username', placeholder: 'Jean-Michel', hasError: invalidation })}
        ${invalidationMessage({ field: 'username', invalidation })}
      </div>
    `
  }

  function emailInput () {
    const invalidation = first(invalidAttributes.email)

    return html`
      <div class="field">
        <label class="label">E-mail</label>
        ${input({ type: 'email', name: 'email', placeholder: 'jeanmichel@peupres.fr', hasError: invalidation })}
        ${invalidationMessage({ field: 'email', invalidation })}
      </div>
    `
  }

  function input ({ type, name, placeholder, hasError }) {
    return html`
      <div class="control ${hasError ? 'has-icons-right' : ''}">
        <input
          type="${type}"
          name="${name}"
          class="input ${hasError ? 'is-danger' : ''}"
          placeholder="${placeholder}"
          required
          onkeypress=${storeValue}
          onchange=${storeValue}
          value="${state.user.register.data[name] || ''}"
        />
        ${hasError ? inputWarning() : ''}
      </div>
    `
  }

  function invalidationMessage ({ field, invalidation }) {
    if (!invalidation) return ''

    const invalidationsMap = {
      'Error.Passport.User.Exists': `Ce nom d'utilisateur est déjà utilisé`,
      'Error.Passport.Email.Exists': 'Cet email est déjà utilisé',
      'Error.Passport.Password.Short': 'Ce mot de passe est trop court'
    }

    return html`
      <p class="help is-danger">${invalidationsMap[invalidation.message]}</p>
    `
  }

  function inputWarning () {
    return html`
      <span class="icon is-small is-right"><i class="fa fa-warning"></i></span>
    `
  }

  // ----------------------
  // Listeners
  // ----------------------

  function submitRegister (e) {
    e.preventDefault()

    const data = serialize(e.currentTarget)

    log.debug('[components/register] Submitted register form:', data)

    emit('user:register', data)
  }

  function goToLogin (e) {
    e.preventDefault()

    emit('user:register:reset')
    emit('pushState', $(e.currentTarget).attr('href'))
  }

  function storeValue (e) {
    const $el = $(e.currentTarget)

    const field = $el.attr('name')
    const value = $el.value()

    emit('user:register:store', { field, value })
  }
}
