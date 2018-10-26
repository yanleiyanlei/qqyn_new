const app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foldClass: 'display:none',
    now: "display:none",
    actInfo: "",
    teamMember: [],
    sta: "",
    uid: "",
    sta1: '',
    team_id: "",
    ac_id: "",
    mshow: "display:none",
    num: "",
    h1: "",
    m1: "",
    s1: "",
    klist: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 规则
    // wx.request({
    //   url: app.globalData.Murl + '/Applets/Active/step_detail',
    //   method: "post",
    //   success: function (res) {
    //     that.setData({
    //       rule: res.data.rule,
    //       finish_num: res.data.finish_num,
    //       total_num: res.data.total_num,
    //       tit: res.data.rule[0].step_number,
    //       remainNum: res.data.goods_num
    //     })
    //   }
    // })
    wx.showShareMenu({
      withShareTicket: true
    })
    //请求数据
   
    var Cteamid = decodeURIComponent(options.scene);
    console.log(Cteamid)

    if (Cteamid) {
      that.setData({
        team_id: Cteamid
      })
    }
   
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
                  console.log(res)
                },
                complete: function () {//进入页面获得战队信息
                  wx.request({
                    url: app.globalData.Murl + '/Applets/Active/create_detail',
                    data: { team_id: that.data.team_id, member_id: wx.getStorageSync("userinfo").uid },
                    method: 'post',
                    success: function (res) {
                      console.log(res)
                      var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                      console.log(kk)
                      var klist = [];
                      if (kk != 0) {
                        for (var i = 0; i < kk; i++) {
                          klist.push(1)
                        }
                      }
                      that.setData({
                        actInfo: res.data.info,
                        people_step: res.data.people_step,
                        teamMember: res.data.info.member_info,
                        ac_id: res.data.info.step_id,
                        klist: klist
                      })
                      if (res.data.info.step_people_num <= 5) {
                        that.setData({
                          five: "height:1220rpx;",
                          cc:"flex:1;"
                        })
                      }else{
                        that.setData({
                          five: "height:1430rpx;"
                        })
                      }
                      if (res.data.info.step_number - res.data.info.total_mem < 0) {
                        that.setData({
                          remainStep: 0
                        })
                      } else {
                        that.setData({
                          remainStep: res.data.info.step_number - res.data.info.total_mem
                        })
                      }

                      if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，
                        wx.redirectTo({
                          url: '/pages/hasbeencompleted/hasbeencompleted?rice_rand=' + res.data.rice_rand
                        })
                      }
                      if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                        that.setData({
                          sta1: 2
                        })
                      }
                      if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                        that.setData({
                          sta1: 3
                        })
                      }
                      if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                        that.setData({
                          sta1: 4
                        })
                      }
                      if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                        that.setData({
                          sta1: 5,
                          num: res.data.num,
                          now: "display:block"
                        })
                        // 倒计时
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
                      }
                      if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          duration: 3000
                        })

                      }

                    }
                  })
                }
              })
            },
            fail: function () {

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
                                  if (Cteamid) {
                                    wx.redirectTo({
                                      url: '/pages/m-step3/m-step3?scene=' + Cteamid,
                                    })
                                  }
                                 
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

              }
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
                    complete: function () {//进入页面获得战队信息
                      wx.request({
                        url: app.globalData.Murl + '/Applets/Active/create_detail',
                        data: { team_id: that.data.team_id, member_id: wx.getStorageSync("userinfo").uid },
                        method: 'post',
                        success: function (res) {
                          console.log(res)
                          var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                          console.log(kk)
                          var klist = [];
                          if (kk != 0) {
                            for (var i = 0; i < kk; i++) {
                              klist.push(1)
                            }
                          }
                          that.setData({
                            actInfo: res.data.info,
                            teamMember: res.data.info.member_info,
                            ac_id: res.data.info.step_id,
                            klist: klist
                          })
                          if (res.data.info.step_people_num<=5){
                            that.setData({
                              five:"height:1220rpx;",
                              cc: "flex:1;"
                            })
                          }else{
                            that.setData({
                              five: "height:1430rpx;"
                            })
                          }
                          if (res.data.info.step_number - res.data.info.total_mem < 0) {
                            that.setData({
                              remainStep: 0
                            })
                          } else {
                            that.setData({
                              remainStep: res.data.info.step_number - res.data.info.total_mem
                            })
                          }
                          if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，
                            wx.redirectTo({
                              url: '/pages/hasbeencompleted/hasbeencompleted?rice_rand=' + res.data.rice_rand
                            })
                          }
                          if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                            that.setData({
                              sta1: 2
                            })
                          }
                          if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                            that.setData({
                              sta1: 3
                            })
                          }
                          if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                            that.setData({
                              sta1: 4
                            })
                          }
                          if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                            that.setData({
                              sta1: 5,
                              num: res.data.num,
                              now: "display:block"
                            })
                            // 倒计时
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
                          }
                          if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                            wx.showToast({
                              title: res.data.msg,
                              icon: 'none',
                              duration: 3000
                            })

                          }

                        }
                      })
                    }
                  })
                },
                fail: function () {
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
                                      //console.log(that.data.team_id);                                
                                      if (Cteamid) {
                                        wx.redirectTo({
                                          url: '/pages/m-step3/m-step3?scene=' + Cteamid,
                                        })
                                      }
                                     
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

                  }
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
  UserInfo: function (e) {//开通权限

   user.user(e)
  },
  gostep: function (e) {//回到拼步数首页
    var that = this;
    var formId = e.detail.formId;
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {

      }
    })
    wx.navigateTo({
      url: '/pages/m-step/m-step',
    })
  },
  fold: function (e) {//拼步攻略展示
    var formId = e.detail.formId;
    this.setData({
      foldClass: 'display:block'
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {

      }
    })
  },
  close: function (e) {//拼步攻略关闭
    var formId = e.detail.formId;
    this.setData({
      foldClass: 'display:none'
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {

      }
    })
  },
  close2: function () {//人满还差多少步显示
    this.setData({
      now: "display:none"
    })

  },
  top: function (e) {//去商城首页
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  again: function (e) {//再次组队
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '/pages/m-step2/m-step2',
    })

  },
  gopyq: function (e) {//分享到朋友圈
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
    var goodid = e.detail.value.goodid;
    console.log(that.data.uid)
    console.log(that.data.team_id)
    console.log(goodid);
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/xcx_code',
      data: { member_id: that.data.uid, team_id: that.data.team_id, goods_id: goodid },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/fxm/fxm?goodname=' + res.data.goods_name + "&fxcode=" + res.data.code,
          })
        } else if (res.data.status == -4) {
          wx.showToast({
            title: "该商品已下架或不存在",
            icon: "none",
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "系统繁忙",
            icon: "none",
            duration: 1000
          })
        }
      }
    })

  },
  Submit: function (e) {//立即加入
    var that = this;
    var team_id = e.detail.value.teamid;


    var ac_id = e.detail.value.acid;
    var form_id = e.detail.formId;

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
                      url: app.globalData.Murl + '/Applets/Active/join_team',
                      data: { member_id: that.data.uid, ac_id: ac_id, team_id: that.data.team_id, formid: form_id },
                      method: 'post',
                      success: function (res) {
                        if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                          })
                        }
                        if (res.data.status == -3) {
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                          })

                        }

                        if (res.data.status == 1 || res.data.status == 2 || res.data.status == 3) {
                          wx.request({
                            url: app.globalData.Murl + '/Applets/Active/create_detail',
                            data: { team_id: that.data.team_id, member_id: that.data.uid },
                            method: 'post',
                            success: function (res) {
                              console.log(res)
                              var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                              console.log(kk)
                              var klist = [];
                              if (kk != 0) {
                                for (var i = 0; i < kk; i++) {
                                  klist.push(1)
                                }
                              }
                              that.setData({
                                actInfo: res.data.info,
                                teamMember: res.data.info.member_info,
                                ac_id: res.data.info.step_id,
                                klist: klist
                              })
                              if (res.data.info.step_people_num <= 5) {
                                that.setData({
                                  five: "height:1220rpx;",
                                  cc: "flex:1;"
                                })
                              }else{
                                that.setData({
                                  five: "height:1430rpx;"
                                })
                              }
                              if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，

                                wx.redirectTo({
                                  url: '/pages/hasbeencompleted/hasbeencompleted?rice_rand=' + res.data.rice_rand
                                })
                              }
                              if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                                that.setData({
                                  sta1: 2
                                })
                              }
                              if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                                that.setData({
                                  sta1: 3

                                })
                              }
                              if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                                that.setData({
                                  sta1: 4
                                })
                              }
                              if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                                that.setData({
                                  sta1: 5,
                                  num: res.data.num,
                                  now: "display:block"
                                })
                                // 倒计时
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
                              }
                              if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                                wx.showToast({
                                  title: res.data.msg,
                                  icon: 'none',
                                  duration: 1000
                                })

                              }

                            }
                          })
                        }

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

      wx.request({
        url: app.globalData.Murl + '/Applets/Active/join_team',
        data: { member_id: that.data.uid, ac_id: ac_id, team_id: that.data.team_id, formid: form_id },
        method: 'post',
        success: function (res) {
          console.log(res)
          if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })

          }
          if (res.data.status == 1 || res.data.status == 2 || res.data.status == 3) {
            wx.request({
              url: app.globalData.Murl + '/Applets/Active/create_detail',
              data: { team_id: that.data.team_id, member_id: that.data.uid },
              method: 'post',
              success: function (res) {
                console.log(res)
                var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                console.log(kk)
                var klist = [];
                if (kk != 0) {
                  for (var i = 0; i < kk; i++) {
                    klist.push(1)
                  }
                }

                that.setData({
                  actInfo: res.data.info,
                  teamMember: res.data.info.member_info,
                  ac_id: res.data.info.step_id,
                  klist: klist
                })
                if (res.data.info.step_people_num <= 5) {
                  that.setData({
                    five: "height:1220rpx;",
                    cc: "flex:1;"
                  })
                }else{
                  that.setData({
                    five: "height:1430rpx;"
                  })
                }
                if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，

                  wx.redirectTo({
                    url: '/pages/hasbeencompleted/hasbeencompleted?rice_rand=' + res.data.rice_rand
                  })
                }
                if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                  that.setData({
                    sta1: 2
                  })
                }
                if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                  that.setData({
                    sta1: 3
                  })
                }
                if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                  that.setData({
                    sta1: 4
                  })
                }
                if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                  that.setData({
                    sta1: 5,
                    num: res.data.num,
                    now: "display:block"
                  })
                  // 倒计时
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
                }
                if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                  })

                }

              }
            })
          }


        }
      })
    }

  },
  join: function (e) {



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
    var that = this;

    return {
      title: '只差' + that.data.remainStep + '步啦！快来拼步数抢稻花香大米',
      path: '/pages/m-step3/m-step3?scene=' + that.data.team_id,
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