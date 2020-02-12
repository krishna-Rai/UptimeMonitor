let environments = {}

environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
}

environments.production = {
    'port' : 5000,
    'envName' : 'production'
}

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase : ""

//check that the current environemnt is one off the envvironments above, if not, default to staging

var environemntToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environemntToExport

