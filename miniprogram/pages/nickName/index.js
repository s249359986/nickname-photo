// miniprogram/pages/nickName/index.js
import {
  shareContent
} from '../../config'
const $AV = getApp().globalData.$AV;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [ 
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    const query = new $AV.Query('nickname'); 
    query.equalTo('isShow', 1);
    query.descending('createdAt');
    query.find().then(res => {  
      wx.hideLoading();     
      console.log('nickname', res)
      let menu = []
      for(let i=0;i<res.length;i++){
        menu.push({title:res[i].get("title"),des:res[i].get("des"),items:res[i].get("content")})
      }      
      this.setData({
        menu: menu
      })        
    })
 
  },
  bindGo(e){
    console.log('bindGo',e)
    let {index} = e.target['dataset']
    let {menu} = this.data
    getApp().globalData.nickNames = menu[index]['items']
    wx.navigateTo({
      url: '/pages/nickName/detail/index',    
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据        
      }
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