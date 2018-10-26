// pages/gift-charge/gift-charge.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: 0,
    uid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       uid: wx.getStorageSync("userinfo").uid
     })
  },
  focus: function (e) {
    var sta = e.currentTarget.dataset.sta;
    this.setData({
      sta: sta
    })
    
  },
  blur:function(){
    this.setData({
      sta: 0
    })
  },

  inputChange: function (e) {
    var val = e.detail.value.replace(/\s+/g, "");

    var l = val.length;

    var sta = parseInt(this.data.sta) + 1;
    //console.log(sta);

    if (l >= 8) {
      this.setData({
        sta: sta
      })
    }
   
    return val
  },
  formSubmit:function(e){
    var val=e.detail.value;
    //var card_number=val.cart1+val.cart2+val.cart3;
    //var pwd=val.pwd1+val.pwd2;
    var pwd = val.pwd1;
    var that=this;

    // console.log(pwd)
    // console.log(that.data.uid)
    wx.request({
      url: app.globalData.Murl +'/Applets/User/third_exchange',
      data: { member_id: that.data.uid, from: 'xcx', code:pwd},
      method:"post",
      success:function(res){
        console.log(res);
        if (res.data == 1) {//未
          wx.showToast({
            title: '兑换失败',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast();
          }, 2000)
        } else if (res.data == 2) {//成功
          wx.showToast({
            title: '兑换成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast();
            wx.redirectTo({
              url: '/pages/m-coupon/m-coupon',
            })
          }, 2000)
        } else if (res.data== 3) {//繁忙
          wx.showToast({
            title: '大哥，你歇一会儿吧',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.hideToast();
          }, 1000)
        } 

      },
      fail:function(){
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })
        wx.showToast({
          title: res.data.data,
          icon: "none",
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
