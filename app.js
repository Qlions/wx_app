//app.js
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(options){
    //获取code， 进行登录
    this.get_code_login(options.path);

    
  },
  // 获取code
  get_code_login(path){
    let that = this;
    wx.login({
      success(res){
        // console.log(res)
        // return false;
        if(res.errMsg == "login:ok"){
          
          that.wx_code_login(res.code,path)
        }
        
      },
      fail(err){
        // console.log(err)
      }
    })
  },


  //通过code登录
  wx_code_login(code, path){
    let that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
  })
    wx.request({
      url: that.globalData.login_code_url,
      header: that.globalData.requestHeader,
      method: "POST",
      data: {code: code},
      success(res){
        // console.log(res)
        //suc 说明已经绑定
        if(res.data.state == "suc"){
          that.get_user_msg(res.data)
        }else{
        // 其他  调到授权页面
          if(path == "pages/serverIndex/serverIndex" || path == "pages/serverItem/serverItem"){
            wx.hideLoading();
            return false;
          }
           wx.navigateTo({
              url: '/pages/login/authorization/authorization'
            })
        }
        wx.hideLoading();
        wx.setStorage({
          key: "userInfo",
          data: res.data
        })

      },
      fail(){
        wx.hideLoading();
      }

    })
  },

  //通过userName 获取 用户信息 600039
  get_user_msg(userInfo){
    let that = this;
    wx.request({
      url: that.globalData.requestUrl,
      header: that.globalData.requestHeader,
      method: "POST",
      data: {
        infoType: 600039,
        token: userInfo.token,
        jsonValue:JSON.stringify({
          userName: userInfo.userName
        })
      },
      success (res){
        // console.log(JSON.parse(res.data.state))
        wx.setStorage({
          key: "user_message",
          data: JSON.parse(res.data.state)[0],
          success(){
            wx.hideLoading()
          }
        })
      }
    })
  },

  //request promise
  post ( data, infoType){
      wx.showLoading({
        title: "加载中..."
      })
    let promise = new Promise(( resolve, reject) => {
      //init 
      var that = this;
      let postData = data;

      wx.request({
        url: that.globalData.requestUrl,
        data: {
          infoType: 222200,
          token: wx.getStorageSync("userInfo").token || ""
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res){
          // console.log(res.data)

          if(res.data.state == "suc"){
            //正常走接口
            resolve(that.reg_login(data, infoType))
          }else{
            // wx.navigateTo({
            //   url: '/pages/login/authorization/authorization'
            // })
            wx.setStorageSync("userInfo", {state: 'err'})
            that.get_code_login();
            let time = setInterval( ()=>{
              if(wx.getStorageSync("userInfo").state == "suc"){
                resolve(that.reg_login(data, infoType));
                clearInterval(time)
              }
            }, 1000)
            
            
          }
          
          
        },
        error(e){
          reject(e)
        }
      })
    })
    return promise;
  },
  reg_login(data, infoType){
    let promise_reg = new Promise( (resolve,reject) => {
      let that = this;
      let res_data;
      wx.request({
        url: that.globalData.requestUrl,
        data: {
          infoType: infoType,
          token: wx.getStorageSync("userInfo").token,
          jsonValue: JSON.stringify(data)
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res){
          resolve(res)
        },
        error(e){
          reject(e)
        }
      })
    })

    return promise_reg;
   
  },



  globalData: {
    // 页面保存的参数
    userInfo: null,
    locationData: {},
    authorization_msg: {},




    //请求设置
    requestHeader: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    gdmapsdk_key:'c5127546d89dd7a2af9550102b104ab3',


    //正式环境
  //  requestUrl: `https://www.zgjky.cn/webservice/wtWebApiH/GetServerData`,
    //测试
    // requestUrl: "http://192.168.19.187/webservice/wtWebApiH/GetServerData",
    //杨哲
    //requestUrl: 'http://192.168.18.89:8080/webservice/wtWebApiH/GetServerData,'
    //安辉
    requestUrl: 'http://192.168.17.33/webservice/wtWebApiH/GetServerData',


    //登录 正式
  //  requestUrlLogin:   "https://www.zgjky.cn/webservice/wtWebApiH/GetAuthService",
    //登录 测试
  //  requestUrlLogin:   "http://192.168.19.187/webservice/wtWebApiH/GetAuthService",
    //登录 安徽
    requestUrlLogin:   "http://192.168.17.33/webservice/wtWebApiH/GetAuthService",

    // 通过code登录请求action 正式
    // login_code_url: "https://www.zgjky.cn/webservice/wtWebApiH/GetAuthInfoFromWx",
    // 通过code登录请求action 测试
    // login_code_url: "http://192.168.19.187/webservice/wtWebApiH/GetAuthInfoFromWx",
     //登录 安徽
    login_code_url:"http://192.168.17.33/webservice/wtWebApiH/GetAuthInfoFromWx",

    //通过手机号码及验证码注册并登录接口（同时绑定小程序登录用户） 正式
    // login_phone_number_url: 'https://www.zgjky.cn/webservice/wtWebApiH/GetMobileAuthService',
    //通过手机号码及验证码注册并登录接口（同时绑定小程序登录用户）  测试
    login_phone_number_url: 'http://192.168.19.187/webservice/wtWebApiH/GetMobileAuthService',
    //通过手机号码及验证码注册并登录接口（同时绑定小程序登录用户）  安辉
    // login_phone_number_url: 'http://192.168.17.33/webservice/wtWebApiH/GetMobileAuthService',

    // 上传图片   测试
    // picAppUpload:'http://192.168.19.189/webapi/picAppUpload.action',
     // 上传图片   正式
     picAppUpload:'https://www.zgjky.cn/webapi/picAppUpload.action',

    //支付签名  杨磊
    requestPaySign: "http://219.142.225.98:8083/unifiedPay/getPaySign",
    //支付签名  正式
    // requestPaySign:"https://pay.zgjky.cn/unifiedPay/getPaySign",
    //支付签名  正式
    requestPaySign:"http://219.142.225.69:8084/unifiedPay/getPaySign",

    //获取拉起支付控件的参数  平台小程序支付 杨磊
    request_wx_pay_url: "http://219.142.225.98:8083/wechatPay/wxXcxPay",
    //获取拉起支付控件的参数  平台小程序支付 正式
    // request_wx_pay_url: "https://pay.zgjky.cn/wechatPay/wxXcxPay",
    //获取拉起支付控件的参数  平台小程序支付 测试
    // request_wx_pay_url: "http://219.142.225.69:8084/wechatPay/wxXcxPay",

    //获取拉起支付控件的参数  盛付通小程序支付 杨磊
    request_wxSFT_pay_url: "http://219.142.225.98:8083/shengPay/payTo/directXcxAccount",
    //获取拉起支付控件的参数  盛付通小程序支付 正式
    // request_wxSFT_pay_url: "https://pay.zgjky.cn/shengPay/payTo/directXcxAccount",
    //获取拉起支付控件的参数  盛付通小程序支付 测试
    // request_wxSFT_pay_url: "http://219.142.225.69:8084/shengPay/payTo/directXcxAccount",

    // 支付回调url  测试
    pay_callback_url: "http://219.142.225.69:8090",
    //支付回调url   正式
    // pay_callback_url: "https://www.zgjky.cn"
  }
})