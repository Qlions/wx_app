// pages/localAdmin/addLocal/addLocal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    addressInfo: "",
    lat: "",
    log: ""
  },
  /**
   * 点击进入选择地址
   */
  choiceLocla() {
    wx.navigateTo({
      url: '../localAdmin/localMap/localMap?type=mail'
    })

  },
  // 获取Input 楼号
  bindAddressInfoInput(e) {
    this.setData({
      addressInfo: e.detail.value
    })
  },
  // 保存按钮
  addLocal() {
    let that = this;
    if (that.data.address == '') {
      wx.showToast({
        title: '地址不能空',
        duration: 2000,
      })
    } else if (that.data.addressInfo == '') {
      wx.showToast({
        title: '门牌号不能为空',
        duration: 2000,
      })
    } else {
      let mailInfo = that.data.address + that.data.addressInfo;
      wx.setStorage({
        key: 'mailInfo',
        data: mailInfo,
        success:function(){
          wx.removeStorage({
            key: 'mailLocation',
          })
          wx.navigateBack({
            delta: 3
          })
        }
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'mailLocation',
      success: function (res) {
        //console.log(res.data)
        let location = res.data.location.split(",");
        that.setData({
          address: res.data.iputValue,
          lat: location[1],
          log: location[0]
        })
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
  // onShareAppMessage: function () {

  // }
})