// pages/orderMsg/orderMsg.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderMsg: {
      proTitle:'',
      createTime: "2018-01-01T00:00:00",
      hospitalStr: "a:a",
      payMoney: 0
    },
    orderState: "",
    isHide: true,
    isSelected: true,
    request_data:{},
    order_service_eaid: "",
    isHideLoadMore: false,
    timeDown: 60*30,
    _timeDown: [],
    orderid: '',
    request_data:{},
    order_service_eaid: "",
    num_star: 0,
    isevaluationShow: true,
    published_data:{
      commentContent: ''
    },
    cancel_item_data: [true, true, true,true,true,true]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderId
    })
    this.get_order_msg(options.orderId)
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
      isSelected: true,
      isHide: true,
      cancel_item_data: [true, true, true,true,true,true],
      num_star: 0,
      isevaluationShow: true,
      published_data:{
        commentContent: ''
      },

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
  //获取订单信息
  get_order_msg(orderId){
    let that = this;
    let data = {
      orderId: orderId
    }
    app.post(data, 660088).
    then( (res) =>{
      //console.log(res)
      that.setData({
        orderMsg: res.data
      }, ()=>{
        wx.hideLoading();
      })

      if(res.data.orderState == 0){
        //console.log(res.data.orderState)
        that.setData({
          ["timeDown"]: res.data.remainderTime
        })
        clearInterval(that.set_count)
        that.set_count = setInterval(()=>{
          that.cont_down(that.set_count)
        }, 1000)
        
      }
    })
  },
  cont_down( fn, index){
    
    let num = this.data.timeDown;
    -- num;
    let m = parseInt(num/60);
    let s = num%60;
    
    let _timeDownArr = '_timeDown';
    if(m < 1 && s <= 59){
      this.setData({
        ["timeDown"]: num,
        [_timeDownArr]: `<1分钟`
      })
      if(m < 1 && s < 0){
        this.setData({
          [_timeDownArr]: ``
        })
        this.get_order_msg(this.data.orderid )
        clearInterval(fn)
      }
      return false;
    }
    
    this.setData({
      ["timeDown"]: num,
      [_timeDownArr]: `${m}分钟${s}秒`
    })
    
  },


  //删除订单 660091 orderId   delState   1
del_order(e){
  let that = this;
  wx.showModal({
    title: "",
    content: "您确定要删除该服务订单吗？",
    showCancel: true,
    cancelText: "考虑一下",
    cancelColor: "#ff5454",
    confirmColor: "#666",
    success: function(res) {
      if(res.confirm){
        let data = {
          orderId: e.currentTarget.dataset.orderid,
          delState: 1
        }
        wx.hideLoading();
       app.post(data, 660091).then((res)=> {
        //console.log(res)
        if(res.data.state == "suc"){
          wx.showToast({
            title: "删除成功",
            icon: "success",
            mask: true,
            duration: 4000
          })
          wx.navigateBack({
            detail: 1
          })
          
        }else{
          wx.showToast({
            title: "删除失败",
            icon: "fail",
            mask: true
          })
        }

        setTimeout(()=>{
          wx.hideLoading()
        }, 2000)
         
       })
      }
      
    }
  })

},

cancel_order(e){
  let that = this;
  let reservationMode = e.currentTarget.dataset.reservationmode;
  let serviceReservation = e.currentTarget.dataset.servicereservation;
  if(serviceReservation || reservationMode != 1 ){
    this.setData({
      isSelected: false,
      ["request_data.orderId"]: e.currentTarget.dataset.orderid,
      order_service_eaid: e.currentTarget.dataset.eaid
    })

    return false;
  }
  this.setData({
    ["request_data.orderId"]: e.currentTarget.dataset.orderid,
    order_service_eaid: e.currentTarget.dataset.eaid
  },  this.close_why())

 
},


//不能超过三次的确定按钮
OK(){
  this.setData({
    //int 选择
    cancel_item_data: [true,true,true,true,true, true],
    isHide: !this.data.isHide,
    input: "",
    isSelected: true
    
  })
},
//穿透
preventTouchMove(e){},

//取消订单选项
cancel_item(e){
  let idx = e.currentTarget.dataset.idx;
  if(idx == this.data.index) return false;
  for(let i = 0; i < this.data.cancel_item_data.length; i ++){
    if(idx != 5) this.setData({ input: '', ['request_data.remark']: e.currentTarget.dataset.text});
    if(i == idx){
      this.setData({
        ["cancel_item_data[" + idx + "]"]: !this.data.cancel_item_data[idx],
        index: idx
      })
      
    }else{
      this.setData({
        ["cancel_item_data[" + i + "]"]: true
      })
    }
  }
},

// 关闭原因
close_why(){
  if(!this.data.isSelected){
     this.setData({
      isSelected: true
     }) 
     return false;
  }
  this.setData({
    //int 选择
    cancel_item_data: [true,true,true,true,true, true],
    isHide: !this.data.isHide,
    input: "",
    
  })
},

//get input value
 get_input_value(e){
   this.setData({
     ["request_data.remark"]: e.detail.value
   })

 },

 //提交取消  660090
 respectively_order(){
   let that = this;
   if(this.data.request_data.remark == ""){
     wx.showToast({
       title: "请填写取消原因！",
       icon: "none",
       mask: true
     })
     return false;
   }
  app.post(this.data.request_data, 660090).then((res)=>{
    //console.log(res)
    switch (res.data.state) {
      case "suc":
        wx.showToast({
          title: "取消成功！",
          icon: "success",
          mask: true,
          duration: 2000
        })
        wx.navigateBack({
          detail: 1
        })
        break;
      case "err_-1": //订单已取消
        wx.showToast({
          title: "订单已取消!",
          icon: "none",
          mask: true,
          duration: 2000
        })
        wx.navigateBack({
          detail: 1
        })
        break;
      case "err_01": //订单取消三次
        wx.showToast({
          title: "订单取消三次!",
          icon: "none",
          mask: true,
          duration: 2000
        })
        wx.navigateBack({
          detail: 1
        })
        break;
      case "err_09": //操作失败  订单不存在
        wx.showToast({
          title: "订单不存在!",
          icon: "none",
          mask: true,
          duration: 2000
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
    that.close_why();
  })
 },

 // 660120 orderId   refundType 1,全额   
 commit_cancel(orderId){
  let that = this;
  let data = {
     orderId: this.data.request_data.orderId
  }
  //console.log(this.data)
   app.post(data, 660120).then( (res) => {
     //console.log(res)
     if(res.data.refundType != 1 && res.data.paymentChannel != 0){
       // 部分退
       wx.navigateTo({
         url: `/pages/order/refund/refund?orderid=${this.data.request_data.orderId}&remark=${that.data.request_data.remark}&refundMoney=${res.data.refundMoney}`
       })
     }else{
       //全款
       that.respectively_order()
     }
   })
  
},


 //确认完成   660092
 orderFinish(e){
  let data = {
    orderId: e.currentTarget.dataset.orderid
  }
  app.post(data, 660092).then( (res)=>{
   //console.log(res)
   if(res.data.state == "suc"){
     wx.navigateTo({
       url: `/pages/order/orderComplete/orderComplete?orderid=${e.currentTarget.dataset.orderid}&docuserid=${e.currentTarget.dataset.docuserid}`
     })
   }
  })
},

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
     published_data:{
       commentContent: '',
       orderId: e.currentTarget.dataset.orderid,
       docUserId: e.currentTarget.dataset.docuserid || ''
     },
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
     }else{
       wx.showToast({
         title: "评论失败！",
         icon: "none"
       })
     }
     that.setData({
       isevaluationShow: !this.data.isevaluationShow
     })
     that.get_order_msg(this.data.published_data.orderId)
  })
},

//再次购买<navigator url="/pages/serverItem/serverItem?serviceId={{item.serviceId}}?docId={{item.docId}}" >
go_service_item(e){
  let serviceId = e.currentTarget.dataset.serviceid;
  let serviceDictId = e.currentTarget.dataset.servicedictid;
  wx.navigateTo({
    url: `/pages/serverItem/serverItem?serviceId=${serviceId}&serviceDictId=${serviceDictId}`
  })

},

 //支付
 pay_ment_order(e){
  //console.log(e.currentTarget.dataset)
  wx.navigateTo({
    url: `/pages/serverOrder/payment/payment?orderId=${e.currentTarget.dataset.orderid}&paymentChannel=${e.currentTarget.dataset.paymentchannel}`,
  })
 }
})

