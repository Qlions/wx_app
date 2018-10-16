// pages/components/serverItem/serverItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    serverListArr:{
        type: Array,
        value: ''
    },
    serverMoneys:{
        type: Array,
        value: ""
    },
    noData:{
        type: Boolean,
        value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      backUrl: 'https://www.zgjky.cn//upload/safe-files///10338951/ea_service/image/2018-04-18/f72ef6851524019415766_c.png',
      
  },

  /**
   * 组件的方法列表
   */
  methods: {
      transitionend () {
          //console.log("aaaa")
      },
      
  },
  
 
})

