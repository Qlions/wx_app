// pages/localAdmin/localMap/localMap.js
var amapFile = require("../../../libs/amap-wx.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon: '',
    lat: '',
    location:"", // 经纬度
    iputValue:"",// input值
    markers: [],
    poisDataList:"",//附近地址
    seachrDataList:"", // 搜索地址
    mailType:"", // 判断是否为邮寄地址
  },

  bindKeyInput (e) {
    var that = this;
    var keywords = e.detail.value;
    var myAmapFun = new amapFile.AMapWX({ key: app.globalData.gdmapsdk_key  });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {
        //console.log(data)
        that.setData({
          seachrDataList: data.tips
        })
      }
    })
  },

  getLoclaName (e) {
    if (this.data.mailType == "mail" ){
      let data = {
        iputValue: e.currentTarget.dataset.name,
        location: e.currentTarget.dataset.location,
      }
      wx.setStorage({
        key: "mailLocation",
        data: data,
        success: function () {
          wx.navigateTo({
            url: '../../mailAddress/mailAddress'
          })
        }
      })
    }else {
      let data = {
        iputValue: e.currentTarget.dataset.name,
        location: e.currentTarget.dataset.location,
      }
      wx.setStorage({
        key: "location",
        data: data,
        success: function () {
          wx.navigateTo({
            url: '../addLocal/addLocal'
          })
        }
      })
    } 
  },

  getSeaName (e) {
    if (this.data.mailType == "mail") {
      let data = {
        iputValue: e.currentTarget.dataset.name,
        location: e.currentTarget.dataset.location,
      }
      wx.setStorage({
        key: "mailLocation",
        data: data,
        success: function () {
          wx.navigateTo({
            url: '../../mailAddress/mailAddress'
          })
        }
      })
    } else {
      let data = {
        iputValue: e.currentTarget.dataset.name,
        location: e.currentTarget.dataset.location,
      }
      wx.setStorage({
        key: "location",
        data: data,
        success: function () {
          wx.navigateTo({
            url: '../addLocal/addLocal'
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
    that.setData({
      lon: app.globalData.locationData.lon,
      lat: app.globalData.locationData.lat,
      mailType: options.type,
      markers: [{
        id: 0,
        latitude: app.globalData.locationData.lat,
        longitude: app.globalData.locationData.lon,
        iconPath: '../../../image/mark_b.png',
        width: 19,
        height: 31
      }]
    })
    if (that.data.mailType == "mail"){
      wx.getStorage({
        key: 'mailLocation',
        success: function (res) {
          let local = res.data.location.split(',');
          let myAmapFun = new amapFile.AMapWX({
            key: app.globalData.gdmapsdk_key
          });
          myAmapFun.getPoiAround({
            location: res.data.location,
            success: function (data) {
              //console.log(data)
              that.setData({
                poisDataList: data.poisData
              })
            }
          })
          that.setData({
            iputValue: res.data.iputValue,
            location: res.data.location,
            lon: local[0],
            lat: local[1],
            markers: [{
              id: 0,
              latitude: local[1],
              longitude: local[0],
              iconPath: '../../../image/mark_b.png',
              width: 19,
              height: 31
            }]
          })
        }
      })
    }else {
      wx.getStorage({
        key: 'location',
        success: function (res) {
          let local = res.data.location.split(',');
          let myAmapFun = new amapFile.AMapWX({
            key: app.globalData.gdmapsdk_key
          });
          myAmapFun.getPoiAround({
            location: res.data.location,
            success: function (data) {
              //console.log(data)
              that.setData({
                poisDataList: data.poisData
              })
            }
          })
          that.setData({
            iputValue: res.data.iputValue,
            location: res.data.location,
            lon: local[0],
            lat: local[1],
            markers: [{
              id: 0,
              latitude: local[1],
              longitude: local[0],
              iconPath: '../../../image/mark_b.png',
              width: 19,
              height: 31
            }]
          })
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let myAmapFun = new amapFile.AMapWX({
      key: app.globalData.gdmapsdk_key
    });
    myAmapFun.getPoiAround({
      location: '',
      success: function (data) {
        that.setData({
          poisDataList: data.poisData
        })
      }
    })
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