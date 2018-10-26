// pages/m-payPsw/m-payPsw.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  formSubmit: function (e) {
    var opsw = e.detail.value.opsw;
    var apsw = e.detail.value.apsw;
    var reg = new RegExp('^[0-9]{6}$')
    var that = this;
     //console.log(e.detail.value.opsw)
    // console.log(reg.exec(opsw))
    if (reg.exec(opsw)) {
      if (opsw == apsw) {
        wx.request({
          url: app.globalData.Murl+'/Applets/User/set_pwd',
          data: { member_id: that.data.uid, paypwd: opsw },
          method: "post",
          success: function (res) {
            console.log(res)
            if(res.data.status==1){//成功
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
              setTimeout(function () {
                wx.hideToast();
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }, 1000)
            } else if (res.data.status == 0){//失败
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000
              })
              setTimeout(function () {
                wx.hideToast();
              }, 1000)
            } else if (res.data.status == 2){//一致
              wx.showToast({
                title: res.data.msg,
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
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.hideToast();
            }, 1000)
          }
        })
      }else{
        wx.showToast({
          title: '两次密码不一致',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast();
        }, 1000)
      }
    }else{
      wx.showToast({
        title: '密码格式错误',
        icon:'none',
        duration:1000
      })
      setTimeout(function(){
        wx.hideToast();
      },1000)
    }
  },
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