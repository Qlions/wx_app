// pages/serverItem/serverItem.js
var WxParse = require("../../wxParse/wxParse.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgList: ['../../image/serve_no_img.png'],
      webViewSrc: app.globalData.requestUrl,
      serverItemMsg:{},
      serverMoneys:'',
      playType:"",
      serverMoneys:'',
      serverMoneys:'',
      bind_num: 0,
      tap_sevice_conent_title: "",
      serviceUserId:"",
      serviceDicIden:"", //再次购买标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.initServerMsg(options.serviceDictId);
    this.setData({
      serviceUserId: options.serviceUserId || "",
      serviceDicIden: options.serviceDicIden,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 清除本地上传图片缓存内容
    wx.removeStorage({
      key: 'upload'
    })
    // 清除本地预约时间
    wx.removeStorage({
      key: 'timestamp'
    })
    // 清除邮寄地址
    wx.removeStorage({
      key: 'mailInfo'
    })
    // 清除邮寄地址
    wx.removeStorage({
      key: 'marrInfo'
    })
    // 清除结算信息
    wx.removeStorage({
      key: 'serverInfo'
    })
    // 清除专家预约信息
    wx.removeStorage({
      key: 'depart'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    //console.log(pages)
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
  onShareAppMessage: function () {
    return {
      title: this.data.serverItemMsg.serviceDictName,
      path: `/pages/serverItem/serverItem?serviceDictId=${this.data.serverItemMsg.serviceDictId}&type=${this.data.serverItemMsg.serviceDictReservation}`,
      success(res){
        //console.log(res)
      }
    }
  },
  //图片点击预览
  imgLook(e){
    var that = this;
    var src = e.currentTarget.dataset.src;
    var imgList = e.currentTarget.dataset.list;
    wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: that.data.imgList // 需要预览的图片http链接列表
      })
  },
  //初始化信息
  initServerMsg(serviceDictId){
      wx.showLoading({
        title: "加载中...",
        icon: "loading"
      })
      let that = this;
      wx.request({
          url: app.globalData.requestUrl,
          method: "POST",
          header: app.globalData.requestHeader,
          data:{
              jsonValue: JSON.stringify({serviceDictId:serviceDictId}),
              infoType: 111181,
              token: wx.getStorageSync("userInfo").token || ""
          },
          success(res){
            //console.log(res.data)
            that.setData({
                serverItemMsg: res.data[0],
                imgList: res.data[0].imgUrl.split(",")
            })
            that.serverMon(res.data[0]);
            that.service_conent(serviceDictId)
            wx.hideLoading()
          }
      })
  },
  /**
 *价格
 */
  serverMon(serverMsg) {
      if (serverMsg.serviceMoneyMin == serverMsg.serviceMoneyMax) {
          if (serverMsg.isHaveItems == "1") {
                this.setData({
                    serverMoneys: `￥${serverMsg.serviceDictMoney.toFixed(2)}`
                })
                console.log("aaa")
              } else {
                this.setData({
                    serverMoneys: `￥${serverMsg.serviceDictMoney.toFixed(2)}`
                })
              }
          } else {
            this.setData({
                serverMoneys: `￥${Number(serverMsg.serviceMoneyMin).toFixed(2)}+`
            })
          
          }

      
      

  },
//   服务详情描述获取
  service_conent(serviceDictId){
    let that = this;
    wx.request({
        url: app.globalData.requestUrl,
        method: "POST",
        header: app.globalData.requestHeader,
        data:{
            jsonValue: JSON.stringify({serviceDictId:serviceDictId,wechat: 1}),
            infoType: 111181,
            token: wx.getStorageSync("userInfo").token || ""
        },
        success(res){
          //console.log(res.data)
          that.setData({
              tap_sevice_conent_title: res.data[0].infoContent
          })

          
          for(let i = 0; i < res.data[0].infoContent.length; i ++){
            WxParse.wxParse('reply' + i, 'html', res.data[0].infoContent[i].serviceDictInfoContent, that);
            if (i === res.data[0].infoContent.length - 1) {
                WxParse.wxParseTemArray("replyTemArray",'reply', res.data[0].infoContent.length, that)
              }
          }
        }
    })
},

//服务详情切换
bind_tab(e){
    //console.log(e)
    this.setData({
        bind_num: e.currentTarget.dataset.num
    })   
}
})