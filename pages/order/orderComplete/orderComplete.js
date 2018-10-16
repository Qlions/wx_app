// pages/order/orderComplete/orderComplete.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num_star: 0,
    isevaluationShow: true,
    published_data:{
      commentContent: ''
    },
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['published_data.orderId']: options.orderid,
      ['published_data.docUserId']: options.docuserid,
      orderId: options.orderid
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
    this.setData({
      num_star: 0,
      isevaluationShow: true,
    })
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


  //穿透
preventTouchMove(e){},

//评价
order_evaluation(e){
  let num_star = e.currentTarget.dataset.num;
  //console.log(num_star)
  this.setData({
    num_star: num_star
  })
},

//显示评价窗口 
publishedShow(e){   
  this.setData({
    isevaluationShow: !this.data.isevaluationShow,
    ['published_data.commentContent']: '',
    num_star: 0
  })
},

//获取textarea的value
get_commentContent(e){
this.setData({
  ["published_data.commentContent"]: e.detail.value
})
},
//提交评价   660087  
published(){
 let that = this;
 switch (this.data.num_star) {
    case 1:
     that.setData({
      ['published_data.commentScore']: 80
     })
     this.get_requset_published();
     break;
    case 2:
     that.setData({
      ['published_data.commentScore']: 85
     })
     this.get_requset_published();
     break;
    case 3:
      that.setData({
        ['published_data.commentScore']: 90
      })
      this.get_requset_published();
     break;
    case 4:
      that.setData({
        ['published_data.commentScore']: 95
      })
      this.get_requset_published();
      break;
    case 5:
      that.setData({
      ['published_data.commentScore']: 100
      })
      this.get_requset_published();
      break;
   default:
      //console.log(this.data.num_star)
      wx.showToast({
        title: "请选择评分星级",
        icon: "none"
      })
     break;
 }

 
},

//请求接口提交评价
get_requset_published(){
 let that = this;
 //console.log(this.data.published_data)
 app.post(this.data.published_data, 660087).then( (res) =>{

    if(res.data.state == "suc"){
      wx.showToast({
        title: "评论成功！",
        icon: "success"
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: "评论失败！",
        icon: "none"
      })
    }
    that.setData({
      isevaluationShow: !this.data.isevaluationShow
    })
   
 })
}
})