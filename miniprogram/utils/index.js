const promisify = require('./promisify')
const compressImage = promisify(wx.compressImage)
const cloudCall = promisify(wx.cloud.callFunction)
const uploadFile = promisify(wx.uploadFile)
const getImageInfo = promisify(wx.getImageInfo)
const downloadFile = promisify(wx.downloadFile)
const saveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)

import {
  readFile
} from './fileManager'


function getUid(pix) {
  let index = 0
  pix = pix || 'pix'
  let createTime = Date.now()
  return `pix--${createTime}-${++index}`
}






function imgSecCheck(filePath) {
  let count = 0
  return new Promise((resolve, reject) => {
    let imgSecCheckInner = ((filePath) => {
      console.log("imgSecCheck", filePath)
      let tempFilePaths = null
      compressImage({
        src: filePath, // 图片路径
        quality: 10 // 压缩质量
      }).then(res => {
        tempFilePaths = [res.tempFilePath]
        readFile({
          filePath: res.tempFilePath
        }).then(res => {          
          cloudCall({
            name: "getcollect",
            data: {
              action: "imgSecCheck",
              file: res.data
            }
          }).then(res => {
            
            console.log("cloudCall", res)
            resolve({
              ...res,
              tempFilePaths
            })
          }).catch(err => {
            if (count > 4) {
              reject(err) //res.result.errCode
            } else {
              count += 1
              console.log("count", count)
              imgSecCheckInner(filePath)
            }
            console.log("cloudCall:err", err)
          })
        }).catch(err => {
          reject(err)          
        })
      }).catch(err => {
        reject(err)
        console.log("compressImage:err", err)
      })
    })
    return imgSecCheckInner(filePath)
  })
}


export {  
  imgSecCheck,
  getImageInfo,
  downloadFile,
  saveImageToPhotosAlbum
}