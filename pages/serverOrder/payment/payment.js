// pages/serverOrder/payment/payment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderInfo:{
      payMoney: 0.00
    },
    paymentChannel: '',
    //签名结果
    pay_sign: ''
  },
  initData(orderId) {
    let that = this;
    let req = {
      orderId: orderId
    }
    app.post(req, 660088).then((res) => {
      
      that.setData({
        orderInfo: res.data
      }, ()=>{
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      })
    }).catch((e) => {
      //console.log(e)
    })
  },
  //获取code
  get_code(){
    let that = this;
    wx.showLoading({
      title: "支付中...",
      mask: true
    })
    wx.login({
      success(res){
        that.setData({
          code: res.code
        }, that.getPaySign(res.code))
      }
    })
  },
  //获取支付签名    平台与盛付通共用签名 系统标识： 100011
  getPaySign(code){
    let that = this;
    // 判断平台付款或者盛付通付款  签名参数不一样
    let paymentChannel = that.data.paymentChannel;
    if(paymentChannel == 1){
      //盛付通 支付
      var signData = {
        out_trade_no: this.data.orderInfo.orderCode,
        subject: this.data.orderInfo.serviceName,
        total_fee: this.data.orderInfo.totalServiceMoney,
        system_name: 100011,
        call_back_url: `${app.globalData.pay_callback_url}/manageFrame/userServiceOrderPay/userServiceOrderPayCallback.action`,
        extra_common_param: {
          //用户id
          userId: wx.getStorageSync("userInfo").userId,
          payFrom: "69"
        },
        user_code: code
      }
    }else{
      var signData = {
        WIDout_trade_no: this.data.orderInfo.orderCode,
        WIDsubject: this.data.orderInfo.serviceName,
        WIDtotal_fee: this.data.orderInfo.payMoney,
        systemName: 100011,
        callBackUrl: `${app.globalData.pay_callback_url}/manageFrame/userServiceOrderPay/userServiceOrderPayCallback.action`,
        attach: {
          //用户id
          userId: wx.getStorageSync("userInfo").userId,
          payFrom: "68"
        },
        userCode: code
      }
    }
    
    wx.request({
      url: app.globalData.requestPaySign,
      data: {jsonValue: JSON.stringify(signData)},
      header: app.globalData.requestHeader,
      method: "POST",
      success(res){
        if(res.data.state == "suc"){
          //获取签名成功
          that.setData({
            pay_sign: res.data.result
          }, ()=>{
            //paymentChannel : 0：平台；1：盛付通
            if(that.data.paymentChannel == 1 ){
              //盛付通小程序支付
              that.getSFTPayData_wx();
            }else{
              //平台小程序支付
              that.getPaydata_wx();
            }
          })
       }else{
         //获取签名失败
         wx.showToast({
           title: "系统异常",
           icon: "none"
         })
       }
      }
    })
    
  },

  //获取拉起支付控件的参数  平台小程序支付   系统标识： 100011
  getPaydata_wx(){
    //console.log("平台")
    let that = this;
    let payData = {
      WIDout_trade_no: this.data.orderInfo.orderCode,
      WIDsubject: this.data.orderInfo.serviceName,
      WIDtotal_fee: this.data.orderInfo.payMoney,
      systemName: 100011,
      callBackUrl: `${app.globalData.pay_callback_url}/manageFrame/userServiceOrderPay/userServiceOrderPayCallback.action`,
      attach: {
        //用户id
        userId: wx.getStorageSync("userInfo").userId,
        payFrom: "68"
      },
      userCode: this.data.code,
      sign: this.data.pay_sign
    }
    wx.request({
      url: app.globalData.request_wx_pay_url,
      data: {jsonValue: JSON.stringify(payData)},
      header: app.globalData.requestHeader,
      method: "POST",
      success(res){
        if(res.data.state == "suc"){
          that.pay_ment(res.data);
        }
        //console.log(res.data)
      }
    })
  },

  //获取拉起支付控件的参数  盛付通小程序支付   SFT --- 盛付通支付   request_wxSFT_pay_url
  getSFTPayData_wx(){
    //console.log("sft")
    let that = this;
    let SFTpayData = {
      out_trade_no: this.data.orderInfo.orderCode,
      subject: this.data.orderInfo.serviceName,
      total_fee: this.data.orderInfo.totalServiceMoney,
      system_name: 100011,
      call_back_url: `${app.globalData.pay_callback_url}/manageFrame/userServiceOrderPay/userServiceOrderPayCallback.action`,
      extra_common_param: {
        //用户id
        userId: wx.getStorageSync("userInfo").userId,
        payFrom: "69"
      },
      user_code: this.data.code,
      sign:this.data.pay_sign
    }
    wx.request({
      url: app.globalData.request_wxSFT_pay_url,
      data: {jsonValue: JSON.stringify(SFTpayData)},
      header: app.globalData.requestHeader,
      method: "POST",
      success(res){
        //console.log(res.data)
        if(res.data.state == "suc"){
          var result = JSON.parse(res.data.result)
          that.pay_ment(result);
        }
      }
    })
  },

  //拉起支付窗口 
  pay_ment(data){
    let that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.sign || data.paySign,
      success(res){
        //console.log(res)
        if(res.errMsg == "requestPayment:ok"){
          wx.showToast({
            title: "支付成功",
            icon: "success",
            mask: true,
            success (){
              // let payMoney = that.data.orderInfo.payMoney.toFixed(2);
              wx.redirectTo({
                url: `/pages/serverOrder/paySuc/paySuc?money=${Number(that.data.orderInfo.payMoney).toFixed(2)}`
              })
            }
          })
        }
      },
      fail(err){
          wx.showToast({
            title: "支付失败",
            icon: "none",
            mask: true
          })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      orderId: options.orderId,
      paymentChannel: options.paymentChannel
    })
    this.initData(options.orderId);
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
    wx.showLoading({
      title: '加载中',
    })
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