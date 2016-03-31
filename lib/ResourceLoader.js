/*
Copyright (C) 2015 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
This class handles the loading of resources from the network using the evaluateScripts
function.

TVMLKit also provides a complet XMLHttpRequest object that can be used to request
resources from the network.
*/

import Presenter from './Presenter'

/**
 * @description This function sets the class BASEURL attribute
 * @param {String} baseurl - The base URL for the app
 * @throws Exception - If no baseurl argument is provided
 */
export default class ResourceLoader {
  /**
   * @description This function loads a resource then invokes the callback
   * @param {String} resource - The URL to a JavaScript file
   * @param {Function} callback - The callback to invoke after successfully loading the resource
   */
  loadResource(resource, callback) {
    var self = this

    console.log(`[ResourceLoader] - Loading ${resource}`)

    /**
     * evaluateScripts is responsible for loading the JavaScript files neccessary
     * for you app to run. It can be used at any time in your apps lifecycle. In
     * this implementation we are using evaluate scripts to load and evaluate
     * template files saved as JavaScript string templates.
     *
     * @param - Array of JavaScript URLs
     * @param - Function called when the scripts have been evaluated. A boolean is
     * passed that indicates if the scripts were evaluated successfully.
     */
    evaluateScripts([resource], function(success) {
      if (success) {
        var resource = Template.call(self)
        callback.call(self, resource)
      } else {
        var title = 'Resource Loader Error',
          description = `There was an error attempting to load the resource '${resource}'. \n\n Please try again later.`,
          alert = App.createAlert(title, description)

        Presenter.removeLoadingIndicator()

        navigationDocument.presentModal(alert)
      }
    })
  }
}