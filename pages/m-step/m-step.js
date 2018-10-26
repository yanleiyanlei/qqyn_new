const app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    mshow: "display:none",//授权遮罩
    more: "display:block",//更多活动
    fold: true,//规则折叠
    fold2: false,//战队折叠
    fold3: false,
    foldStyle: "height:340rpx;",
    foldStyle2: "height:auto!important;",
    foldStyle3: "height:1250rpx!important;",
    team: "",
    teamList1: [],
    teamList2: [],
    teamList3: [],
    teamList: [],//渲染的组队信息
    h1: "",
    m1: "",
    s1: "",
    soldout: false,
    sta: 1//切换
  },
  gowx: function () {
    wx.navigateTo({
      url: '/pages/goout/goout',
    })
  },
  tab: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.sta;
    if (index == 1) {

      that.setData({
        teamList: that.data.teamList1,
        sta: 1
      })
      if (that.data.teamList.length > 4) {
        that.setData({
          foldStyle2: "height:1316rpx!important;",
          foldStyle21: "padding-bottom:70rpx!important;",
          fold2: true
        })
      } else {
        that.setData({
          foldStyle2: "height:auto!important;",
          foldStyle21: "padding-bottom:0rpx!important;",
          fold2: false
        })
      }
    }
    if (index == 2) {
      that.setData({
        teamList: that.data.teamList2,
        sta: 2
      })
      if (that.data.teamList.length > 4) {
        that.setData({
          foldStyle2: "height:1316rpx!important;",
          foldStyle21: "padding-bottom:70rpx!important;",
          fold2: true
        })
      } else {
        that.setData({
          foldStyle2: "height:auto!important;",
          foldStyle21: "padding-bottom:0rpx!important;",
          fold2: false
        })

      }
    }
    if (index == 3) {
      that.setData({
        teamList: that.data.teamList3,
        sta: 3
      })
      if (that.data.teamList.length > 4) {
        that.setData({
          foldStyle2: "height:1316rpx!important;",
          foldStyle21: "padding-bottom:70rpx!important;",
          fold2: true
        })
      } else {
        that.setData({
          foldStyle2: "height:auto!important;",
          foldStyle21: "padding-bottom:0rpx!important;",
          fold2: false
        })
      }
    }
  },
  onShow: function () {
    var that = this;
    // 规则
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/step_detail',
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.step_rand) {
          that.setData({
            step_rand: res.data.step_rand,
            x: Math.floor(Math.random() * (res.data.step_rand.length - 1)),
          })
          //Math.floor(Math.random() * (res.data.step_rand.length - 1))
          if (that.data.x == 0) {
            that.setData({
              y: parseInt(that.data.step_rand.length) - 1
            })
          } else {
            that.setData({
              y: that.data.x - 1
            })
          }



        }

        if (res.data.is_sale == 1) {//活动下架
          that.setData({
            soldout: true
          })
        } else {
          that.setData({
            soldout: false
          })
        }
        that.setData({
          total_num: res.data.total_num,
        })
      }
    })
    //判断授权
    if (wx.getStorageSync("userinfo").uid) {
      that.setData({
        uid: wx.getStorageSync("userinfo").uid
      })
      wx.login({
        success: function (res) {
          var code = res.code
          wx.getWeRunData({//解密微信运动
            success(res) {
              wx.setStorageSync("run", true);
              wx.request({
                url: app.globalData.Murl + '/Applets/Active/wx_movemen',
                data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
                method: "post",
                success: function (res) {

                },
                complete: function () {
                  //参加的团队
                  wx.request({
                    url: app.globalData.Murl + '/Applets/Active/team_list',
                    data: { member_id: wx.getStorageSync("userinfo").uid },
                    method: "post",
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        teamList1: res.data.going,
                        teamList2: res.data.finish,
                        teamList3: res.data.all,
                        head_pic: res.data.head_pic,
                        rice: res.data.member_rice
                      })
                      if (that.data.sta == 1) {
                        that.setData({
                          teamList: res.data.going
                        })
                      }
                      if (that.data.sta == 2) {
                        that.setData({
                          teamList: res.data.finish
                        })
                      }
                      if (that.data.sta == 3) {
                        that.setData({
                          teamList: res.data.all
                        })
                      }
                      console.log(res.data.all)
                      if (that.data.teamList.length > 4) {
                        that.setData({
                          foldStyle2: "height:1314rpx!important;",
                          foldStyle21: "padding-bottom:70rpx!important;",
                          fold2: true
                        })
                      } else {
                        that.setData({
                          foldStyle2: "height:auto!important;",
                          foldStyle21: "padding-bottom:0rpx!important;",
                          fold2: false
                        })
                      }
                      // if (res.data.create == "" && res.data.join == "") {
                      //   that.setData({
                      //     team: false
                      //   })
                      // } else {
                      //   that.setData({
                      //     team: true,
                      //     teamList1: res.data.create,
                      //     teamList2: res.data.join,
                      //   })
                      //   if (res.data.create.length > 4) {
                      //     that.setData({
                      //       foldStyle2: "height:1200rpx!important;",
                      //       foldStyle21: "padding-bottom:70rpx!important;",
                      //       fold2: true
                      //     })
                      //   } else {
                      //     that.setData({
                      //       foldStyle2: "height:auto!important;",
                      //       foldStyle21: "padding-bottom:0rpx!important;",
                      //       fold2: false
                      //     })
                      //   }
                      //   if (res.data.join.length > 4) {
                      //     that.setData({
                      //       foldStyle3: "height:1200rpx!important;",
                      //       foldStyle31: "padding-bottom:70rpx!important;",
                      //       fold3: true
                      //     })
                      //   } else {
                      //     that.setData({
                      //       foldStyle3: "height:auto!important;",
                      //       foldStyle31: "padding-bottom:0rpx!important;",
                      //       fold3: false
                      //     })
                      //   }
                      // }

                    }
                  })
                }
              })
            },
            fail: function () {
              wx.showToast({
                title: '请授权微信运动步数，参加活动',
                icon: "none",
                duration: 1000
              })
            }
          })
        }
      })



    } else {
      that.setData({
        mshow: "display:block"
      })
      var timer = setInterval(function () {
        var userInfo = wx.getStorageSync("userinfo");
        if (userInfo.uid) {
          clearInterval(timer)
          that.setData({
            uid: wx.getStorageSync("userinfo").uid,
            mshow: "display:none"
          })
          wx.login({
            success: function (res) {
              var code = res.code
              wx.getWeRunData({//解密微信运动
                success(res) {
                  wx.setStorageSync("run", true);
                  wx.request({
                    url: app.globalData.Murl + '/Applets/Active/wx_movemen',
                    data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
                    method: "post",
                    success: function (res) {


                    },
                    complete: function () {
                      // 参加的团队
                      wx.request({
                        url: app.globalData.Murl + '/Applets/Active/team_list',
                        data: { member_id: wx.getStorageSync("userinfo").uid },
                        method: "post",
                        success: function (res) {
                          console.log(res)
                          console.log(res)
                          that.setData({
                            teamList1: res.data.going,
                            teamList2: res.data.finish,
                            teamList3: res.data.all,
                            head_pic: res.data.head_pic,
                            rice: res.data.member_rice
                          })
                          if (that.data.sta == 1) {
                            that.setData({
                              teamList: res.data.going
                            })
                          }
                          if (that.data.sta == 2) {
                            that.setData({
                              teamList: res.data.finish
                            })
                          }
                          if (that.data.sta == 3) {
                            that.setData({
                              teamList: res.data.all
                            })
                          }
                          console.log(res.data.going)
                          if (that.data.teamList.length > 4) {
                            that.setData({
                              foldStyle2: "height:1200rpx!important;",
                              foldStyle21: "padding-bottom:70rpx!important;",
                              fold2: true
                            })
                          } else {
                            that.setData({
                              foldStyle2: "height:auto!important;",
                              foldStyle21: "padding-bottom:0rpx!important;",
                              fold2: false
                            })
                          }
                          // if (res.data.create == "" && res.data.join == "") {
                          //   that.setData({
                          //     team: false
                          //   })
                          // } else {
                          //   that.setData({
                          //     team: true,
                          //     teamList1: res.data.create,
                          //     teamList2: res.data.join,
                          //   })
                          //   if (res.data.create.length > 4) {
                          //     that.setData({
                          //       foldStyle2: "height:1200rpx!important;",
                          //       foldStyle21: "padding-bottom:70rpx!important;",
                          //       fold2: true
                          //     })
                          //   } else {
                          //     that.setData({
                          //       foldStyle2: "height:auto!important;",
                          //       foldStyle21: "padding-bottom:0rpx!important;",
                          //       fold2: false
                          //     })
                          //   }
                          //   if (res.data.join.length > 4) {
                          //     that.setData({
                          //       foldStyle3: "height:1200rpx!important;",
                          //       foldStyle31: "padding-bottom:70rpx!important;",
                          //       fold3: true
                          //     })
                          //   } else {
                          //     that.setData({
                          //       foldStyle3: "height:auto!important;",
                          //       foldStyle31: "padding-bottom:0rpx!important;",
                          //       fold3: false
                          //     })
                          //   }
                          // }

                        }
                      })
                    }
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '请授权微信运动步数，参加活动',
                    icon: "none",
                    duration: 1000
                  })
                }
              })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onUnload: function () {
    app.globalData.timer2 = 3;
  },
  onLoad: function (options) {
    var that = this;
    app.globalData.timer2 = 2;
    that.setData({
      tx: wx.getStorageSync("userinfo").avatarUrl
    })
    wx.showShareMenu({
      withShareTicket: true
    })


    var timer2 = setInterval(function () {
      // console.log(that.data.x)
      // console.log(that.data.y)

      if (app.globalData.timer2 == 3) {
        clearInterval(timer2)
      }
      if (that.data.x == 0) {
        that.setData({
          x: parseInt(that.data.step_rand.length) - 1,
          y: parseInt(that.data.step_rand.length) - 2
        })



      } else if (that.data.x == 1) {
        that.setData({
          x: 0,
          y: parseInt(that.data.step_rand.length) - 1
        })
      } else {
        that.setData({
          y: that.data.x - 2,
          x: that.data.x - 1
        })
      }
    }, 5000)


    // 轮播上的倒计时
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var h = 23 - date.getHours();
    var m = 59 - date.getMinutes();
    var s = 59 - date.getSeconds();
    var gap = h * 60 * 60 + m * 60 + s;
    setInterval(
      function () {
        gap--;
        var h1 = parseInt(gap / 60 / 60);
        var m1 = parseInt(gap / 60) % 60;
        var s1 = gap % 60;
        if (m1 < 10) {
          m1 = "0" + m1;
        }
        if (s1 < 10) {
          s1 = "0" + s1;
        }
        that.setData({
          h1: h1,
          m1: m1,
          s1: s1
        })
      }
      , 1000)

  },
  UserInfo: function (e) {//开通权限获得用户信息
    user.user(e)
  },
  Sfold: function (e) {//规则展开
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    var fold = e.detail.value.ff;
    console.log(e.detail.value.ff)
    if (fold=='true') {
      that.setData({
        fold: false,
        foldStyle: "height:auto!important;"
      })
    }else if(fold=='false'){
      console.log(555)
      that.setData({
        fold: true,
        foldStyle: "height:350rpx!important;"
      })
    }
  },
  Sfold2: function (e) {//我组建的团队展开
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    var fold2 = !e.detail.value.ff;
    this.setData({
      fold2: fold2
    })
    if (!fold2) {
      that.setData({
        foldStyle2: "height:auto!important;",
        foldStyle21: "padding-bottom:0rpx!important;"
      })
    } else {
      that.setData({
        foldStyle2: "height:1250rpx!important;",
        foldStyle21: "padding-bottom:70rpx!important;"
      })
    }
  },
  Sfold3: function (e) {//我加入的团队展开
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    var fold3 = !e.detail.value.ff;
    this.setData({
      fold3: fold3
    })
    if (!fold3) {
      that.setData({
        foldStyle3: "height:auto!important;",
        foldStyle31: "padding-bottom:0rpx!important;"
      })
    } else {
      that.setData({
        foldStyle3: "height:1250rpx!important;",
        foldStyle31: "padding-bottom:70rpx!important;"
      })
    }
  },
  Submit: function (e) {//进入下一页的开通微信步数
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    if (!wx.getStorageSync('run')) {
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.werun"]) {
                wx.getWeRunData({//解密微信运动
                  success(res) {
                    wx.setStorageSync("run", true);
                    wx.request({
                      url: app.globalData.Murl + '/Applets/Active/wx_movemen',
                      data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
                      method: "post",
                      success: function (res) {
                        wx.navigateTo({
                          url: '/pages/m-step2/m-step2',
                        })
                      }
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '请授权微信运动步数，参加活动',
                      icon: "none",
                      duration: 1000
                    })
                  }
                })
              }
            }
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/m-step2/m-step2',
      })
    }
  },
  Submit2: function (e) {//点击不同的战队显示
    var that = this;
    var zl = e.detail.value.zl;
    var formId = e.detail.formId;
    console.log(formId)
    if (zl == 1) {
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
        }
      })
      wx.navigateTo({
        url: '/pages/personalcenter/personalcenter?uid=' + that.data.uid,
      })
    }
    if (zl == 2) {
      var teamid = e.detail.value.teamid;
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
        }
      })
      wx.navigateTo({
        url: '/pages/m-step3/m-step3?scene=' + teamid,
      })
    }
    if (zl == 3) {
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {

        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */


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
    var that = this;
    // console.log(that.data.id)
    return {
      title: '青青优农',
      path: '/pages/m-step/m-step',
      imageUrl: '',
      success: function (res) {

        var shareTickets = res.shareTickets[0];
        wx.login({
          success: function (res) {
            var code = res.code;
            wx.getShareInfo({
              shareTicket: shareTickets,
              success: function (res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
              },
              fail: function (res) { console.log(res) },
              complete: function (res) { }
            })



          }
        })

      },
      fail: function (res) {

      }
    }
  }
})