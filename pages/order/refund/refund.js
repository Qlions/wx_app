// pages/order/refund/refund.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [false, false],
    request_refund:{
      accoutName: '',
      userName: '',
      orderId: '',
      remark: ''
    },
    refundMoney: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['request_refund.orderId']: options.orderid || "",
      ['request_refund.remark']: options.remark || "",
      refundMoney: options.refundMoney
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
  

  //选择退款方式
  refund_pay(e){
    let item = e.currentTarget.dataset.item;
    if(item == 0){
      this.setData({
        selected: [true, false],
        ['request_refund.refundSource']: "WxPay",
        ['request_refund.accoutName']: '',
        ['request_refund.userName']: ''
      })
    } else if(item == 1){
      this.setData({
        selected: [false, true],
        ['request_refund.refundSource']: "AliPay"
      })
    }
  },

  //获取支付宝账号
  get_aliUser(e){
    this.setData({
      ['request_refund.accoutName']: e.detail.value
    })
  },

  //获取真实姓名
  get_aliName(e){
    this.setData({
      ['request_refund.userName']: e.detail.value
    })
  },

  //确定退款
  confirm_refund(){
    //console.log(this.data.request_refund)
    if(this.data.request_refund.refundSource == "AliPay" && (this.data.request_refund.userName == "" || this.data.request_refund.accoutName == "")){
      wx.showToast({
        title: "请填写支付宝账号或真实姓名！",
        icon: "none",
        mask: true
      })
      return false;
    }
    if(this.data.request_refund.remark == "" ){
      wx.showToast({
        title: "信息错误！",
        icon: "none",
        mask: true
      })
      return false;
    }
   app.post(this.data.request_refund, 660090).then((res)=>{
     //console.log(res)
     switch (res.data.state) {
       case "suc":
         wx.showToast({
           title: "取消成功！",
           icon: "success",
           mask: true,
           duration: 2000
         })
         //返回订单列表
         wx.navigateBack({
           delta: 1
         })
         break;
       case "err_-1": //订单已取消
         wx.showToast({
           title: "订单已取消!",
           icon: "none",
           mask: true,
           duration: 2000
         })
         //返回订单列表
         wx.navigateBack({
          delta: 1
        })
         break;
       case "err_01": //订单取消三次
         wx.showToast({
           title: "订单取消三次!",
           icon: "none",
           mask: true,
           duration: 2000
         })
         //返回订单列表
         wx.navigateBack({
          delta: 1
        })
         break;
       case "err_09": //操作失败  订单不存在
         wx.showToast({
           title: "订单不存在!",
           icon: "none",
           mask: true,
           duration: 2000
         })
         //返回订单列表
         wx.navigateBack({
          delta: 1
        })
         break;
       default: //系统异常
         wx.showToast({
           title: "系统异常!",
           icon: "none",
           mask: true,
           duration: 2000
         })
         break;
     }

   })
  }
})