//获取应用实例
const app = getApp();
var user = require("../../lib/js/user.js")
var util = require("../../utils/util.js")
// pages/classifyGoods/classifyGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    goods: [],
    second: [],
    mshow: "display:none",
    // oneType:"",
    twoType: "",
    active: "",
    xlactive: "",
    jgactive: "",
    xlOrder: 1,
    jgOrder: 1,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    classfyBtn: [{
        id: '1',
        name: '生态果蔬'
      },
      {
        id: '3',
        name: '米面粮油'
      },
      {
        id: '4',
        name: '肉禽蛋品'
      },
      {
        id: '108',
        name: '休闲零食'
      }
    ],
    classfyBtnActive: 0
  },
  golaAdd: function() {
    wx.navigateTo({
      url: '/pages/laAdd/laAdd',
    })
  },
  close: function() {
    this.setData({
      mshow: "display:none"
    })
  },
  UserInfo: function(e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e);
  },
  /** 点击分类 */
  clickClassfy: function(e) {
    console.log(e.target.dataset.id, e.target.dataset.index);
    var locationcity = wx.getStorageSync("locationcity");
    if (locationcity) {
      var add = locationcity
    } else {
      var add = wx.getStorageSync("locationcity")
    }

    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var data = {
      one_cat_id: id,
      city: add
    };
    var that = this;
    that.setData({
      classfyBtnActive: index,
      one_cat_id: id
    })
    this.updateList(add, id);
    // var res = util.request('/Applets/Index/classify_content', data, "post", "");
    // res.then(function(res) {
    //   if(res.goods && res.seond_cat){
    //     that.setData({
    //       classfyBtnActive: index,
    //       second: res.seond_cat,
    //       goods: res.goods,
    //       one_cat_id: id
    //     })
    //   }else{
    //     that.setData({
    //       classfyBtnActive: index,
    //       second: res.seond_cat,
    //       goods: '',
    //       one_cat_id: id
    //     })
    //   }
    // })
    /***wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/classify_content',
      data: data,
      method: 'post',
      header: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: function (res) {
        wx.hideLoading();
        // resolve(res.data);
        console.log(res)
        that.setData({
          classfyBtnActive: index,
          second: res.data.seond_cat,
          goods: res.data.goods
        })
      },
      fail: function (err) {
        wx.showToast({
          icon: 'loading',
          title: "网络错误！",
          duration: 2000
        })
        //reject(err.data)
        console.log(res)
      }
    })*/
  },
  // 添加购物车=================

  cart: function(e) {
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
          member_id: uid, //会员ID
          goods_id: goods_id, //商品ID
          goods_num: 1, //商品数量
          spec_key: spec_key
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
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
              success: function(res) {
                //console.log(res.data.cartList)

                that.setData({
                  cartList: res.data.cartList
                })

              }
            })

          }
          if (res.data.status == 10) {
            //by yan.lei 一键代发执行跳转
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

          setTimeout(function() {
            wx.hideLoading()
          }, 2000)

        }
      })
    }

  },
  // 商品跳转详情
  goodsDetails: function(e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var locationcity = wx.getStorageSync("locationcity");
    if (locationcity) {
      var add = locationcity
    } else {
      var add = wx.getStorageSync("locationcity")
    }
    this.setData({
      location: add,
      one_cat_id: options.id
    })
    /** 根据跳转过来的ID显示对应的分类 */
    if (options.id) {
      var data = {
        one_cat_id: options.id,
        city: add
      };
      var that = this;
      for (var i = 0; i < this.data.classfyBtn.length; i++) {
        if (options.id === this.data.classfyBtn[i].id) {
          that.setData({
            classfyBtnActive: i,
          })
        }
      }

      this.updateList(add, options.id);
      // util.request('/Applets/Index/classify_content', data, 'post', '').then(function(res) {
      //   if (res.seond_cat && res.goods) {
      //     that.setData({
      //       second: res.seond_cat,
      //       goods: res.goods
      //     })
      //   }else{
      //     that.setData({
      //       second: res.seond_cat,
      //       goods: ''
      //     })
      //   }
      // })
    }
    /** 根据跳转过来的ID显示对应的分类 */

    var pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }

    var that = this;
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
      success: function(res) {
        console.log(res.data.cartList)

        that.setData({
          cartList: res.data.cartList
        })

      }
    })






    // 判断指定view到页面顶部的距离，未完成。
    var query = wx.createSelectorQuery();
    query.select('#screen').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为second的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].top);
    })

    // 页面加载时，请求到对应二级商品和二级下次级分类
    var that = this;
    that.setData({
      oneType: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  updateList: function (city, one_cat_id) {
    //if (city != this.data.location || one_cat_id != this.data.one_cat_id) {
      //console.log(add+'onshow,改变了', this.data.location)
      var that = this;
      console.log(one_cat_id, city)
      var data = {
        one_cat_id: one_cat_id,
        city: city
      }
      util.request('/Applets/Index/classify_content', data, 'post', '').then(function (res) {
        if (res.seond_cat && res.goods) {
          console.log('success' ,res.goods)
          for(var i=0;i<res.goods.length;i++){
            res.goods[i].goods_name = res.goods[i].goods_name+res.goods[i].spec_name;
            if (res.goods[i].goods_name.length>26){
              res.goods[i].goods_name = res.goods[i].goods_name.substring(0,26)+'...'
            }
          }
          that.setData({
            second: res.seond_cat,
            goods: res.goods
          })
        } else {
          that.setData({
            second: res.seond_cat,
            goods: ''
          })
        }
      })
    //}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var locationcity = wx.getStorageSync("locationcity");
    var add;
    if (locationcity) {
      add = locationcity
    } else {
      add = wx.getStorageSync("locationcity")
    }
    if(add != this.data.location){
      //console.log(add+'onshow,改变了', this.data.location)
      this.updateList(add, this.data.one_cat_id);
      // var one_cat_id = this.data.one_cat_id;
      // var city = locationcity;
      // console.log(one_cat_id,city)
      // var data = {
      //   one_cat_id: one_cat_id,
      //   city: city
      // }
      // util.request('/Applets/Index/classify_content', data, 'post', '').then(function (res) {
      //   if (res.seond_cat && res.goods) {
      //     console.log('success' + res.seond_cat)
      //     that.setData({
      //       second: res.seond_cat,
      //       goods: res.goods
      //     })
      //   } else {
      //     that.setData({
      //       second: res.seond_cat,
      //       goods: ''
      //     })
      //   }
      // })
    }
    this.setData({
      location: add
    })


    var that = this;
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
      success: function(res) {
        console.log(res.data.cartList)

        that.setData({
          cartList: res.data.cartList
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var url = currentPage.route
    var options = currentPage.options
    console.log(url)
    console.log(options)
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/classifyGoods/classifyGoods?id=' + options.id + '&pid=' + uid,
      imageUrl: '',
      success: function(res) {
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
      fail: function(res) {
        // 分享失败
        //console.log(res)
      }
    }
  },
  // 最新商品查询=================
  newgoods: function() {
    var that = this;
    console.log(that.data.oneType)
    console.log(that.data.twoType)
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/timesort',
      data: {
        one_cat_id: that.data.oneType,
        two_cat_id: that.data.twoType
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        that.setData({
          active: "active"
        })
        that.setData({
          xlactive: ""
        })
        that.setData({
          jgactive: ""
        })
        that.setData({
          goods: res.data
        })


      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      }
    })
  },
  // 点击二级分类=============
  second: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.secondid)
    //that.setData({ twoType: e.currentTarget.dataset.secondid })
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/timesort',
      data: {
        one_cat_id: that.data.oneType,
        two_cat_id: that.data.twoType
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.navigateTo({
          url: '../secondGoods/secondGoods?page=2&oneType=' + that.data.oneType + '&twoType=' + e.currentTarget.dataset.secondid
        })
      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      }
    })
  },
  //销量排行===================
  saleN: function(e) {
    var that = this;
    //console.log(e)
    if (e.currentTarget.dataset.order == 1) {
      // 销量降序
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/xiaoxia',
        data: {
          one_cat_id: that.data.oneType,
          two_cat_id: that.data.twoType
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          that.setData({
            active: ""
          })
          that.setData({
            jgactive: ""
          })
          that.setData({
            xlactive: "xlactive1"
          })
          that.setData({
            goods: res.data
          })
          that.setData({
            xlOrder: 2
          })
        },
        fail: function(res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        }
      })
    } else if (e.currentTarget.dataset.order == 2) {
      // 销量升序======================
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/xiaoshang',
        data: {
          one_cat_id: that.data.oneType,
          two_cat_id: that.data.twoType
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          that.setData({
            active: ""
          })
          that.setData({
            jgactive: ""
          })
          that.setData({
            xlactive: "xlactive2"
          })
          that.setData({
            goods: res.data
          })
          that.setData({
            xlOrder: 1
          })
        },
        fail: function(res) {
          wx.showLoading({
            title: '网络连接失败！',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        }
      })
    }
  },
  //价格排序========================
  priceN: function(e) {
    var that = this;
    console.log(e)
    if (e.currentTarget.dataset.order == 1) {
      // 价格sheng序
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/priceshang',
        data: {
          one_cat_id: that.data.oneType,
          two_cat_id: that.data.twoType
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {

          that.setData({
            active: ""
          })
          that.setData({
            xlactive: ""
          })
          that.setData({
            jgactive: "jgactive1"
          })
          that.setData({
            goods: res.data
          })
          that.setData({
            jgOrder: 2
          })


        },
        fail: function(res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function() {
            wx.hideLoading()
          }, 2000)

        }
      })


    } else if (e.currentTarget.dataset.order == 2) {
      // 价格jiang序
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/pricexia',
        data: {
          one_cat_id: that.data.oneType,
          two_cat_id: that.data.twoType
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {

          that.setData({
            active: ""
          })
          that.setData({
            xlactive: ""
          })
          that.setData({
            jgactive: "jgactive2"
          })
          that.setData({
            goods: res.data
          })
          that.setData({
            jgOrder: 1
          })


        },
        fail: function(res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function() {
            wx.hideLoading()
          }, 2000)

        }
      })

    }

  },
  // 筛选按钮点击================================
  sxClick: function() {
    var that = this;
    that.setData({
      sxactive: "sxactive"
    })
    that.setData({
      show: "show"
    })
  },
  // 取消筛选=============================
  cancel: function() {
    var that = this;
    that.setData({
      sxactive: ""
    })
    that.setData({
      show: ""
    })
    that.setData({
      hsactive: ""
    })
    that.setData({
      sactive: ""
    })
  },
  // 新品上市点击
  ngoods: function() {
    var that = this;
    that.setData({
      hactive: ""
    })
    that.setData({
      sactive: "sactive"
    })
    that.setData({
      sxID: "新品"
    })
  },
  //热销产品点击
  hgoods: function() {
    var that = this;
    that.setData({
      sactive: ""
    })
    that.setData({
      hactive: "hactive"
    })
    that.setData({
      sxID: "热销"
    })
  },
  //确定筛选事件
  confirm: function() {
    var that = this;
    console.log(1)
    that.setData({
      sxactive: ""
    })
    that.setData({
      jgactive: ""
    })
    that.setData({
      show: ""
    })
    that.setData({
      hsactive: ""
    })
    that.setData({
      sactive: ""
    })

    wx.request({
      url: app.globalData.Murl + '/Applets/Index/screen',
      data: {
        one_cat_id: that.data.oneType,
        two_cat_id: that.data.twoType,
        state: that.data.sxID
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        that.setData({
          active: ""
        })
        that.setData({
          xlactive: ""
        })
        that.setData({
          goods: res.data
        })


      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function() {
          wx.hideLoading()
        }, 2000)

      }
    })






  }
})