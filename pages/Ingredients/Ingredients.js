// pages/Ingredients/Ingredients.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iserweima:false,
    showAlert:false,
    com_val:'',
    showMask:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  link: function () {
    wx.makePhoneCall({
      phoneNumber: '4006881602', //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
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
  bindFormSubmit:function(e){
    let com_val = e.detail.value.com_input;
    let tel_val = e.detail.value.tel_input;
    let add_val = e.detail.value.textarea;
    let that = this;
    if (com_val == '' || tel_val == "" || add_val == "") {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/.test(tel_val)) && !/^(\d{3,4}\-)?\d{7,8}$/.test(tel_val) && !/^400[0-9]{7}$/
      .test(tel_val)) {
      wx.showToast({
        title: '手机号码格式有误！',
        icon:'none'
      })
    } else {
      let param = {
        company: com_val,
        phone: tel_val,
        address: add_val
      }
      wx.request({
        url: app.globalData.Murl + '/Applets/Bapi/foods',
        data:param,
        method:'POST',
        success:function(res){
          console.log(res)
          
          if (res.data.status == 1) {
            that.setData({
              showAlert:true,
              com_val:'',
              showMask:false
            })
          }
        }
      })
    }
  },
  imgClose:function(){
    this.setData({
      iserweima:false
    })
  },
  close: function () {
    this.setData({
      showAlert: false,
      showMask: true
    })
  },
  onerweima:function(){
    this.setData({
      iserweima:true
    })
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