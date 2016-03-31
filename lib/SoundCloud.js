import { fetch } from 'whatwg-fetch'

export default class SoundCloud {

  constructor(token, clientId) {
    if (!clientId)
      throw new Error('Could not initialize SoundCloud. Missing `client_id`.')

    if (!token)
      throw new Error('Could not initialize SoundCloud. Missing `access_token`.')

    this._endpoint   = 'http://api.soundcloud.com/'
    this._token      = token
    this._clientId   = clientId
  }

  get clientId() { return this._clientId }

  static setToken(token) {
    return localStorage.setItem('soundCloudToken', token)
  }

  static getToken(token) {
    return localStorage.getItem('soundCloudToken')
  }

  makeRequest(url, options) {
    var self = this
    options  = options || {}

    if (typeof url === 'object')
      options = url
    else if (typeof url === 'string' && url.indexOf('://') === -1)
      options.url = this._endpoint + url
    else if (typeof url === 'string' && url.indexOf('://') !== -1)
      options.url = url

    console.log(`Fetching ${options.url}?client_id=${self._clientId}&oauth_token=${self._token}&limit=50`)
    return fetch(`${options.url}?client_id=${self._clientId}&oauth_token=${self._token}&limit=50`)
            .then((data) => { return data.json() })
  }

  /**
    Grab different resolution of artwork
  */
  static formatArtwork(artwork_url, size) {
    size = size || 't500x500'
    return artwork_url.replace('-large', '-' + size)
  }

  fetchLikes(options) {
    options = options || {}

    let next_href = options.next_href
    const url = next_href || 'me/favorites?linked_partitioning=1'

    return this.makeRequest(url)
      .then((resp) => {
        // Higher resolution images
        for (let track of resp.collection) {
          track.artwork_url = SoundCloud.formatArtwork(track.artwork_url)
        }
        return resp
      })
      .then((resp) => {
        next_href = resp.next_href
        return resp.collection
      })
  }

  fetchMe(options) {
    options = options || {}

    const url = 'me'
    return this.makeRequest(url)
  }

}
