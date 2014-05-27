# [GridLab](https://github.com/concord-consortium/gridLab)

A grid simulation application for the [Learning Everywhere](http://concord.org/learning-everywhere/) project.

## Running Locally

This project is built using Brunch.io, which compiles the CoffeeScript,
stylesheets, and other assets.

### Dependencies

* [Node](http://nodejs.org/) `brew install node`
* [Brunch 1.4.5](http://brunch.io) `npm install -g brunch/brunch`
* [Bower](http://bower.io/) `npm install -g bower`

### Setup Brunch and Project Libraries

You'll need to install the plugins required for the brunch project, as well
as libraries the project depends on.

```
  npm install
  bower install
```

### Starting the Server

Run this command:

```
  npm start
```

Now open http://localhost:3333. Whenever you make a change to a file the
browser will be automatically refreshed.

Your files will automatically be built into the /public directory
whenever they change.

You can also just run `brunch build` to simply build the files into /public without starting
the server.

### Running the Tests

To run the tests under PhantomJS, you'll first have to install PhantomJS

```
  brew install phantomjs
```

The run

```
  npm test
```

