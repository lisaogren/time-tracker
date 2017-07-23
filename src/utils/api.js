import forEach from 'lodash/forEach'
import partial from 'lodash/partial'
import http from 'xhr'
import urlComposer from 'url-composer'
import Promise from 'bluebird'

const config = {
  host: 'http://localhost:3000',
  services: {
    login: {
      path: '/auth/local',
      method: 'post'
    },
    logout: {
      path: '/auth/logout',
      method: 'post'
    },
    register: {
      path: '/api/users',
      method: 'post'
    },
    me: {
      path: '/api/users/me',
      method: 'get'
    },
    updateSettings: {
      path: '/api/settings/:id',
      method: 'put'
    },
    addSettings: {
      path: '/api/settings',
      method: 'post'
    }
  }
}

function request (serviceName, options = {}) {
  const service = config.services[serviceName]
  const { params, query, data } = options

  if (!service) {
    throw new Error(`[api] Inexisting api service '${serviceName}'`)
  }

  return new Promise((resolve, reject) => {
    const url = urlComposer.build({
      host: config.host,
      path: service.path,
      params,
      query
    })

    const options = {
      json: true,
      body: data,
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      },
      withCredentials: true
    }

    http[service.method || 'get'](url, options, (error, response, body) => {
      if (error) return reject(error)
      else if (response.statusCode >= 500) return resolve({ error: true, type: 'technical', xhr: response })
      else if (response.statusCode >= 400) return resolve({ error: true, type: 'functional', xhr: response })

      resolve({ xhr: response, body })
    })
  })
}

const api = {
  request
}

forEach(config.services, (service, name) => {
  api[name] = partial(request, name)
})

export default api
