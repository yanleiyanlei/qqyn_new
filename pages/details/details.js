// pages/details/details.js
//获取应用实例
const QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
const demo = new QQMapWX({
  key: '5UPBZ-OQLKD-AE44M-HBYKJ-32WLH-2JBKT' //密钥
})
const user = require("../../lib/js/user.js")
/*接口调用*/
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wantsObj: {
      name: '大家都在买',
      showTip: true
    },
    show: "display:none",
    monstiden: "display:none",
    datas: [],
    imgUrls: [], //详情页上的banner图
    current: 0,  //当前所在滑块的index
    detaIls: [], //商品的详情图
    describe: [], //商品的文字详情 by yan.lei
    indicatorDots: false,
    autoplay: true, //banner图时候自动播放
    interval: 5000, //轮换的 速度
    duration: 1000,
    src: "http://www.77farmers.com/Public/Home/images/morentouxiang.png", //默认的 头像
    pcSrc: "http://www.77farmers.com/", //pc上的评论图pain路径
    wechatSrc: "http://m.77farmers.com/Public/Uploads/", //手机上的评论图pain路径
    dImg: "http://ss.bjzzdk.com/Public/Uploads/", //微信上的评论地址
    pingLun: [], //评论
    goodsAttrInfo: [],
    shopName: [], //商品名称  销售 多少份
    priCes: [], //价格 原价
    homoNet: [], //规格
    spec_key: [], //规格键
    goodImg: [],
    goodsReviews: [], //评论
    reviewsNum: "", //评论总条数
    cityName: [], //获取城市
    nowTime: [], //当前时间
    modelHidden: true,
    goodsReviewimg: [],
    modelHiddens: true, //加入购物车
    modelHiddenss: true, //立即购买
    num: 1, //默认 选择为 1 件
    minusStatus: 'disabled',
    Number: [], //库存
    goodsreviews: [],
    shopprices: [],
    shop_key: [],
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    Index: '',
    a: '',
    locationadd: "",
    add: " ",
    tags:null,          //标签列表
    tagHidden:false     //是否隐藏标签列表
    // tagsArr:{
    //   '1':'有机',
    //   '2':'无公害',
    //   '3':'绿色',
    //   '4':'转换期',
    //   '5':'产地直供'
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })

    /*调用接口*/
    var _that = this;
    //console.log(options.pid);
    var scene = decodeURIComponent(options.scene)
    // console.log(scene);
    if (scene == 'undefined') {
      var goodsid = options.goodsid;
      var pid = options.pid;
    } else {
      var goodsid = scene.split("&")[0];
      var pid = scene.split("&")[1];
    }
    //创建缓存
    _that.setData({
      goodsid: goodsid,
      member_id: pid,
    })
    if (pid) {
      wx.setStorageSync("pid", pid);
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
    var that = this;
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    let city = wx.getStorageSync("locationcity");

    function getNowTime() {
      var now = new Date();
      var h = now.getHours();
      var formatDate = h;
      return formatDate;
    }

    function toDate(number) {
      const dateTime = new Date(number * 1000);
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const day = dateTime.getDate();
      const hour = dateTime.getHours();
      const minute = dateTime.getMinutes();
      const second = dateTime.getSeconds();
      const now = new Date();
      const now_new = Date.parse(now.toDateString()); //typescript转换写法  
      const milliseconds = now_new - dateTime;
      const timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      return timeSpanStr;
    }

    const _url = app.globalData.Murl + "/Applets/Goods/goodsdetails";
    wx.request({
      url: _url,
      data: {
        id: that.data.goodsid, //249
        member_id: uid,       //1760
        seller_id: 1,
        city: city            //北京市
      },
      success: function (res) {

        const datalist = res.data;
        console.log(datalist);
        const datas = datalist.goodsreviews;
        /*将评论的 时间 循环添加到数据中*/
        for (var i = 0; i < datas.length; i++) {
          datas[i].timesto = toDate(datas[i].reviews_addtime)
        }
        /*获取当前时间 添加到 数据 中*/
        datalist.timestos = getNowTime(datalist.reviews_addtime);
        let tagHidden=false;
        if (datalist.goodsdetails.tags == null || JSON.stringify(datalist.goodsdetails.tags) == "{}"){
          tagHidden=true;
        }
        var shop_prices = datalist.goodsSpecInfo[0].shop_price;
        //测试数据
        // const tagsArr={
        //   '1':'有机',
        //   '2':'无公害',
        //   '3':'绿色',
        //   '4':'转换期',
        //   '5':'产地直供'
        // }
        that.setData({
          datas: datalist,
          ionot: datalist.goodsdetails.isnot, //是否有货
          nowTime: datalist.timestos, //当前时间
          goodsAttrInfo: datalist.goodsAttrInfo,
          shopName: datalist.goodsdetails,
          goodsreviews: datalist.goodsreviews,
          shop_prices: Number(shop_prices * 0.1).toFixed(2),
          imgUrls: datalist.goodsdetails.goods_img,
          priCes: datalist.goodsSpecInfo,
          homoNet: datalist.goodsSpec,
          goodImg: datalist.goodsImg2,
          detaIls: datalist.goodsdetails.details_img,
          describe: datalist.goodsdetails.goods_describe,
          goodsReviews: datas,
          reviewsNum: datalist.reviewsnum,
          add: res.data.address,
          tags: datalist.goodsdetails.tags,
          tagHidden: tagHidden
        })

        var locationadd = wx.getStorageSync("locationadd");
        if (locationadd) {
          var add = locationadd
        } else {
          var add = wx.getStorageSync("locationcity")

        }
        that.setData({
          locationadd: add
        })

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var member_id = that.data.member_id;
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var shopName = that.data.shopName;
    var goods_name = shopName.goods_name;
    var shop_price = shopName.shop_price;
    return {
      title: goods_name + "￥" + shop_price,
      path: '/pages/details/details?goodsid=' + that.data.goodImg.goods_id + '&pid=' + uid,
      imageUrl: '',
      success: function (res) {
        // console.log(res)
      },
      fail: function (res) {
        // 分享失败
        // console.log(res)
      }
    }
  },

  /*=======自定义事件==============*/
  //swiper change事件
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  //用户拒绝获取权限
  close: function () {
    this.setData({
      show: "display:none"
    })
  },

  //获取用户的权限
  UserInfo: function (e) {
    this.setData({
      show: "display:none"
    })
    user.user(e);
  },
  //事件处理函数
  modalinput: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    this.setData({
      modelHidden: !this.data.modelHidden,
      goodsReviewimg: src
    })
  },
  /*关闭评论图*/
  modalinputs: function () {
    this.setData({
      modelHidden: !this.data.modelHidden
    })
  },
  //分享
  openfx: function () {
    this.setData({
      monstiden: 'display:show',
    })
  },
  //关闭分享
  ofssfeq: function () {
    this.setData({
      monstiden: 'display:none',
    })
  },
  /*加入购物车*/
  addcars: function () {
    if (this.data.ionot != 1) return;
    var a = this.data.shopName.shop_price;
    this.setData({
      modelHiddens: !this.data.modelHiddens
    })
    var len = this.data.priCes.length;
    // console.log(this.data.priCes)
    for (var i = 0; i < len; i++) {

      if (a == this.data.priCes[i].shop_price) {
        // console.log(this.data.priCes[i].spec_key);
        this.setData({
          selectindex: i,
          shop_key: this.data.priCes[i].spec_key
        })
      }
    }
  },
  /*关闭加入购物车*/
  offcasrts: function () {
    this.setData({
      modelHiddens: !this.data.modelHiddens
    })
  },
  /*立即购买*/
  addcarss: function () {
    if (this.data.ionot != 1) return;
    var a = this.data.shopName.shop_price;
    this.setData({
      modelHiddenss: !this.data.modelHiddenss
    })
    var len = this.data.priCes.length;
    // console.log(this.data.priCes)
    for (var i = 0; i < len; i++) {

      if (a == this.data.priCes[i].shop_price) {
        // console.log(this.data.priCes[i].spec_key);
        this.setData({
          selectindex: i,
          shop_key: this.data.priCes[i].spec_key
        })
      }
    }

  },
  offcasrtss: function () {
    this.setData({
      modelHiddenss: !this.data.modelHiddenss
    })
  },
  /*选择 商品 数量 ---*/
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    var num = this.data.num;
    var kc = e.currentTarget.dataset.num; //获取data-num
    // console.log(kc);
    if (num < kc) {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num >= kc ? 'disabled' : 'normal';
    if (minusStatus == 'disabled') {
      wx.showToast({
        title: '库存不足！',
        icon: 'loading',
        duration: 2000,
      })
    }
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /*加入购物车*/
  joincarts: function (e) {
    var code = app.globalData.code;
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    //console.log(uid)
    if (!uid) {
      that.setData({
        show: "display:block",
        modelHiddens: !this.data.modelHiddens
      })
    } else {

      var goods_id = e.currentTarget.dataset.list;
      var uid = wx.getStorageSync("userinfo").uid;
      var memner_id = uid;
      var goods_id = goods_id;
      var num = that.data.num; //获取data-num
      var spec_key = e.currentTarget.dataset.key;
      var obj = {
        member_id: memner_id,
        goods_id: goods_id,
        goods_num: num,
        spec_key: spec_key
      }
      // console.log(spec_key);
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
        data: obj,
        method: "post",
        success: function (res) {
          const dastas = res.data;
          const datamsg = dastas.msg;
          // console.log(dastas);
          if (dastas.status == false) { //哪个傻缺写的，连个false 的情况都加
            wx.showToast({
              title: dastas.data,
              icon: 'none',
              duration: 2000
            })
          }
          if (dastas.status == 1) {
            wx.showToast({
              title: '添加成功！',
              icon: 'success',
              duration: 2000,
            })
            that.setData({
              modelHiddens: !that.data.modelHiddens,
              datamsg: datamsg
            })
          }
          if (dastas.status == -1) {
            wx.showToast({
              title: '请选择规格！',
              icon: 'loading',
              duration: 2000
            })
          }
          if (dastas.status == -2) {
            wx.showToast({
              title: '添加失败！！',
              icon: 'loading',
              duration: 2000
            })
          }
          if (dastas.status == -5) {
            wx.showToast({
              title: datamsg,
              icon: 'none',
              duration: 2000
            })

          }
          if (dastas.status == 10) {
            //by yan.lei 一键代发执行跳转
            wx.navigateTo({
              url: '../theorder/theorder?goods_id=' + goods_id + '&num=' + num + '&spec_key=' + spec_key + '&page=' + 1,
              success: function (res) {
                // console.log(res)
              },
              fail: function (res) {
                // console.log(res)
              },
              complete: function (res) {
                // console.log(res)
              },
            })

          }

        }
      })

    }

  },
  /*跳转到首页*/
  tiaoindex: function () {

    wx.switchTab({
      url: '../index/index'
    });

  },
  /*跳转到评论*/
  allcommes(e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../comments/comments?goods_id=' + goods_id,
      success: function (res) {
        // console.log(res)
      },
      fail: function (res) {
        // console.log(res)
      },
      complete: function (res) {
        // console.log(res)
      },
    })
  },
  /*跳转到购物车*/
  tiaocar: function () {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    wx.switchTab({
      url: '../shopcarts/shopcarts?member_id=uid'
    });
  },

  tabFun: function (e) {
    // console.log(e.currentTarget.dataset.index);
    var shop_price = e.currentTarget.dataset.prices;
    var shop_key = e.currentTarget.dataset.key;
    var selectindex = e.currentTarget.dataset.index;
    var kc = e.currentTarget.dataset.num; //获取data-num
    // console.log(kc);
    this.setData({
      selectindex: selectindex,
      shopprices: shop_price,
      shop_key: shop_key,
      nums: kc
    })
  },
  /*立即购买*/
  btensjop(e) {
    var _this = this;
    var uid = wx.getStorageSync("userinfo").uid;
    // cxvasdcconsole.log(uid)
    if (!uid) {
      _this.setData({
        show: "display:block",
        modelHiddenss: !this.data.modelHiddenss
      })
    } else {
      var kc = _this.data.nums; //获取data-num
      var goods_id = e.currentTarget.dataset.list;
      var num = _this.data.num;
      var spec_key = e.currentTarget.dataset.key; //获取data-num
      var uid = wx.getStorageSync("userinfo").uid;
      if (spec_key == '') {
        wx.showToast({
          title: '请选择规格',
          icon: 'loading',
          duration: 2000
        })
      } else {
        var _urlshop = app.globalData.Murl + "/Applets/Cart/goBuy";
        wx.request({
          url: _urlshop,
          data: {
            member_id: uid,
            seller_id: 1,
            goods_id: goods_id,
            spec_key: spec_key,
            goods_num: num,
          },
          method: "post",
          success: function (res) {
            const dastas = res.data;
            // console.log(dastas);
            if (dastas.status == false) {
              wx.showToast({
                title: dastas.data,
                icon: 'none',
                duration: 2000
              })
            } else {
              _this.setData({
                modelHiddenss: true
              })
              wx.navigateTo({
                url: '../theorder/theorder?goods_id=' + goods_id + '&num=' + num + '&spec_key=' + spec_key + '&page=' + 1,
                success: function (res) {
                  // console.log(res)
                },
                fail: function (res) {
                  // console.log(res)
                },
                complete: function (res) {
                  // console.log(res)
                },
              })

            }
          }

        })
      }
    }
  },
  //分享朋友圈
  sharefrend() {
    var goods_id = this.data.goodsid;
    // console.log(goods_id);
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var that = this;
    if (!uid) {
      that.setData({
        show: "display:block",
        monstiden: 'display:none'
      })
    } else {
      wx.navigateTo({
        url: '../dfxm/dfxm?goods_id=' + goods_id,
        success: function (res) {
          // console.log(res)
        },
        fail: function (res) {
          // console.log(res)
        },
        complete: function (res) {
          // console.log(res)
        },
      })
    }
  },
  // 选择送货地址
  selectAddress: function () {
    wx.navigateTo({
      url: '/pages/laAdd/laAdd',
    })
  }
})