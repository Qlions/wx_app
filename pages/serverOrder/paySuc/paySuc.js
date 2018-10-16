// pages/paySuc/paySuc.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneys:""
  },
  // 查看订单
  checkOrders(){
    //console.log(1)
    wx.reLaunch({
      url: '../../order/orderList/orderList',
    })
  },
  // 返回首页
  goBackHome(){
    wx.reLaunch({
      url: '../../serverIndex/serverIndex'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      moneys: options.money
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
  // onShareAppMessage: function () {
  
  // }
})