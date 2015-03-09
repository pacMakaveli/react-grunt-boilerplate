### ReactJS & Grunt Boilerplate

ReactJS & Grunt boilerplate for faster development
Includes:

Browserify for managing front-end JavaScript components
Watchify
Watch with LiveReload
Grunt
jQuery, for ReactJS Ajax ( will be replaced with )

INSTALL

``` bash
git clone git@github.com:pacMakaveli/react-grunt-boilerplate.git && cd react-grunt-boilerplate
npm install
grunt
```

STRUCTURE

##### `app` Structure
`Contains all your application' files, raw & untouched`
```
scripts
  components
    - *.jsx
  - app.jsx
  - main.js
styles
  - main.less
- index.html
- *.html
```

##### `dev` Structure
`Contains all your application' files, compiled & unminified`
``` bash
$ grunt serve
```
```
scripts
  - app.js
  - main.js
styles
  - main.css
- index.html
- *.html
```

##### `dev` Structure
`Contains all your application' files, compiled, minified and ready to deploy`
``` bash
$ grunt deploy
```
```
scripts
  - app.js
  - main.js
styles
  - main.css
- index.html
- *.html
```
