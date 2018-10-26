var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    active2: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  tab: function (e) {
    var tab = e.currentTarget.dataset.sta;
    var tab2=this.data.active2;
    this.setData({
      active: tab
    })
    if (tab == 0) {
      this.setData({
        list: this.data.list1
      })
    } else if (tab == 1&&tab2==0) {
      this.setData({
        list: this.data.list21
      })
    } else if (tab == 1 && tab2 == 1) {
      this.setData({
        list: this.data.list22
      })
    } else if (tab == 2 && tab2 == 0) {
      this.setData({
        list: this.data.list31
      })
    } else if (tab == 2 && tab2 == 1) {
      this.setData({
        list: this.data.list32
      })
    }  

  },
  tab2: function (e) {
    var tab=this.data.active;
    var tab2 = e.currentTarget.dataset.stas;
    this.setData({
      active2: tab2
    })

    if (tab == 0) {
      this.setData({
        list: this.data.list1
      })
    } else if (tab == 1 && tab2 == 0) {
      this.setData({
        list: this.data.list21
      })
    } else if (tab == 1 && tab2 == 1) {
      this.setData({
        list: this.data.list22
      })
    } else if (tab == 2 && tab2 == 0) {
      this.setData({
        list: this.data.list31
      })
    } else if (tab == 2 && tab2 == 1) {
      this.setData({
        list: this.data.list32
      })
    }  
    
  },
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/ireferrals',
      data: { member_id: wx.getStorageSync("userinfo").uid },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          people:res.data.qq[0].member_down_line,
          list1:res.data.qq,
          list21: res.data.partner,
          list22: res.data.partner_money,
          list31: res.data.wechat,
          list32: res.data.wechat_money,
          list: res.data.qq
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