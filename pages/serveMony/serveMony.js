// pages/serverNotice/serverNotice.js
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	 serviveData:'',
  	 serverListAll:[],
  	 tempServicePerson: {
      isCheckbox: true,
      imageUrl: "../../image/icon-unauthorized.png",
      serverPersonData: '',
      playType:"",
      isShow:false,
      serviceDictId:"",
      userId:"",
      money:"",
      name:"",
      speci:"",
      sume:"",
    },
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  		
//  if( wx.getStorageSync("userInfo") == ""){
//    wx.redirectTo({
//      url: '../login/authorization/authorization'
//    })
//    return false;
//  }
    this.setData({
      serviveData: options,
      ['tempServicePerson.playType']: options.type
    })
    this.matchingServiceDoc();
  
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
  // onShareAppMessage: function () {
  
  // },
   matchingServiceDoc(){
    let that = this;
    wx.request({
      url:app.globalData.requestUrl,
      header:app.globalData.requestHeader,
      method:"POST",
      data:{
          token: wx.getStorageSync("userInfo").token,
          infoType:111183,
          jsonValue: JSON.stringify({
            serviceDictId: that.data.serviveData.serviceDictId,
            page: 1,
            rows: 30
          })
      },
      success(res){
          console.log(res)
          that.userId = that.data.serviveData.userId;
          console.log(that.userId);
          let list = [];
          for(var i = 0;i < res.data.rows.length;i ++){
							if(that.userId == res.data.rows[i].userId){
								continue;
							}else {
								list.push(res.data.rows[i]);
							}
						}
          that.setData({
          	 serverListAll: list
//          ['tempServicePerson.serverPersonData']: res.data.rows
          })
      }
    })
  },
  hideClick(){
  	console.log("隐藏");
  	this.setData({
  		isShow: false,
  	})
  },
  showClick:function(item){
  	console.log("显示");
  	console.log(item.currentTarget.dataset.text);
  	console.log(item.currentTarget.dataset.type);
  	console.log(item.currentTarget.dataset.num);
  	console.log(item.currentTarget.dataset.name);
  	this.setData({
  		isShow: true,
  		serviceDictId:item.currentTarget.dataset.text,
  		userId:item.currentTarget.dataset.type,
  		money:item.currentTarget.dataset.num,
  		name: item.currentTarget.dataset.name,
  	})
  	if(item.currentTarget.dataset.speci == "" || item.currentTarget.dataset.speci == null){
					this.setData({
			  		speci: "暂无擅长",
			  	})
				}else {
					this.setData({
			  		speci: item.currentTarget.dataset.speci,
			  	})
				}
			if(item.currentTarget.dataset.sume == "" || item.currentTarget.dataset.sume == null){
					this.setData({
			  		sume: "暂无简介",
			  	})
				}else {
					this.setData({
			  		sume: item.currentTarget.dataset.sume,
			  	})
				}
  	
  },
  chooseExpert(){
  	console.log(333);
  	console.log(this.data.userId);
  	console.log(this.data.money);
  	let id = this.data.serviceDictId;
  	let userId = this.data.userId;
  	let mon = this.data.money;
  	console.log(id);
  	wx.navigateTo({
      url: '/pages/purchaseService/purchaseService?serviceDictId=' + id +'&serviceId='+userId+'&serviceDictMoney='+mon+'&type='+0
    })
  }
})