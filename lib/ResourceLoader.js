import Presenter from './Presenter'
import Hogan from 'hogan.js'

// Import templates
import '../templates/compiled/auth'
import '../templates/compiled/grid'

export default class ResourceLoader {

  static renderTemplate(templateKey, data) {
    const self = this

    console.log(`[ResourceLoader] - Rendering template "${templateKey}"`)

    if (!App.templates[templateKey]) {
      throw new Error(`Could not render template ${templateKey}, template not found`)
    }

    return App.templates[templateKey].render(data)
  }

}