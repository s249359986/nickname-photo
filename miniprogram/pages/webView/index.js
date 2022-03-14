const $AV = getApp().globalData.$AV;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "发现",
    url:"https://mp.weixin.qq.com/s/aod8WLRj9xmLMDGzWbYaoQ", 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const query = new $AV.Query('head_discover');
    query.equalTo('isShow', 1);
    query.limit(1);
    query.find().then((res)=>{
      console.log("head_discover",res)
      if(res.length > 0){
        const title = res[0].get("title") || "发现";
        const url = res[0].get("url");
        wx.setNavigationBarTitle({
          title
        })
        this.setData({
          title,
          url
        })
      }
    });

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

  }
})