// pages/serverNotice/serverNotice.js
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	createName:'',
  	title:'',
  	proTitle:'',
  	department:'',
  	 timeSlot:'',
  	 timeName:'',
  	 registerDate:'',
		 costMoney :'',
		 hospitalServiceMoney:'',
  	 doctorSchedualId:'',
  	 dayOfWeek:'',
  	 doctorCost:'',
  	 ids:'-1',
  	 idx:'-1',
  	 depCode:'',
  	 eaId:'',
  	 depName2:'',
  	 userId:'',
  	 name:'',
  	 serviveData:'',
  	 serverListAll:[],
  	 serverItemMsg: {
      docNum:'',
    },
  	 tempServicePerson: {
      isCheckbox: true,
      imageUrl: "../../image/icon-unauthorized.png",
      serverPersonData: '',
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
    	docNum:options.docNum,
      serviveData: options,
//    ['tempServicePerson.playType']: options.type
    })
    //console.log(this.data.docNum);
    this.matchingServiceDoc();
    this.init();
  
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
  		wx.showLoading({
        title: "加载中..."
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
  
  // },
   matchingServiceDoc(){
    let that = this;
    wx.request({
      url:app.globalData.requestUrl,
      header:app.globalData.requestHeader,
      method:"POST",
      data:{
          token: wx.getStorageSync("userInfo").token,
          infoType:660101,
          jsonValue: JSON.stringify({
            userId: this.data.serviveData.doctorId,
            page: 1,
            rows: 30
          })
      },
      success(res){
          //console.log(res.data);
          //console.log(res.data.createName);
          that.setData({
          	serverItemMsg: res.data,
						name: res.data.name,
						userId: res.data.userId,
						depName2: res.data.departmentInfo,
						eaId: res.data.eaId,
						department:res.data.department,
						proTitle: res.data.proTitle,
						createName: res.data.createName,
          })
            //console.log(res.data.name);
            
             wx.setNavigationBarTitle({
      					title: res.data.name,
   					})
      }
     
   
    })

  },
  init(){
    let that = this;
    wx.request({
      url:app.globalData.requestUrl,
      header:app.globalData.requestHeader,
      method:"POST",
      data:{
          token: wx.getStorageSync("userInfo").token,
          infoType:660122,
          jsonValue: JSON.stringify({
          	eaId: this.data.serviveData.eaId,
            doctorId: this.data.serviveData.doctorId,
            page: 1,
            rows: 30,
            showValid:'1',
          })
      },
      success(res){
          //console.log(res.data)
          that.setData({
          	serverListAll: res.data.rows,
          }, ()=>{
          	wx.hideLoading();
          })
          
          
      }
    })
  },
  btnTop:function(){
  	if(this.data.timeName == ""){
  		//console.log("没有选择时间");
  		return false;
  	}
  	let timeSlot;
  	if(this.data.timeName == '上午'){
					timeSlot = 1;
		}else {
					timeSlot = 2;
		}
		this.setData({
	        timeSlot: timeSlot,
	   })
  	//console.log(1);
  	var departData = {
  		name: this.data.name,
  		userId:this.data.userId,
  		title: this.data.depName2,
  		eaId: this.data.eaId,
  		depCode: this.data.serviveData.depCode,
  		timeSlot: this.data.timeSlot,
  		dayOfWeek: this.data.dayOfWeek,
  		doctorSchedualId : this.data.doctorSchedualId,
			registerDate : this.data.registerDate,
			costMoney : this.data.costMoney,
			hospitalServiceMoney : this.data.hospitalServiceMoney,
			department : this.data.department,
			proTitle : this.data.proTitle,
			costRemark:this.data.costRemark,
			createName: this.data.createName,
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
		 delta: 3,
		})
  	
 },
//上午
  morning:function(event){
  	//console.log(event.currentTarget.dataset.name);
  	//console.log(event.currentTarget.dataset.index);
  	var item = event.currentTarget.dataset.name;
  	//console.log("上午");
  	this.setData({
	         idx: event.currentTarget.dataset.index,
	         ids: "-1",
	         dayOfWeek:item.dayOfWeek,
	         doctorSchedualId : item.doctorSchedualId,
					 registerDate : item.registerDate,
					 costMoney : item.morningCostMoney,
					 hospitalServiceMoney : item.morningHospitalServiceMoney,
					 timeName : "上午",
					 costRemark : item.morningCostRemark,
	   	})
  	var timeDate = {
  		dayOfWeek: this.data.dayOfWeek,
  		doctorSchedualId : this.data.doctorSchedualId,
			registerDate : this.data.registerDate,
			costMoney : this.data.costMoney,
			hospitalServiceMoney : this.data.hospitalServiceMoney,
			costRemark: this.data.costRemark,
			createName: this.data.createName,
  	}
  	wx.setStorage({
      key: 'time',
      data: timeDate,
      success: function(res){
        //console.log(res)
      }
    })
  	wx.getStorage({
	 	 key: 'time',
	  	success: function(res){
	      //console.log("储存的数据",res.data)
	  	} 
		})
  },
//下午
  afternoon:function(event){
  	//console.log(event.currentTarget.dataset.name);
  	//console.log(event.currentTarget.dataset.index);
  	//console.log("下午");
  	var item = event.currentTarget.dataset.name;
  	this.setData({
	         ids: event.currentTarget.dataset.index,
	         idx: "-1",
	         dayOfWeek:item.dayOfWeek,
	         doctorSchedualId : item.doctorSchedualId,
					 registerDate : item.registerDate,
					 costMoney : item.morningCostMoney,
					 hospitalServiceMoney : item.morningHospitalServiceMoney,
					 timeName : "下午",
					 costRemark : item.afternoonCostRemark,
				
	  })
  	var timeDate = {
  		dayOfWeek: this.data.dayOfWeek,
  		doctorSchedualId : this.data.doctorSchedualId,
			registerDate : this.data.registerDate,
			costMoney : this.data.costMoney,
			hospitalServiceMoney : this.data.hospitalServiceMoney,
			costRemark:this.data.costRemark,
			createName: this.data.createName,
  	}
  	
  	wx.setStorage({
      key: 'time',
      data: timeDate,
      success: function(res){
        //console.log(res)
      }
    })
  	wx.getStorage({
	 	 key: 'time',
	  	success: function(res){
	      //console.log("储存的数据",res.data)
	  	} 
		})
  
  },

})