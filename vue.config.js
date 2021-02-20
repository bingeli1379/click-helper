/* eslint-disable no-template-curly-in-string */

module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        productName: 'HowGer Macro',
        artifactName: 'HowGer Macro Setup ${arch} ${version}.${ext}',
        win: {
          icon: 'build/icons/icon.ico'
        }
      }
    }
  }
}
