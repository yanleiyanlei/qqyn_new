const app = getApp();
var user=require("../../lib/js/user.js")
Page({
  data: {
    nickName: "",
    portraitImg: "",
    uid: "undefined",
    levelname: "",
    member_money: "0.00",
    commission:'0.00',
    yhq: "0",
    mshow: "display:none",
    wantsBuyData:{
      name:"大家都在买",
      "showTip": true
    },
    waitPayment: 0,
    waitDelivery: 0,
    waitTakeDelivery: 0,
    waitEvaluate: 0,
    isPhone:false
  },
  /**订单查询数量*/
  queryNum: function(url){
    var num = new Promise(function (resolve, reject) {
      var userInfo = wx.getStorageSync("userinfo");
      var uid = userInfo.uid;
      wx.request({
        url: app.globalData.Murl + url,
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: "POST",
        data:{
          member_id: uid
        },
        success(res) {
          resolve(res)
        },
        fail(res){
          reject(res)
        }
      })
    })
    return num
  },
  getQueryNum: function (url, orderType){
    var that = this;
    this.queryNum(url).then(function (res) {
      // console.log(res)
      var len;
      if (res.data.order) {
        len = res.data.order.length;
      }else{
        len = 0;
      }
      if (orderType === 'waitPayment') {
        that.setData({
          waitPayment: len
        })
      } else if (orderType === 'waitDelivery') {
        that.setData({
          waitDelivery: len
        })
      } else if (orderType === 'waitTakeDelivery') {
        that.setData({
          waitTakeDelivery: len
        })
      }
      if (url === '/Applets/User/m_order4'){
        var numLen = 0;
        if (!res.data.is_check) {
          for (var i = 0; i < res.data.order.length; i++) {
            if (res.data.order[i].order_list) {
              numLen += res.data.order[i].order_list.length;
            }
            that.setData({
              waitEvaluate: numLen
            })
          }
        }
        
      }
    })
  },
  tomcharge:function(){
    //console.log(wx.getStorageSync("userinfo").uid)
    if (wx.getStorageSync("userinfo").uid){
      wx.navigateTo({
        url: '/pages/m-charge/m-charge',
      })
    }
  },
  goindex:function(){
    // app.globalData.store=1
    wx.navigateTo({
      // url: '/pages/bution/bution',
      url: '/pages/profit/profit'
    })
  },
  //跳到199
  members() {
    wx.navigateTo({
      // url: '/pages/bution/bution'
      url: '/pages/profit/profit'
    })
  },
  //子组件事件
  cancel: function () {
    this.setData({
      mshow: "display:none"
    })
  },
  //点击登录 调用授权页面
  login: function () {
    this.setData({
      mshow: "display:block"
    });
  },
  onShow: function () {
    
    var that = this;
    //console.log(wx.getStorageSync("userinfo").uid)
    if (wx.getStorageSync("userinfo").uid) {
      this.getQueryNum('/Applets/User/m_order1', 'waitPayment');
      this.getQueryNum('/Applets/User/m_order2', 'waitDelivery');
      this.getQueryNum('/Applets/User/m_order3', 'waitTakeDelivery');
      this.getQueryNum('/Applets/User/m_order4', 'waitEvaluate');
      that.setData({
        uid: wx.getStorageSync("userinfo").uid,
        mshow: "display:none"
      })
      wx.request({
        url: app.globalData.Murl + "/Applets/User/my",
        data: { uid: that.data.uid },
        method: "POST",
        success: function (res) {
          //console.log(res)
          that.setData({
            levelname: res.data.level_name,
            member_money: res.data.member_money,
            yhq: res.data.yhq,
            portraitImg: res.data.head_pic,
            nickName: res.data.nickname,
            commission: res.data.distribute_amount
          })
        },
        fail: function () {
          console.log(888)
        },
        complete: function () {
        }
      })


      //登录后在判断手机号
      if (!app.globalData.isPhone) {
        wx.hideTabBar({});
        this.hasPhone();
      }


    } else {
      //console.log(wx.getStorageSync("userinfo").uid)
      // that.setData({ 
      //   mshow: "display:block"
      // })
      // var timer = setInterval(function () {
      //   var userInfo = wx.getStorageSync("userinfo");
      //   console.log(wx.getStorageSync("userinfo").uid);
      //   // console.log(userInfo.uid != undefined)
      //   if (userInfo.uid) {
      //     clearInterval(timer)

      //     that.setData({
      //       uid: wx.getStorageSync("userinfo").uid,
      //       mshow: "display:none"
      //     })
      //     wx.request({
      //       url: app.globalData.Murl + "/Applets/User/my",
      //       data: { uid: that.data.uid },
      //       method: "POST",
      //       success: function (res) {
      //         console.log(res)
      //         that.setData({
      //           levelname: res.data.level_name,
      //           member_money: res.data.member_money,
      //           yhq: res.data.yhq,
      //           portraitImg: res.data.head_pic,
      //           nickName: res.data.nickname
      //         })

      //         wx.setStorageSync("portraitImg", res.data.head_pic);
      //         wx.setStorageSync("nickname", res.data.nickname);
      //       },
      //       fail: function () {
      //         console.log(888)
      //       },
      //       complete: function () {
      //       }
      //     })


      //   } else {
      //     that.setData({
      //       mshow: "display:block"
      //     })
      //   }
      // }, 1000)


    }
    
    
    
  },
  //获取手机号信息
  getPhoneNumber(e) {
    let that = this;
    if (e.detail.iv) {
      let uid = wx.getStorageSync("userinfo").uid;
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/getPhone',
        method: "POST",
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          member_id: uid
        },
        success: function (res) {
          console.log("getPhoneNumber", res)
          if (res.data.status == 1) {
            wx.showTabBar({})
            app.globalData.isPhone = true;
            that.setData({
              isPhone: false
            })
          }
        }
      })
    }
  },
  //判断是否注册手机号了
  hasPhone: function () {
    let that = this;
    let uid = wx.getStorageSync("userinfo").uid;
    let pid = wx.getStorageSync("pid");
    if (uid) {
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/isPhone',
        method: "POST",
        data: {
          member_id: uid,
          pid: pid
        },
        success: function (ress) {
          console.log(ress.message);
          if (ress.data.status == 1) {
            that.setData({
              isPhone: true
            })
          } else {
            app.globalData.isPhone = true;
            that.setData({
              isPhone: false
            });
            wx.showTabBar({});
          }
        }
      })
    }
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
  onLoad: function (options) {

    var pid = options.pid;
    // console.log(pid);
    if (pid) {
      wx.setStorageSync("pid", pid);
    }

    wx.showShareMenu({
      withShareTicket: true
    })

    // dl.getUserDataToken();
    var that = this;



  },
  // open: open.open,
  UserInfo: function (e) {
    user.user(e, this.isPhoneFun);
  },
  //回调函数 user.js
  isPhoneFun: function (obj) {
    let that = this;

    this.onShow();
    // console.log('isPhoneFun',obj);
    if (obj.data.status === 1) {
      that.setData({
        isPhone: true
      })
    } else {
      that.setData({
        isPhone: false
      })
      wx.showTabBar({
        success: function () {
          return
        }
      })
    }
  },
  onShareAppMessage: function () {
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid);
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/my/my?pid=' + uid,
      imageUrl: '',
      success: function (res) {
        console.log(res)
        // console.log
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})