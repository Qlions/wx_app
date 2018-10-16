// pages/localAdmin/addLocal/addLocal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    tel:"",
    address:"",
    addressInfo:"",
    lat:"",
    log:""
  },
  /**
   * 点击进入选择地址
   */
  choiceLocla () {
    wx.navigateTo({
      url: '../localMap/localMap'
    })

  },
  // 获取Input 姓名
  bindNameInput (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取Input 手机
  bindTelInput(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 获取Input 楼号
  bindAddressInfoInput(e) {
    this.setData({
      addressInfo: e.detail.value
    })
  },
  // 保存按钮
  addLocal () {
    let that = this;
    if ( that.data.name == '' ) {
      wx.showToast({
        title: '姓名不能空',
        duration: 2000,
      })
    } else if (that.data.tel == '' ){
      wx.showToast({
        title: '手机不能空',
        duration: 2000,
      })
    } else if (that.data.address == '' ){
      wx.showToast({
        title: '地址不能空',
        duration: 2000,
      })
    } else if (that.data.addressInfo == '') {
      wx.showToast({
        title: '门牌号不能为空',
        duration: 2000,
      })
    }else {
      
      wx.request({
        url: app.globalData.requestUrl,
        data: {
          jsonValue: JSON.stringify({
            address: that.data.address,
            addressInfo: that.data.addressInfo,
            addressType: 2,
            area: "11010600",
            city: "11010000",
            email: "1",
            id: "",
            latitude: that.data.lat,
            longitude: that.data.log,
            name: that.data.name,
            phone: that.data.tel,
            province: "11000000",
            state: 0,
            tel: that.data.tel,
            town: "2854"
          }),
          infoType: 112012,
          token: wx.getStorageSync("userInfo").token
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          //console.log(res)
          switch (res.data.state) {
            case "suc":
              wx.showToast({
                title: '保存成功',
                duration: 2000,
                success: function () {
                  wx.redirectTo({
                    url: '../localAdmin'
                  })
                }
              })
              break;

            case "err_delAdd_001":
              wx.showToast({
                title: '地址数量大于10',
                duration: 2000
              })
              break;
          }
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
      key: 'location',
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