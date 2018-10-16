// pages/serverNotice/serverNotice.js
var  app = getApp();
Page({
	tapName: function(event) {
		//console.log(1);
     var that = this;
    that.setData({
      showView: !that.data.showView,
      select: !that.data.select,
       selectTwo: !that.data.selectTwo,
       selectUl: !that.data.selectUl,
    })
     this.matchingServiceDoc();
 },
 	tapNameTwo: function(event){
 		//console.log(2);
     	var that = this;
	    that.setData({
	    showView: !that.data.showView,
	      selectTwo: !that.data.selectTwo,
	       select: !that.data.select,
	       selectUl: !that.data.selectUl,
	    })
	      wx.request({
	      url:app.globalData.requestUrl,
	      header:app.globalData.requestHeader,
	      method:"POST",
	      data:{
	          token: wx.getStorageSync("userInfo").token,
	          infoType:660123,
	          jsonValue: JSON.stringify({
					eaId: this.data.serviveData.eaId,
	          })
	      },
	      success(res){
	          //console.log(res.data)
	          that.setData({
	          	dateList: res.data.rows,
	          }) 
	      }
	    })
	   this.matchingServiceDoc_one();
//	   this.timeClick(event);
 	},
 	timeClick(event){
 		//console.log(event.currentTarget.dataset.index);
 		//console.log(event.currentTarget.dataset.week);
 		//console.log(event.currentTarget.dataset.dete);
 		var idx=event.currentTarget.dataset.index;
 		this.setData({
	         key: idx,
	         week:event.currentTarget.dataset.week,
	         dete:event.currentTarget.dataset.dete,
	   	})
 		this.matchingServiceDoc_one();
 		var departData = {
	  		dayOfWeek: this.data.week,
			registerDate : this.data.dete,
		}
   		wx.setStorage({
		      key: 'depart',
		      data: departData,
		      success: function(res){
		        //console.log(res)
		      }
	    })
		wx.getStorage({
		  	key: 'depart',
		 	 success: function(res){
		      //console.log("储存的数据",res.data)
		  	} 
		})
 	},
 	appointDetail: function(event){
 		//console.log(event.currentTarget.dataset.name);
	  	//console.log(event.currentTarget.dataset.text);
	  	//console.log(this.data.serviveData.depCode);
	  	//console.log(this.data.serviveData.docNum);
	  	this.setData({
	  		eaId:event.currentTarget.dataset.text,
	  		userId:event.currentTarget.dataset.name,
	  		docNum:this.data.serviveData.docNum,
  		})
	     wx.navigateTo({
	      url: `../departmentDeta/departmentDeta?doctorId=${this.data.userId}&eaId=${this.data.eaId}&docNum=${this.data.docNum}&depCode=${this.data.serviveData.depCode}`,
	     })
 	},
 	morningBottn: function(event){
 		var data = event.currentTarget.dataset.name;
 		//console.log(data);
 		//console.log(data.name);
   		var departData = {
	  		name: data.name,
	  		userId:data.userId,
	  		title: data.depName2,
	  		eaId: data.eaId,
	  		depCode: this.data.serviveData.depCode,
	  		timeSlot: data.timeSlot,
	  		dayOfWeek: this.data.week,
	  		doctorSchedualId : data.doctorSchedualId,
			registerDate : this.data.dete,
			costMoney : data.morningCostMoney,
			hospitalServiceMoney : data.morningHospitalServiceMoney,
			department : data.department,
			proTitle : data.proTitle,
			costRemark: data.morningCostRemark,
			createName: data.createName,
		}
   		wx.setStorage({
		      key: 'depart',
		      data: departData,
		      success: function(res){
		        //console.log(res)
		      }
	    })
		wx.getStorage({
		  	key: 'depart',
		 	 success: function(res){
		      //console.log("储存的数据",res.data)
		  	} 
		})
   		wx.navigateBack({
		 	delta: 2,
		})
 },
 afternoonBottn: function(event){
 		var data = event.currentTarget.dataset.name;
 		//console.log(data);
 		//console.log(data.name);
   		var departData = {
	  		name: data.name,
	  		userId:data.userId,
	  		title: data.depName2,
	  		eaId: data.eaId,
	  		depCode: this.data.serviveData.depCode,
	  		timeSlot: data.timeSlot,
	  		dayOfWeek: this.data.week,
	  		doctorSchedualId : data.doctorSchedualId,
			registerDate : this.data.dete,
			costMoney : data.afternoonCostMoney,
			hospitalServiceMoney : data.afternoonHospitalServiceMoney,
			department : data.department,
			proTitle : data.proTitle,
			costRemark: data.afternoonCostRemark,
			createName: data.createName,
		}
   		wx.setStorage({
		      key: 'depart',
		      data: departData,
		      success: function(res){
		        //console.log(res)
		      }
	    })
		wx.getStorage({
		  	key: 'depart',
		 	 success: function(res){
		      //console.log("储存的数据",res.data)
		  	} 
		})
   		wx.navigateBack({
		 	delta: 2,
		})
 },
  /**
   * 页面的初始数据
   */
  data: {
  	 showView: true,
  	 depName: '',
  	 serviveData:'',
  	 page:1,
  	 rows:30,
  	 eaId:'',
  	 userId:'',
  	 key:'0',
  	 week:'',
  	 dete:'',
  	 serverListAll:[],
  	 serverListAll_One:[],
  	 dateList:[],
  	 serverItemMsg: {
      
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
//   onShareAppMessage: function () {
  
//   },
    
    matchingServiceDoc(){
	    let that = this;
	    wx.request({
	      url:app.globalData.requestUrl,
	      header:app.globalData.requestHeader,
	      method:"POST",
	      data:{
	          token: wx.getStorageSync("userInfo").token,
	          infoType:660124,
	          jsonValue: JSON.stringify({
	            	page: this.data.page,
					rows: this.data.rows,
					docType: "",
					searchValue: "",
					orderType: "",
					serviceWay: "",
					ignoreLogin: 1,
					lat: "",
					lon: "",
					eaId: this.data.serviveData.eaId,
					depCode: this.data.serviveData.depCode,
					registerDate: "",
					dayOfWeek: ""
	          })
	      },
	      success(res){
	          //console.log(res.data);
	          let depName1 = res.data.rows[0].department;
	          let depName2 = res.data.rows[0].departmentInfo
	          let depName = depName1 +'-'+ depName2;
	          //console.log(depName);
	          that.setData({
	          	serverListAll: res.data.rows,
	          	depName : depName,
	          })
	          
	      }
	     
	    })
	    wx.setNavigationBarTitle({
      		title: this.data.depName,
   		})
	     
	  },
	  
	   matchingServiceDoc_one(){
	    let that = this;
	    wx.request({
	      url:app.globalData.requestUrl,
	      header:app.globalData.requestHeader,
	      method:"POST",
	      data:{
	          token: wx.getStorageSync("userInfo").token,
	          infoType:660124,
	          jsonValue: JSON.stringify({
	            	page: this.data.page,
					rows: this.data.rows,
					docType: "",
					searchValue: "",
					orderType: "",
					serviceWay: "",
					ignoreLogin: 1,
					lat: "",
					lon: "",
					eaId: this.data.serviveData.eaId,
					depCode: this.data.serviveData.depCode,
					registerDate: this.data.dete,
					dayOfWeek: this.data.week,
	          })
	      },
	      success(res){
	          //console.log(res.data)
	          that.setData({
	          	serverListAll_One: res.data.rows,
	          }) 
	      }
	    })
	  },
    
  
})