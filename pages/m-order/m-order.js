
const app=getApp();
Page({
  data: {
    iskong: false,
    orderlist: [],
    active: 0,
    uid: "",
    tt:"display:none",
    showShare:false
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    //var uid=62;
    console.log(options)
    if (options.suc == 1){
      this.setData({
        showShare: true
      })
    }

    if (options.coupon=='1'){
      this.setData({
        tt: "display:block",
        tip:options.tip,
        end:options.end
      })
      console.log(options.time)
    } else if (options.coupon == 0){
      this.setData({
        tt: "display:none"
      })
    }
   
    var that = this;
    var f = options.sta;
    this.setData({
      uid: uid
    })
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_order' + f,
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          iskong: res.data.is_check,
          orderlist: res.data.order,
          active: f
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })
        wx.showToast({
          title: res.data.data,
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  onShare: function(){
    console.log(1)
    this.setData({
      showShare: false
    })
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
    // wx.navigateTo({
    //   url: '/pages/link/link',
    // })
  },
  pay: function (e) {
    var val = e.currentTarget.dataset;
    var order_number = val.ordernum;
     console.log(val)
    wx.redirectTo({
      url: '/pages/mpay/mpay?oid=' + val.oid + '&money=' + val.money + '&sta=' + val.sta + '&wz=1&orderNumber=' + order_number + '&coupon=' + val.coupon+"&end="+val.end+"&tip="+val.tip,
    })
    // wx.request({
    //   url: app.globalData.Murl+'/Applets/User/check_order',
    //   data: { order_number: order_number },
    //   method: "post",
    //   success: function (res) {
    //     if (res.data.status == 1) {
    //       wx.redirectTo({
    //         url: '/pages/mpay/mpay?oid=' + val.oid + '&money=' + val.money + '&sta=' + val.sta + '&wz=1',
    //       })
    //     } else if (res.data.status == 0) {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none",
    //         duration: 2000
    //       })
    //     }
    //   }

    // })
    //console.log(val)
    //  wx.request({
    //   url: app.globalData.Murl+'/Applets/User/check_order',
    //   data: { order_number: order_number },
    //   method: "post",
    //   success: function (res) {
    //     if (res.data.status == 1) {
    //       wx.redirectTo({
    //         url: '/pages/mpay/mpay?oid=' + val.oid + '&money=' + val.money + '&sta=' + val.sta + '&wz=1&orderNum=' + order_number,
    //       })
    //     } else if (res.data.status == 0) {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none",
    //         duration: 2000
    //       })
    //     }
    //   }

    // })

  },
  logistic: function (e) {
    var oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/m-logistic/m-logistic?oid=' + oid,
    })
  },
  remindDeliver: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/send_goods',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {//提醒发货成功
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  wx.request({
                    url: app.globalData.Murl+'/Applets/User/m_order' + f,
                    data: { member_id: uid },
                    method: "post",
                    success: function (res) {
                      that.setData({
                        iskong: res.data.is_check,
                        orderlist: res.data.order,
                        active: f
                      })
                    },
                    fail: function () {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: "none",
                        duration: 1000
                      })
                      // wx.showToast({
                      //   title: res.data.data,
                      //   icon: "none",
                      //   duration: 1000
                      // })
                    }
                  })
                }, 1000)
            }, 1000)
        } else if (res.data.status == 0) {//提醒发货失败
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })

          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)


        }

        // else {
        //   wx.showToast({
        //     title: '订单已经提醒',
        //     icon:'none',
        //     duration: 1000
        //   })

        //   setTimeout(
        //     function () {
        //       wx.hideToast();

        //     }, 1000)
        // }

      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 1000)
      }
    })

  },


  confirmReceipt: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/sure_goods',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {//收货成功
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  wx.request({
                    url: app.globalData.Murl+'/Applets/User/m_order' + f,
                    data: { member_id: uid },
                    method: "post",
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        iskong: res.data.is_check,
                        orderlist: res.data.order,
                        active: f
                      })
                    },
                    fail: function () {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: "none",
                        duration: 1000
                      })
                      wx.showToast({
                        title: res.data.data,
                        icon: "none",
                        duration: 1000
                      })
                    }
                  })
                }, 1000)
            }, 1000)
        } else if (res.data.status == 0) {//收货失败



          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })

          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)
        }

      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 1000)
      }
    })



  },
  cancelOrder: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/order_cancel',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {//取消成功
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  wx.request({
                    url: app.globalData.Murl+'/Applets/User/m_order' + f,
                    data: { member_id: uid },
                    method: "post",
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        iskong: res.data.is_check,
                        orderlist: res.data.order,
                        active: f
                      })
                    },
                    fail: function () {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: "none",
                        duration: 1000
                      })
                      wx.showToast({
                        title: res.data.data,
                        icon: "none",
                        duration: 1000
                      })
                    }
                  })
                }, 1000)
            }, 1000)

        } else if (res.data.status == 0) {//系统繁忙
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)

        } else if (res.data.status == 3) {//取消成功，2-3到账
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  wx.request({
                    url: app.globalData.Murl+'/Applets/User/m_order' + f,
                    data: { member_id: uid },
                    method: "post",
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        iskong: res.data.is_check,
                        orderlist: res.data.order,
                        active: f
                      })
                    },
                    fail: function () {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: "none",
                        duration: 1000
                      })
                      wx.showToast({
                        title: res.data.data,
                        icon: "none",
                        duration: 1000
                      })
                    }
                  })
                }, 1000)
            }, 1000)

        } else if (res.data.status == 2) {//无法取消
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)

        }


      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 1000)
      }
    })
  },
  deleteOrder: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/order_del',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {//删除成功
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  wx.request({
                    url: app.globalData.Murl+'/Applets/User/m_order' + f,
                    data: { member_id: uid },
                    method: "post",
                    success: function (res) {
                      console.log(res)
                      that.setData({
                        iskong: res.data.is_check,
                        orderlist: res.data.order,
                        active: f
                      })
                    },
                    fail: function () {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: 'none',
                        duration: 1000
                      })
                      wx.showToast({
                        title: res.data.data,
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  })
                }, 1000)

            }, 1000)
        } else if (res.data.status == 0) {//删除失败
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)



        }
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 1000)
      }
    })
  },
  orderReload: function (e) {
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    var that = this;
    var f = e.currentTarget.dataset.sta;
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_order' + f,
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          iskong: res.data.is_check,
          orderlist: res.data.order,
          active: f
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })
        setTimeout(
          function () {
            wx.hideToast()
          }, 1000)
      }
    })
  },
  close: function () {//关闭优惠券弹窗
    this.setData({
      tt: "display:none"
    })
  }
})