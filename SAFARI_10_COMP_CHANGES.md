
modified:   _develop/scripts/release.sh
modified:   _develop/webpack.config.js
modified:   core/quill.js
modified:   package-lock.json
modified:   package.json
modified:   ui/icons.js


# _develop/webpack.config.js
Copied Labflow's setup

# ui/icons.js
icons.js was using `import`  statement with `module.exports =`  assignments in the same file

# core/quill.js
added a const that would point to the Quill class that would not get name mangled and survive scope

# package.json
Copied Labflow's setup for webpack
