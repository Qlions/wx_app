// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_bar_text: [
      {
        text: "全部"
      },
      {
        text: "待付款"
      },
      {
        text: "已付款"
      },
      {
        text: "已完成"
      },
      {
        text: "已取消"
      }
    ],
    cancel_item_data: [true, true, true,true,true,true],
    currentTarget: 0,
    orderList: [],
    rows: 8,
    isHideLoadMore: false,
    timeDown: 60*30,
    _timeDown: [],
    orderState: "",
    isHide: true,
    isSelected: true,
    request_data:{},
    order_service_eaid: "",
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
     //加载中
     wx.showLoading({
      title: "加载中...",
      mask: true
    })
    this.setData({
      wx_login_state: wx.getStorageSync("userInfo").state,
    }) 
    if(wx.getStorageSync("userInfo").state == "err"){
      wx.redirectTo({
        url: '../../login/authorization/authorization'
      })
      return false;
    }
    this.get_order_list(this.data.orderState, this.data.rows)
    wx.hideLoading();
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

  //订单分类点击
  class_bar_change(e){
    //console.log(e)
    let currentTarget = e.currentTarget.dataset.index;
    this.setData({
      currentTarget: currentTarget,
      orderList: []
    })
    switch (currentTarget) {
      case 0:
        this.get_order_list("",8);
        this.setData({
          orderState: ""
        })
        break;
      case 1:
        this.get_order_list(0,8);
        this.setData({
          orderState: 0
        })
        break;
      case 2:
        this.get_order_list(1,8)
        this.setData({
          orderState: 8
        })
        break;
      case 3:
        this.get_order_list(2,8)
        this.setData({
          orderState: 2
        })
        break;
      default:
        this.get_order_list(6,8)
        this.setData({
          orderState: 6
        })
        break;
    }
    

  },

  /*
    订单列表 660086 
    serviceComponent:// 组件服务，图文F001，电话F003，视频F004
    orderState;// 0待付款1待抢单 2已完成 3待接单 4待服务 6已取消 7挂单 8处理中
    userType 1
  */
  get_order_list(state, rows){
    this.setData({
      isHideLoadMore: false
    })
    let that = this;
    let data = {
      userType: 1,
      orderState: state,
      page: 1,
      rows: rows
    }
    app.post(data, 660086).
    then( (res)=>{
      // //console.log(res)
      // clearInterval(that.set_count)
      // let res_data = res.data.rows;
      // let len = res.data.rows.length;
      // for (var i = 0; i < len; i++) {
        
      //   if(res_data[i].orderState == 0){
      //     that.setData({
      //       ["timeDown["+ i +"]"]: res_data[i].remainderTime
      //     })
      //     let index = i;
      //     that.set_count = setInterval(()=>{
      //       that.cont_down(that.set_count, index)
      //     }, 1000)
      //   }
        
      // }
      that.setData({
        orderList: res.data.rows
      }, ()=>{

        //返回数据 正在加载消失
        that.setData({
          isHideLoadMore: true
        })
      })
      
      let arrTime = res.data.rows.map(function (item,index) {
        clearInterval(that['set_count'+index])
          if(item.orderState == 0){
            that.setData({
              ["timeDown["+ index +"]"]: item.remainderTime
            })
            that['set_count'+index] = setInterval(()=>{
              that.cont_down(that.set_count, index)
            }, 1000)
          }
      })
      
      wx.hideLoading();
      
    }, (err)=>{
      //console.log(err)
    })
  },
  onPullDownRefresh(){
    let that = this;
    that.setData({
      isHideLoadMore: false
    })
    //init list
    this.get_order_list(this.data.orderState, this.data.rows);
    
    wx.showNavigationBarLoading() ;
    setTimeout(function () {
        // complete
        that.setData({
          isHideLoadMore: true
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
},
onReachBottom () {
    this.setData({
        isHideLoadMore: false,
        rows: this.data.rows+8
    });
    this.get_order_list(this.data.orderState, this.data.rows);
    let that = this;
    setTimeout(() => {
        that.setData({
            isHideLoadMore: true,
        })
        
    }, 1000)
},
cont_down( fn, index){
  
  let num = this.data.timeDown[index];
  -- num;
  let m = parseInt(num/60);
  let s = parseInt(num)%60;
  
  let _timeDownArr = '_timeDown['+index +']';
  if(m < 1 && s <= 59){
    this.setData({
      ["timeDown["+ index +"]"]: num,
      [_timeDownArr]: `<1分钟`
    })
    if(m < 1 && s < 0){
      this.setData({
        [_timeDownArr]: ``
      })
      this.get_order_list(this.data.orderState,this.data.rows )
      clearInterval(fn)
    }
    return false;
  }
  this.setData({
    ["timeDown["+ index +"]"]: num,
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
            duration: 4000,
            success(){
              that.get_order_list(that.data.state, that.data.rows)
            }
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
        break;
      case "err_-1": //订单已取消
        wx.showToast({
          title: "订单已取消!",
          icon: "none",
          mask: true,
          duration: 2000
        })
        break;
      case "err_01": //订单取消三次
        wx.showToast({
          title: "订单取消三次!",
          icon: "none",
          mask: true,
          duration: 2000
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
    that.get_order_list(that.data.orderState, that.data.rows);
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
      that.get_order_list(that.data.orderState, that.data.rows)
   })
 },

 //再次购买<navigator url="/pages/serverItem/serverItem?serviceId={{item.serviceId}}?docId={{item.docId}}" >
 go_service_item(e){
    console.log(e)
    let serviceuserid = e.currentTarget.dataset.serviceuserid;
    let serviceDictId = e.currentTarget.dataset.servicedictid;
    let serviceDicIden = '1'; // 判断再次购买
    wx.navigateTo({
      url: `/pages/serverItem/serverItem?serviceUserId=${serviceuserid}&serviceDictId=${serviceDictId}&serviceDicIden=${serviceDicIden}`
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