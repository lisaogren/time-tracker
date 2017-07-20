import forEach from 'lodash/forEach'

export default (options) => {
  const list = options.list
  const breakpoint = options.breakpoint || 4

  const groups = []
  let group = []

  groups.push(group)

  forEach(list, (item, i) => {
    if (i % breakpoint === 0 && i !== 0) {
      group = []
      groups.push(group)
    }

    group.push(item)
  })

  return groups
}
