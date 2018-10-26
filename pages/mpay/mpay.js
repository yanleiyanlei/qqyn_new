const app = getApp()
Page({
  data: {
    weCharstatus: true,   // 全选状态，默认全选
    yuestutea: false,
    isFocus: false,//控制input 聚焦
    wallets_password_flag: false,//密码输入遮罩
    actual_fee: '20',
    actualpayment: '',
    orderid: "",
    sta: "",
    mdd: true,
    wz: ""
  },
  /*30分钟内完成支付*/
  // function toDate(number){  
  //   const dateTime = new Date(number * 1000);  
  //   const year = dateTime.getFullYear();  
  //   const minute = dateTime.getMinutes();  
  //   const second = dateTime.getSeconds();  
  //   const now = new Date();  
  //   const now_new = Date.parse(now.toDateString());  //typescript转换写法  
  //   const milliseconds = now_new - dateTime;  
  //   const timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;  
  //   return timeSpanStr;  
  // },
  // 支付
  selectAll(e) {
    let weCharstatus = this.data.weCharstatus;
    let yuestutea = this.data.yuestutea;
    weCharstatus = !weCharstatus;
    console.log(weCharstatus);
    if (weCharstatus == true) {
      this.setData({
        weCharstatus: weCharstatus,
        yuestutea: false
      });
    } else {
      this.setData({
        weCharstatus: weCharstatus,
      });
    }
  },
  selectAlls(e) {
    let yuestutea = this.data.yuestutea;
    yuestutea = !yuestutea;
    console.log(yuestutea);
    this.setData({
      yuestutea: yuestutea,
      weCharstatus: false,
    });
  },
  set_wallets_password(e) {//获取钱包密码
    var uid = wx.getStorageSync("userinfo").uid;
    var that = this;
    that.setData({
      wallets_password: e.detail.value
    });
    if (that.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      console.log(that.data.wallets_password);
      console.log(that.data.orderid);
      console.log(uid);
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/YuE_pay',
        data: {
          member_id: uid,
          inp_v: that.data.wallets_password,
          show_id: that.data.orderid,
        },
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          console.log(res.data)
          var datalist = res.data;
          if (datalist.data == -1) {
            wx.showToast({
              title: '您还未设置密码',
              icon: 'loading',
              duration: 2000
            })
          } else if (datalist.data == 1) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              if (that.data.wz == 1) {

                wx.redirectTo({
                  url: '/pages/m-order/m-order?sta=' + that.data.sta + "&coupon=" + that.data.coupon + "&end=" + that.data.end + "&tip=" + that.data.tip,
                })
              } else if (that.data.wz == 0) {
                wx.redirectTo({
                  url: '/pages/m-charge/m-cahrge'
                })
              }

            }, 1000)
          } else if (datalist.data == -4) {
            wx.showToast({
              title: '余额不足,请充值',
              icon: 'none',
              duration: 2000
            })
          } else if (datalist.data == -3) {
            wx.showToast({
              title: '密码错误',
              icon: 'loading',
              duration: 2000
            })
          }
        }
      })
    }
  },
  set_Focus() {//聚焦input
    console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  },
  close_wallets_password() {//关闭钱包输入密码遮罩
    this.setData({
      isFocus: false,//失去焦点
      wallets_password_flag: false,
      wallets_password: '',
    })
  },
  pay: function () {
    /*微信支付*/



    let weCharstatus = this.data.weCharstatus;
    let yuestutea = this.data.yuestutea;
    var orderid = this.data.orderid;
    console.log(orderid);
    var wz = this.data.wz;
    var that = this;
    var mdd = that.data.mdd;
    if (mdd) {
      wx.request({
        url: app.globalData.Murl + '/Applets/User/check_order',
        data: { order_number: that.data.order_number },
        method: "post",
        success: function (res) {
          if (res.data.status == 1) {
            if (weCharstatus == true) {
              var openid = wx.getStorageSync("userinfo").openId;
              // console.log(openid)
              //订单支付
              wx.request({
                url: app.globalData.Murl + '/Applets/Api/index',
                data: {
                  openid: openid,
                  orderid: orderid
                },
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                success: function (res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data['timeStamp'],
                    'nonceStr': res.data['nonceStr'],
                    'package': res.data['package'],
                    'signType': 'MD5',
                    'paySign': res.data['paySign'],
                    'success': function (res) {
                      //console.log("支付成功");
                      console.log(res)
                      wx.redirectTo({
                        url: '/pages/m-order/m-order?sta=' + that.data.sta+"&coupon="+that.data.coupon+"&end="+that.data.end+"&tip="+that.data.tip,
                      })


                    },
                    'fail': function (res) {

                    }
                  })
                }
              })

            } else if (yuestutea == true) {
              //var _this = this;
              that.setData({
                wallets_password_flag: true,
                isFocus: true
              })
            }









          } else if (res.data.status == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000
            })
          }
        }

      })
    } else {
      var openid = wx.getStorageSync("userinfo").openId;
      wx.request({
        url: app.globalData.Murl + '/Applets/Api/wx_recharge',
        data: {
          openid: openid,
          orderid: orderid
        },
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          console.log(res)
          wx.requestPayment({
            'timeStamp': res.data['timeStamp'],
            'nonceStr': res.data['nonceStr'],
            'package': res.data['package'],
            'signType': 'MD5',
            'paySign': res.data['paySign'],
            'success': function (res) {
              //console.log("支付成功");
              wx.switchTab({
                url: '/pages/my/my',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) { return; }
                  page.onLoad();
                }
              })


            },
            'fail': function (res) {

            }
          })
        }
      })


    }
  },
  /*设置密码*/
  newpwd(e) {
    wx.navigateTo({
      url: '../m-payPsw/m-payPsw',
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })
  },
  onLoad: function (options) {
    var uid = wx.getStorageSync("userinfo").uid;
     console.log(options)
    this.setData({
      order_number: options.orderNumber
    })
    //console.log(options.actualpayment);
    //console.log(options.orderNum)
    var _this = this;
    if (options.mdd == 0) {//余额充值
      _this.setData({
        actualpayment: options.money,
        sta: options.sta,
        mdd: false,
        wz: options.wz,
        weCharstatus: true
      })
      wx.request({
        url: app.globalData.Murl + '/Applets/User/pay1',
        data: { order_number: options.orderNum },
        method: "post",
        success: function (res) {
          console.log(res)
          if (res.data.status) {

            _this.setData({
              orderid: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 1000
          })
        }
      })

    } else {
      _this.setData({
        orderid: options.oid,
        actualpayment: options.money,
        sta: options.sta,
        mdd: true,
        wz: options.wz,
        coupon:options.coupon,
        end:options.end,
        tip:options.tip
      })
      // console.log(options.coupon)
    }


  }
})