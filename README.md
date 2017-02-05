# Call Your MP

If you have any questions about the website, feel free to [open an issue](/issues).

## MP letters

The content for this letter is pulled from [skeskali/MPFormLetters](https://github.com/skeskali/MPFormLetters). Thanks [@skeskali](https://twitter.com/skeskali) and [@freyburg](https://twitter.com/freyburg)! Future iterations of this site should support other letters.

## Getting started

To get started, clone this project locally by running the following command in your terminal:

```sh
git clone https://github.com/kennethormandy/call-your-mp
cd call-your-mp
```

Running this static site locally will require a recent stable version of [Node.js](https://nodejs.org) installed. (Node.js isn’t used in production and you don’t really need to know much about it to contribute to the site. [hjs-webpack](https://github.com/HenrikJoreteg/hjs-webpack), a preconfigured version of [Webpack](https://github.com/webpack/webpack), is used as the static site generator and compile the Sass files, metadata, and React components into HTML, CSS, and JavaScript using Node.js.

Node.js comes with [npm](https://npmjs.org), the package manager for JavaScript. Use it to install the project’s dependencies (the other JavaScript libraries and tools listed in the `package.json` file) by running the following command:

```sh
# Install dependencies
npm install
```

## Serving the site

To run the site locally, run the following commands in your terminal:

```sh
# Start the project
npm start

# Now available at http://localhost:3000
```

## Compiling the site

You can compile the site to static HTML, CSS, and JavaScript at any point using the following command:

```sh
npm run build
```

This will compile the site to a `./build` directory using Webpack.

## Deploying the site

The deployment process for publishing the site to [Surge.sh](https://surge.sh) is already set up.

This should also be triggered automatically via [Travis CI](http://travis-ci.com). When you push to the `master` branch, the dependencies are installed, the `npm run build` command is run, and then deployment is handled via [Surge.sh](https://surge.sh).

### Deploy to staging

Running the following command will automatically compile the site, add a `robots.txt` file and publish it to the staging domain, so the site can be previewed in the production environment:

```sh
npm run stage
```

### Deploy to production

Running the following command will automatically compile the site and deploy to the production domain:

```sh
npm run deploy
```

You’ll need an [invitation](https://surge.sh/help/adding-collaborators) from [@kennethormandy](https://github.com/kennethormandy) to publish.

## License

Copyright © 2017 [Kenneth Ormandy](http://kennethormandy.com)
