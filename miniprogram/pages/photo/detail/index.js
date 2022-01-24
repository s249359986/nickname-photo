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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload',options)
    let tempUrl = decodeURIComponent(options['url'])
    preImg = tempUrl
    this.setData({
      url: tempUrl
    })

  },
  previewImage:function (){
    wx.previewImage({ urls: [preImg]})
  },
  goHome:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  download:function(){
    if (loading) {return}
    loading = true
    wx.showLoading({
      title: '保存中...',
    })
    let tempHttps = preImg.replace('http','https');
    downloadFile({
      url: tempHttps
    }).then(res=>{
      console.log("downloadFile",res)
      saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
      }).then(res=>{
        wx.showToast({
          title: '保存成功',
        })
        loading = false
        console.log("saveImageToPhotosAlbum",res)
      }).catch(err=>{
        wx.showToast({
          title: '保存失败',
        })
        loading = false
        console.log("err:saveImageToPhotosAlbum", err)
      })
    }).catch(err=>{
      wx.showToast({
        title: '保存失败',
      })
      loading = false
      console.log("err:downloadFile",err)
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
    if(preImg){
      shareContent['imageUrl'] = preImg
    }    
    return shareContent;
  }
})