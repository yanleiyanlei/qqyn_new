// pages/m-charge/m-charge.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    remain: "",
    uid: "",
    all: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    that.setData({
      uid: uid
    })

    wx.request({
      url: app.globalData.Murl+'/Applets/User/top_up',
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        that.setData({
          remain: res.data.member_money
        })
      }
    })
  },
  choose: function (e) {
    var money = e.currentTarget.dataset.money;
    var other = e.currentTarget.dataset.other;
    this.setData({
      money: money,
      all: parseInt(other) + parseInt(money)
    })
  },
  pay: function () {
    var that = this;
    //console.log(that.data.all)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/AddCommec',
      data: { member_id: that.data.uid, seller_id: 1, itunes_money: that.data.money, money: that.data.all, pre_paid: 1 },
      method: "post",
      success: function (res) {
        console.log(res)
        if(res.data.status){
          wx.redirectTo({
            url: '/pages/mpay/mpay?money='+that.data.money+'&mdd=0&wz=0&orderNum='+res.data.data
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '系统繁忙',
          icon: 'none',
          duration: 1000
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
