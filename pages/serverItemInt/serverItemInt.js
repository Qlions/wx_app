// pages/serverItemInt/serverItemInt.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointList:"",//列表
  },
  // 点击获取时间
  appointTime (e) {
    let state = e.currentTarget.dataset.state;
    let item = e.currentTarget.dataset.date;
    if (state == 0) {//预约上午
      if (item.morningFull == 0) {
        let registerDate = item.registerDate.substring(0, 4) + '-' + item.registerDate.substring(4, 6) + '-' + item.registerDate.substring(6, 8);
        let timeInfo = {
          date: registerDate,
          time:'上午'
        }
        wx.setStorage({
          key: "timestamp",
          data: timeInfo,
          success:function(){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    } else {//预约下午
      if (item.afternoonFull == 0) {
        let registerDate = item.registerDate.substring(0, 4) + '-' + item.registerDate.substring(4, 6) + '-' + item.registerDate.substring(6, 8);
        let timeInfo = {
          date: registerDate,
          time: '下午'
        }
        wx.setStorage({
          key: "timestamp",
          data: timeInfo,
          success: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })  
      }
    }
  },
  // 预约时间列表
  serverTimeList(doctorId,serviceDictId) {
    let that = this;
    let req = {
      doctorId: doctorId, 
      serviceDictId: serviceDictId
    }
    app.post(req, 660136).then((res) => {
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      that.setData({
        appointList: res.data.rows,
      })

    }).catch((e) => {
      //console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serverTimeList(options.dictEaId, options.serviceDictId);//获取列表
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