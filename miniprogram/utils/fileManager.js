const promisify = require('./promisify')
const fileSystemManager = wx.getFileSystemManager()
const readFile = promisify(fileSystemManager.readFile)
const getFileInfo = promisify(fileSystemManager.getFileInfo)
export { readFile, getFileInfo }