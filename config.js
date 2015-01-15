module.exports = {
    prod: (process.env.NODE_ENV && process.env.NODE_ENV.indexOf('prod') > -1) ? true : false 
}
