// pages/localAdmin/localAdmin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAll:""
  },
  // 获取地址列表
  addressList () {
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        jsonValue: JSON.stringify({
          "page": 1,
          "rows": 8,
          "addressType": "2",
          "state": ""
        }),
        infoType: 112000,
        token: wx.getStorageSync("userInfo").token
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //console.log(res)
        that.setData({
          addressAll: res.data.addressAll
        })
      }
    })
  },
  // 地址设为默认
  setDefault(id) {
    let deliveryId = id;
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        jsonValue: JSON.stringify({
          "deliveryId": deliveryId,
        }),
        infoType: 112013,
        token: wx.getStorageSync("userInfo").token
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.state == 'suc') {
          that.addressList();
        }
      }
    })
  },
  // 点击地址返回
  retrunGo(options){
    wx.navigateBack({
      delta: 1,
    })
    wx.setStorage({
      key: 'user_local',
      data: options.currentTarget.dataset.local,
    })
  },
  // 设为地址为默认
  setUp (e) {
    let that = this;
    wx.showModal({
      content: '是否将该地址设为默认地址',
      success: function (res) {
        if (res.confirm) {
          that.setDefault(e.currentTarget.dataset.id);
        } else if (res.cancel) {
          
        }
      }
    })
  },
  // 删除地址函数
  deleteFunc (id) {
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        jsonValue: JSON.stringify({
          "deliveryId": id,
        }),
        infoType: 112014,
        token: wx.getStorageSync("userInfo").token
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.state == 'suc') {
          that.addressList();
        }
      }
    })
  },
  // 删除地址事件
  deleteLocal (e) {
    let that = this;
    wx.showModal({
      content: '是否删除该地址',
      success: function (res) {
        if (res.confirm) {
          that.deleteFunc(e.currentTarget.dataset.id);
        } else if (res.cancel) {
          
        }
      }
    })
  },
  // 修改地址
  updateLocal (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../localAdmin/updateLocal/updateLocal?id=' + id + ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.addressList(); // 默认地址列表
    wx.removeStorage({
      key: 'location',
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