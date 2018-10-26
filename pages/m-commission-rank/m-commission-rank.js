const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var dd = new Date();
    var year = dd.getFullYear();

    var month = dd.getMonth() + 1
    var day = dd.getDate()
    that.setData({
      tt:year+'.'+month+'.'+day
    })

    wx.request({
      url: app.globalData.Murl+'/Applets/User/commission_ran',
      data: { member_id: wx.getStorageSync("userinfo").uid},
      method:'post',
      success: function (res) {
        console.log(res)
        that.setData({
          info: res.data.mem_info,
          list:res.data.list
        })

      }
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