const app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    mshow: "display:none",//授权遮罩
    act: "",
    arr: [],
    goods:[],
    soldout: false,
    foldClass: "height:366rpx!important;padding-bottom:70rpx",
    fold: "display:block",
    tt: "display:none",
    foldd: true,//规则折叠
    fold2: false,//战队折叠
    fold3: false,
    foldStyle: "height:340rpx;",
    foldStyle2: "height:auto!important;",
    foldStyle3: "height:1250rpx!important;",
  },

  /**
   * 生命周期函数--监听页面显示
   */
  gowx: function () {
    wx.switchTab({
      url: '/pages/bution/bution',
    })
  },
  fold: function () {
    this.setData({
      foldClass: "height:auto!important;padding-bottom:0rpx",
      fold: "display:none"
    })

  },
  close: function (e) {//拼步攻略关闭
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    that.setData({
      tt: "display:none",
      wz: "overflow:auto"
    })
  }
  ,
  more: function () {
    var that = this;
    that.setData({
      tt: "display:block",
      wz: "overflow:hidden"
    })
  },
  gomstep() {
    wx.navigateTo({
      url: '/pages/m-step/m-step'
    })
  },
  onShow: function () {
    var that = this;
    // 假数据

    if (wx.getStorageSync("userinfo").uid) {

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
                complete: function () {//进入页面轮播上的假数据

                  //更新完成步数  
                  wx.request({
                    url: app.globalData.Murl + '/Applets/Active/team_first',
                    data: { member_id: wx.getStorageSync("userinfo").uid },
                    method: "post",
                    success: function (res) {

                    }
                  })

                  wx.request({
                    url: app.globalData.Murl + '/Applets/Active/step_detail',
                    method: "post",
                    success: function (res) {
                      if (res.data.step_rand) {
                        that.setData({
                          step_rand: res.data.step_rand,
                          x: Math.floor(Math.random() * (res.data.step_rand.length - 1)),
                        })
                        // Math.floor(Math.random() * (res.data.step_rand.length - 1))
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
                      console.log(res.data.total_num)
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
      console.log("我没有授权")
      
      that.setData({
        mshow: "display:block"
      })
      var timer = setInterval(function () {
        
        var userInfo = wx.getStorageSync("userinfo");
        console.log(userInfo.uid)
        if (userInfo.uid) {
          console.log(userInfo.uid)
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
                     //更新完成步数   
                      wx.request({
                        url: app.globalData.Murl + '/Applets/Active/team_first',
                        data: { member_id: wx.getStorageSync("userinfo").uid },
                        method: "post",
                        success: function (res) {
                         
                        }
                      })


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
    console.log(wx.getStorageSync("userinfo").uid)
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
            fold: "display:block",
          })
        } else {
          that.setData({
            foldClass: "height:autorpx;padding-bottom:0rpx",
            fold: "display:none",
          })
        }





      }

    })
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
    that.setData({
      uid: wx.getStorageSync("userinfo").uid
    })
    //随机数
    var pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }
    var timer2 = setInterval(function () {
      console.log(that.data.x)
      console.log(that.data.y)
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


    wx.request({//任务规则
      url: app.globalData.Murl + '/Applets/Active/active_word',
      method: "post",
      data: { member_id: wx.getStorageSync("userinfo").uid },
      success: function (res) {
        console.log(res)
        console.log(res.data)
        that.setData({
          msg: res.data
        })
      }

    })

    // 活动类型
    wx.request({//小程序拼步数活动列表
      url: app.globalData.Murl + '/Applets/Active/get_step_list',
      
      method: "post",
      success: function (res) {
        console.log(res.data)
        that.setData({
          act: res.data
        })
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

    // 排行榜假数据
    // wx.request({
    //   url: app.globalData.Murl + '/Applets/Active/mem_rice',
    //   method: "post",
    //   data: { member_id: wx.getStorageSync("userinfo").uid},
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       rank: res.data.rice_rank,
    //       head_pic:res.data.head_pic,
    //       rice: res.data.rice_nums
    //     })
    //     if (res.data.rice_rank.length>3){
    //       that.setData({
    //         foldClass: "height:372rpx;padding-bottom:70rpx",
    //         fold: "display:block",
    //       })
    //     }else{
    //       that.setData({
    //         foldClass: "height:autorpx;padding-bottom:0rpx",
    //         fold: "display:none",
    //       })
    //     }
    //   }
    // })



    // bannner图的倒计时
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
    var foldd = e.detail.value.ff;
    console.log(e.detail.value.ff)
    if (foldd == 'true') {
      console.log("fold为真")
      that.setData({
        foldd: false,
        foldStyle: "height:auto!important;"
      })
    } else if (foldd == 'false') {
      console.log("fold为假")
      console.log(555)
      that.setData({
        foldd: true,
        foldStyle: "height:350rpx!important;"
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
  Submit2: function (e) {//加入别人的团队
    var that = this;
    var ac_id = e.detail.value.acid;
    var team_id = e.detail.value.teamid;
    var formId = e.detail.formId;
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
      }
    })
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/join_team',
      data: { member_id: that.data.uid, ac_id: ac_id, team_id: team_id, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.status == 3) {//人数不够
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?scene=' + team_id,
          })
        }
        if (res.data.status == 2) {//人数够了，步数不够
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?scene=' + team_id,
          })
        }
        if (res.data.status == 1) {//赵晓阳页面 都够了

          wx.navigateTo({
            url: '/pages/m-step3/m-step3?scene=' + team_id,
          })
        }
        if (res.data.status == -3) {//满员
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?scene=' + team_id,
          })
        }
        if (res.data.status == -1 || res.data.status == -2 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }

      }
    })

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
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    return {
      title: '快来拼步数抢200元优惠券',
      path: '/pages/m-step2/m-step2?pid='+uid,
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
              fail: function (res) { },
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