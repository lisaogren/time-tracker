import partialRight from 'lodash/partialRight'
import serialize from 'form-serialize'

export default partialRight(serialize, { hash: true })
