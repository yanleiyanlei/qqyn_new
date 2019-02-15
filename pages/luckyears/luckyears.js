// apges/luckdraw/luckdraw.js
var user = require("../../lib/js/user.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mshow: "display:none", //用户是否登陆
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: '#FFFFFF', //圆点颜色1
    colorCircleSecond: '#FE4D32', //圆点颜色2
    colorAwardDefault: '#FFEEEE', //奖品默认颜色
    colorAwardSelect: '#ff4f40', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    indexSelect: 0, //被选中的奖品index
    showDialog: false,//中奖弹窗
    showDialogg: false,//中奖弹窗
    contentJp:'',//中奖内容
    imageAward: [
      'https://m.7710mall.com/Public/xcximg/newyear/100.png',
      'https://m.7710mall.com/Public/xcximg/newyear/nuandong.png',
      'https://m.7710mall.com/Public/xcximg/newyear/pig.png',
      'https://m.7710mall.com/Public/xcximg/newyear/100quan.png',
      'https://m.7710mall.com/Public/xcximg/newyear/thanks.png  ',
      'https://m.7710mall.com/Public/xcximg/newyear/1000.png',
      'https://m.7710mall.com/Public/xcximg/newyear/200.png',
      'https://m.7710mall.com/Public/xcximg/newyear/129.png',
    ], //奖品图片数组
    times: 0 ,// 抽奖次数
    pd:0 //立即分享是否显示
    
  },

  //判断用户是否确认登录

  close: function () { //用户拒绝登录
    this.setData({
      mshow: "display:none"
    })
  },
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
            console.log("允许");
            wx.reLaunch({
              url: '/pages/luckyears/luckyears',
            })

           
          }
          // ,
          // callback: function () {
          //   var that = this;
          //   that.onLoad();
          // }
        })

      }

    })
  },
  link: function () {
    wx.switchTab({
      url: '/pages/bution/bution',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    
    console.log(1232131232131)
    var _this = this;
    //圆点设置
    var leftCircle = 5.25;
    var topCircle = 5.25;
    var circleList = [];
    for (let i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 10.5;
        leftCircle = 10.5;
      } else if (i < 6) {
        topCircle = 5.25;
        leftCircle = leftCircle + 85;
      } else if (i == 6) {
        topCircle = 5.25
        leftCircle = 520;
      } else if (i < 12) {
        topCircle = topCircle + 75;
        leftCircle = 520;
      } else if (i == 12) {
        topCircle = 445;
        leftCircle = 520;
      } else if (i < 18) {
        topCircle = 445;
        leftCircle = leftCircle - 85;
      } else if (i == 18) {
        topCircle = 445;
        leftCircle = 10.5;
      } else if (i < 24) {
        topCircle = topCircle - 72;
        leftCircle = 10.25;
      } else {
        return
      }
      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle
      })
    }
    _this.setData({
      circleList: circleList
    })

    //让圆点闪烁起来
    setInterval(function () {
      if (_this.data.colorCircleFirst == "#FFFFFF") {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFFFFF'
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFFFFF',
          colorCircleSecond: '#FE4D32'
        })
      }
    }, 500)


    //设置图片
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 6;
    var leftAward = 6;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 5;
        leftAward = 5;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 131 + 32;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 99 + 38;
      } else if (j < 7) {
        leftAward = leftAward - 131 - 32;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 99 - 38 ;
      }
      var imageAward = this.data.imageAward[j];
      awardList.push({
        topAward: topAward,
        leftAward: leftAward,
        imageAward: imageAward
      });
    }
    _this.setData({
      awardList: awardList
    })


    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      _this.setData({
        mshow: "display:block"
      })
    } else {
      wx.request({
        url: app.globalData.Murl + '/Applets/Newyear/nums',
        data: {
          member_id: uid
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.status == true) {
            _this.setData({
              times: res.data.num,
              pd:res.data.pd
            })
          }
        },
        fail: function () {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }

      })
    }
  },
  //点击立即抽奖
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
    return
  },
  toggleDialogg() {
    this.setData({
      showDialogg: !this.data.showDialogg
    });
    return
  },
  startGame: function () {
    if (this.data.isRunning) return
    var _this = this;
    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      _this.setData({
        mshow: "display:block"
      })
    } else {
      var times = _this.data.times;
      wx.request({
        url: app.globalData.Murl + '/Applets/Newyear/cli',
        data: {
          member_id: uid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          
          console.log(res.data)
          if (times <= 0) {
            console.log(res.data.content)
            _this.toggleDialogg();//抽奖次数为0显示弹窗
          } else {
            _this.setData({
              isRunning: false
            })
            if (res.data.status == true) {
              var indexSelect = 0;
              var i = 0;
              var timer = setInterval(function () {
                console.log(11123)
                indexSelect++;
                i += 30;
                console.log(1)
                console.log(i)
                if (i > res.data.data.wz) {
                  
                  times --;//抽奖1次，可抽奖次数减1
                  clearInterval(timer);
                  var contentJp = res.data.data.content;
                  console.log(res.data.data.content)
                  _this.setData({
                    contentJp: res.data.data.content,
                    isRunning: false,
                    times:times

                  })
                  _this.toggleDialog();//显示弹窗，抽奖结果
                } else {
                  indexSelect = indexSelect % 8;
                  _this.setData({
                    indexSelect: indexSelect,
                  })
                }
              }, 200 + i)  
            } else {
              _this.toggleDialogg();//抽奖次数为0显示弹窗
            }
          }
        },
        fail: function (res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        },
        complete: function (res) { },
      })
    }
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
    if (options.from == 'button') {
      console.log(1)
      
      return
    } else {
      console.log(2)
    }
    var uid = wx.getStorageSync("userinfo").uid;
    return {
      title: '新年好运气！我获得了150元优惠券，大家有福同享哈！',
      path: '/pages/luckdraw/luckdraw',
      imageUrl: "https://m.7710mall.com/Public/xcximg/newyear/shareny.jpg",
      success: (res) => {
        console.log("转发成功", res);
        var _this = this;
        var uid = wx.getStorageSync("userinfo").uid;
        wx.request({
          url: app.globalData.Murl + '/Applets/Newyear/addnums',
          data: {
            member_id: uid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: function (res) {

            console.log(res)
            console.log("转发成功2")

          },
          fail: function (res) {
            // wx.showLoading({
            //   title: '网络连接失败！',
            // })

            // setTimeout(function () {
            //   wx.hideLoading()
            // }, 2000)
            console.log("发送失败")
          },
          complete: function (res) {
            console.log(11111111111111111111111111111)
          },
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})