// pages/serverNotice/serverNotice.js
var  app = getApp();
Page({
	tapName: function(event) {
		//console.log(event.currentTarget.dataset.index);
//		//console.log(event.currentTarget.dataset.name);
//		//console.log(event.currentTarget.dataset.type);
//		//console.log(event.currentTarget.dataset.cond);
     var that = this;
     let Index = event.currentTarget.dataset.index;
     //console.log(Index);

    that.setData({
      index:event.currentTarget.dataset.index,
      showView: event.currentTarget.dataset.index,
      select: event.currentTarget.dataset.index,
      name:event.currentTarget.dataset.text,
	  docNum:event.currentTarget.dataset.name,
	  depCode:event.currentTarget.dataset.type,
    })
    if(event.currentTarget.dataset.cond == ""){
    	wx.navigateTo({
	      url: `../expertAppoint/expertAppoint?eaId=${this.data.serviveData.relationEaId}&depCode=${this.data.depCode}&docNum=${this.data.docNum}`,
	     })
    }else{
    	return false;
    }
 },

  /**
   * 页面的初始数据
   */
  data: {
  	showView:"-1",
  	index:"-1",
  	serviveData:'',
  	 serverListAll:[],
  	 serverListSon:[],
  	 serverItemMsg: {
      
    },
    name:'',
    docNum:'',
    depCode:'',
  	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//		 showView: (options.showView == "true" ? true : false);
    
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
    	//console.log(this.data.serviveData.relationEaId)
	    let that = this;
	    wx.request({
	      url:app.globalData.requestUrl,
	      header:app.globalData.requestHeader,
	      method:"POST",
	      data:{
	          token: wx.getStorageSync("userInfo").token,
	          infoType:200100,
	          jsonValue: JSON.stringify({
	            relationEaId: this.data.serviveData.relationEaId,
	          })
	      },
	      success(res){
	          //console.log(res.data)
	          that.setData({
	          	serverListAll: res.data.rows,
	          }) 
	      }
	    })
	  },
	  depart:function(item) {
	  	//console.log(item.currentTarget.dataset.text);
	  	//console.log(item.currentTarget.dataset.name);
	  	//console.log(item.currentTarget.dataset.type);
	  	//console.log(this.data.serviveData.relationEaId);
	  	this.setData({
	  		name:item.currentTarget.dataset.text,
	  		docNum:item.currentTarget.dataset.name,
	  		depCode:item.currentTarget.dataset.type,
  		})
	     wx.navigateTo({
	      url: `../expertAppoint/expertAppoint?eaId=${this.data.serviveData.relationEaId}&depCode=${this.data.depCode}&docNum=${this.data.docNum}`,
	     })
  },

  
})