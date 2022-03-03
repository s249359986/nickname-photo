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
  _count = 24,
  _isLoading = false,
  isNoData = false,
  _currentTab
const $AV = getApp().globalData.$AV;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {},
    modules: [],
    pages: []
  },
  goDetail(e) {
    console.log("goDetail", e)
    let {
      url
    } = e['target']['dataset']
    let tempUrl = encodeURIComponent(url)
    wx.navigateTo({
      url: '/pages/bizhi/detail/index?url=' + tempUrl
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
      pages: []
    })
    _currentTab = this.getCurrentTab(e.detail.key)['value']
    console.log('onChange', _currentTab)
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $startWuxRefresher()
    wx.showLoading({
      title: '加载中...',
    })
    this.initMockData();
    this.init();
    this.initHead();
  },
  initHead() {
    const query = new $AV.Query('head_album');
    query.equalTo('isShow', 1);
    query.descending('createdAt');
    query.find().then(res => {
      wx.hideLoading();
      console.log('head_album', res)
      let menu = []
      for (let i = 0; i < res.length; i++) {
        if (res[i].get("type") === 5) {

          this.setData({
            swiper: {
              content: res[i].get('content'),
              title: res[i].get('title'),
              paht: res[i].get('path')
            }
          })
        } else {
          menu.push({
            content: res[i].get('content'),
            title: res[i].get('title'),
            paht: res[i].get('path')
          });
        }
      }
      this.setData({
        modules: menu
      })
    })
  },
  handleGo(e) {
    let {
      path
    } = e.target['dataset']
    wx.navigateTo({
      url: path,
    })
  },
  handleLoad(e) {
    console.log("handleLoad", e);
    let {
      index
    } = e.target.dataset;
    let imgs = this.data.pages;
    imgs[index]['isShow'] = false;
    setTimeout(() => {
      this.setData({
        pages: imgs
      })
    }, 300);

  },
  initMockData() {
    let temp = this.data.pages;
    for (let i = 0; i < 22; i++) {
      temp.push({
        isShow: true,
        url: "",
      });
    }
    this.setData({
      pages: temp
    });
  },
  init() {
    _isLoading = true

    const query = new $AV.Query('photo');
    query.equalTo('isShow', 1);
    query.equalTo('type', 1);
    query.descending('createdAt');
    query.limit(_count);
    query.skip(_count * _limit);
    query.find().then((res) => {
      if (_limit === 0) {
        this.setData({
          pages: []
        });
      }
      wx.hideLoading();
      console.log('getPhoto', res)
      let tempData = this.data.pages;
      for (let i = 0; i < res.length; i++) {
        let tempName = res[i].get("thumbnail");
        let tempUrl = `${FILE_URL_PATH}${tempName}`;
        if (tempName.indexOf('http') > -1) {
          tempUrl = tempName;
        }
        if (tempUrl.indexOf('https') > -1) {
          tempUrl = tempUrl.replace('https', 'http');
        }
        tempData.push({
          id: res[i]['id'],
          isShow: true,
          url: tempUrl,
        })
      }
      this.setData({
        pages: tempData
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
  onPulling() { // 下拉刷新，暂时禁用
 
    return ; //临时注释掉，有分页后增加
    console.log('onPulling')
    if (_isLoading) return
    _limit = 0
    this.initMockData();
    this.init()
  },
  onRefresh() {
    $stopWuxLoader('#wux-refresher', this, true)
    $stopWuxRefresher()        
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


// {
//   "selectedIconPath": "/pages/photo/img/hot.png",
//   "iconPath": "/pages/photo/img/hot1.png",
//   "pagePath": "pages/photo/index",
//   "text": "头像"
// },