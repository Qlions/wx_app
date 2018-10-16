// pages/purchaseService/purchaseService.js
var WxParse = require("../../wxParse/wxParse.js");
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	relationEaId:'',
  	userId:'',
    dctorUserId:"",//医生ID
    id:"",// 服务ID
    serviveData:'',
    isFocus:true, // 关注医生判断值
    serverPersonData: '',
    serverPersonData_if: '',
    name: "", // 用户基本姓名
    phone: "",// 用户基本手机
    address: "",// 用户基本地址
    addressInfo: "",// 用户基本楼号
    imgFiles:"",//图片储存内容
    time:"", //预约时间
    date:"",//预约日期
    DataTimes:"",//时间与日期
    textarea:"", // 备注文本
    idCard:"",// 身份证
    types: "", //判断购买预约类型
    // 签约图片
    isCheckbox: true,
    imageUrl: "../../image/icon-unauthorized.png",
    setverCofimLocal:"",
    serverMoneys:"", //价格
    basicsMoneys: "", //基础价格
    serverItemMsg:"", //详情内容
    payType:"",//判断支付方式
    radioItems: [
      { name: '0', value: '邮寄' },
      { name: '1', value: '自取', checked: 'true' },
    ],
    radioLabel:1,
    mailInfo:"",// 邮寄地址
    timeInfo:"",//预约上下午时间
    marryInfo:"",//婚姻状况
    marryIndex: "",//婚姻状况ID
    arrItme:[],// 储存多服务项目
    serviceItemIds: [],// 储存多服务项目ID
    showModalStatus:false,// 弹出框显示标记
    depart:"",//预约专家信息
    departMoney:"",//专家总价格
    tap_sevice_conent_title: "", // 服务说明数据
    desModel:false, // 服务说明判断变量
    bscModel: false, // 基础服务说明判断变量
    latitude: '', // 经纬度
    longitude: '',// 经纬度
    areaCode: '',// COde
    isRelax:'',//判断医生是否休息
    yyyz3:false,// 判断身份证类型
    yyyz4: false,// 判断婚姻类型
    yyyz5: false,// 判断地址类型
    serviceDicIden:"", //再次购买标识
  },

  //   服务详情描述获取
  service_conent(serviceDictId) {
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      method: "POST",
      header: app.globalData.requestHeader,
      data: {
        jsonValue: JSON.stringify({ serviceDictId: serviceDictId, wechat: 1 }),
        infoType: 111181,
        token: wx.getStorageSync("userInfo").token || ""
      },
      success(res) {
        console.log(res.data)
        that.setData({
          tap_sevice_conent_title: res.data[0].infoContent
        })
        WxParse.wxParse('reply', 'html', res.data[0].infoContent[0].serviceDictInfoContent, that);
      }
    })
  },
  // 服务说明显示事件
  desModelClickHide(){
    this.setData({
      desModel: true
    })
  },
  // 服务说明显示关闭
  desModelClickShow(){
    this.setData({
      desModel: false
    })
  },
  // 基础服务费说明显示事件
  bscModelClickHide() {
    this.setData({
      bscModel: true
    })
  },
  // 基础服务费说明显示关闭
  bscModelClickShow() {
    this.setData({
      bscModel: false
    })
  },
  // 明细弹出框显示
  showModal: function () {
    this.setData({
      showModalStatus: true
    })  
  },
   // 明细弹出框关闭
  HideModal: function () {
    this.setData({
      showModalStatus: false
    })
  },
  // 输入时触发姓名
  getName(e){
    this.setData({
      name: e.detail.value
    })
  },
  // 输入时触发手机
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 输入时触发身份证
  getCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  // 判断是否为上门服务，获取个人信息
  serviceRadiusState(){
    
  },
  // 关注
  bindFollow (e) {
    console.log(e)
    let that = this;
    if (!that.data.isFocus) {
      wx.request({
        url: app.globalData.requestUrl,
        data: {
          infoType: 111125,
          token: wx.getStorageSync("userInfo").token || "",
          jsonValue: JSON.stringify({
            attentionId: e.currentTarget.dataset.userid
          })
        },
        method: 'POST',
        header: app.globalData.requestHeader,
        success(res) {
          console.log(res)
          that.setData({
            isFocus: true
          })
        }
      })
    }else {
      wx.request({
        url: app.globalData.requestUrl,
        data: {
          infoType: 111126,
          token: wx.getStorageSync("userInfo").token || "",
          jsonValue: JSON.stringify({
            id: e.currentTarget.dataset.id
          })
        },
        method: 'POST',
        header: app.globalData.requestHeader,
        success(res) {
          console.log(res)
          that.setData({
            isFocus: false
          })
        }
      })
    }   
  },
  
  // 获取基本信息
  getInfo () {
    let that = this;
    let req = {
      addressType: '2',
      state: '1'
    }
    app.post(req, 112000).then((res) => {
      console.log(res)
      that.setData({
        name: res.data.addressAll[0].name,
        phone: res.data.addressAll[0].tel,
        address: res.data.addressAll[0].address,
        addressInfo: res.data.addressAll[0].addressInfo,
        latitude:res.data.addressAll[0].latitude,
        longitude:res.data.addressAll[0].longitude,
        areaCode:res.data.addressAll[0].areaCode,
      })
      that.matchingServiceDoc();
    }).catch((e) => {
      console.log(e)
    })
  },
  // 获取预约专家信息
  getDepart() {
    let that = this;
    wx.getStorage({
      key: 'depart',
      success: function (res) {
        let costMoney = Number(res.data.costMoney);
        let hospitalServiceMoney = Number(res.data.hospitalServiceMoney);
        let serverMoneys = that.data.serverMoneys + res.data.costMoney + res.data.hospitalServiceMoney;
        that.setData({
          depart: res.data,
          serverMoneys: serverMoneys
        })
        wx.removeStorage({
          key: 'depart',
        })
      }
    })
  },
  // 获取本地个人信息
  getStorageInfo(){
    let that = this;
    // 获取时间
    wx.getStorage({
      key: 'user_message',
      success: function (res) {
        console.log(res);
        that.setData({
          name: res.data.name, // 用户基本姓名
          phone: res.data.mobile,// 用户基本手机
        })
        // wx.removeStorage({
        //   key: 'user_message',
        // })
      }
    })
  },
  // 获取本地地址
  getStorageLocal() {
    let that = this;
    // 获取时间
    wx.getStorage({
      key: 'user_local',
      success: function (res) {
        that.setData({
          name: res.data.name,
          phone: res.data.tel,
          address: res.data.address,
          addressInfo: res.data.addressInfo,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          areaCode: res.data.areaCode,
        })
        wx.removeStorage({
          key: 'user_local',
        })
      }
    })
  },
  // 获取时间
  timestamp () {
    let that = this;
    // 获取时间
    wx.getStorage({
      key: 'timestamp',
      success: function (res) {
        that.setData({
          date: res.data.date,
          time: res.data.time,
          DataTimes: res.data.date + ' '+res.data.time
        })
        wx.removeStorage({
          key: 'timestamp',
        })
      }
    })
  },
  // 获取备注
  remarks() {
    let that = this;
    wx.getStorage({
      key: 'upload',
      success: function (res) {
        that.setData({
          textarea: res.data.textarea,
          imgFiles: res.data.imgFiles
        })
        wx.removeStorage({
          key: 'upload',
        })
      }
    })
  },
  // 获取婚姻
  marrInfo() {
    let that = this;
    wx.getStorage({
      key: 'marrInfo',
      success: function (res) {
        that.setData({
          marryInfo: res.data.info,//婚姻状况
          marryIndex: res.data.value,//婚姻状况ID
        })
        wx.removeStorage({
          key: 'marrInfo',
        })
      }
    })
  },
   // 获取邮寄地址
  mailInfo() {
    let that = this;
    wx.getStorage({
      key: 'mailInfo',
      success: function (res) {
        console.log(res);
        that.setData({
          mailInfo: res.data
        })
        wx.removeStorage({
          key: 'mailInfo',
        })
      },
    })
  },
  
  // 跳转邮寄地址
  mailAddress () {
    wx.navigateTo({
      url: '../mailAddress/mailAddress',
    })
  },
  // 签发授权
  catchChecked() {
    if (this.data.isCheckbox) {
      this.setData({
        isCheckbox: false,
        imageUrl: '../../image/icon-unauthorized.png'
      })
    } else {
      this.setData({
        isCheckbox: true,
        imageUrl: '../../image/icon-anthorize.png'
      })
    }
  },
  // 判断当前地址是否超出服务范围接口
  serviceDoorState() {
    let doctorData = {
      userId: this.data.serverPersonData.userId,
      lat: this.data.latitude,
      lon: this.data.longitude,
      serviceDictId: this.data.id,
      areaCode: this.data.areaCode
    };
    app.post(doctorData, 660101).then((res) => {
      console.log(res);
      //判断当前地址是否超出服务范围
     
    }).catch((e) => {
      console.log(e)
    })
  },
  //匹配医生
  matchingServiceDoc() {
    let that = this;
    let req = {};
    let portNum;
    if (!that.data.date) {//无预约时间
      if (that.data.latitude == "" || that.data.latitude == null) {
        req = {
          serviceDictId: that.data.serviveData.serviceDictId,
          page: 1,
          rows: 30
        }  
        console.log("无预约时间数据,无经纬度"); 
      } else {
        req = {
          serviceDictId: that.data.serviveData.serviceDictId,
          page: 1,
          rows: 30,
          lat: that.data.latitude,
          lon: that.data.longitude,
          areaCode: that.data.areaCode
        } 
        console.log("无预约时间数据,有经纬度");
      }
      portNum = 111183;
    }else {
      let splitDate = that.data.date;
      let date = splitDate.replace(/-/g);
      console.log(date)
      if (that.data.time == '上午' || that.data.time == '下午') {//预约上下午服务
        if (that.data.latitude == "" || that.data.latitude == null) {
          req = {
            serviceDictId: that.data.serviveData.serviceDictId,
            page: 1,
            rows: 30,
            registerDate: date,
            isAPMService: 1
          }
        } else {
          req = {
            serviceDictId: that.data.serviveData.serviceDictId,
            page: 1,
            rows: 30,
            registerDate: date,
            isAPMService: 1,
            lat: that.data.latitude,
            lon: that.data.longitude,
            areaCode: that.data.areaCode
          }
        }
        portNum = 111183;
      } else {
        if (that.data.latitude == "" || that.data.latitude == null) {
          req = {
            serviceDictId: that.data.serviveData.serviceDictId,
            page: 1,
            rows: 30,
            lat: that.data.latitude,
            lon: that.data.longitude,
            areaCode: that.data.areaCode,
            pointOfTime: that.data.time,
            pointOfDay: date
          }
          console.log("有预约时间数据，有经纬度");
        } else {
          req = {
            serviceDictId: that.data.serviveData.serviceDictId,
            page: 1,
            rows: 30,
            pointOfTime: that.data.time,
            pointOfDay: date
          }
          
          console.log("有预约时间数据，无经纬度");
        }
        portNum = 111199;
      }
    }
    app.post(req, portNum).then((res) => { 
      console.log(res);
      if (res.data.rows.length > 0){
        if (res.data.rows[0].attentionId == '') {
          that.setData({
            isFocus: false,
            serverPersonData: res.data.rows[0],
            serverMoneys: res.data.rows[0].serviceMoney,
            basicsMoneys: res.data.rows[0].serviceMoney,
            serverPersonData_if: res.data.rows
          })
        } else {
          that.setData({
            isFocus: true,
            serverPersonData: res.data.rows[0],
            serverPersonData_if: res.data.rows,
            serverMoneys: res.data.rows[0].serviceMoney,
            basicsMoneys: res.data.rows[0].serviceMoney,
            dctorUserId: res.data.rows[0].userId
          })
        }
        if (that.data.userId != '') {//选择的另外一个专家
          let uId = that.data.userId;
          console.log(res.data.rows);
          for (var i = 0; i < res.data.rows.length; i++) {
            if (uId == res.data.rows[i].userId) {
              that.setData({
                serverPersonData: res.data.rows[i],
                serverPersonData_if: res.data.rows,
                serverMoneys: res.data.rows[i].serviceMoney,
                basicsMoneys: res.data.rows[i].serviceMoney,
              })
              console.log(res.data.rows[i]);

            }
          }

        } else {//当前专家，未选择更多专家
          that.setData({
            serverPersonData: res.data.rows[0],
            serverMoneys: res.data.rows[0].serviceMoney,
            basicsMoneys: res.data.rows[0].serviceMoney,
          })
        }
      }				
      
    }).catch((e) => {
      console.log(e)
    },

    )
  },
  // 获取门诊(店)服务 - 综合服务 的详情模块
  getInfoData() {
    let that = this;
    let req = {
      serviceDictId: that.data.serviveData.serviceDictId,
      lat: app.globalData.locationData.lat,
      lon: app.globalData.locationData.lon,
      opType: "1"
    }
    app.post(req, 111177).then((res) => {
      that.setData({
        setverCofimLocal: res.data.rows[0]
      })

    }).catch((e) => {
      console.log(e)
    })
  },
   //选择专家
  depart() {
     wx.navigateTo({
        url: `../departSelect/departSelect?relationEaId=${this.data.relationEaId}`
     })
  },
  //预约时间
  checkTime() {
    if (this.data.serverItemMsg.reservationMode == 3) {
      wx.navigateTo({
        url: `../serverItemInt/serverItemInt?serviceDictId=${this.data.serviveData.serviceDictId}&dictEaId=${this.data.serverPersonData.userId}`
      })
    } else {
      wx.navigateTo({
        url: `../serviceTime/serviceTime?serviceDictId=${this.data.serviveData.serviceDictId}`
      })
    }

  },
  // 跳转婚姻状况
  chooseMarr() {
    wx.navigateTo({
      url: '../serverMarriage/serverMarriage',
    })
  },
  // 跳转备注
  goUpload() {
    wx.navigateTo({
      url: `../upload/upload?serviceDictId=${this.data.serviveData.serviceDictId}`
    })
  },
  // 跳转地址管理
  goLocal() {
    wx.navigateTo({
      url: `../localAdmin/localAdmin?serviceDictId=${this.data.serviveData.serviceDictId}`
    })
  },

  //初始化信息
  initServerMsg(serviceDictId) {
    let that = this;
    let req = {
      serviceDictId: serviceDictId
    }
    app.post(req, 111181).then((res) => { 
      console.log(res);
      if (res.data[0].reservationValid.includes('yyyz3')){
        that.setData({
          yyyz3:true
        })
      }
      if (res.data[0].reservationValid.includes('yyyz4')) {
        that.setData({
          yyyz4: true
        })
      }
      if (res.data[0].reservationValid.includes('yyyz5')) {
        that.setData({
          yyyz5: true
        })
      }
      console.log(res.data[0])
      that.setData({
        
        serverItemMsg: res.data[0],
        serverMoneys: res.data[0].serviceDictMoney,
        basicsMoneys: res.data[0].serviceDictMoney,
        payType: res.data[0].payType,
        relationEaId: res.data[0].relationEaId,
      })

    }).catch((e) => {
      console.log(e)
    })
  },

  switch1Change: function (e) {
    if (e.detail.value) {
      let money = Number(e.currentTarget.dataset.item.serviceItemMoney);
      let endMoney = this.data.serverMoneys + money;
      let arr = this.data.arrItme;
      let arrId = this.data.serviceItemIds;
      arr.push(e.currentTarget.dataset.item);
      arrId.push(e.currentTarget.dataset.item.serviceDictItemId);
      this.setData({
        serverMoneys: endMoney,
        arrItme: arr,
        serviceItemIds: arrId
      })
    } else {
      let money = Number(e.currentTarget.dataset.item.serviceItemMoney);
      let endMoney = this.data.serverMoneys - money;
      let arr = this.data.arrItme;
      let arrId = this.data.serviceItemIds;
      arr.splice(e.currentTarget.dataset.index,1);
      arrId.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        serverMoneys: endMoney,
        arrItme: arr,
        serviceItemIds: arrId
      })
    }
  },
  // 结算跳转
  nextTips () {
    let that = this;
    // 判断姓名
    if (that.data.name == '') {
      wx.showToast({
        title: '请填写姓名',
        icon:'none',
        duration: 2000
      })
      return false;
    }
    // 判断手机号码
    if (that.data.phone == ''){
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else {
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(that.data.phone))){
        wx.showToast({
          title: '请填写正确手机号码',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断地址
    if (that.data.serverItemMsg.serviceDictWay == '上门服务'){
      if (that.data.address == '' || that.data.addressInfo == '') {
        wx.showToast({
          title: '请填写地址',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断服务时间
    if (that.data.types == 1 && that.data.serverItemMsg.reservationMode != 2) {
      if (that.data.time == '') {
        wx.showToast({
          title: '请填写服务时间',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断健康现状描述
    if (that.data.serverItemMsg.serviceDictWay == '图文咨询'){
      if (that.data.textarea == '') {
        wx.showToast({
          title: '请填写健康现状描述',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断婚姻状况
    if (that.data.serverItemMsg.reservationValid.includes('yyyz4')) {
      if (that.data.marryInfo == '') {
        wx.showToast({
          title: '请填写婚姻状况',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断婚姻状况
    if (that.data.serverItemMsg.reservationMode == 2) {
      if (that.data.depart == '') {
        wx.showToast({
          title: '请选择医生专家',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 判断身份证号
    if (that.data.serverItemMsg.reservationValid.includes('yyyz3')) {
      if (that.data.idCard == '') {
        wx.showToast({
          title: '请填写身份证号',
          icon: 'none',
          duration: 2000
        })
        return false;
      } else {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(that.data.idCard)) {
          wx.showToast({
            title: '请输入合法身份证号',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
    }
    let serverInfo = {
      serviveData: that.data.serverItemMsg,
      serverPersonData: that.data.serverPersonData,
      name: that.data.name, // 用户基本姓名
      phone: that.data.phone,// 用户基本手机
      address: that.data.address,// 用户基本地址
      addressInfo: that.data.addressInfo,// 用户基本楼号,
      imgFiles: that.data.imgFiles,// 上传图片,
      date: that.data.date, //预约时间
      time: that.data.time, //预约时间
      textarea: that.data.textarea, // 备注文本
      serverMoneys: that.data.serverMoneys, //价格
      setverCofimLocal: that.data.setverCofimLocal, // 服务地址
      idCard: that.data.idCard,//身份证号码
      address: that.data.address, //地址
      addressInfo: that.data.addressInfo, //楼号
      mailInfo: that.data.mailInfo,// 邮寄地址
      timeInfo: that.data.timeInfo,//预约上下午时间
      marryInfo: that.data.marryInfo,//婚姻状况
      marryIndex: that.data.marryIndex,//婚姻状况ID
      arrItme: that.data.arrItme,// 储存多服务项目
      depart: that.data.depart // 预约专家信息
    }
    // 判断预约医生
    if (that.data.serverItemMsg.reservationMode == 2 ){
      //serverInfo.name = that.data.depart.name;
      //serverInfo.appoint_department = that.data.depart.title;
      //serverInfo.appoint_proTitle = obj.proTitle;
      //serverInfo.serviceItemIds = "";
      if (that.data.serviceItemIds.length > 0) {
        serverInfo.isServiceFlag = 1;
      } else {
        serverInfo.isServiceFlag = 0;
      }
    }else {
      if (!this.data.serviceItemIds.length) {
        serverInfo.serviceItemIds = "";
      } else {
        serverInfo.serviceItemIds = this.data.serviceItemIds.join(",");
      }
    }
    if (that.data.isCheckbox){
      let spliceStr = 'UA001_UA002_UA003_UA004_UA005_UA006_UA007_UA008_UA009';
      let req = {
        docId: that.data.serverPersonData.userId,
        type: '1',
        attention: spliceStr
      }
      app.post(req, 660037).then((res) => {
        console.log(res)
        if (res.data.state == "add_suc"){
          wx.showToast({
            title: '授权成功，请等待确定',
            icon: 'none',
            duration: 2000,
            success:function(){
              wx.setStorage({
                key: 'serverInfo',
                data: serverInfo,
                success: function () {
                  wx.navigateTo({
                    url: `../serverOrder/serverOrder?id=${that.data.id}&type=${that.data.types}&payType=${that.data.payType}&basicsMoneys=${that.data.basicsMoneys}`,
                  })
                }
              })
            }
          })
        }
        
      }).catch((e) => {
        console.log(e)
      })
    }else {
      wx.setStorage({
        key: 'serverInfo',
        data: serverInfo,
        success: function () {
          wx.navigateTo({
            url: `../serverOrder/serverOrder?id=${that.data.id}&type=${that.data.types}&payType=${that.data.payType}&basicsMoneys=${that.data.basicsMoneys}`,
          })
        }
      })
    }   
  },

  // radio label单选
  radioChange (e) {
    this.setData({
      radioLabel: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serviveData: options,
      types: options.type,
      id: options.serviceDictId,
      userId: options.serviceId,
      serviceDicIden:options.serviceDicIden //再次购买标识
    })
    this.initServerMsg(options.serviceDictId);
    this.getInfoData();
    this.service_conent(options.serviceDictId);
    if (this.data.serviveData.serviceDictWay == '上门服务') {
      this.getInfo(); //基本信息
    } else {
      this.matchingServiceDoc();
      this.getStorageInfo(); //获取本地个人信息
    }
  },
 
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.timestamp(); // 获取预约时间
    this.remarks(); // 获取备注
    this.marrInfo(); // 获取婚姻
    this.mailInfo();// 邮寄地址
    this.getDepart();// 获取预约专家信息
    this.getStorageLocal(); // 获取本地地址
    if (this.data.serverPersonData.authorizeId != '' || this.data.serverPersonData.authorizeId != null){
      this.setData({
        isCheckbox: false,
        imageUrl: '../../image/icon-unauthorized.png'
      })
    }else {
      console.log(1)
      this.setData({
        isCheckbox: true,
        imageUrl: '../../image/icon-anthorize.png'
      })
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
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
})