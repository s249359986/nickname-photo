// miniprogram/pages/nickName/detail/index.js
import utill  from '../../../utils/util'

import {
  shareContent
} from '../../../config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
    //   {
    //   name:"aaa1"
    // },{
    //   name:"aaa"
    // }
  ]

  },
  copy:function(e){
    console.log("aa",e)
    let {text} = e.target['dataset']
    wx.setClipboardData({
      data: text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '内容已经复制',
              icon:'none',
            })
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    console.log("utill",utill)
    let tempNames = getApp().globalData.nickNames
    let tempArray = []
    for(let i =0;i<tempNames.length;i++){
      tempArray.push({name:tempNames[i],color:utill.getRandomColor()})
    }
    
    this.setData({
      items:tempArray
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
  return shareContent
  }
})