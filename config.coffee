exports.config =
  modules:
    nameCleaner: (path) ->
      path.replace(/^app\//, '')
  paths:
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
