// pages/cash/cash.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    add: "哈哈哈哈哈",
    switchindex: 0, // 判断显示微信还是余额提现 0==微信提现  1==余额提现
    userxinxi: [], //用户可提现信息
    weixintotal: " ", //微信提现金额
    yuertotal: " ", //余额提现金额
    weixintotalpro: "0.00", //微信提现手续费
    username: " ", //收款人姓名
    userphone: " ", //收款人电话
    useridea: " ", //收款人身份证号码
    usercount: " ", //收款人微信账号
  },

  //切换提现方式
  switchnav: function(e) {
    var ind = e.currentTarget.dataset.index;
    if (ind == 0) {
      this.setData({
        switchindex: 0
      })
    } else {
      this.setData({
        switchindex: 1
      })
    }
  },
  //查看提现明细
  tomwithdrawd: function() {
    wx.navigateTo({
      url: '/pages/m-withdraw-d/m-withdraw-d',
    })
  },

  //微信提现总额
  totalall: function(e) {
    var sun = Number(e.detail.value);
    var sunbai = 0
    // console.log(sun);
    this.setData({
      weixintotal: sun
    })
    if (sun <= 100) {
      sunbai = Number(1.0).toFixed(2);
    } else {
      sunbai = Number(sun * 0.01).toFixed(2);
    }

    this.setData({
      weixintotalpro: sunbai
    })
  },
  //余额提现总额
  totalalls: function(e) {
    var sun = Number(e.detail.value);
    var sunbai = 0
    // console.log(sun);
    this.setData({
      yuertotal: sun
    })
  },
  // 收款人姓名
  subname: function(e) {
    var username = e.detail.value;
    this.setData({
      username: username
    })
    // console.log(this.data.username);
  },
  //收款人电话
  subphone: function(e) {
    var userphone = e.detail.value;
    this.setData({
      userphone: userphone
    })
    // console.log(this.data.userphone);
  },
  //收款人身份证号码
  subidea: function(e) {
    var useridea = e.detail.value;
    this.setData({
      useridea: useridea
    })
    // console.log(this.data.useridea);
  },
  //收款人微信账号
  subcount: function(e) {
    var usercount = e.detail.value;
    this.setData({
      usercount: usercount
    })
    // console.log(this.data.usercount);
  },
  //微信提现
  submit: function() {
    var _this = this;
    var uid = wx.getStorageSync("userinfo").uid;
    var weixintotal = _this.data.weixintotal; //提现金额
    var canusertotal = _this.data.userxinxi.sur_amt //本月剩余可提现额度
    var weixintotalpro = _this.data.weixintotalpro //微信提现手续费
    var username = _this.data.username; //收款人姓名
    var userphone = _this.data.userphone; //收款人电话
    var useridea = _this.data.useridea; //收款人身份证号码
    var usercount = _this.data.usercount; //收款人微信账号
    var testname = /^[\u4e00-\u9fa5]+$/; //判断输入汉字正则
    var testphone = /^1[34578]\d{9}$/; //判断手机号正则
    var testidea = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //判断身份证正则

    if (weixintotal == " " || username == " " || userphone == " " || useridea == " " || usercount == " ") {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (Number(weixintotal) < 30) {
      wx.showToast({
        title: '提现金额最低为30元',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (isNaN(weixintotal) || weixintotal % 10 != 0) {
      wx.showToast({
        title: '提现金额必须为10的倍数',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!testname.test(username)) {
      wx.showToast({
        title: '姓名必须为汉字',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!testphone.test(userphone)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!testidea.test(useridea)) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: app.globalData.Murl + '/Applets/User/SaveCommission',
      data: {
        member_id: uid, //用户id
        jine: weixintotal, //微信提现金额
        service_charge: weixintotalpro, //微信提现手续费
        withdrawal_path: 1, //体现类型 1=微信  3=余额
        id_number: useridea, //收款人身份证号
        payee: username, //收款人姓名
        phone: userphone, //收款人手机号
        cash_account: usercount, //收款人微信号
        sur_amt: _this.data.userxinxi.sur_amt, //本月剩余提现额度
        total: _this.data.userxinxi.select[0].ktxyj, //可提现总额度
        max_cunt: _this.data.userxinxi.max_quota, //最大提现额度
        min_cunt: _this.data.userxinxi.selec[0].withdrawdesign_small //最小提现额度
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success: function(res) {
        console.log(res.data);
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/m-withdraw-s/m-withdraw-s?path=1&money=' + weixintotal + '&number=' + usercount,
          })
        } else {
          wx.showToast({
            title: res.data.content,
            icon: 'none',
            duration: 1000
          })
        }

      },
      fail: function() {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  submity: function() {
    var _this = this;
    var uid = wx.getStorageSync("userinfo").uid;
    var yuertotal = _this.data.yuertotal;
    if (isNaN(yuertotal) || yuertotal < 0) {
      wx.showToast({
        title: '请填写正确的金额',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: app.globalData.Murl + '/Applets/User/SaveCommission',
      data: {
        member_id: uid, //用户id
        jine: yuertotal, //余额提现金额
        withdrawal_path: 3, //体现类型 1=微信  3=余额
        sur_amt: " ", //本月剩余提现额度
        total: _this.data.userxinxi.select[0].ktxyj, //可提现总额度
        max_cunt: " ", //最大提现额度
        min_cunt: " " //最小提现额度
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success: function(res) {
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/m-withdraw-s/m-withdraw-s?path=3&money=' + yuertotal,
          })
        } else {
          wx.showToast({
            title: res.data.content,
            icon: 'none',
            duration: 1000
          })
        }

      },
      fail: function() {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid);
    wx.request({
      url: app.globalData.Murl + '/Applets/User/WeChatwithdrawa',
      data: {
        member_id: uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success: function(res) {
        _this.setData({
          userxinxi: res.data,
          username: res.data.payment_info.payee, //收款人姓名
          userphone: res.data.payment_info.phone, //收款人电话
          useridea: res.data.payment_info.id_number, //收款人身份证号码
          usercount: res.data.payment_info.cash_account, //收款人微信账号
        })
      },
      fail: function() {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})