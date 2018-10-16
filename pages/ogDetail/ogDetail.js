// pages/serverNotice/serverNotice.js
var  app = getApp();
Page({
	tapName: function(event) {
		//console.log(1);
     var that = this;
    that.setData({
      showView: (!that.data.showView),
      select: !that.data.select,
    })
 },

  /**
   * 页面的初始数据
   */
  data: {
  	showView:false,
  	serviveData:'',
  	 serverListAll:[],
  	 serverItemMsg: {
      
    },
  	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  		 showView: (options.showView == "true" ? true : false);
    
//  if( wx.getStorageSync("userInfo") == ""){
//    wx.redirectTo({
//      url: '../login/authorization/authorization'
//    })
//    return false;
//  }
    this.setData({
      serviveData: options,
      ['tempServicePerson.playType']: options.type
    })
    this.matchingServiceDoc();
  
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
  // onShareAppMessage: function () {
  
  // },
    matchingServiceDoc(){
    let that = this;
    wx.request({
      url:app.globalData.requestUrl,
      header:app.globalData.requestHeader,
      method:"POST",
      data:{
          token: wx.getStorageSync("userInfo").token,
          infoType:111176,
          jsonValue: JSON.stringify({
            eaId: 0,
            page: 1,
            rows: 30
          })
      },
      success(res){
          //console.log(res.data)
          that.setData({
          	serverItemMsg: res.data,
//        	serverListAll: res.data,
          })
      }
    })
  },
  
})