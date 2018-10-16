// pages/serverIndex/serverIndex.wxml.js
/**
 * Create 2018-4-18
 * 服务列表
 */
var amapFile = require("../../libs/amap-wx.js");
var gdmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //模块header参数
    headerCompValue:{
      headerText: "健康服务",
      isLocationShow: false,
      isSearchShow: false
    },
    serverListArr: [],
    serverMoneys:[],
    isHideLoadMore: false,
    pages: 8,
    resTrue: 2,
    searchVal:'',
    //从搜索进
    isSearch: '',
    noData: true,
    addressName: '',
    locationObjBack:[],
    top:{
        top: 0
    },
    //筛选请求数据
    FilterValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
      //初始化位置 
      //加载中
        wx.showLoading({
            title: "加载中...",
            mask: true
        })
        this.init_data_server_list();
        this.init_location();
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
    this.header = this.selectComponent("#header");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
        title: "加载中...",
        mask: true
    })
      if( this.data.isSearch == 'search'){
        
        this.searchFn();
        return false;
      }
    wx.hideLoading()
      
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
/**
 * 初始化数据 111180
 */
load_more(nums){
        if(this.data.resTrue == 1){
            this.setData({
                pages: this.data.pages += 8,
                resTrue: 2
            })
        }
        let that = this;
        let datas = {
            ignoreLogin: 1,
            platType: 2,
            page: 1,
            rows: this.data.pages,
            lon: app.globalData.locationData.lon,
            lat: app.globalData.locationData.lat,
            "d.serviceDictScopeCode": app.globalData.locationData.adcode
        }

        wx.request({
            url: app.globalData.requestUrl,
            data: {
                infoType: 111180,
                token: wx.getStorageSync("userInfo").token || "",
                jsonValue: JSON.stringify(datas)
            },
            method: 'POST',
            header: app.globalData.requestHeader,
            success(res) {
                
                //console.log(res)
                that.setData({
                    serverListArr: res.data.rows,
                    resTrue: 1
                });
                that.serverMon(res.data.rows)
               
            }
        })
    
    
    
   
   
},

/**
 *价格
 */
    serverMon(newVal) {
            let money = [];
            for (let i = 0; i < newVal.length; i++) {

                if (newVal[i].serviceMoneyMin == newVal[i].serviceMoneyMax) {
                    if (newVal[i].isHaveItems == "1") {
                        money.push(`￥${newVal[i].serviceDictMoney.toFixed(2)}`);
                    } else {
                        money.push(`￥${newVal[i].serviceDictMoney.toFixed(2)}`);
                    }
                } else {
                    money.push(`￥${newVal[i].serviceMoneyMin.toFixed(2)}+`);
                }

            }
            this.setData({
                serverMoneys: money
            })

        },

    onPullDownRefresh(){
        this.init_data_server_list();
        wx.showNavigationBarLoading() ;
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
    onReachBottom () {
        this.setData({
            isHideLoadMore: false
        });
        this.load_more();
        let that = this;
        setTimeout(() => {
            that.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },
    //搜索
    searchFn(){
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        //console.log(currPage)
        this.setData({
            searchVal: currPage.data.searchVal,
            isSearch: currPage.data.isSearch,
            locationObjBack: currPage.data.locationObjBack,
            ["FilterValue.searchValue"]: currPage.data.searchVal
            // addressName: currPage.data.locationObjBack.name  || currPage.data.locationObjBack.name || ''
        })
        app.globalData.locationData = currPage.data.locationObjBack;
        if (this.data.searchVal != "") {
            let dataValue = {
                platType: '2',
                searchValue: this.data.searchVal,
                // serviceDictType: '',
                // serviceDictWay: "",
                // sortDictMoney: "",
                // sortDictType: ''
            }
            let that = this;
            wx.request({
                url: app.globalData.requestUrl,
                data: {
                    infoType: 111180,
                    token: wx.getStorageSync("userInfo").token || "",
                    jsonValue: JSON.stringify(dataValue)
                },
                header: app.globalData.requestHeader,
                method: 'post',
                success: function (res) {
                    wx.hideLoading()
                    that.setData({
                        serverListArr: res.data.rows,
                        isSearch: ''
                    }, ()=>{
                        wx.hideLoading();
                    });
                    that.serverMon(res.data.rows)

                },
                fail: function (res) { },
                complete: function (res) { },
            })
        }else{
            
        }
    },

    myEventListener(e){
        wx.showLoading({
            title: "加载中...",
            icon: "loading"
        })
        let FilterValue = {};
        let that = this;
        for(var item in e.detail){
            if(e.detail[item] != ''){
                FilterValue[item] = e.detail[item];
            }
        }
        
        this.setData({
            FilterValue: FilterValue,
            ['FilterValue.lon']: this.data.addressName.lon,
            ['FilterValue.lat']: this.data.addressName.lat,
        })
        //console.log(FilterValue)
        wx.request({
            url: app.globalData.requestUrl,
            header: app.globalData.requestHeader,
            method: "POST",
            data:{
                infoType:111180,
                token:  wx.getStorageSync("userInfo").token ||"" ,
                jsonValue: JSON.stringify(FilterValue)
                },
            success(res){
                //console.log(res.data)
                that.setData({
                    serverListArr: res.data.rows
                },()=>{
                    wx.hideLoading();
                })
                that.serverMon(res.data.rows)
            }
        })
        
    },

    /**
     *  初始化位置
     */
    init_location(){
        var that = this;
        var gdmapsdk = new amapFile.AMapWX({
            key: app.globalData.gdmapsdk_key
        })
        gdmapsdk.getRegeo({
            success: function (data) {
              //成功回调
              app.globalData.locationData.name = data[0].name;
              app.globalData.locationData.province = data[0].regeocodeData.addressComponent.province;
              app.globalData.locationData.district = data[0].regeocodeData.addressComponent.district;
              app.globalData.locationData.city = data[0].regeocodeData.addressComponent.city;
              app.globalData.locationData.adcode = data[0].regeocodeData.addressComponent.adcode;
              app.globalData.locationData.lat = data[0].latitude;
              app.globalData.locationData.lon = data[0].longitude;
              that.setData({
                  ['addressName.name']: data[0].name,
                  ['addressName.province']: data[0].regeocodeData.addressComponent.province,
                  ['addressName.district']: data[0].regeocodeData.addressComponent.district,
                  ['addressName.city']: data[0].regeocodeData.addressComponent.city,
                  ['addressName.adcode']: data[0].regeocodeData.addressComponent.adcode,
                  ['addressName.lat']: data[0].latitude,
                  ['addressName.lon']: data[0].longitude
              })

             
              
           },
            fail: function (info) {
              //失败回调
              //console.log(info)
           }
        })
        
    },

    /**
    * 初始化数据 111180
    */
    init_data_server_list(){
        let that = this;
        let datas = {   
            ignoreLogin: 1,
            platType: 2,
            page: 1,
            rows: this.data.pages,
            lon: this.data.addressName.lon,
            lat: this.data.addressName.lat,
            "d.serviceDictScopeCode": this.data.addressName.adcode,
            sortDictType: 1,

        }
        wx.request({
            url: app.globalData.requestUrl,
            data: {
                infoType: 111180,
                token:  wx.getStorageSync("userInfo").token || "",
                jsonValue: JSON.stringify(datas)
            },
            method: 'POST',
            header: app.globalData.requestHeader,
            success(res) {
                //console.log(res)
                that.setData({
                    serverListArr: res.data.rows,
                    resTrue: 1
                });
                that.serverMon(res.data.rows)
                
            }
        })
    },

    //tap
    tap (e){
        let item = e.currentTarget.dataset;
        //console.log(item)
        wx.navigateTo({
            url: `/pages/purchaseService/purchaseService?${'serviceDictId='+item.servicedictid + '&eaName='+ item.eaname + '&imgUrl='+ item.imgurl+ '&serviceDictName=' +item.servicedictname + '&serviceMoney=' + item.servicemoney + '&serviceDictWay=' + item.servicedictway + '&serviceDictComponent=' + item.servicedictcomponent}`
        })
    }
})