// pages/bution/bution.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperli: [], //轮播信息
    swipertx: [], //详细规则
    swiperCurrent: 0, //轮播开始位置
    tabFixed: "display:none", //底部是否显现  true 为隐藏   false 为显示
    tabScrollTop: 500, //滑动超过500距离底部显示
    mentshow: true, //信息是否显示
    mshow: "display:none", //是否登录
    message: [], //流动信息
    phone: [], //活动细则第七条
    backshow: true, //活动细则
    shareshow: true, //点击提示分享
    xianshang: ""
  },
  //拒绝授权登录
  close: function () {
    var _this = this;
    _this.setData({
      mshow: "display:none"
    })
  },
  //同意授权登录
  UserInfo: function (e) {
    this.setData({
      mshow: "display:none"
    })
    wx.login({
      success: function (res) {
        var code = res.code;
        var utoken = wx.getStorageSync("utoken");
        var pid = wx.getStorageSync("pid");
        console.log(pid);
        console.log(pid);
        wx.request({
          //用户登陆URL地址，请根据自已项目修改
          url: app.globalData.Murl + '/Applets/Login/userAuthSlogin',
          method: "POST",
          data: {
            utoken: utoken,
            code: code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            pid: pid
          },
          success: function (res) {
            var utoken = res.data.utoken;
            console.log(res);
            //设置用户缓存
            wx.setStorageSync("utoken", utoken);
            wx.setStorageSync("userinfo", res.data.userinfo);
            //console.log("允许");
            wx.reLaunch({
              url: '/pages/bution/bution',
            })
          }
        })
      }
    })
  },
  // 判断页面滚动是否超过 500
  onPageScroll: function (e) {
    if (e.scrollTop > this.data.tabScrollTop) {
      this.setData({
        tabFixed: "display:block",
      })
    } else {
      this.setData({
        tabFixed: "display:none",
      })
    }
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击拨打电话功能
  telphone: function (e) {
    console.log(0);
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },
  //点击显示活动细则
  tapback: function () {
    var _this = this;
    _this.setData({
      backshow: false
    })
  },
  //点击关闭活动细则
  backhide: function () {
    var _this = this;
    _this.setData({
      backshow: true
    })
  },
  //点击弹出提示分享
  toshare: function () {
    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      this.setData({
        mshow: "display:block"
      })
    } else {
      this.setData({
        shareshow: false
      })
    }

  },
  //点击关闭提示分享
  closeshare: function () {
    this.setData({
      shareshow: true
    })
  },
  previewImage: function (e) { //点击图片放大长按保存
    var sun = []; //声明一个空数组sun来存储图片的连接
    sun.push(e.currentTarget.dataset.url); //把图片连接push进sun数组
    wx.previewImage({
      current: sun, // 当前显示图片的http链接   
      urls: sun // 需要预览的图片http链接列表   
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }
    var uid = wx.getStorageSync("userinfo").uid;

    if (!uid) {
      _this.setData({
        mshow: "display:block"
      })
    } else {
      // setInterval(function () {
      //   wx.request({
      //     url: app.globalData.Murl + '/Applets/Fx/message',
      //     data: {},
      //     method: "POST",
      //     header: {
      //       'content-type': 'application/json' // 默认值
      //     },
      //     success: function (res) {
      //       _this.setData({
      //         message: res.data.word
      //       })
      //     }
      //   })
      //   var a = 0;
      //   var showtime = setInterval(function () {
      //     a += 3000;
      //     _this.setData({
      //       mentshow: false
      //     })
      //     if (a >= 9000) {
      //       _this.setData({
      //         mentshow: true
      //       })
      //       clearInterval(showtime);
      //     }
      //   }, 3000)
      // }, 10000)
    }
    wx.request({
      url: app.globalData.Murl + '/Applets/Fx/index',
      data: {
        uid: uid,
        from: 'x'
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        _this.setData({
          swiperli: res.data.img,
          swipertx: res.data.content,
          phone: res.data.phone,
          xianshang: res.data.pd
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
  onShareAppMessage: function (options) {
    var uid = wx.getStorageSync("userinfo").uid;
    return {
      title: '我获得了大量优惠劵，有福同享！点我查看薅羊毛攻略',
      path: '/pages/profit/profit?pid=' + uid,
      //imageUrl: "http://m.7710mall.com/Uploads/xxc/yess.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})