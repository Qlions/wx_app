// pages/components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headerText:{
      type: String,
      value: "中国健康云"
    },
    addressName:{
        type: Object,
        value: ""
    },
    iconType:{
      type: String,
      value: "search"
    },
    iconSize:{
      type: Number,
      value: 20
    },
    iconColor:{
      type: String,
      value: "#fff"
    },
    isLocationShow:{
      type: Boolean,
      value: true
    },
    isSearchShow:{
      type:Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      locationServer(){
        //console.log(this.properties.addressName)
        let addressName = this.properties.addressName;
          wx.navigateTo({
              url: `/pages/serverLocation/serverLocation?adcode=${addressName.adcode}&lat=${addressName.lat}&lon=${addressName.lon}`,
          })
      }
  },
  a(e){
    e.preventDefault;
  }
})
