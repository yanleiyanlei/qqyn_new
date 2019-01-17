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
    colorAwardSelect: '#ffe400', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    imageAward: [
      'http://m.7710mall.com/Public/xcximg/a.jpg',
      'http://m.7710mall.com/Public/xcximg/b.jpg',
      'http://m.7710mall.com/Public/xcximg/c.jpg',
      'http://m.7710mall.com/Public/xcximg/d.jpg',
      'http://m.7710mall.com/Public/xcximg/e.jpg',
      'http://m.7710mall.com/Public/xcximg/f.jpg',
      'http://m.7710mall.com/Public/xcximg/g.jpg',
      'http://m.7710mall.com/Public/xcximg/h.jpg',
    ], //奖品图片数组
    times: 0 // 抽奖次数
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
            //console.log("允许");
            wx.reLaunch({
              url: '/pages/luckdraw/luckdraw',
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (let i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
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
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
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
        url: app.globalData.Murl + '/Applets/Christmas/nums',
        data: {
          member_id: uid
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == true) {
            _this.setData({
              times: res.data.num
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
        url: app.globalData.Murl + '/Applets/Christmas/cli',
        data: {
          member_id: uid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          if (times <= 0) {
            wx.showModal({
              title: '',
              content: "抽奖次数已用完",
              showCancel: false, //去掉取消按钮
              success: function (res) {
                if (res.confirm) {
                  _this.setData({
                    isRunning: false
                  })
                }
              }
            })
          } else {
            _this.setData({
              isRunning: true
            })
            if (res.data.status == true) {
              var indexSelect = 0;
              var i = 0;
              var timer = setInterval(function () {
                indexSelect++;
                i += 30;
                if (i > res.data.wz) {
                  clearInterval(timer);
                  wx.showModal({
                    title: '恭喜您',
                    content: res.data.content,
                    showCancel: false, //去掉取消按钮
                    success: function (res) {
                      times--;
                      if (res.confirm) {
                        _this.setData({
                          isRunning: false,
                          times: times
                        })
                      }
                    }
                  })
                } else {
                  indexSelect = indexSelect % 8;
                  _this.setData({
                    indexSelect: indexSelect,
                  })
                }
              }, 200 + i)

            } else {
              wx.showModal({
                title: '',
                content: "抽奖次数已用完",
                showCancel: false, //去掉取消按钮
                success: function (res) { }
              })
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
  onShareAppMessage: function () {

  }
})