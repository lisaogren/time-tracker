module.exports = function (shipit) {
  require('shipit-deploy')(shipit)

  const name = 'time-tracker'
  const workspace = `/tmp/shipit/${name}`

  shipit.initConfig({
    default: {
      workspace,
      deployTo: `/home/rascarlito/www/${name}`,
      repositoryUrl: `git@github.com:RasCarlito/${name}.git`,
      keepReleases: 3,
      ignores: ['.git', 'src'],
      dirToCopy: `${workspace}`
    },
    production: {
      servers: 'rascarlito@carlogren.com'
    }
  })

  shipit.blTask('dependencies', () => {
    return shipit.local(run('npm install'))
      .then(() => {
        shipit.log('Successfully installed dependencies')
      })
      .catch(() => {
        shipit.log('Failed to install dependencies')
      })
  })

  shipit.blTask('build', () => {
    return shipit.local(run('npm run build'))
      .then(() => {
        shipit.log('Successfully built the project')
      })
      .catch(() => {
        shipit.log('Failed to build the project')
      })
  })

  shipit.on('fetched', () => {
    shipit.start('dependencies', 'build')
  })

  function run (cmd) {
    return `cd ${workspace} && ${cmd}`
  }
}
