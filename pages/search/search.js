// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      historyArr: [],
      isRenderHistory: true,
      searchVal: '',
      isSearch: 'search'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
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
//   onShareAppMessage: function () {
  
//   },
//   清空HistoryArr
  clearHistoryArr(){
    this.setData({
        historyArr: []
    })
    wx.removeStorageSync("historyArr")
  },
  //向historyArr添加数据
  focusHistory(e){
    let that = this;
    wx.getStorage({
        key: 'historyArr',
        success: function(res) {
            that.setData({
                isRenderHistory: false,
                historyArr: res.data
            })
        },
    })
  },
  //向historyArr 添加数据
  blurHistoryArr(e){
    var val = e.detail.value;
    let aa = 'historyArr[' + this.data.historyArr.length + ']';
    if (e.detail.value != "" && !this.data.historyArr.includes(e.detail.value)){
        this.setData({
            [aa]: e.detail.value
        })

       //存储数据到本地
       wx.setStorage({
           key: 'historyArr',
           data: this.data.historyArr
       })
    }
  },
  searchBtn(e){
      this.setData({
          searchVal: e.detail.value,
      })
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({
            searchVal: this.data.searchVal,
            isSearch: this.data.isSearch
        })
      wx.navigateBack({
          delta: 1
      })
  },
  checkSearchHistory(e){
    this.setData({
        searchVal: e.target.dataset.searchval
    })
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({
        searchVal: this.data.searchVal,
        isSearch: this.data.isSearch
    })
    wx.navigateBack({
        delta: 1
    })
  }
})