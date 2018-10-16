// 手机验证码
var app = getApp();
Page({
     /**
   * 页面的初始数据
   */
  data: {
    input_phone_number: '',
    id: '',
    uid: '',
    input_phone_regcode: '',
    phone_number_hide_four: "",
    btn_color: false,
    timeText: "获取验证码",
    currentTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(getCurrentPages())
    this.setData({
      input_phone_number: options.input_phone_number,
      phone_number_hide_four: `${options.input_phone_number.substr(0,3)}****${options.input_phone_number.substr(7,11)}`,
      id: options.id,
      uid: options.uid
    }, ()=>{
      //获取验证码
      wx.setStorage({
        key: "id",
        data: options.id
      })
      this.get_phone_reg_code()
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

  // 获取验证码 222202
  get_phone_reg_code(){
    
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      header: app.globalData.requestHeader,
      method: "POST",
      data: {
          infoType: 222202,
          token: "123",
          jsonValue: JSON.stringify({mobile: that.data.input_phone_number,msgType:10})
      },
      success(res){
        //console.log(res)
        if(res.data.state == "suc"){
          // 倒计时
          var setInterval_time = setInterval( ()=>{
            that.count_down(setInterval_time);
          }, 1000 )
          
         
          //发送成功
          wx.showToast({
            title: "已发送短信",
            icon: "success",
          })

          setTimeout( () =>{
            wx.hideToast()
          }, 2000)
        }else{
           //发送失败
           wx.showToast({
            title: "发送失败",
            icon: "fail",
          })

          setTimeout( () =>{
            wx.hideToast()
          }, 2000)
        }
      }
    })
  },

  // 通过手机号码及验证码注册并登录接口（同时绑定小程序登录用户）  login_phone_number_url
  login_number_suc(e){
    //加载中
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let that = this;
    wx.request({
      url: app.globalData.login_phone_number_url,
      header: app.globalData.requestHeader,
      method: "POST",
      data: {
        id: that.data.id,
        uid: that.data.uid,
        mobile: that.data.input_phone_number,
        mobileCode: that.data.input_phone_regcode,
        userType: 1
      },
      success(res){
        wx.hideLoading()
        if(res.data.state == "suc"){
          wx.setStorage({
            key: "userInfo",
            data: res.data
          })
          that.get_user_msg(res.data)
         
          //登录成功
          wx.showToast({
            title: "登录成功",
            icon: "success",
          })

          setTimeout( () =>{
            wx.hideToast()
          }, 2000)
         
        }else if(res.data.state == "err_login_mobilecode_err"){
          //登录失败
          wx.showToast({
            title: "登录失败"
          })

          setTimeout( () =>{
            wx.hideToast()
          }, 2000)
        }else{
          //系统异常
          wx.showToast({
            title: "系统异常"
          })

          setTimeout( () =>{
            wx.hideToast()
          }, 2000)
        }
      }
    })
  },
  // 获取个人信息
  get_user_msg(userInfo){
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      header: app.globalData.requestHeader,
      method: "POST",
      data: {
        infoType: 600039,
        token: userInfo.token,
        jsonValue:JSON.stringify({
          userName: userInfo.userName
        })
      },
      success (res){
        //console.log(JSON.parse(res.data.state))
        wx.setStorage({
          key: "user_message",
          data: JSON.parse(res.data.state)[0],
          success(){
            wx.hideLoading()
            wx.switchTab({
              url: "/pages/serverIndex/serverIndex"
            })
          }
        })
      }
    })
  },
 // 获取填写手机验证码
 get_phone_value(e){
  // this.setData({
  //   input_phone_regcode: e.detail.value 
  // })
},

//位数
reginput_length(e){

  if(e.detail.value.length >= 4){
    this.setData({
      btn_color: true,
      input_phone_regcode: e.detail.value 
    })
  }else{
    this.setData({
      btn_color: false
    })
  }
},

// 倒计时
  count_down(setInterval_time){
    //console.log("time")
    let timeText = --this.data.currentTime;
    this.setData({
      timeText: timeText + "秒"
    })
    if(timeText <= 0){
      this.setData({
        timeText: "重新发送"
      })
      clearInterval(setInterval_time)
    }
    
  },

  //重新发送
  again_code(){
    if(this.data.timeText == "获取验证码" || this.data.timeText == "重新发送"){
      this.setData({
        currentTime: 60
      })
      this.get_phone_reg_code();
    }
  }
  
})