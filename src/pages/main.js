import welcome from 'components/welcome'
import dashboard from 'components/dashboard'

export default (state, emit) => {
  const user = state.user.data
  const view = user ? dashboard : welcome

  return view(state, emit)
}
