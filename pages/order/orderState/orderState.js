// pages/order/orderState/orderState.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress_order_data: {
      userType: 1
    },
    progress_arr: [{createTime: '2018-01-01T00:00:00'}],
    orderCode: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      ['progress_order_data.orderId']: options.orderid,
      orderCode: options.ordercode
    }, ()=>{
      that.get_progress_order();
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
  
  // },


  // 660089 
  get_progress_order(){
    let that = this;
    app.post(this.data.progress_order_data, 660089).then( (res)=>{
      //console.log(res.data.rows)
      that.setData({
        progress_arr: res.data.rows
      }, ()=>{
        wx.hideLoading()
      })
    })
  }
})