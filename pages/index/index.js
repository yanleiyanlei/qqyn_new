
//获取腾讯地图应用实例
var QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: '5UPBZ-OQLKD-AE44M-HBYKJ-32WLH-2JBKT'   //密钥
})
//获取应用实例
const app = getApp()
var user = require("../../lib/js/user.js")
// var common = require("../../lib/js/common.js");
Page({
  data: {
    mshow: "display:none",
    cs: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenLoading: true,
    location: "北京",
    // 首页banner
    bannerUrls: [],
    banner: {
      bannerlink: [],
      bannersrc: []
    },
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    // 导航
    navUrls: [],
    //青青活动
    qqactiveUrls: [],
    //今日推荐
    todayUrls: [],
    // 青粉推荐
    qfUrls: {},
    //商品四个类目
    goodsType: {},
    ewmimg: ["http://m.7710mall.com/Public/Home/img/m_ma.png"]
  },
  gowx: function () {
    wx.switchTab({
      url: '/pages/members/members',
    })
  },
  previewImage: function (e) {
    //console.log("点击图片")
    wx.previewImage({
      current: this.data.ewmimg, // 当前显示图片的http链接   
      urls: this.data.ewmimg // 需要预览的图片http链接列表   
    })
  },
  cs: function () {
    //console.log("点击")
    this.setData({ cs: false })
  },
  gz: function () {
    this.setData({ cs: true })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  close: function () {
    this.setData({
      mshow: "display:none"
    })
  },
  UserInfo: function (e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e)
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     var utoken = wx.getStorageSync("utoken");
    //     wx.request({
    //       //用户登陆URL地址，请根据自已项目修改
    //       url: app.globalData.Murl+'/Applets/Login/userAuthSlogin',
    //       method: "POST",
    //       data: {
    //         utoken: utoken,
    //         code: code,
    //         encryptedData: e.detail.encryptedData,
    //         iv: e.detail.iv
    //       },
    //       fail: function (res) {
    //       },
    //       success: function (res) {
    //         var utoken = res.data.utoken;
    //         //设置用户缓存
    //         wx.setStorageSync("utoken", utoken);
    //         wx.setStorageSync("userinfo", res.data.userinfo);
    //         //console.log("允许");
    //       }
    //     })
    //   }
    // })
  },
  // 添加购物车=================
  cart: function (e) {
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    } else {
      var uid = wx.getStorageSync("userinfo").uid;
      var goods_id = e.currentTarget.dataset.goodsid;
      var spec_key = e.currentTarget.dataset.key;
      //console.log(uid)
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
        data: {
          member_id: uid,//会员ID
          goods_id: goods_id, //商品ID
          goods_num: 1, //商品数量
          spec_key: spec_key
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res.data)
          var txt = res.data.msg
          var num = res.data.thisGoodsNum
          e.currentTarget.dataset.num = num
          //console.log(e.currentTarget.dataset.num)
          wx.showToast({
            title: txt,
            icon: 'none',
            duration: 2000
          })
          if (res.data.status == 1) {
            // 重新更新购物车数据表
            const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
            wx.request({
              url: shopusr,
              data: {
                member_id: uid,
                seller_id: 1,
              },
              method: "POST",
              success: function (res) {
                //console.log(res.data.cartList)

                that.setData({
                  cartList: res.data.cartList
                })

              }
            })

          } else if (res.data.status == 10){//by yan.lei 一键代发执行跳转
            wx.navigateTo({
              url: '../theorder/theorder?goods_id=' + goods_id + '&num=1' + '&spec_key=' + spec_key + '&page=' + 1,
              success: function (res) { console.log(res) },
              fail: function (res) { console.log(res) },
              complete: function (res) { console.log(res) },
            })
          }

        },
        fail: function (res) {
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
  // 商品跳转详情================
  goodsDetails: function (e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  onHide:function(){
    app.globalData.store = 0
  },
   onLoad: function (options) {
  //  console.log(options)
     var pid = options.pid;
     console.log(pid);
     if(pid){
       wx.setStorageSync("pid", pid);
     }
     var uid = wx.getStorageSync("userinfo").uid;
     var that = this;
     
    // 获取购物车列表



    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data.cartList)

        that.setData({
          cartList: res.data.cartList
        })

      }
    })
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.SDKVersion)//小程序版本库,低于1.9.0首页商品展示不兼容.

      }
    })


    // 分享带票据===用作分享团购拼团操作部分数据。获取用户和群基本信息
    wx.showShareMenu({
      withShareTicket: true
    })


    // 获取用户地点
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {

        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (ress) {

            //console.log(ress);
            that.setData({ location: ress.result.address_component.province });
          }
        })
      },
      fail: function () {
        //console.log("获取失败")
        wx.showModal({
          title: '提示',
          content: '您未授权访问位置，请点击确定授权，方便购物。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  //console.log(res)
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'gcj02',
                      success: function (res) {
                        //console.log(res)
                        demo.reverseGeocoder({
                          location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                          },
                          success: function (ress) {

                            //console.log(ress);
                            that.setData({ location: ress.result.address_component.province });

                          }
                        })
                      }

                    })
                  }
                }, fail: function (res) {

                }
              })

            }
          }
        })

      }
    })



    // 首页banner轮播=========================================

    wx.request({
      url: app.globalData.Murl + '/Applets/Index/banner',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var banner = []
        console.log(res.data)
        var len = res.data.length
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ad_position == 66) {
            banner.push({ "bannerlink": res.data[i].link_url, "bannersrc": res.data[i].ad_img });

          } else {
            if (res.data[i].link_url == "") {
              banner.push({ "bannersrc": res.data[i].ad_img });

            } else {


              var link = res.data[i].link_url.split("/")
              var cas = link[link.length - 1].split(".")[0]
              var cas2 = link[link.length - 1].split("=")[1]
              //console.log(link)
              for (var j = 0; j < link.length; j++) {
                // 循环判断跳转到是分类页面还是详情页面

                if (link[j] == "classify_content") {
                  var j = Number(j)
                  // console.log(link[j + 1] )

                  // 判断是二级分类father_id还是一级分类parents_id
                  if (link[j + 1] == "parents_id") {

                    var blink = "../classifyGoods/classifyGoods?id=" + cas
                    var sj = { "bannerlink": blink, "bannersrc": res.data[i].ad_img }
                    banner.push(sj)
                    break

                  } else if (link[j + 1] == "father_id") {
                    var blink = '../secondGoods/secondGoods?page=2&twoType=' + cas
                    var sj = { "bannerlink": blink, "bannersrc": res.data[i].ad_img }
                    banner.push(sj)
                    break
                  }


                } else if (link[j] == "goodsdetails") {
                  var blink = "../details/details?goodsid=" + cas

                  var sj = { "bannerlink": blink, "bannersrc": res.data[i].ad_img }
                  banner.push(sj)
                  break

                } else if (link.length == 7) {
                  var blink = "../details/details?goodsid=" + cas2

                  var sj = { "bannerlink": blink, "bannersrc": res.data[i].ad_img }
                  banner.push(sj)
                  break
                }

              }
            }






          }


        }




        that.setData({ banner: banner })
        //console.log(that.data.banner)



        that.setData({ bannerUrls: res.data })

      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })

    //nav导航图片及连接=======================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/icon',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({ navUrls: res.data })

      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })
    //青青活动图片及跳转=================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/qqhd',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //  处理链接 分隔截取出页面和对应的商品参数
        var link = res.data[0].link_url.split("/")
        var len = link.length - 1
        var cas = link[len]
        for (var i in link) {
          //console.log(link[i])
          //  判断青青活动跳转页面 goodsdetails商品详情页面。
          if (link[i] == "goodsdetails") {
            that.setData({ qqhdlink: "../details/details?goodsid=" + cas })
            break
          } else if (link[i] == "classify_content") {
            that.setData({ qqhdlink: "../classifyGoods/classifyGoods?id=" + cas })
            break
          }
        }
        that.setData({ qqactiveUrls: res.data })


      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })
    //今日推荐商品=======================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/recommend',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({ todayUrls: res.data })
      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })

    //青粉推荐=========================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/hot',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)

        that.setData({ qfUrls: res.data })


      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })
    // 商品四个类目============================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/goods_list',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)

        that.setData({ goodsType: res.data })

      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      }
    })






  },
  onShow: function () {
    var that = this;
    console.log(app.globalData.store)
    if (app.globalData.store == 1) {
      that.setData({
        store: true
      })
    } else {
      that.setData({
        store: false
      })
    }
    if (app.globalData.store == 1) {
      wx.request({
        url: app.globalData.Murl + "/Applets/User/my_shop",
        data: { member_id: wx.getStorageSync("userinfo").uid },
        method: 'post',
        success: function (res) {

          that.setData({
            shop: res.data
          })
        }
      })
    }
    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    } else {
      that.setData({
        mshow: "display:none"
      })
    }

    //console.log(1)

    // 获取购物车列表
    var uid = wx.getStorageSync("userinfo").uid;
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data.cartList)

        that.setData({
          cartList: res.data.cartList
        })

      }
    })
  },
  onShareAppMessage: function () {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/index/index?id=' + 123 + '&pid=' + uid,
      imageUrl: '',
      success: function (res) {
        console.log(res)
        // console.log
        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   },
        //   fail: function (res) { console.log(res) },
        //   complete: function (res) { console.log(res) }
        // })
      },
      fail: function (res) {
        // 分享失败
        //console.log(res)
      }
    }
  }

  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }


})
