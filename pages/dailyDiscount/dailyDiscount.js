const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataTitle: {
      name: "",
      showTip: false,
    },
    listData: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      listData: options.id
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
  onShow: function (options) {
    // var that = this;
    // var _urlshop = app.globalData.Murl + "/Applets/Index/getThemeById";
    // wx.request({
    //   url: _urlshop,
    //   data: {
    //     id: 2,
    //   },
    //   method: "post",
    //   success: function (res) {
    //     const dastas = res.data;
    //     // console.log(dastas);
    //     if (dastas.code == 200){
    //       that.setData({
    //         listData: dastas.data
    //       })
    //       //console.log(that.data.listData)
    //     }else{
    //       wx.showToast({
    //         title: '网络错误',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   }

    // })
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