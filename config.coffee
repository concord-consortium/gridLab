exports.config =
  modules:
    nameCleaner: (path) ->
      path.replace(/^app\/src\//, '')
  paths:
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components)/
  sourceMaps: false
