export default class Auth {

  set AUTHURL(authurl) {
    this._baseUrl = authurl
  }

  get AUTHURL() {
    return this._baseUrl
  }

  static generateSecret() {
    return (Math.random() + 1).toString(36).substr(2)
  }

  static _makeRequest(options) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          let body = xhr.responseText
          try {
            body = JSON.parse(xhr.responseText)
          } catch(ex) {}
          resolve({
            body: body || null,
            status: xhr.status
          })
        }
      }
      xhr.open(options.method, options.uri)
      if (options.json)
        xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(options.json))
    })
  }

  static getKey(secret) {
    const options = {
      method: 'POST',
      uri: `${this.AUTHURL}/key/generate`,
      json: {
        secret
      }
    }

    return this._makeRequest(options)
  }

  // Use XHR natively, otherwise BAD_EXEC crashes
  static checkKey(key, secret) {
    const options = {
      method: 'POST',
      uri: `${this.AUTHURL}/key/${key}`,
      json: {
        secret,
        nonce: this.generateSecret()
      }
    }

    return this._makeRequest(options)
  }

}