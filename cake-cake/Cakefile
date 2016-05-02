CoffeeScript  = require 'coffee-script'
{exec}        = require 'child_process'

task 'build', 'build the cake utility from source', ->
  exec 'coffee -c -o lib/ src/*.*coffee'

task 'doc:source', 'rebuild the internal documentation', ->
  exec 'docco src/*.*coffee && cp -rf docs documentation && rm -r docs', (err) ->
    throw err if err
