// pages/login/wx_login_phone_num/wx_login_phone_num.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_color: false,
    authorization_msg: {},
    value_length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      authorization_msg: options
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

  // 获取手机号
  get_phone_value(e){
    // this.setData({
    //   input_phone_number: e.detail.value.replace(/\s/g,"")
    // })
  },

  //位数
  value_length(e){
   
    // let value_length_old = this.data.value_length;
    // if(value_length_old < e.detail.value.length){

    //   if(e.detail.value.length == 3 ){
    //     this.setData({
    //       value_length: e.detail.value.length
    //     })
    //     return e.detail.value + "\t"
    //   }else if(e.detail.value.length == 8 ){
    //     this.setData({
    //       value_length: e.detail.value.length
    //     })
    //     return e.detail.value + " "
    //   }
    // }
    // this.setData({
    //   value_length: e.detail.value.length
    // })
    let reg =  /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    
    let nmber_mobile = e.detail.value.replace(/\s/g,"");
    //console.log(e.detail.value.length == 13, reg.test(nmber_mobile), nmber_mobile)
    if(e.detail.value.length == 11 && reg.test(nmber_mobile)){
      this.setData({
        btn_color: true,
        input_phone_number: nmber_mobile
      })
    }else{
      this.setData({
        btn_color: false
      })


    }
  },

  //进入下一页验证
  next_reg(){
    if(!this.data.btn_color){
      wx.showToast({
        title: "请输入正确的手机号！",
        icon: "none"
      })
      return false;
    }
    wx.navigateTo({
      url: `../wx_login_phone_code/wx_login_phone_code?input_phone_number=${this.data.input_phone_number}&id=${this.data.authorization_msg.id}&uid=${this.data.authorization_msg.uid}`
    })
  }
})
