// miniprogram/pages/photo/detail/index.js
import {
  shareContent
} from '../../../config'
import {
  saveImageToPhotosAlbum,
  downloadFile
} from '../../../utils/index'
let preImg = ''
let loading = false
const currentPageData = {
  videoAd: null,
  videoSucccFn: null,
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    adType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload', options)
    let tempUrl = decodeURIComponent(options['url'])
    let adType = +decodeURIComponent(options['adType'])
    preImg = tempUrl
    this.setData({
      url: tempUrl,
      adType: adType,
    })
    if (wx.createRewardedVideoAd) {
      currentPageData.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-06f9cd09e08245a5'
      })
      currentPageData.videoAd.onLoad(() => {
        wx.reportEvent("load_ad", {
          "status": 1
        })
      })
      currentPageData.videoAd.onError((err) => {
        wx.reportEvent("load_ad", {
          "status": 2
        })
        currentPageData.videoSucccFn();
      })
      currentPageData.videoAd.onClose((res) => {
        wx.reportEvent("load_ad", {
          "status": 3
        })
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          wx.reportEvent("load_ad", {
            "status": 5
          })
          currentPageData.videoSucccFn();
        } else {
          wx.reportEvent("load_ad", {
            "status": 4
          })
          // 播放中途退出，不下发游戏奖励
        }
      })
    }

  },
  openAd() {
    // 用户触发广告后，显示激励视频广告
    if (currentPageData.videoAd) {
      currentPageData.videoAd.show().catch(() => {
        // 失败重试
        currentPageData.videoAd.load()
          .then(() => currentPageData.videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  previewImage: function () {
    wx.previewImage({
      urls: [preImg],
      showmenu: false
    })
  },
  goHome: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  downloadWrap() { // 下载外包一层判断是否需要广告
    if (this.data.adType === 1) {
      currentPageData.videoSucccFn = this.download;
      this.openAd();
    } else {
      this.download();
    }
  },
  download: function () {


    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {

          if (loading) {
            return
          }
          loading = true
          wx.showLoading({
            title: '保存中...',
          })
          let tempHttps = "";
          if (preImg.indexOf("https") > -1) {
            tempHttps = preImg;
          } else {
            tempHttps = preImg.replace('http', 'https');
          }
          downloadFile({
            url: tempHttps
          }).then(res => {
            console.log("downloadFile", res)
            saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
            }).then(res => {
              wx.showToast({
                title: '保存成功',
              })
              loading = false
              console.log("saveImageToPhotosAlbum", res)
            }).catch(err => {
              wx.hideLoading({
                success: (res) => {},
              })

              loading = false
              console.log("err:saveImageToPhotosAlbum", err)
            })
          }).catch(err => {
            wx.showToast({
              title: '保存失败',
            })
            loading = false
            console.log("err:downloadFile", err)
          })
        }else{                   
            wx.showModal({
              title: '温馨提示',
              content: "请授权访问本地相册",
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                  })
                } else {
                  wx.showToast({
                    title: '必须授权才能下载',
                  })
                }
              },
            })          
        }
      },
    })








  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (preImg) {      
      shareContent['title'] = "精美壁纸免费领取"
      shareContent['imageUrl'] = preImg
    }
    return shareContent;
  }
})