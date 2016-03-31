# Cumulus for tvOS

Cumulus for tvOS consists of 3 separate projects:

- [Xcode Project](https://github.com/MichielDeMey/cumulus-tv-xcode)  
  This is a simple bootstrapping project which will load our TVJS/TVML application and is no more than a couple of lines of Swift.

- [TVJS/TVML Project](https://github.com/MichielDeMey/cumulus-tv)  
  This is the project you are currently looking at and is the main code for Cumulus.
  
- [OAuth2 Authentication Project](https://github.com/MichielDeMey/tvos-oauth-flow)  
  This project is responsible for the OAuth2 authentication, allowing users to authenticate with a 3rd-party device.
   
# Developing the application
Run `npm start` to start a watcher for Browserify, it will automatically recompile the application when a source file changes.

In addition, start a web-server to serve the application to our tvOS client.

E.g. `http-server . -p 8000` using the "http-server" node module.

# Building the application
Run `npm run build` to create a production build, which will minify and concatenate the JavaScript files.

In addition, serve the static content using a production-ready web-server such as Nginx.
