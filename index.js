import 'core-js/es6/promise' // Promise polyfill

import Auth from './lib/Auth'
import SoundCloud from './lib/SoundCloud'
import ResourceLoader from './lib/ResourceLoader'
import Presenter from './lib/Presenter'
import Config from './config'

const clientId = Config.clientId
let resourceLoader

App.feed = []
App.Player = new Player()
App.currentTrackId = null

// Entry point
App.onLaunch = (options) => {
  App.BASEURL = options.BASEURL
  Auth.AUTHURL = options.AUTHURL

  resourceLoader = new ResourceLoader()
  Presenter.showLoadingIndicator()

  // Check SoundCloud token
  App.login(options.AUTHURL)
    .then((token) => {
      App.SoundCloud = new SoundCloud(token, clientId)

      App.SoundCloud.fetchLikes().then((feedItems) => {
        App.feed = feedItems

        // Present the feed
        var startTemplate = `${options.BASEURL}/templates/grid.xml.js`

        var index = resourceLoader.loadResource(startTemplate, function(resource) {
          var doc = Presenter.makeDocument(resource)
          doc.addEventListener('select', App.playSong)
          doc.addEventListener('play', App.playSong)
          Presenter.feedPresenter(doc, feedItems)
        })
      })
    })
    .catch((err) => {
      console.error(err)
      App.reload()
    })
}

App.playSong = (event) => {
  const elm = event.target
  const trackId = elm.getAttribute('trackId')

  if (App.currentTrackId === trackId) return App.Player.present()
  App.currentTrackId = trackId

  console.log(`Playing track ${trackId}`)

  // Find the trackId
  const trackIndex = App.feed.findIndex((track) => {
    return track.id.toString() === trackId.toString()
  })
  const playlistItems = App.feed.slice(trackIndex, App.feed.length)

  App.Player.playlist = new Playlist()

  playlistItems.forEach((song) => {
    console.log(`Adding ${song.stream_url}?client_id=${App.SoundCloud.clientId}`)
    const audio = new MediaItem('audio', `${song.stream_url}?client_id=${App.SoundCloud.clientId}`)
    audio.title = song.title
    audio.description = song.description
    audio.artworkImageURL = song.artwork_url
    App.Player.playlist.push(audio)
  })

  App.Player.present()
}

App.login = (authuri) => {
  if (SoundCloud.getToken()) { return Promise.resolve(SoundCloud.getToken()) }

  return new Promise((resolve, reject) => {
    const secret = Auth.generateSecret()
    const key = Auth.getKey(secret)
      .then((res) => {
        const key = res.body.key

        // Show auth dialog
        const auth = createOAuthLogin(key, res.body.qr, authuri)
        Presenter.presentModal(auth)

        const check = () => {
          Auth.checkKey(key, secret)
            .then((res) => {
              if (res.status === 202) return setTimeout(check, 2000)
              if (res.status !== 200) return reject(res.body)

              if (res.status === 200 && res.body) {
                SoundCloud.setToken(res.body)
                Presenter.dismissModal()
                return resolve(res.body)
              }
            })
        }

        setTimeout(check, 2000)
      })
  })
}

const createOAuthLogin = (key, qrcode, authuri) => {
  const templateString = `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <descriptiveAlertTemplate>
       <title>Scan this QR code to log in</title>
       <description>
        Or go to ${authuri}/activate
        and enter the key "${key}"
       </description>
       <img width="620" height="620" src="${qrcode}" />
    </descriptiveAlertTemplate>
  </document>
  `
  const parser = new DOMParser()
  return parser.parseFromString(templateString, 'application/xml')
}

App.createAlert = (title, description) => {
    const alertString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <alertTemplate>
        <title>${title}</title>
        <description>${description}</description>
        <button>
          <text>OK</text>
        </button>
      </alertTemplate>
    </document>`
    const parser = new DOMParser()
    return parser.parseFromString(alertString, 'application/xml')
}
