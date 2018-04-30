# sr-via-redux

My intro into React/Redux using an iMac.
This is a simple (and incomplete) React/Redux/Java project that demonstrates basic UI and REST API integration features. The main objective was to make it build and run, and thereby get a grip on the frontend ecosystem.
All steps that were required to build the project on an iMac are documented.

Core technologies: NPM, Webpack, Babel, React, Redux, Redux-Saga, REST, Jetty

The backend integrates with the invoicing REST API provided by sendregning.no (hence "sr").

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
### Creating repository
Add project, name __sr-via-redux__, add __readme__ and __.gitignore__ for Java, create.

Clone or download > Clone with HTTPS > Copy link
```
$ git clone https://github.com/eogjostol/sr-via-redux.git
```

## Creating Java backend
Create __sr-via-redux/pom.xml__

In IntelliJ IDEA: File > Open… > Select pom.xml > Open as Project

Implement backend (steps are not covered here; see source code for result).

## Frontend prerequisites
Ref.:
* https://docs.npmjs.com/getting-started/installing-node
* https://github.com/creationix/nvm/blob/master/README.md#installation
#### Install NVM (Node Version Manager):
Start Mac Terminal and run the following command (starting with "curl"):
```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```
#### Install/update Node:
```
$ nvm install node
```
#### Update NPM (Node Package Manager):
```
$ npm install npm@latest -g
$ mkdir <project>
$ cd <project>
$ nvm use node
$ npm init
```
Enter values or use defaults.

Result: __package.json__ created, containing entered/default values.

Ref.: https://webpack.js.org/guides/installation/
```
$ npm install --save-dev webpack
```
Result:
* Directory __node_modules__ folder created, containing Webpack files
* Added to __package.json__: "devDependencies": { "webpack": "^4.1.1" }

Install Babel compiler/transpiler for converting from ES6/JSX to ES5 for browser support:

Ref.:
* http://babeljs.io/
* http://babeljs.io/docs/plugins/preset-react/
* https://reactjs.org/docs/add-react-to-an-existing-app.html
```
$ npm install --save-dev babel-preset-env babel-preset-react
$ echo '{ "presets": [“env”, "react"] }' > .babelrc
```
## Install React
Ref.: https://reactjs.org/docs/add-react-to-an-existing-app.html
```
$ npm install --save react react-dom
```
#### Create file/directory structure
Directory __src__ for source files, __dist__ for distribution code (which is the optimised output of the build process).

Ref.: https://webpack.js.org/guides/getting-started/
```
$ mkdir src
$ touch src/index.js
$ mkdir dist
$ touch dist/index.html
```
Fill index.* files with code (see examples in source code).

Build prerequisite: Install Webpack command line interface:
```
$ npm install webpack-cli -D
```
Build (note: __npx webpack__ is equivalent to __./node_modules/.bin/webpack__):
```
$ npx webpack src/index.js --output dist/bundle.js
```
Add React code to __index.js__. Then __npx__ fails: "You may need an appropriate loader to handle this file type". To fix, install __babel-loader__ (https://webpack.js.org/loaders/babel-loader/):
```
$ npm install babel-loader babel-core babel-preset-env webpack
```
Create Webpack config file:
```
$ touch webpack.config.js
```
Fill file, note syntax changes from webpack1 to webpack2 (npx webpack -v gives 4.1.1 for w2) (https://webpack.js.org/guides/migrating/).

To build differently for development vs production, add this to __package.json__:
```json
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
```
Then use __npm run dev__ and __npm run build__

## Install Redux
Ref.: https://www.npmjs.com/package/redux
```
$ npm install --save redux
```
Ref.:
* https://www.npmjs.com/package/react-redux
* https://redux.js.org/basics/usage-with-react#installing-react-redux
```
$ npm install --save react-redux
```
If using experimental object-spread-operator (...xxx), see https://redux.js.org/recipes/using-object-spread-operator

To debug Redux app in Chrome, install Redux DevTools Extension:

https://github.com/zalmoxisus/redux-devtools-extension

and use this in index.js file:
```
const store = createStore(
  myApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```
## CSS handling
We want to bundle CSS (Cascaded Style Sheets) with JS.

Ref.:
* https://github.com/webpack-contrib/css-loader
* https://webpack.js.org/loaders/css-loader/
* https://webpack.js.org/loaders/style-loader/
```
$ npm install --save-dev css-loader
$ npm install --save-dev style-loader
```
Add in __webpack.config.js__ under module > rules:
```
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
```
Example file.css content:
```
.greeting { color: blue; }
```
Usage example in JS file:
```
import style from ‘./file.css'
<p className=“greeting”>Hello</p>
```
### CSS modules
Add in __webpack.config.js__ under module > rules:
```
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
```
Example __file.css__ content:
```
:local .greeting { color: blue; }
```
Usage example in JS file:
```
import style from './file.css'
<p className={style.greeting}>Hello</p>
```
Generated HTML will look like:
```
<p class="src-file__greeting--19nxI">Hello</p>
```
## Make REST calls
To make REST calls in JavaScript, there are many libraries that provide this functionality. In this project the __rest__ library was picked (by coincidence):

Ref.: https://github.com/cujojs/rest

Some alternatives to the __rest__ library are:
* https://github.com/axios/axios
* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
* https://github.com/visionmedia/superagent
```
$ npm install --save rest
```
In the JS file use:
```
import rest from 'rest'
const makeRestCall = queryParam => {
  rest(‘/resource?q=' + queryParam).then(response => console.log(response));
}
```
JSON-returning REST call with Redux (dispatch passed as parameter):
```
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
```
To avoid passing dispatch function as parameter, use __redux-thunk__ (in simple cases) or __redux-saga__.

For more background on making API requests in Redux Saga, see:
* https://hackernoon.com/moving-api-requests-to-redux-saga-21780f49cbc8
* https://www.youtube.com/watch?v=msx0Qiu8NxQ 

## Redux Saga
Ref.:
* https://redux-saga.js.org/
* https://www.npmjs.com/package/redux-saga
```
$ npm install --save redux-saga
```
In __sagas.js__, line 1 (no __npm install__ needed):
```
import "regenerator-runtime/runtime"
```
When using uncontrolled forms and need to refresh defaultValues, use a unique key for the form:

In __<component>.js__:
```
    getKey() {
    return this.props.entity.id + '.' + this.props.entity.etag; // example key
  }
  render() {
	...
      <form key={this.getKey()} ... >
	<input defaultValue={this.props.entity.value} ref={node => { value = node }} />
	...
  }
```
## Datepicker
Ref.:
* https://github.com/dbushell/Pikaday
* https://www.npmjs.com/package/react-pikaday-datepicker
* https://npm.runkit.com/react-pikaday-datepicker
```
$ npm install --save react-pikaday-datepicker
```
In .js:
```
import DatePicker from 'react-pikaday-datepicker';
```
Copy CSS file form https://dbushell.com/Pikaday/css/pikaday.css to ./dist/
	      
In ./dist/index.html:
```
     <link rel="stylesheet" href="./pikaday.css">
```
To make datepicker not inherit background colour:

In pikatable.css:
```
.pika-table {
    background-color: white;
```
