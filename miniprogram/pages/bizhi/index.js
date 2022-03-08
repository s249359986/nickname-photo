import {
  getPhoto
} from '../../utils/db'
let tool = require('../../utils/util')
import {
  shareContent,
  FILE_URL_PATH
} from '../../config'
import {
  $startWuxRefresher,
  $stopWuxRefresher,
  $stopWuxLoader
} from '../../libs/wux/index'
let _limit = 0,
  _count = 8,
  _isLoading = false,
  isNoData = false,
  _currentTab
const $AV = getApp().globalData.$AV;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: [],
    leftPages:[],
    rightPages: [],
  },
  goDetail(e) {
    console.log("goDetail", e)
    let {
      url,adtype
    } = e['target']['dataset']
    let tempUrl = encodeURIComponent(url)
    wx.navigateTo({
      url: `/pages/bizhi/detail/index?url=${tempUrl}&adType=${adtype}`
    })
  },
  onPageScroll(e) {    
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
  },
  getCurrentTab(key) {
    let tempData = this.data.tabs
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i]['key'] == key) {
        return tempData[i]
      }
    }
  },
  onChange(e) {
    console.log('onChange', e)
    if (this.data.current == e.detail.key) return
    if (_isLoading) return
    this.setData({
      current: e.detail.key,
    })
    _limit = 0
    this.setData({
      pages: [],
      leftPages:[],
      rightPages:[],
    })
    _currentTab = this.getCurrentTab(e.detail.key)['value']
    console.log('onChange', _currentTab)
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._options = options;
    $startWuxRefresher()
    wx.showLoading({
      title: '加载中...',
    })
    this.initMockData();
    this.init();    
  },
  handleLeftLoad(e){
    console.log("handleLoad",e);
    let {index} = e.target.dataset;
    let imgs = this.data.leftPages;
    imgs[index]['isShow'] = false;
    setTimeout(()=>{
      this.setData({
        leftPages:imgs
      })
    },300);
  },
  handleRightLoad(e){
    console.log("handleLoad",e);
    let {index} = e.target.dataset;
    let imgs = this.data.rightPages;
    imgs[index]['isShow'] = false;
    setTimeout(()=>{
      this.setData({
        rightPages:imgs
      })
    },300);
  },
  handleLoad(e) {
   
  },
  initMockData(){
    let leftTemp = this.data.leftPages;
    let rightTemp = this.data.rightPages;
    for(let i=0;i<11;i++){
      leftTemp.push({
        isShow: true,
          url: "",
      });
      rightTemp.push({
        isShow: true,
          url: "",
      });
    }
    this.setData({
      leftPages: leftTemp,
      rightPages:rightTemp,
    });
  },
  init() {
    console.log("init",this._options)
    _isLoading = true    
    const query = new $AV.Query('photo');
    query.equalTo('isShow', 1);
    query.equalTo('type', 2);
    if(this._options && this._options['type']){
      query.equalTo('tags', this._options['type']);
    }    
    query.descending('createdAt');
    query.limit(_count);
    query.skip(_count*_limit);
    query.find().then((res) => {
      if(_limit===0){
        this.setData({
          leftPages:[],
          rightPages:[],
        });
      }
      wx.hideLoading();
      console.log('getPhoto', res)
      let tempLeftData = this.data.leftPages;
      let tempRightData = this.data.rightPages;
      for (let i = 0; i < res.length; i++) {
        let tempUrl = res[i].get("thumbnail");  
        let originUrl = res[i].get("originUrl");  
        let des = res[i].get("des");  
        let adType = res[i].get("adType") || 0;  
        if(i%2 === 0){
          tempLeftData.push({
            id:res[i]['id'],
            isShow: true,
            url: tempUrl,
            originUrl,
            des,
            adType,
          })
        }else{
          tempRightData.push({
            id:res[i]['id'],
            isShow: true,
            url: tempUrl,
            originUrl,
            des,
            adType,
          })
        }    
        
      }
      this.setData({
        leftPages: tempLeftData,
        rightPages:tempRightData,
      })      
      if (res.length < _count) {
        $stopWuxLoader('#wux-refresher', this, true)
        $stopWuxRefresher()
      } else {
        $stopWuxLoader()
        $stopWuxRefresher()
      }
      _isLoading = false
    })
  },
  onPulling() {
   // return //临时注释掉，有分页后增加
    console.log('onPulling')
    if (_isLoading) return
    _limit = 0
    this.initMockData();
    this.init()
  },
  onRefresh() {
    $stopWuxLoader('#wux-refresher', this, true)
    $stopWuxRefresher()

    // return // 临时去掉加载更多

    if (_isLoading) return
    console.log('onRefresh')
  },
  onLoadmore() {
    // return // 临时去掉加载更多
    if (_isLoading) return
    console.log('onLoadmore')
    _limit += 1
    this.init()
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