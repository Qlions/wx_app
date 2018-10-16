// pages/serviceTime/serviceTime.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //服务ID
    serviceDictId:'',
    timeViewShow: true,
    appointmentTimeData: [],
    toView: '',
    tapNum: 0,
    scrollLeft: '',
    timestamp:"", //当前时间戳
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      serviceDictId: options.serviceDictId
    }, ()=>{
      this.getAppointmentTime()
    })
    this.getTiem(); // 获取当前时间
    //console.log(this.data.appointmentTimeData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    })
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
  //预约时间获取
  getAppointmentTime(){
    let that = this;
    wx.request({
      url: app.globalData.requestUrl,
      header: app.globalData.requestHeader,
      method: "POST",
      data:{
        infoType: 111188,
        token: wx.getStorageSync("userInfo").token,
        jsonValue: JSON.stringify({serviceDictId: that.data.serviceDictId})
      },
      success(res){
        setTimeout(function () { 
          wx.hideLoading()
        }, 1500)
        var week = [];
        let time;
        for(let item in res.data.rows){
          //获取week
          let year = res.data.rows[item].dataDay.substring(0,4);
          let month = res.data.rows[item].dataDay.substring(4,6);
          let day = res.data.rows[item].dataDay.substring(6,8);
          let time = res.data.rows[item].timeScopeCan.timeScopeOk.split(",")
          switch (new Date(`${year}-${month}-${day}`).getDay()) {
            case 1:
              week.push("周一");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周一",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 2:
              week.push("周二");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周二",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 3:
              week.push("周三");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周三",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 4:
              week.push("周四");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周四",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 5:
              week.push("周五");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周五",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 6:
              week.push("周六");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周六",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            case 0:
              week.push("周日");
              that.setData({
                [`appointmentTimeData[${item}].week`] : "周日",
                [`appointmentTimeData[${item}].month`]: `${month}/${day}`,
                [`appointmentTimeData[${item}].time`]: time,
                [`appointmentTimeData[${item}].date`]: `${year}-${month}-${day}`
              })
              break;
            default:
              break;
          }
        } 
      

      }

    })
  },
  // 选择时间
  checkTime(e){
    this.setData({
      tapNum: e.currentTarget.dataset.tap_num
    })
  },
  // 获取预约时间
  chooseTime(e){
    let date = e.currentTarget.dataset.date;
    let time = e.currentTarget.dataset.time;
    let stamps = {
      date: date,
      time: time
    }
    let stamp = date+" "+time;
    let timestamp = new Date(stamp).getTime();
    if (timestamp > this.data.timestamp){
      wx.setStorage({
        key: "timestamp",
        data: stamps,
        success:function(){
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  //向右
  rightBind(){
    if(this.data.appointmentTimeData.length <= 6){
      return false;
    }
    this.setData({
      toView: `a${Number((this.data.scrollLeft/54).toFixed(0))-1}`
    })

  },
  //向左
  leftBind(){
    if(this.data.appointmentTimeData.length <= 6){
      return false;
    }
      this.setData({
        toView: `a${Number((this.data.scrollLeft/54).toFixed(0))+1}`
      })
  },
  //获取滚动信息
  scrollMsg(e){
    //console.log(e)
    this.setData({
       scrollLeft: e.detail.scrollLeft
    })
  },
  // 获取当前时间
  getTiem () {
    let timestamp = new Date().getTime();
    this.setData({
      timestamp: timestamp
    })
  }
})