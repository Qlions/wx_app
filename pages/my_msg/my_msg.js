// pages/my_msg/my_msg.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wx_user_message: "",
    wx_login_state: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中
    wx.showLoading({
      title: "加载中...",
      mask: true
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
    
    //提取userInfo
    this.setData({
      wx_login_state: wx.getStorageSync("userInfo").state
    })
    if(wx.getStorageSync("userInfo").state == "err"){
      wx.redirectTo({
        url: '../login/authorization/authorization'
      })
      return false;
    }
    this.setData({
      wx_user_message: wx.getStorageSync("user_message")
    })
    
    wx.hideLoading()
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
  
  // 退出
  wx_showModal(){
    let _this = this;
    wx.showModal({
      title: "确认退出?",
      content: "退出登陆后将无法查看订单，重新登录即可查看",
      showCancel: true,
      confirmColor: "#62b54b",
      success(res){
        //console.log(res)
        if(res.confirm){
          _this.out_login();
        }
      }
    })
  },

  out_login(){
  //   wx.request({
  //    url: app.globalData.requestUrl,
  //    header: app.globalData.requestHeader,
  //    data: {
  //       infoType: 222201,
  //       token: wx.getStorageSync("userInfo").token,
  //       jsonValue: JSON.stringify({ id: wx.getStorageSync("id")})
  //    },
  //    method: "POST",
  //    success(res){
       
  //       if(res.data.state == "suc"){
  //         wx.switchTab({
  //           url: "../serverIndex/serverIndex",
  //         })
  //           wx.setStorage({
  //             key: "userInfo",
  //             data: { state: "err", token: "err"}
  //           })

  //           //console.log(wx.getStorageSync("userInfo"))
  //       }else if(res.state == "err"){

  //       }
  //    }
  //  })       
   let req = {
    id: wx.getStorageSync("userInfo").id
   }  
   app.post(req, 222201).then( (res) => {
     //console.log(res)
    if(res.data.state == "suc"){
      
        wx.setStorage({
          key: "userInfo",
          data: { state: "err", token: "err"}
        })
        wx.removeStorage({
          key: "user_message",
          success(res){
            //console.log(res)
            if(res.errMsg == "removeStorage:ok"){
              wx.switchTab({
                url: "/pages/serverIndex/serverIndex",
              })
            }
          }
        })
        //console.log(wx.getStorageSync("userInfo"))
    }else if(res.data.state == "err"){
      //To do soming
    }
   })
  }


})