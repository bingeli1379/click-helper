import { ipcMain } from 'electron'
import robot from 'robotjs'

ipcMain.handle('macro', (event, macro, delay) => {
  robot.keyTap('tab', ['alt'])

  setTimeout(() => {
    try {
      macro.reduce(async (acc, current) => {
        if (acc) await acc
        return new Promise(resolve => {
          current.forEach(key => {
            robot.keyToggle(key, 'down')
          })
          current.forEach(key => {
            robot.keyToggle(key, 'up')
          })
          setTimeout(() => {
            resolve()
          }, delay)
        })
      }, undefined)
    } catch (error) {
      console.error(error)
    }
  }, 100)
})
