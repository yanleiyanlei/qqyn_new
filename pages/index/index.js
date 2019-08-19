//获取腾讯地图应用实例
const QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
const request = require('../../utils/util.js');
const demo = new QQMapWX({
  key: '5UPBZ-OQLKD-AE44M-HBYKJ-32WLH-2JBKT' //密钥
})
//获取应用实例
const app = getApp()
const user = require("../../lib/js/user.js")
var setInterTimer = null;
Page({
  data: {
    mshow: "display:none",
    cs: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenLoading: true,
    location: "北京市",
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
    ewmimg: ["http://m.7710mall.com/Public/Home/img/m_ma.png"],
    swiperCurrent: 0,
    //每日秒杀
    dailySpike:[],
    dailySpikeIndex: 0,
    dailySpikeShow: true,
    isPhone:false
  },
  //获取手机号信息
  getPhoneNumber(e) {
    let that = this;
    // console.log(e)
    if (e.detail.iv){
      let uid = wx.getStorageSync("userinfo").uid;
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/getPhone',
        method: "POST",
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          member_id: uid
        },
        success: function (res) {
          console.log("getPhoneNumber",res)
          if(res.data.status == 1){
            wx.showTabBar({})
            app.globalData.isPhone = true; 
            that.setData({
              isPhone: false
            })
          }
        }
      })
    }
  },
  //跳转连接
  goUrl:function(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    console.log()
    if (index == this.data.bannerCon.length - 1){
      //console.log(1111111111111);
      
      wx.navigateToMiniProgram({
        appId: 'wxc23d0a231b36d62d',
        path: 'pages/goods/detail?id=56060360149&recommendType=-1',
        envVersion: 'release',
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }else{
      var url = e.currentTarget.dataset.url;
      let splitUrl = url.split('/');
      console.log(splitUrl)
      let len = splitUrl.length;
      if (splitUrl[len - 2] == 'classify') {
        var idArr = url.split('?');
        app.globalData.tabBarId = idArr[1].split('=')[1];
        wx.switchTab({
          url: '/pages/classify/classify'
        })
      } else {
        wx.navigateTo({
          url: url
        })
      }
    }
    
  },
  intervalChange:function(e){
    console.log(e.detail.current);
    if (e.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.current == 0 && this.data.dailySpikeIndex > 1) {//卡死时，重置current为正确索引
        this.setData({ dailySpikeIndex: this.data.dailySpikeIndex });
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ dailySpikeIndex: e.detail.current });
      }
    }
  },
  //轮播图的切换事件
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  golaAdd: function() {
    wx.navigateTo({
      url: '/pages/laAdd/laAdd',
    })
  },
  gowx: function() {
    wx.switchTab({
      url: '/pages/members/members',
    })
  },
  previewImage: function(e) {
    //console.log("点击图片")
    wx.previewImage({
      current: this.data.ewmimg, // 当前显示图片的http链接   
      urls: this.data.ewmimg // 需要预览的图片http链接列表   
    })
  },
  cs: function() {
    //console.log("点击")
    this.setData({
      cs: false
    })
  },
  gz: function() {
    this.setData({
      cs: true
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  UserInfo: function(e) {
    console.log(e);
    if (e.detail.iv) {
      //    app.globalData.source

      this.setData({
        mshow: "display:none",
        isPhone:true
      })
    }
    user.user(e,this.isPhoneFun);
  },
  isPhoneFun:function(obj){
    let that = this;
    console.log('isPhoneFun',obj);
    if (obj.data.status == 1){
      that.setData({
        mshow: "display:none",
        isPhone: true
      })
    } else if (obj.data.status == 0){
      app.globalData.isPhone = true;
      that.setData({
        isPhone: false
      })
      wx.showTabBar({});
    }
  },
  // 添加购物车=================
  cart: function(e) {
    let goods = e.currentTarget.dataset.goods;
    console.log('cart',e);
    //预售商品 不可加入购物车
    if (goods.is_sale==1) {
      wx.showToast({
        title: '商品暂未开售',
        icon:'none',
        duration:2000
      })
      return;
    }
    let that = this;
    // var city = "哈尔滨";
    let city = app.globalData.location;
    let uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    } else {
      if (!goods.spec_key){
        wx.showToast({
          title: "没有设置规格",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      //console.log(uid)
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
        data: {
          member_id: uid, //会员ID
          goods_id: goods.goods_id, //商品ID
          goods_num: 1, //商品数量
          spec_key: goods.spec_key,
          city: city
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          var txt = res.data.msg
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
              success: function(res) {
                //console.log(res.data.cartList)
                that.setData({
                  cartList: res.data.cartList
                })

              }
            })

          } else if (res.data.status == 10) { //by yan.lei 一键代发执行跳转
            wx.navigateTo({
              url: '../theorder/theorder?goods_id=' + goods_id + '&num=1' + '&spec_key=' + spec_key + '&page=' + 1,
              success: function(res) {
                console.log(res)
              },
              fail: function(res) {
                console.log(res)
              },
              complete: function(res) {
                console.log(res)
              },
            })
          }

        },
        fail: function(res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          var timer = setTimeout(function() {
            wx.hideLoading();
            clearTimeout(timer);
          }, 2000)

        }
      })
    }

  },
  // 商品跳转详情================
  goodsDetails: function(e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  //每日秒杀
  mrms:function(){
    var that = this;
    const shopusr = "/Applets/Index/getBargainsRushGoodsList";
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/getBargainsRushGoodsList',
      method:'post',
      data:{},
      success:function(data){
        //console.log(data)
        var data = data.data;
        if (data.code == 200) {
          // console.log(data);
          if (data.data == null) {
            that.setData({
              dailySpikeShow: false
            })
          } else {
            that.setData({
              dailySpikeShow: true,
              dailySpike: data.data.goods_list
            });
          }

          if (data.data) {
            var startTime = data.data.info.current_time;
            var endTime = data.data.info.end_time;
            var time_distance = (endTime - startTime);

            function time(time_distance) {
              var int_day = Math.floor(time_distance / 86400000);
              time_distance -= int_day * 86400000;
              // 时
              var int_hour = Math.floor(time_distance / 3600000)
              time_distance -= int_hour * 3600000;
              // 分
              var int_minute = Math.floor(time_distance / 60000)
              time_distance -= int_minute * 60000;
              // 秒
              var int_second = Math.floor(time_distance / 1000)
              // 时分秒为单数时、前面加零
              if (int_day < 10) {
                int_day = "0" + int_day;
              }
              if (int_hour < 10) {
                int_hour = "0" + int_hour;
              }
              if (int_minute < 10) {
                int_minute = "0" + int_minute;
              }
              if (int_second < 10) {
                int_second = "0" + int_second;
              }
              that.setData({
                hour: int_hour,
                minute: int_minute,
                second: int_second,
              })
              if (int_hour == '00' && int_minute == '00' && int_second == '00') {
                that.mrms();
              }
            }


            clearInterval(setInterTimer);
            setInterTimer = setInterval(function () {
              time_distance -= 1000;
              time(time_distance);
            }, 1000)
          }


        } else {
          wx.showLoading({
            title: '网络连接失败！',
          })
          var timer = setTimeout(function () {
            wx.hideLoading();
            clearTimeout(timer);
          }, 2000)
        }
      }
    })
    /*request.request(shopusr, {},'post').then(function (data) {
      if(data.code == 200){
        // console.log(data);
        if (data.data == null) {
          that.setData({
            dailySpikeShow: false
          })
        } else {
          that.setData({
            dailySpikeShow: true,
            dailySpike: data.data.goods_list
          });
        }

        if (data.data){
          var startTime = data.data.info.current_time;
          var endTime = data.data.info.end_time;
          var time_distance = (endTime - startTime);

          function time(time_distance) {
            var int_day = Math.floor(time_distance / 86400000);
            time_distance -= int_day * 86400000;
            // 时
            var int_hour = Math.floor(time_distance / 3600000)
            time_distance -= int_hour * 3600000;
            // 分
            var int_minute = Math.floor(time_distance / 60000)
            time_distance -= int_minute * 60000;
            // 秒
            var int_second = Math.floor(time_distance / 1000)
            // 时分秒为单数时、前面加零
            if (int_day < 10) {
              int_day = "0" + int_day;
            }
            if (int_hour < 10) {
              int_hour = "0" + int_hour;
            }
            if (int_minute < 10) {
              int_minute = "0" + int_minute;
            }
            if (int_second < 10) {
              int_second = "0" + int_second;
            }
            that.setData({
              hour: int_hour,
              minute: int_minute,
              second: int_second,
            })
            if (int_hour == '00' && int_minute == '00' && int_second == '00') {
              that.mrms();
            }
          }


          clearInterval(setInterTimer);
          setInterTimer = setInterval(function () {
            time_distance -= 1000;
            time(time_distance);
          }, 1000)
        }
        

      }else{
        wx.showLoading({
          title: '网络连接失败！',
        })
        var timer = setTimeout(function () {
          wx.hideLoading();
          clearTimeout(timer);
        }, 2000)
      }
    }) */
  },
  onHide: function() {
    app.globalData.store = 0
  },
  onLoad: function(options) {
    //  console.log(options)
    //第三方跳转过来的小程序 app.globalData.source
    if (app.globalData.source != '') {
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/xcx_cou',
        method: 'post',
        data: {
          member_id: wx.getStorageSync("userinfo").uid
        },
        success: function (res) {
          console.log(res)

          wx.showToast({
            title: res.data.msg,
            duration: 2500,
            success: function () {
              if (res.data.status == 1) {
                wx.switchTab({
                  url: '/pages/my/my'
                })
              } else {
                return;
              }
            }
          })
        }
      })
    }
    console.log('onload', options);
    if(options.source){
      app.globalData.source = options.source;
    }
    var pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }
    //by yan.lei 对方会把wi传进来 扔缓存里
    var wi = options.wi;
    if (wi) {
      wx.setStorageSync("wi", wi);
    }


    var uid = wx.getStorageSync("userinfo").uid;
    var that = this;
    // 获取购物车列表
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    request.request("/Applets/Cart/ajaxCartList", {
      member_id: uid,
      seller_id: 1,
    }, ).then(function(data) {
      that.setData({
        cartList: data.cartList
      })
    })
    wx.getSystemInfo({
      success: function(res) {
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
      success: function(res) {
        console.log(res,123123)
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(ress) {

            console.log(ress);
            that.setData({
              location: ress.result.address_component.province
            });
            wx.setStorageSync("locationcity", ress.result.address_component.province);
            wx.setStorageSync("city", ress.result.address_component.city);
            wx.setStorageSync("district", ress.result.address_component.district);
            wx.setStorageSync("province", ress.result.address_component.province);
            wx.setStorageSync("locationid", "");
            wx.setStorageSync("locationadd", "");
          }
        })

      },
      fail: function() {
        //console.log("获取失败")
        wx.showModal({
          title: '提示',
          content: '您未授权访问位置，请点击确定授权，方便购物。',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  //console.log(res)
                  if (res.authSetting["scope.userLocation"]) { ////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'gcj02',
                      success: function(res) {
                        //console.log(res)
                        demo.reverseGeocoder({
                          location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                          },
                          success: function(ress) {

                            //console.log(ress);
                            that.setData({
                              location: ress.result.address_component.province
                            });
                            wx.setStorageSync("locationcity", ress.result.address_component.province)
                          }
                        })
                      }

                    })
                  }
                },
                fail: function(res) {

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
      success: function(res) {
        var banner = []
        // console.log(res.data)
        var len = res.data.length;
        if (res.data){
          that.setData({
            bannerCon: res.data
          })
        }
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ad_position == 66) {
            banner.push({
              "bannerlink": res.data[i].link_url,
              "bannersrc": res.data[i].ad_img
            });

          } else {
            if (res.data[i].link_url == "") {
              banner.push({
                "bannersrc": res.data[i].ad_img
              });

            } else {


              var link = res.data[i].link_url.split("/")
              var cas = link[link.length - 1].split(".")[0]
              var cas2 = link[link.length - 1].split("=")[1]
              //console.log(link)
              var falg_banner = false;
              for (var j = 0; j < link.length; j++) {
                // 循环判断跳转到是分类页面还是详情页面

                if (link[j] == "classify_content") {
                  falg_banner = true
                  var j = Number(j)
                  // console.log(link[j + 1] )

                  // 判断是二级分类father_id还是一级分类parents_id
                  if (link[j + 1] == "parents_id") {

                    var blink = "../classifyGoods/classifyGoods?id=" + cas
                    var sj = {
                      "bannerlink": blink,
                      "bannersrc": res.data[i].ad_img
                    }
                    banner.push(sj)
                    break

                  } else if (link[j + 1] == "father_id") {
                    var blink = '../secondGoods/secondGoods?page=2&twoType=' + cas
                    var sj = {
                      "bannerlink": blink,
                      "bannersrc": res.data[i].ad_img
                    }
                    banner.push(sj)
                    break
                  }


                } else if (link[j] == "goodsdetails") {
                  falg_banner = true;
                  var blink = "../details/details?goodsid=" + cas

                  var sj = {
                    "bannerlink": blink,
                    "bannersrc": res.data[i].ad_img
                  }
                  banner.push(sj)
                  break

                }
              }
              if (falg_banner == false) {
                var blink = res.data[i].xcx_url

                var sj = {
                  "bannerlink": blink,
                  "bannersrc": res.data[i].ad_img
                }
                banner.push(sj)
              }
            }
          }
        }
        that.setData({
          banner: banner
        })
        //console.log(that.data.banner)
        that.setData({
          bannerUrls: res.data
        })

      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function() {
          wx.hideLoading();
          clearTimeout(timer);
        }, 2000)

      }
    })

    //nav导航图片及连接=======================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/iconByV2',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        // console.log(res.data)
        that.setData({
          navUrls: res.data.data.data.xcx.data
        })

      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function() {
          wx.hideLoading();
          clearTimeout(timer);
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
      success: function(res) {
        //  处理链接 分隔截取出页面和对应的商品参数
        var link = res.data[0].link_url.split("/")
        var len = link.length - 1
        var cas = link[len]
        for (var i in link) {
          //console.log(link[i])
          //  判断青青活动跳转页面 goodsdetails商品详情页面。
          if (link[i] == "goodsdetails") {
            that.setData({
              qqhdlink: "../details/details?goodsid=" + cas
            })
            break
          } else if (link[i] == "classify_content") {
            that.setData({
              qqhdlink: "../classifyGoods/classifyGoods?id=" + cas
            })
            break
          }
        }
        that.setData({
          qqactiveUrls: res.data
        })


      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function() {
          wx.hideLoading();
          clearTimeout(timer);
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
      success: function(res) {
        //console.log(res.data)

        that.setData({
          qfUrls: res.data
        })


      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function() {
          wx.hideLoading();
          clearTimeout(timer);
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
      success: function(res) {
        // console.log(res.data)
        for (var i = 0; i < res.data.length;i++){
          for (var j = 0; j < res.data[i].green.length;j++){
            if (res.data[i].green[j].spec_name === null) {
              res.data[i].green[j].spec_name = '';
            }
            res.data[i].green[j].goods_name = res.data[i].green[j].goods_name + res.data[i].green[j].spec_name;

            if (res.data[i].green[j].goods_name.length > 24) {
              res.data[i].green[j].goods_name = res.data[i].green[j].goods_name.substring(0, 24) + '...'
            }
          }
        }
        
        that.setData({
          goodsType: res.data
        })

      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function() {
          wx.hideLoading();
          clearTimeout(timer);
        }, 2000)

      }
    })
  },
  onShow: function(e) {

    


    this.setData({
      dailySpikeIndex: 0
    })
    clearInterval(setInterTimer);
    this.mrms();
    let that=this;
    location = wx.getStorageSync("locationcity");
    this.setData({
      location: location
    })

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
        data: {
          member_id: wx.getStorageSync("userinfo").uid
        },
        method: 'post',
        success: function(res) {

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
    
    //今日推荐商品=======================================
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/getBoutiqueList',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          todayUrls: res.data.data
        })
      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        var timer = setTimeout(function () {
          wx.hideLoading();
          clearTimeout(timer);
        }, 2000)

      }
    })

    //console.log(1)

    // 获取购物车列表
    this.getCartList();
    if (!app.globalData.isPhone){
      wx.hideTabBar({});
      //this.hasPhone();
    }
    this.hasPhone();
  },
  //判断是否注册手机号了
  hasPhone: function (){
    let that = this;
    let uid = wx.getStorageSync("userinfo").uid;
    let pid = wx.getStorageSync("pid");
    console.log('pid1', pid);
    if (uid){
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/isPhone',
        method: "POST",
        data: {
          member_id: uid,
          pid: pid
        },
        success: function (ress) {
          console.log('hasPhone',ress);
          if (ress.data.status == 1){
            that.setData({
              isPhone: true
            })
          } else if (ress.data.status == 3){
            wx.removeStorageSync('utoken');
            that.setData({
              mshow: "display:block"
            })
          } else if (ress.data.status == 0){
            app.globalData.isPhone = true;
            that.setData({
              isPhone: false
            });
            wx.showTabBar({});
          }
        }
      })
    }
  },
  // onPullDownRefresh() {
  //   this.mrms();
  //   // this.getCartList();
  //   wx.stopPullDownRefresh();
  // },
  // 获取购物车列表
  getCartList: function () {
    let _this = this;
    // 获取购物车列表 
    let uid = wx.getStorageSync("userinfo").uid;
    let data = {
      member_id: uid,
      seller_id: 1,
    }
    wx.request({
      //用户登陆URL地址，请根据自已项目修改
      url: app.globalData.Murl + '/Applets/Cart/ajaxCartList',
      method: "POST",
      data: {
        member_id: uid,
        seller_id: 1,
      },
      success: function (res) {
        console.log("获取购物车列表", res)
        _this.setData({
          cartList: res.data.cartList
        })
      }
    })
  /*
    let req = request.request("/Applets/Cart/ajaxCartList", data);
    req.then(
      function (res) {
        // console.log("获取购物车列表", res)
        _this.setData({
          cartList: res.cartList
        })
      }
    )
  */
  },
  onShareAppMessage: function() {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/index/index?id=' + 123 + '&pid=' + uid,
      imageUrl: '',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        // 分享失败
        //console.log(res)
      }
    }
  },
})