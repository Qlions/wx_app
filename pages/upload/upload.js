// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textarea:"",//文本
    imgSrc:[], // 图片暂时
    imgFiles:[], //图片Files
  },
  /**
   * 获取文本框内容
   */
  bindtareatab (e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  /**
   * 上传图片方法imgFiles
   */
  upload () {
    let that = this;
    let arrImgSrc;
    let arrImgFile;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let tempFiles = res.tempFiles;
        //console.log(res)
        //console.log(tempFilePaths)
        for (let i = 0; i < tempFilePaths.length; i++) {
          arrImgSrc = that.data.imgSrc;
          arrImgFile = that.data.imgFiles;
          arrImgSrc.push(tempFilePaths[i]);
          arrImgFile.push(tempFiles[i]);
        } 
        that.setData({
          imgSrc: arrImgSrc,
          imgFiles: arrImgFile
        }) 
      }
    })
    
  },
  /**
   * 上传图片方法
   */
  uploadBtn () {
    if (this.data.textarea == ''){
      wx.showToast({
        title: '请你填写病情概念！',
        icon: 'none',
        duration: 2000
      })
    } else if ( this.data.textarea.length < 15 ){
      wx.showToast({
        title: '请输入不少于15个字',
        icon: 'none',
        duration: 2000
      })
    } else {
      let dataObj = {
        textarea: this.data.textarea,
        imgSrc: this.data.imgSrc,
        imgFiles: this.data.imgFiles,
      }
      wx.setStorage({
        key: "upload",
        data: dataObj,
        success:function(){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }
  },
  /**
   * 删除图片
   */
  removeImg (e) { 
    let index = e.currentTarget.dataset.index;
    let imgSrc = this.data.imgSrc; 
    let imgFiles = this.data.imgFiles; 
    imgSrc.splice(index, 1)
    imgFiles.splice(index, 1)
    this.setData({
      imgSrc: imgSrc,
      imgFiles: imgFiles
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getStorage({
      key: 'upload',
      success: function (res) {
        //console.log(res.data)
        that.setData({
          textarea: res.data.textarea,
          imgSrc: res.data.imgSrc
        })
      }
    })
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
  
  // }
})