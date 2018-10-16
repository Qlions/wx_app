var app = getApp();
Page({
  data:{
    wx_code: ''
  },




  // 获取code
  get_code_login(){
    let that = this;
    wx.login({
      success(res){
        if(res.errMsg == "login:ok"){
          that.setData({
            wx_code: res.code
          })
          that.wx_code_login(res.code)
        }
        
      },
      fail(err){
        //console.log(err)
      }
    })
  },


  //通过code登录
  wx_code_login(code){
    //加载中
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let that = this;
    wx.request({
      url: app.globalData.login_code_url,
      header: app.globalData.requestHeader,
      method: "POST",
      data: {code: code},
      success(res){
        wx.hideLoading()
        //console.log(res.data.id)
        if(res.data.state == "err"){
          wx.navigateTo({
            url: `../wx_login_phone_num/wx_login_phone_num?id=${res.data.id}&uid=${res.data.uid}`
          })
        }else if(res.data.state == "suc"){
          app.get_user_msg(res.data);
          wx.setStorage({
            key: "userInfo",
            data: res.data
          }, ()=>{
            wx.navigateBack({
              delta: 2
            })
          })
          
        }

      }

    })
  },

  //回到首页
  go_home(){
    wx.switchTab({
      url: "../../serverIndex/serverIndex"
    })
  }
})