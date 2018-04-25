# sr-via-redux

My intro into React/Redux.
This is a simple (and incomplete) React/Redux/Java project that demonstrates basic UI and integration features.
All steps that were required to build the project are documented.

Core technologies: NPM, Webpack, Babel, React, Redux, Redux-Saga, REST, Jetty

## What it demonstrates
### Frontend:
- REST API calls using redux-saga and rest
- GET and POST with JSON content
- Controlled and uncontrolled React components
- Dropdowns
- Date-picking using Pikadate
- HATEOAS using rest location
- CSS styling the React way

### Backend:
- Embedded Jetty with no XML config
- Handling GET & POST requests
- Integrating with a remote REST API via OkHttp HTTP client
- Faking HTTP client for testing
- Basic Auth for authentication towards remote API

## GitHub.com
Add project
Name sr-via-redux
Add readme and .gitignore for Java
Create
Clone or download > Clone with HTTPS > Copy link
$ git clone https://github.com/eogjostol/sr-via-redux.git
Create sr-via-redux/pom.xml
In IntelliJ: File > Open… > Select pom.xml > Open as Project

## Prerequisites
Ref.: https://docs.npmjs.com/getting-started/installing-node
      https://github.com/creationix/nvm/blob/master/README.md#installation
Install nvm:
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
Install/update Node:
$ nvm install node
Update npm:
$ npm install npm@latest -g

$ mkdir <project>
$ cd <project>
$ nvm use node
$ npm init
Enter values or use defaults.
Result: package.json created, containing entered/default values.

Ref.: https://webpack.js.org/guides/installation/
$ npm install --save-dev webpack
Result: - node_modules folder created, containing Webpack files
        - added to package.json: "devDependencies": { "webpack": "^4.1.1" }

Install Babel compiler/transpiler for converting from ES6/JSX to ES5 for browser support:
Ref.: http://babeljs.io/
      http://babeljs.io/docs/plugins/preset-react/
      https://reactjs.org/docs/add-react-to-an-existing-app.html
$ npm install --save-dev babel-preset-env babel-preset-react
$ echo '{ "presets": [“env”, "react"] }' > .babelrc

## Install React
Ref.: https://reactjs.org/docs/add-react-to-an-existing-app.html
$ npm install --save react react-dom

Create file/directory structure (src for source files, dist for distribution code, i.e. optimised output of build process):
Ref.: https://webpack.js.org/guides/getting-started/
$ mkdir src
$ touch src/index.js
$ mkdir dist
$ touch dist/index.html
Fill index.* files with code

Build prereq.: Install Webpack command line interface:
$ npm install webpack-cli -D
Build (note: ‘npx webpack’ is equivalent to ./node_modules/.bin/webpack):
$ npx webpack src/index.js --output dist/bundle.js

Add React code to index.js
Then npx fails: “You may need an appropriate loader to handle this file type”
To fix, install babel-loader (https://webpack.js.org/loaders/babel-loader/):
$ npm install babel-loader babel-core babel-preset-env webpack
Create Webpack config file:
$ touch webpack.config.js
Fill file, note syntax changes from webpack1 to webpack2 (npx webpack -v gives 4.1.1 for w2) (https://webpack.js.org/guides/migrating/).

To build differently for dev vs prod, add this to package.json:
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
Then use ‘nom run dev’ and ‘nom run build’

## Install Redux
Ref.: https://www.npmjs.com/package/redux
$ npm install --save redux
Ref.: https://www.npmjs.com/package/react-redux
      https://redux.js.org/basics/usage-with-react#installing-react-redux
$ npm install --save react-redux

If using experimental object-spread-operator (...xxx), see https://redux.js.org/recipes/using-object-spread-operator

To debug Redux app in Chrome, install Redux DevTools Extension:
https://github.com/zalmoxisus/redux-devtools-extension
and use this in index.js file:
const store = createStore(
  myApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

## CSS handling
We want to bundle CSS with JS
Ref.: https://github.com/webpack-contrib/css-loader
      https://webpack.js.org/loaders/css-loader/
      https://webpack.js.org/loaders/style-loader/
$ npm install --save-dev css-loader
$ npm install --save-dev style-loader
Add in webpack.config.js under module > rules:
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
Example file.css content:
.greeting { color: blue; }
Usage example in JS file:
import style from ‘./file.css'
<p className=“greeting”>Hello</p>

### CSS modules
Add in webpack.config.js under module > rules:
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      }

Example file.css content:
:local .greeting { color: blue; }
Usage example in JS file:
import style from ‘./file.css'
<p className={style.greeting}>Hello</p>
Generated HTML will look like:
<p class="src-file__greeting--19nxI">Hello</p>

## Make REST calls
Using ‘rest’ library:
Ref.: https://github.com/cujojs/rest
Alternatives to rest:
– https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
– https://github.com/axios/axios
– https://github.com/visionmedia/superagent
$ npm install --save rest
In JS file use:
import rest from 'rest'
const makeRestCall = queryParam => {
  rest(‘/resource?q=' + queryParam).then(response => console.log(response));
}

JSON-returning REST call with Redux (dispatch passed as parameter):
// mime converts JSON string in response to JS object
import mime from 'rest/interceptor/mime'
export function getJson(dispatch) {
    rest.wrap(mime)(‘/resource’)
    .then(response => {
        if (response.status.code == 200) {
          dispatch(resourceFetched(response.entity));
        }
    });
}

To avoid passing dispatch function as parameter, use redux-thunk (in simple cases) or redux-saga.
(About making API requests in Redux Saga:
 – https://hackernoon.com/moving-api-requests-to-redux-saga-21780f49cbc8
 – https://www.youtube.com/watch?v=msx0Qiu8NxQ 
)

## Redux Saga
Ref.: https://redux-saga.js.org/
      https://www.npmjs.com/package/redux-saga
$ npm install --save redux-saga

In sagas.js, line 1 (no npm install needed):
import "regenerator-runtime/runtime"

When using uncontrolled forms and need to refresh defaultValues,
use a unique key for the form:
In <component>.js:
  getKey() {
    return this.props.entity.id + '.' + this.props.entity.etag; // example key
  }
  render() {
	...
      <form key={this.getKey()} ... >
	<input defaultValue={this.props.entity.value} ref={node => { value = node }} />
	...
  }

## Datepicker
Ref.: https://github.com/dbushell/Pikaday
      https://www.npmjs.com/package/react-pikaday-datepicker
      https://npm.runkit.com/react-pikaday-datepicker
(Alternatives: https://github.com/fobbyal/pikaday-react
               https://github.com/thomasboyt/react-pikaday <- requires old react version)
$ npm install --save react-pikaday-datepicker
In .js:
import DatePicker from 'react-pikaday-datepicker';
Copy CSS file form https://dbushell.com/Pikaday/css/pikaday.css to ./dist/
In ./dist/index.html:
     <link rel="stylesheet" href="./pikaday.css">

To make datepicker not inherit background colour:
In pikatable.css:
.pika-table {
    background-color: white;
