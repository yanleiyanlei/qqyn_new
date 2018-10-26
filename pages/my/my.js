const app = getApp();
var user=require("../../lib/js/user.js")
Page({
  data: {
    nickName: "",
    portraitImg: "",
    uid: "",
    levelname: "",
    member_money: "",
    yhq: "",
    mshow: "display:none"
  },
  goindex:function(){
    app.globalData.store=1
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //跳到199
  members() {
    wx.switchTab({
      url: '../members/members'
    })
  },
  onShow: function () {
    var that = this;
    console.log(wx.getStorageSync("userinfo").uid)
    if (wx.getStorageSync("userinfo").uid) {
      that.setData({
        uid: wx.getStorageSync("userinfo").uid,
        mshow: "display:none"
      })
      wx.request({
        url: app.globalData.Murl + "/Applets/User/my",
        data: { uid: that.data.uid },
        method: "POST",
        success: function (res) {
          console.log(res)
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
    } else {
      that.setData({
        mshow: "display:block"
      })
      var timer = setInterval(function () {
        var userInfo = wx.getStorageSync("userinfo");
        console.log(wx.getStorageSync("userinfo").uid);
        // console.log(userInfo.uid != undefined)
        if (userInfo.uid) {
          clearInterval(timer)

          that.setData({
            uid: wx.getStorageSync("userinfo").uid,
            mshow: "display:none"
          })
          wx.request({
            url: app.globalData.Murl + "/Applets/User/my",
            data: { uid: that.data.uid },
            method: "POST",
            success: function (res) {
              console.log(res)
              that.setData({
                levelname: res.data.level_name,
                member_money: res.data.member_money,
                yhq: res.data.yhq,
                portraitImg: res.data.head_pic,
                nickName: res.data.nickname
              })

              wx.setStorageSync("portraitImg", res.data.head_pic);
              wx.setStorageSync("nickname", res.data.nickname);
            },
            fail: function () {
              console.log(888)
            },
            complete: function () {
            }
          })


        } else {
          that.setData({
            mshow: "display:block"
          })
        }
      }, 1000)


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
    console.log(pid);
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
    user.user(e)
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
  //function(){
  // wx.showModal({
  //   title: '提示',
  //   content: '您未授权登陆,无法正常商城购物,点击确定重新获取授权。',
  //   success: function (res) {
  //     if (res.confirm) {
  //       wx.openSetting({
  //         success: (res) => {
  //           if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
  //             wx.getUserInfo({
  //               success: function (res) {
  //                 var utoken = wx.getStorageSync("utoken");
  //                 wx.request({
  //                   //用户登陆URL地址，请根据自已项目修改
  //                   url: 'http://ss.bjzzdk.com/index.php/Applets/Login/userAuthSlogin',
  //                   method: "POST",
  //                   data: {
  //                     utoken: utoken,
  //                     code: mdd.globalData.code,
  //                     encryptedData: res.encryptedData,
  //                     iv: res.iv
  //                   },
  //                   fail: function (res) {


  //                   },
  //                   success: function (res) {
  //                     //console.log(res)
  //                     var utoken = res.data.utoken;
  //                     //设置用户缓存
  //                     wx.setStorageSync("utoken", utoken);
  //                     wx.setStorageSync("userinfo", res.data.userinfo);
  //                     console.log(wx.getStorageSync("userinfo").uid)                      
  //                   }
  //                 })
  //               }
  //             })
  //           }
  //         }, fail: function (res) {

  //         }
  //       })

  //     }
  //   }
  // })
  // }
})