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
    stylesheets:
      joinTo:
        'css/app.css' : /^(app)/
  sourceMaps: false
