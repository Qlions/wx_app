// pages/serverMarriage/serverMarriage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      {
        info: '未婚',
        value: '1'
      },
      {
        info: '已婚',
        value: '2'
      },
      {
        info: '丧偶',
        value: '3'
      },
      {
        info: '离婚',
        value: '4'
      },
      {
        info: '其他',
        value: '5'
      }
    ]
  },
  // 点击储存内容
  selectInfo(e) {
    let item = e.currentTarget.dataset.item;
    wx.setStorage({
      key: 'marrInfo',
      data: item,
      success:function(){
        wx.navigateBack({
          delta:1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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