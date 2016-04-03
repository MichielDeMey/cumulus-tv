import 'core-js/es6/promise' // Promise polyfill

import Auth from './lib/Auth'
import SoundCloud from './lib/SoundCloud'
import ResourceLoader from './lib/ResourceLoader'
import Presenter from './lib/Presenter'
import Config from './config'

const clientId = Config.clientId

App.feed = []
App.Player = new Player()
App.currentTrackId = null

// Entry point
App.onLaunch = (options) => {
  App.BASEURL = options.BASEURL
  Auth.AUTHURL = options.AUTHURL

  Presenter.showLoadingIndicator()

  // Check SoundCloud token
  App.login(options.AUTHURL)
    .then((token) => {
      App.SoundCloud = new SoundCloud(token, clientId)

      App.SoundCloud.fetchLikes().then((tracks) => {
        App.feed = tracks

        // Present the feed
        Presenter.presentFeed(tracks)
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
        Presenter.presentAuthModal(authuri, key, res.body.qr)

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
