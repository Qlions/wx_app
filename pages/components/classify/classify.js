// pages/components/classify/classify.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
      classText: [
          {
             value: "慢病防控",
             text: '慢病防控',
             imageSrc: "../../../image/service_manbing.png",
             type: "ST007"
         },
         {
             value: "医护上门",
             text: '医护上门',
             imageSrc: "../../../image/service_docAnurse.png",
             type: "ST001"
         },
         {
             value: "就医陪诊",
             text: '就医陪诊',
             imageSrc: "../../../image/service_jiuyi.png",
             type: 'ST003'
         },
         {
             value: "中医调理",
             text: '中医调理',
             imageSrc: "../../../image/service_CH_doctor.png",
             type: 'ST004'
         },
         {
             value: "专家咨询",
             text: "专家咨询",
             imageSrc: "../../../image/service_expertTalk.png",
             type: 'ST010'
         }
      ],
      OptList: [
          {
              value: "综合",
              imageSrcDown: "../../../image/arrow-down.png",
              imageSrcUp: "../../../image/arrow-up.png",
              ListID: 1,
              type: '',
              childList:[
                  {
                      childValue: "综合排序",
                      chilListID: 0,
                      text: "综合",
                      type: '1',
                  },
                  {
                      childValue: "离我最近",
                      chilListID: 1,
                      text: "距离",
                      type: '2',
                  },
                  {
                      childValue: "销量最多",
                      chilListID: 2,
                      text: "销量",
                      type: '4',
                  },
                  {
                      childValue: "评价优先",
                      chilListID: 3,
                      text: "评价",
                      type: '5',
                  },

              ]
          },
          {
              value: "价格",
              imageSrcDown: "../../../image/arrow-down.png",
              imageSrcUp: "../../../image/arrow-up.png",
              ListID: 2,
              type: '1',
          },
          {
              value: "类型",
              imageSrcDown: "../../../image/arrow-down.png",
              imageSrcUp: "../../../image/arrow-up.png",
              ListID: 3,
              type: '',
              childList: [
                  {
                      childValue: "全部",
                      chilListID: 1,
                      text: "全部",
                      type: ''
                  },
                  {
                      childValue: "图文咨询",
                      chilListID: 1,
                      type: '1',
                      text: "图文"
                  },
                  {
                      childValue: "门诊(店)服务",
                      chilListID: 1,
                      type: '3',
                      text: "门诊(店)"
                  },
                  {
                      childValue: "上门服务",
                      chilListID: 1,
                      type: '2',
                      text: "上门"
                  },

              ]
          },
          {
              value: "全部",
              imageSrcDown: "../../../image/arrow-down.png",
              imageSrcUp: "../../../image/arrow-up.png",
              ListID: 4,
              type: '',
              childList: [
                  {
                      childValue: "全部",
                      chilListID: 1,
                      
                  },
                  {
                      childValue: "慢病防控",
                      chilListID: 1,
                      type: "ST007"
                  },
                  {
                      childValue: "医护上门",
                      chilListID: 1,
                      type: "ST001"
                  },
                  {
                      childValue: "就医陪诊",
                      chilListID: 1,
                      type: 'ST003'
                  },
                  {
                      childValue: "康复理疗",
                      chilListID: 1,
                      type: 'ST004'
                  },
                  {
                      childValue: "专家咨询",
                      chilListID: 1,
                      type: 'ST010'
                  }
                ]
            }
      
        ],
      childListShow: true,
      _num: '',
     maskShow: true,
     maskView: false,
     targetNode: "",
     priceImg: true,
     data:{
        page : "1",
        platType:'2',
        rows:"10",
        'd.serviceDictScopeCode' : ''
     }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    bindMask(){
        this.setData({
            childListShow: true,
            maskShow: true
        })
    },
    touchItem(e){
        //console.log(e.currentTarget.dataset.num, this.data._num)
        if (this.data._num != e.currentTarget.dataset.num) {
            //console.log(e)
        }
        //点击变颜色
        this.setData({
            _num: e.currentTarget.dataset.num
        });
        if (this.data.childListShow){
            this.setData({
                childListShow: false
            })
        }else{
            this.setData({
                childListShow: true
            })
        }
        if (e.currentTarget.dataset.num == 1) {
            
            this.setData({
                maskShow: true,
                priceImg: !this.data.priceImg,
                ['OptList[' + e.currentTarget.dataset.num +'].type']: this.data.priceImg ? "1" : "2",
            })
            this.targetNodeFn()
           
        }else {
             this.setData({
                maskShow: false
            })
        }
        
    },
    targetNodeFn(e){
        //console.log(e)
        if(!e){
            //console.log("price")
            //筛选
            let that = this;
            let str = "d.serviceDictScopeCode";
            let data = {
                page : "1",
                platType:'2',
                rows:"10",
                'd.serviceDictScopeCode' : app.globalData.locationData.adcode,
                serviceDictWay :that.data.OptList[2].type,
                sortDictType :that.data.OptList[0].type,
                typeCode:that.data.OptList[3].type,
                sortDictMoney: that.data.OptList[1].type,
            }
            that.setData({
                data: data
            })
            this.triggerEvent('myClassify', this.data.data)
            return false;
        }
        let that = this;
        let opListNum = e.target.dataset.numbers;
        let opListtext = e.target.dataset.txt ||  e.target.dataset.text;
        let opListScope = e.target.dataset.dictscope;
        that.setData({
            ['OptList[' + opListNum +'].value']: opListtext,
            ['OptList[' + opListNum +'].type']: opListScope
        }, () => {
            that.setData({
                maskShow: true
            })
        })
        //筛选
        let str = "d.serviceDictScopeCode";
        let data = {
            page : "1",
            platType:'2',
            rows:"10",
            'd.serviceDictScopeCode' : app.globalData.locationData.adcode,
            serviceDictWay :that.data.OptList[2].type,
            sortDictType :that.data.OptList[0].type,
            typeCode:that.data.OptList[3].type,
            sortDictMoney: that.data.OptList[1].type,
        }
        that.setData({
            data: data
        })
        this.triggerEvent('myClassify', this.data.data)
    },
    targetType(event){
        let data = {
            page : "1",
            platType:'2',
            rows:"10",
            'd.serviceDictScopeCode' : app.globalData.locationData.adcode,
            serviceDictWay :this.data.OptList[2].type,
            sortDictType :this.data.OptList[0].type,
            typeCode:event.currentTarget.dataset.type.type,
            sortDictMoney: this.data.OptList[1].type,
        }
        this.setData({
            ['OptList[3].value']: event.currentTarget.dataset.type.value,
            ['OptList[3].type']: event.currentTarget.dataset.type.type,
            data: data
        })
        this.triggerEvent('myClassify', this.data.data)
      }
  }
 
})




