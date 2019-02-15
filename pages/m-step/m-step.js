const app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据lexlee
   */
  data: {
    act:[],
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
    rice_rand:'',
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
    wx.switchTab({
      url: '/pages/bution/bution',
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
                      console.log(1111111111111112)
                      // console.log(res.data.finish[0].rice_rand)
                      that.setData({
                        teamList1: res.data.going,
                        teamList2: res.data.finish,
                        teamList3: res.data.all,
                        head_pic: res.data.head_pic,
                        rice: res.data.member_rice,
                        // rice_rand: res.data.finish[0].rice_rand

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
        console.log(userInfo.uid)
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
                          // console.log(res.data.finish[0].rice_rand)
                          that.setData({
                            teamList1: res.data.going,
                            teamList2: res.data.finish,
                            teamList3: res.data.all,
                            head_pic: res.data.head_pic,
                            rice: res.data.member_rice,
                            // rice_rand: res.data.finish[0].rice_rand
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
    var pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }

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

    wx.request({//页面已经开团的轮播
      url: app.globalData.Murl + '/Applets/Active/carousel',
      method: "post",
      data: { member_id: wx.getStorageSync("userinfo").uid },
      success: function (res) {
        console.log(res)
        that.setData({
          arr: res.data.list,
          arr2: res.data.list,
          step: res.data.mem_step_num.step_number
        })
        // if (res.data.list.length > 2 && res.data.list.length <= 10) {
        //   that.setData({
        //     arr2: res.data.list
        //   })
        // } else {

        //   var arrZ = [];
        //   for (var i = 0; i <10; i++) {
        //     arrZ.push(res.data.list[i])
        //   }
        //   that.setData({
        //     arr2: arrZ
        //   })
        // }

        that.setData({
          rank: res.data.rice_rank,
          head_pic: res.data.head_pic,
          rice: res.data.member_rice
        })
        if (res.data.rice_rank.length > 3) {
          that.setData({
            foldClass: "height:380rpx;padding-bottom:70rpx",
            fold1: "display:block",
          })
        } else {
          that.setData({
            foldClass: "height:autorpx;padding-bottom:0rpx",
            fold1: "display:none",
          })
        }





      }

    })
    wx.request({//任务一数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodfirst',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务一图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goods: res.data.goods,
        })
      }
    })
    wx.request({//任务二数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodsecond',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务二图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goodsecond: res.data.goods,
        })
      }
    })
    wx.request({//任务三数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodthrid',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务三图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goodthrid: res.data.goods,
        })
      }
    })
    // wx.request({//任务列表
    //   url: app.globalData.Murl + '/Applets/Active/sy_step_list',
    //   method: "post",
    //   data: { member_id: wx.getStorageSync("userinfo").uid },
    //   success: function (res) {
    //     console.log(321321321321)
    //     console.log(res.data[0].act_img)
    //     that.setData({
    //       act_renwu:res.data
    //     })
    //   }

    // })
    wx.request({//任务规则
      url: app.globalData.Murl + '/Applets/Active/active_word',
      method: "post",
      data: { member_id: wx.getStorageSync("userinfo").uid },
      success: function (res) {
        console.log(res)
        console.log(res.data)
        that.setData({
          msg:res.data
        })
      }

    })
    wx.request({//小程序拼步数活动列表
      url: app.globalData.Murl + '/Applets/Active/get_step_list',
      data: { member_id: wx.getStorageSync("userinfo").uid },
      method: "post",
      success: function (res) {
        console.log(123123132)
        console.log(res.data)
        that.setData({
          act: res.data
        })
      }
    })
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
  renwu1qingqiu: function () {  //任务一刷新更多奖品
    var that = this;
    wx.request({//任务一数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodfirst',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务一图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goods: res.data.goods,
        })
      }
    })
  },
  renwu2qingqiu: function () { //任务二刷新更多奖品
    var that = this;
    wx.request({//任务二数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodsecond',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务二图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goodsecond: res.data.goods,
        })
      }
    })
  },
  renwu3qingqiu: function () {   //任务三刷新更多奖品
    var that = this;
    wx.request({//任务三数据请求
      url: app.globalData.Murl + '/Applets/Tgs/goodthrid',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //application/json for get
      },
      method: "post",
      success: function (res) {
        console.log("任务三图片列表")
        console.log(res.data)
        console.log(res.data.goods)
        // console.log(res.data.goods[0].shop_price)
        that.setData({
          goodthrid: res.data.goods,
        })
      }
    })
  },
  goodsDetails: function (e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  gomstep:function(){
    wx.navigateTo({
      url: '/pages/m-step2/m-step2'
    })
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
  // Submit: function (e) {//进入下一页的开通微信步数
  //   var that = this;
  //   var formId = e.detail.formId;
  //   wx.request({
  //     url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
  //     data: { member_id: that.data.uid, formid: formId },
  //     method: 'post',
  //     success: function (res) {
  //     }
  //   })
  //   if (!wx.getStorageSync('run')) {
  //     wx.login({
  //       success: function (res) {
  //         var code = res.code;
  //         wx.openSetting({
  //           success(res) {
  //             if (res.authSetting["scope.werun"]) {
  //               wx.getWeRunData({//解密微信运动
  //                 success(res) {
  //                   wx.setStorageSync("run", true);
  //                   wx.request({
  //                     url: app.globalData.Murl + '/Applets/Active/wx_movemen',
  //                     data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
  //                     method: "post",
  //                     success: function (res) {
  //                       wx.navigateTo({
  //                         url: '/pages/m-step2/m-step2',
  //                       })
  //                     }
  //                   })
  //                 },
  //                 fail() {
  //                   wx.showToast({
  //                     title: '请授权微信运动步数，参加活动',
  //                     icon: "none",
  //                     duration: 1000
  //                   })
  //                 }
  //               })
  //             }
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/m-step2/m-step2',
  //     })
  //   }
  // },
  Submit2: function (e) {//点击不同的战队显示
    var that = this;
    var zl = e.detail.value.zl;
    var rice_rand = e.detail.value.rice_rand;
    var formId = e.detail.formId;
    console.log(formId)
    if (zl == 1) {
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
          console.log(taat.data.uid)
        }
      })
      
      wx.navigateTo({
        url: '/pages/hasbeencompleted/hasbeencompleted?uid=' + that.data.uid + "&rice_rand=" + rice_rand,
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
  Submit: function (e) {//自己开团
    var that = this
    var ac_id = e.detail.value.ac_id;
    var formId = e.detail.formId;//模板id
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    wx.showModal({
      title: '组队',
      content: '是否立即组队',
      success: function (res) {
        console.log(222)
        console.log(res)
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl + '/Applets/Active/create_step',
            data: { member_id: that.data.uid, ac_id: ac_id, formid: formId },
            method: "post",
            success: function (res) {
              var sta = res.data.status;
              console.log(res)
              console.log(res.data.msg)
              if (sta == 1) {
                wx.navigateTo({
                  url: '/pages/m-step3/m-step3?scene=' + res.data.team_id,
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  // title: "bug",
                  icon: "none",
                  duration: 1000
                })
              }
            }
          })


        } else {

        }
      }
    })



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
    if (fold == 'true') {
      console.log("fold为真")
      that.setData({
        fold: false,
        foldStyle: "height:auto!important;"
      })
    } else if (fold == 'false') {
      console.log("fold为假")
      console.log(555)
      that.setData({
        fold: true,
        foldStyle: "height:350rpx!important;"
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
    var uid = wx.getStorageSync("userinfo").uid;
    return {
      title: '快来拼步数抢200元优惠券',
      path: '/pages/m-step/m-step?pid=' + uid,
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