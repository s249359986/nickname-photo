let app = getApp();  
Page({

  data: {
    avatarUrl:"",
    isLogin:false
  },  
  onLoad(options){    
    // const scene = decodeURIComponent(options.scene)
    // console.log('scene', scene)
    wx.showShareMenu()    

   

    wx.getSetting({
      success: res => {
        console.log('')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          app.globalData.user['isLogin'] = true
          app.globalData.user['info'] = res.userInfo
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                isLogin:true              
              })
              console.log('getUserInfo', res)
            }
          })
        }
      },
      fail: res => {
        console.log('loginFail', res)
      }
    })

  },
  handleCallKf() {
  
    console.log('handleCallKf')
  },
  onGetUserInfo: function (e) {    
    if (e.detail.userInfo) {
      let tempInfo = e.detail.userInfo
      app.globalData.user['isLogin'] = true
      app.globalData.user['info'] = tempInfo
      this.setData({
        isLogin: true,
        avatarUrl: tempInfo.avatarUrl        
      })
      console.log('onGetUserInfo', tempInfo)
    }
  } 
})
