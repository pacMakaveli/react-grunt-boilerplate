### ReactJS & Grunt Boilerplate

ReactJS & Grunt boilerplate for faster development
Includes:

Browserify for managing front-end JavaScript components
Watchify
Watch with LiveReload
Grunt
jQuery, for ReactJS Ajax ( will be replaced with )

INSTALL

git clone
npm install
grunt for launching the Demo App

STRUCTURE

app - for developing, raw
app
  scripts
    components
    - app.jsx
    - main.js

  styles
    - main.less

- index.html
- *.html

dev - for developing, everything compiles here
dev
  scripts
    - app.js
    - main.js

  styles
    - main.css

  - index.html
  - *.html

dist - `grunt serve` to compile for production ( minify and such )
dist
  scripts
    - app.js
    - main.js

  styles
    - main.css

  - index.html
  - *.html
