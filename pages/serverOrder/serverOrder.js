// pages/serverOrder/serverOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"", //用户ID
    eaId: "",//用户eaIdID
    userCode: "",//用户userCodeID
    serviceDictId: "", //服务字段ID,
    types:"", //判断是否为购买预约
    setverCofimLocal:"",
    serviveData:"", // 服务人员信息
    serverPersonData:"",//服务医生信息
    name: "",//姓名
    phone: "",//手机
    text: "", //备注
    moneys: "", //价格
    basicsMoneys:"", //基础价格
    date: "",//预约日期,
    time:"",//预约时间,
    idCard:"",//身份证号码
    address:"", //地址
    addressInfo:"", //楼ao
    payType: "",//判断支付方式 0 为在线支付 2为线下支付
    payTypes: false,
    department:"",
    proTitle:"",
    mailInfo: "",// 邮寄地址
    timeInfo: "",//预约上下午时间
    marryInfo: "",//婚姻状况
    marryIndex: "",//婚姻状况ID
    serviceItemIds:"",//服务项目ID
    depart:"",// 预约专家信息
    arrItme: [],// 储存多服务项目
    payArray:["在线支付","线下支付"],
    imgFiles:"",//储存上传图片,
    payMethod:"在线支付", // 价格文本
  },
  // 获取明天
  getDateStr() {
    var dd = new Date();
    dd.setDate(dd.getDate() + 1);//获取AddDayCount天后的日期
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return '您今日累计取消预约类服务已达上限（3次），您可于' + m + "月" + d + '日继续购买此类服务或选择非预约类服务购买';
  },
  // 提交订单
  submitOrder(){
    let that = this;
    let orderData = {}, payType;
    if (that.data.payType == '1') {
      payType = '0'
    } else {
      payType = '2'
    }
    if (that.data.type == 0){
      orderData = {
        userId: that.data.userId,
        source:"2",
        payType: payType,
        customerMaritalState: that.data.marryIndex,
        customerCartNo:  that.data.idCard,
        serviceDictId: that.data.serviceDictId,
        serviceId: that.data.serverPersonData.serviceId,
        content: that.data.text,
        customerName: that.data.name,
        customerMobile: that.data.phone,
        serviceItemIds: that.data.serviceItemIds
      }
      if (that.data.serviveData.serviceDictWay == '上门服务') {
        orderData.customerAddress = that.data.address + that.data.addressInfo;
      }
    }else {
      // 处理日期
      let str = that.data.date;
      let test = new RegExp(/-/g);
      let newstr = str.replace(test, "");
      orderData = {
        userId: that.data.userId,
        payType: payType,
        source: "2",
        customerMaritalState: that.data.marryIndex,
        customerCartNo: that.data.idCard,  
        serviceDictId: that.data.serviceDictId,
        serviceId: that.data.serverPersonData.serviceId,
        dataDay: newstr,
        content: that.data.text,
        customerName: that.data.name,
        customerMobile: that.data.phone,
        serviceItemIds: that.data.serviceItemIds
      }
      if (that.data.time == '上午') {
        orderData.timeScope = 1;
      } else if (that.data.time == '下午') {
        orderData.timeScope = 2;
      } else {
        orderData.timeScope = that.data.time;
      }
      if (that.data.serviveData.serviceDictWay == '上门服务') {
        orderData.customerAddress = that.data.address + that.data.addressInfo;
      }
    }
    //预约专家
    if (that.data.depart != "") {
      // 处理日期
      let str = that.data.depart.registerDate;
      let registerDate = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
      orderData.registerDate = registerDate;
      orderData.serviceDoctorId = that.data.serverPersonData.userId;
      orderData.doctorScheduleId = that.data.depart.doctorSchedualId;
      orderData.unitType = that.data.depart.timeSlot;
      orderData.isServiceFlag = '1';
      orderData.eaId = that.data.depart.eaId;
    }
    console.log(orderData)
    //邮寄地址
    if (that.data.mailInfo != "") {
      orderData.customerMailAddress = JSON.stringify({
        address: that.data.mailInfo
      })
    }
    app.post(orderData, 660085).then((res) => {
      console.log(res);
      if (res.data.state == 'err_01') {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        wx.showModal({
          title: '提示',
          showCancel:false,
          confirmText:"选择其他",
          content: that.getDateStr(),
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../serverIndex/serverIndex',
              })
            }
          }
        })
      }
      if (res.data.state == 'err_02') {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showModal({
          content: '由于您今日还有1个预约类订单未处理，无法继续购买预约类服务！快去处理吧',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../order/orderList/orderList',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      if (res.data.state == 'err_03') {
        wx.showToast({
          title: '该服务不可预约',
          icon: 'none',
          duration: 2000
        })
      }
      if (res.data.state == 'err_04') {
        wx.showToast({
          title: '购买的服务不存在',
          icon: 'none',
          duration: 2000
        })
      }
      if (res.data.state == 'err_05') {
        wx.showToast({
          title: '预约时间为空',
          icon: 'none',
          duration: 2000
        })
      }
      if (res.data.state == 'err_06') {
        wx.showToast({
          title: '参数异常',
          icon: 'none',
          duration: 2000
        })
      }
      if (res.data.state == 'err_10') {
        wx.showModal({
          content: '由于您今日还有1个预约类订单未处理，无法继续购买预约类服务！快去处理吧',
          success: function (res) {
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
            if (res.confirm) {
              wx.reLaunch({
                url: '../order/orderList/orderList',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      if (res.data.state == 'suc'){
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        let moduletype = res.data.moduletype;
        let questionId = res.data.questionId;
        let paymentChannel = res.data.paymentChannel;
        let orderId = res.data.orderId;
        if (that.data.imgFiles.length>0){
          for (let i = 0; i < that.data.imgFiles.length; i++) {
            let moduletypeId;
            if (res.data.questionId) {
              moduletypeId = res.data.questionId;
            } else {
              moduletypeId = res.data.orderId;
            }
            wx.uploadFile({
              url: app.globalData.picAppUpload,
              filePath: that.data.imgFiles[i].path,
              name: 'picArrayFile',
              header: {
                "Content-Type": "multipart/form-data"
              },  
              formData: {
                'eaId': that.data.eaId,
                'moduletypeId': moduletypeId,
                'type': moduletype,
                'userCode': that.data.userCode,
                'userId': that.data.userId,
              },
              success: function (res) {
                console.log(res)
                let jsonObj = JSON.parse(res.data);
                //do something
                if (jsonObj.picUploadState == 'add_suc'){
                  if (payType == '2') {
                    wx.showModal({
                      content: '订单已经提交，请前往服务订单查看！',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: `../order/orderMsg/orderMsg?orderId=${orderId}`,
                          })
                        }
                      }
                    })
                  } else {
                    if (that.data.moneys == 0) {
                      wx.reLaunch({
                        url: `./paySuc/paySuc?money=${that.data.moneys}`,
                      })
                    } else {
                      wx.reLaunch({
                        url: `./payment/payment?orderId=${orderId}&paymentChannel=${paymentChannel}`,
                      })
                    }
                  }
                }
              }
            })
          }
        }else {
          if (payType == '2'){
            wx.showModal({
              content: '订单已经提交，请前往服务订单查看！',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `../order/orderMsg/orderMsg?orderId=${orderId}`,
                  })
                }
              }
            })
          }else {
            if (that.data.moneys == 0) {
              wx.reLaunch({
                url: `./paySuc/paySuc?money=${that.data.moneys}`,
              })
            } else {
              wx.navigateTo({
                url: `./payment/payment?orderId=${orderId}&paymentChannel=${paymentChannel}`,
              })
            }
          } 
        }
        
      }
    }).catch((e) => {
      console.log(e)
    })
  },
  // 选择支付方式
  bindPickerChange(e) {
    if (e.detail.value == 1){
      this.setData({
        payType: 2
      })
    }else {
      this.setData({
        payType: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    // 获取url ID
    let payType = options.payType.split(',');
    console.log(payType)
    this.setData({
      serviceDictId: options.id, 
      types: options.type,
      basicsMoneys: options.basicsMoneys
    })
    if (payType.length == 2){
      this.setData({
        payTypes: false,
        payType: payType[0],
      })
    }else {
      this.setData({
        payTypes: true,
        payType: payType[0],
      })
    }
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
    
    // 获取本地数据
    let that = this;
    wx.getStorage({
      key: 'serverInfo',
      success: function (res) { 
        console.log(res)
        that.setData({
          serviveData: res.data.serviveData, // 服务人员信息
          serverPersonData: res.data.serverPersonData,//服务医生信息
          department: res.data.serverPersonData.department.split(',')[0],
          proTitle: res.data.serverPersonData.proTitle.split(',')[0],
          setverCofimLocal: res.data.setverCofimLocal,//服务地址
          name: res.data.name,//姓名
          phone: res.data.phone,//手机
          text: res.data.textarea, //备注
          moneys: res.data.serverMoneys, //价格
          date: res.data.date, // 预约时间
          time: res.data.time, // 预约时间
          idCard: res.data.idCard,//身份证号码
          address: res.data.address, //地址
          addressInfo: res.data.addressInfo, //楼号
          mailInfo: res.data.mailInfo,// 邮寄地址
          timeInfo: res.data.timeInfo,//预约上下午时间
          marryInfo: res.data.marryInfo,//婚姻状况
          marryIndex: res.data.marryIndex,//婚姻状况ID
          serviceItemIds: res.data.serviceItemIds,//多服务列表ID
          arrItme: res.data.arrItme, //多服务列表
          imgFiles: res.data.imgFiles,// 上传图片,
          depart: res.data.depart //预约专家信息
        })
      },
    })
    wx.getStorage({
      key: 'user_message',
      success: function (res) {
        console.log(res)
        that.setData({
          userId: res.data.userId,
          eaId: res.data.eaId,
          userCode: res.data.userCode,
        })
      },
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