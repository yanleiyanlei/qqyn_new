const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ims:[],
    page:'0',
    pd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Fx/more",
      data: {
        page: "0",
        uid: wx.getStorageInfoSync().uid,
        from:'x'
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.pd);
        console.log(res.data.img);
        that.setData({
          pd: res.data.pd,
          ims: res.data.img,
        })
      }
    })
  },
  jiazai:function(){
    var that = this;
    var page = that.data.page;
    page+=1;
    console.log()
    wx.request({
      url: app.globalData.Murl + "/Applets/Fx/more",
      data: {
        page: page,
        uid: wx.getStorageInfoSync().uid,
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.pd);
        console.log(res.data.img);
        that.setData({
          pd: res.data.pd,
          page:page
        })

        for (let i = 0; i < res.data.img.length; i++) {
          that.data.ims.push(res.data.img[i])
        }
        that.setData({
          ims: that.data.ims
        })
      }
    })
  },
  previewImg: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var ims = that.data.ims;
    wx.previewImage({
      current: ims[index],     //当前图片地址
      urls: ims,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
  onShareAppMessage: function () {
    
  }
})