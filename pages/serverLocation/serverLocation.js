// pages/serverLocation/serverLocation.js
var amapFile = require("../../libs/amap-wx.js");
var gdmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //当前城市信息
      addressMsg: {
          province:'',
          adcode: '',
          city:'',
          district:''
      },
      //输入匹配
      inputSearchArr: [],
      inputSearchShow: false,
      //搜索历史记录
      historySearch: [],
      locationObjBack: [],
    //   当前选择
      region: [],
      //省级
      cityList:[],
    //   市级
      townList: [],
    //   县级
      countyList:[],
      //mask
      isMaskShow: true,
      isTouchHistory: false,
      isLocation: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //console.log(options)
      this.getLocation();
      this.initCity();
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
    //渲染历史列表
    this.renderHistory()
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
  //获取当前位置
  getLocation(){
      //console.log(app.globalData.locationData)
      if (app.globalData.locationData){
          let province = 'addressMsg.province';
          let district = 'addressMsg.district';
          let city = 'addressMsg.city';
          let adcode = 'addressMsg.adcode';
          let name = 'addressMsg.name';
          let lon = 'addressMsg.lon';
          let lat = 'addressMsg.lat';
          this.setData({
              [province]: app.globalData.locationData.province || '',
              [district]: app.globalData.locationData.district || '',
              [city]: app.globalData.locationData.city || '',
              [adcode]: app.globalData.locationData.adcode,
              [name]: app.globalData.locationData.name,
              [lat]: app.globalData.locationData.lat || '',
              [lon]: app.globalData.locationData.lon || '',
              cityCode: app.globalData.locationData.adcode
          }) 
      }else{
          var that = this;
          var gdmapsdk = new amapFile.AMapWX({
              key: app.globalData.gdmapsdk_key
          })
          gdmapsdk.getRegeo({
              success: function (data) {
                  //成功回调
                  //console.log(data)
                  let province = 'addressMsg.province';
                  let district = 'addressMsg.district';
                  let city = 'addressMsg.city';
                  let adcode = 'addressMsg.adcode';
                  let name = 'addressMsg.name';
                  let lon = 'addressMsg.lon';
                  let lat = 'addressMsg.lat';
                  that.setData({
                       [province]: data[0].regeocodeData.addressComponent.province,
                       [district]: data[0].regeocodeData.addressComponent.district,
                       [name]: data[0].name,
                       [city]: data[0].regeocodeData.addressComponent.city,
                       [adcode]: data[0].regeocodeData.addressComponent.adcode,
                       [lat]: data[0].latitude,
                       [lon]: data[0].longitude,
                    //    cityCode: app.globalData.locationData.regeocodeData.addressComponent.adcode
                  }) 
              },
              fail: function (info) {
                  //失败回调
                  //console.log(info)
              }
          })

      }
      
  },
//   点击获取当前地址
    getLocationAddress(e){
        var that = this;
        var gdmapsdk = new amapFile.AMapWX({
            key: app.globalData.gdmapsdk_key
        })
        gdmapsdk.getRegeo({
            success: function (data) {
                //成功回调
                //console.log(data)
                let province = 'addressMsg.province';
                let district = 'addressMsg.district';
                let city = 'addressMsg.city';
                let adcode = 'addressMsg.adcode';
                let name = 'addressMsg.name';
                let lon = 'addressMsg.lon';
                let lat = 'addressMsg.lat';
                that.setData({
                    [province]: data[0].regeocodeData.addressComponent.province,
                    [district]: data[0].regeocodeData.addressComponent.district,
                    [name]: data[0].name,
                    [adcode]: data[0].regeocodeData.addressComponent.adcode,
                    cityCode: data[0].regeocodeData.addressComponent.adcode,
                    [city]: data[0].regeocodeData.addressComponent.city,
                    [lat]: data[0].latitude,
                    [lon]: data[0].longitude,
                    inputSearchArr: [],
                    inputSearchShow: false
                })
            },
            fail: function (info) {
                //失败回调
                //console.log(info)
            }
        })
    },
    // 输入时获取pol
    getPolAdderss(e){
        let keywords = e.detail.value;
        var that = this;
        var gdmapsdk = new amapFile.AMapWX({
            key: app.globalData.gdmapsdk_key
        })
        gdmapsdk.getInputtips({
            keywords: keywords,
            city: that.data.cityCode,
            citylimit:true,
            success: function (data) {
                //成功回调
                //console.log(data)
                that.setData({
                    inputSearchArr: data.tips,
                    inputSearchShow: true,
                    isTouchHistory: true,
                    ['addressMsg.adcode']: ''
                })
               
            },
            fail: function (info) {
                //失败回调
                //console.log(info)
            }
        })
    },
    //清空
    emptyVal(){
        this.setData({
            ['addressMsg.name']: ''
        })

    },
    //搜索记录
    inputSearchCatch(e){
        let itemArr = e.currentTarget.dataset.item;
        let name = 'addressMsg.name';
        let province = 'addressMsg.province';
        let district = 'addressMsg.district';
        let city = 'addressMsg.city';
        let adcode = 'addressMsg.adcode';
        let lon = 'addressMsg.lon';
        let lat = 'addressMsg.lat';
        //console.log(itemArr)
        this.setData({
            [name]: itemArr.name,
            [province]: itemArr.province || '',
            [district]: itemArr.district|| '',
            [city]: itemArr.city || "",
            [lon]: itemArr.location != '' ? itemArr.location.split(',')[0] : '',
            [lat]: itemArr.location != '' ? itemArr.location.split(',')[1] : '',
            [adcode]: itemArr.adcode
        })
        for (let i = 0; i < this.data.historySearch.length; i++){
            if (itemArr.name == this.data.historySearch[i].name){
                return false;
            }
        }
        let storageIput = wx.getStorageSync("inputSearch");
        let index = 'historySearch[' + this.data.historySearch.length + ']';
        this.setData({
            [index]: itemArr
        })
        wx.setStorage({
            key: 'inputSearch',
            data: this.data.historySearch
        })
    },
    // 渲染历史记录
    renderHistory(){
        let that = this;
        wx.getStorage({
            key: 'inputSearch',
            success: function(res) {
                that.setData({
                    historySearch: res.data.reverse()
                })
            },
        })
    },
    //清空历史记录
    clearStorageHistory(){
        wx.removeStorageSync("inputSearch");
        this.setData({
            historySearch: []
        })
    },
    //开始搜索
    startSearch(){
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        if (this.data.addressMsg.adcode == "" && this.data.inputSearchShow){
            //console.log('a')
            prevPage.setData({
                locationObjBack: this.data.inputSearchArr[0],
                isLocation: this.data.isLocation
            })
            app.globalData.locationData = this.data.inputSearchArr[0];
        } else if (this.data.addressMsg.adcode == "" && !this.data.inputSearchShow){
            //console.log('b')
            prevPage.setData({
                locationObjBack: this.data.historySearch[0],
                isLocation: this.data.isLocation
            })
            app.globalData.locationData = this.data.historySearch[0];
        } else if (this.data.addressMsg.name == ''){
            // //console.log(this.data.historySearch[0])
            prevPage.setData({
                // locationObjBack: this.data.historySearch[0],
                isLocation: this.data.isLocation
            })
            app.globalData.locationData = this.data.historySearch[0];
        }else{
            //console.log('c')
            prevPage.setData({
                addressName: this.data.addressMsg,
                isLocation: this.data.isLocation
            })
            app.globalData.locationData = this.data.addressMsg;
        }
        wx.navigateBack({
            delta: 1
        })
    },
    //历史记录点击
    locationlist(e){
        let locationVal = e.currentTarget.dataset.locationval;
        //console.log(locationVal)
        var that = this;
        let province = 'addressMsg.province';
        let district = 'addressMsg.district';
        let city = 'addressMsg.city';
        let adcode = 'addressMsg.adcode';
        let name = 'addressMsg.name';
        let lon = 'addressMsg.lon';
        let lat = 'addressMsg.lat';
        that.setData({
            [province]: '',
            [district]: locationVal.district,
            [name]: locationVal.name,
            [lon]: locationVal.location != '' ? locationVal.location.split(',')[0] : '',
            [lat]: locationVal.location != '' ? locationVal.location.split(',')[1] : '',
            [city]: locationVal.city || "",
            [adcode]: locationVal.adcode,
            cityCode: locationVal.adcode
        })
    },
    // 初始化城市列表
    initCity(){
        let that = this;
        wx.request({
            url: app.globalData.requestUrl,
            data:{
                jsonValue: JSON.stringify({nodeParent: 0}),
                infoType: 111114,
                token: "1"
            
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
               that.setData({
                   cityList: res.data
               })
            }
        })
    },
    changeCity (e) {
        let dictAreaCacheList = this.data.cityList.dictAreaCacheList[e.detail.value[0]];
        let that = this;
        //省级
        wx.request({
            url: app.globalData.requestUrl,
            data:{
                jsonValue: JSON.stringify({ nodeParent: dictAreaCacheList.nodeCode }),
                token: "1",
                infoType: 111114
            },
            method: 'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
                that.setData({
                    townList: res.data.dictAreaCacheList,
                })
                let townList1 = that.data.townList[e.detail.value[1]];
                let nodeList1 = 'region[1]';
                that.setData({
                    [nodeList1]: townList1,
                    ['addressMsg.city']: townList1.nodeName
                })
                //获取市级
                let townList = that.data.townList[e.detail.value[1]]
                 wx.request({
                    url: app.globalData.requestUrl,
                    data:{
                        jsonValue: JSON.stringify({ nodeParent: townList.nodeCode }),
                        token: "1",
                        infoType: 111114
                    },
                    method: 'POST',
                    header:{
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(res){
                        that.setData({
                            countyList: res.data.dictAreaCacheList
                        })
                        let nodeList2 = 'region[2]';
                        let countyList2 = that.data.countyList[e.detail.value[2]];
                        that.setData({
                            [nodeList2]: countyList2,
                            ['addressMsg.district']: countyList2.nodeName || '',
                            ['addressMsg.adcode']: countyList2.nodeCode || '',
                            ['addressMsg.name']:'' ,
                            cityCode: countyList2.nodeCode,
                        })
                    }
        })
            }
        })
        
        let nodeList0 = 'region[0]';
        this.setData({
            [nodeList0]: dictAreaCacheList,
            ['addressMsg.province']: dictAreaCacheList.nodeName
        })

        // setTimeout( () => {
        //     that.setData({
        //         isMaskShow: true
        //     })
        // },10000)
    },
    changeAddressShow(){
        this.setData({
            isMaskShow: false
        })
    },
    hiddenMask(e){
        
        this.setData({
            isMaskShow: true
        })
    },
    preventD(){
    //   滚动穿透
    }
})