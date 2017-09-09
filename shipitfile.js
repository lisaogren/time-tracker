module.exports = function (shipit) {
  require('shipit-deploy')(shipit)

  const name = 'time-tracker'
  const workspace = `/tmp/shipit/${name}`
  const deployTo = `/home/rascarlito/www/${name}`

  shipit.initConfig({
    default: {
      workspace,
      deployTo,
      repositoryUrl: `git@github.com:RasCarlito/${name}.git`,
      keepReleases: 3,
      branch: 'master',
      ignores: ['.git', 'node_modules'],
      dirToCopy: `${workspace}`
    },
    production: {
      servers: 'rascarlito@carlogren.com'
    }
  })

  shipit.blTask('dependencies', () => {
    return shipit.remote(run('npm install'))
      .then(() => {
        shipit.log('Successfully installed dependencies')
      })
      .catch(() => {
        shipit.log('Failed to install dependencies')
      })
  })

  shipit.blTask('build', () => {
    return shipit.remote(run('npm run build'))
      .then(() => {
        shipit.log('Successfully built the project')
      })
      .catch(() => {
        shipit.log('Failed to build the project')
      })
  })

  shipit.on('deployed', () => shipit.start('dependencies', 'build'))

  function run (cmd) {
    return `cd ${deployTo}/current && ${cmd}`
  }
}
