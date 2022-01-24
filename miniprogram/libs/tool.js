const promisify = require('./promisify')
const compressImage = promisify(wx.compressImage)

export function imageClip(canvas, img, option) {
  return new Promise((resolve, reject) => {
    option = Object.assign({
      left: 0,
      top: 0,
      scale: 1,
      width: 0,
      height: 0
    }, option)
    const ctx = wx.createCanvasContext(canvas)
    let x = option.left / option.scale
    let y = option.top / option.scale
    let clipW = option.width / option.scale
    let clipH = option.height / option.scale
    ctx.drawImage(img,
      x,
      y,
      clipW,
      clipH,
      0,
      0,
      option.width,
      option.height)
    ctx.draw(false, () => {
      resolve()
    })
  })
}

export function mixImgs(canvas, imgs) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(`#${canvas}`).boundingClientRect(rect => {
      _mixImgs(canvas, imgs, rect).then(resolve).catch(reject)
    }).exec()
  })
}

function _mixImgs(canvas, imgs, option) {
  console.log(option)
  console.log(imgs[1])
  return new Promise((resolve, reject) => {
    const getImgInfo = toPromise(wx.getImageInfo)
    let imgsInfo = imgs.map(img => {
      return getImgInfo({ src: img }).then(res => ({ ...res, imgPath: img }))
    })
    const ctx = wx.createCanvasContext(canvas)
    Promise.all(imgsInfo).then(infos => {
      infos.forEach(info => {
        ctx.drawImage(info.path, 0, 0, info.width, info.height, 0, 0, option.width, option.height)
      })
      ctx.draw(false,  resolve)
    }).catch(reject)
  })

}

export function saveCanvasToTemp(canvas, option) {
  option = {
    ...option,
    canvasId: canvas
  }
  return toPromise(wx.canvasToTempFilePath)(option).then(res => res.tempFilePath)
}

export function saveImage(imgPath) {
  return toPromise(wx.saveImageToPhotosAlbum)({ filePath: imgPath })
}

function toPromise(fn) {
  return (obj) => {
    return new Promise((resolve, reject) => {
      fn({ ...obj, success: resolve, fail: reject })
    })
  }
}
export function throttle(method, delay=300, time=300) {
  var timeout, startTime = new Date()
  return function () {
    var context = this, args = arguments
    var curTime = new Date()
    clearTimeout(timeout)
    // 若达到了触发的时间间隔，则立即触发handler
    if (curTime - startTime >= time) {
      method.apply(context, args)
      startTime = curTime
      // 若没有达到触发的时间间隔，则重新设定定时器
    } else {
      timeout = setTimeout(method, delay)
    }
  }
}


/**
 * 图片检验
 * 
 * */

const cloudCall = promisify(wx.cloud.callFunction)
const readFile = promisify(wx.getFileSystemManager().readFile)
export function imgSecCheck(filePath) {
  let count = 0  
  return new Promise((resolve, reject) => {
    let imgSecCheckInner = ((filePath) => {      
      console.log("imgSecCheck", filePath)  
      compressImage({ src: filePath, quality:50}).then(res=>{
        let compressFile = res.tempFilePath
        readFile({
          filePath: compressFile,
          encoding: 'base64'
        }).then(res => {
          cloudCall({
            name: 'upload',
            data: {
              action: "imgSecCheck",
              file: res.data
            }
          }).then(res => {
            console.log("cloudCall", res)
            resolve(res)
          }).catch(err => {
            if (count > 4) {
              reject(err) //res.result.errCode
            } else {
              count += 1
              console.log("count", count)
              imgSecCheckInner(compressFile)
            }
            console.log("cloudCall:err", err)
          })
        }).catch(err => {
          reject(err)
        })
      }).catch(err=>{
        reject(err)
      })
    })
    return imgSecCheckInner(filePath)
  })
}


export function msgSecCheck(content) {
  return new Promise((resolve, reject) => {
    cloudCall({
      name: "upload",
      data: {
        action: "msgSecCheck",
        content: content
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
