//index.js
const app = getApp()
const $AV = app.globalData.$AV;

Page({
  data: {
    swiper: {
    },
    modules:[   
    ],
  },

  onLoad: function() {
    const query = new $AV.Query('head_album'); 
    query.equalTo('isShow', 1);
    query.descending('createdAt');
    query.find().then(res => {  
      wx.hideLoading();     
      console.log('head_album', res)
      let menu = []
      for(let i=0;i<res.length;i++){
        if(res[i].get("type") === 5){
          
          this.setData({
            swiper: {content:res[i].get('content'),title:res[i].get('title'),paht:res[i].get('path') }
          }) 
        }else{
          menu.push({content:res[i].get('content'),title:res[i].get('title'),paht:res[i].get('path') });
        }       
      }      
      this.setData({
        modules: menu
      })        
    })
  },
  handleGo(e) {
    let {path} = e.target['dataset']
    wx.navigateTo({
      url: path,
    })
  },

})
