// pages/special2/special2.js
const app = getApp();
var user = require("../../lib/js/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textShow: false,
    changeClass: '',
    peachTxt: false,
    //isPeach:false,  好像没啥用了
    goodsInfoId: '',
    fruit: false,
    mshow: 'display:none'
  },
  UserInfo: function (e) {
    console.log(e);
    if (e.detail.iv) {
      this.setData({
        mshow: "display:none"
      })
    }
    user.user(e);
  },
  rule: function (opt) {
    // console.log(opt)
    let i = opt.currentTarget.dataset.goodsinfoid;
    if (i == '1104' || i == '1105' || i == '1105a' || i == '1105b') {
      this.setData({
        textShow: true
      })
    } else if (i == '1113' || i == '1113a' || i == '1113b') {
      this.setData({
        peachTxt: true
      })
    } else if (i == '1193') {
      this.setData({
        fruit: true
      })
    }
  },

  close: function () {
    this.setData({
      textShow: false,
      fruit: false
    })
  },
  closePeach: function () {
    this.setData({
      textShow: false,
      peachTxt: false
    })
  },
  open: function () {
    this.setData({
      textShow: true
    })
  },
  openPeach: function () {
    this.setData({
      peachTxt: true
    })
  },

  receive: function () {
    let param = {
      member_id: wx.getStorageSync("userinfo").uid,
      goods_id: this.data.goodsInfoId
    }
    let that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Lq/qdcount",
      data: param,
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.data,
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../m-coupon/m-coupon',
            })
          }, 500);

        } else {
          wx.showToast({
            title: res.data.data,
          })

          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
            })
          }, 500);
        }
      }
    })
  },
  getQuery: function (i) {
    var j = location.search.match(new RegExp("[?&]" + i + "=([^&]*)(&?)", "i"));
    return j ? j[1] : j
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodid = options.id;
    this.setData({
      goodsInfoId: goodid
    });

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
    let goodid = this.data.goodsInfoId;
    if (goodid === '1104') {
      //西红柿
      // this.changeClass = 'actBj';
      this.setData({
        changeClass: 'actBj'
      })
    } else if (goodid === '1105' || goodid === '1105a' || goodid === '1105b') {
      //酸奶
      // this.changeClass = 'main';
      this.setData({
        changeClass: 'main'
      })
    } else if (goodid === '1113' || goodid === '1113a') {//桃
      // this.changeClass = 'peach';
      this.setData({
        changeClass: 'peach'
      })
    } else if (goodid === '1113b') {//桃
      // this.changeClass = 'peachb';
      this.setData({
        changeClass: 'peachb'
      })
    }
    else if (goodid === '1193') { //水果 by yan.lei
      // this.changeClass = 'fruit';
      this.setData({
        changeClass: 'fruit'
      })
    }



    let member_id = wx.getStorageSync("userinfo").uid;
    if (member_id) {
      // this.member_id = member_id;
      this.setData({
        member_id: member_id
      })
    } else {
      //return
      this.setData({
        mshow: "display:block"
      })
    }
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
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    let goodsInfoId = this.data.goodsInfoId;
    return {
      title: '青青优农喊你领优惠劵',
      path: '/pages/special2/special2?id='+ goodsInfoId+'&pid=' + uid,
      imageUrl: '',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        //console.log(res)
      }
    }
  }
})