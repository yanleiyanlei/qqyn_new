const app = getApp()

Page({
  data: {
    loc: " ",
    goodsorder: [],//商品信息
    quantity: [],//商品数量
    address: [],//地址
    allsprice: [],//提交订单总额
    money: [],//商品提交总价
    couponprice: [],
    monprice: [],
    conprice: [],
    item: " ",
    selAddress: " ",
    package_mail: [],
    userName: '',
    weCharstatus: false,   // 全选状态，默认全选
    yuestutea:false,
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
 //生成 订单支付
  selectAll(e) {
    var wtimes = e.currentTarget.dataset.keys;
    console.log(wtimes);
    let weCharstatus = this.data.weCharstatus;
    let yuestutea = this.data.yuestutea;
    weCharstatus = !weCharstatus;
    console.log(weCharstatus);
    console.log(yuestutea);
    if (weCharstatus == true) {
      this.setData({
        weCharstatus: weCharstatus,
        yuestutea: false,
        wtimes: wtimes,
      });
    } else {
      this.setData({
        weCharstatus: weCharstatus,
        wtimes:undefined
      });
    }
  },

  selectAlls(e) {
    var wtimes = e.currentTarget.dataset.keys;
    let yuestutea = this.data.yuestutea;
    yuestutea = !yuestutea;
    console.log(yuestutea);
    if (yuestutea == true) {
      this.setData({
        yuestutea: yuestutea,
        weCharstatus: false,
        wtimes: wtimes,
      });
    } else {
      this.setData({
        yuestutea: yuestutea,
        wtimes: undefined
      });
    }
  },
  /*去结算按钮 生成订单*/
  subdingr(e) {
    var quantity = e.currentTarget.dataset.key;
    var price = e.currentTarget.dataset.price;
    var dis_id = e.currentTarget.dataset.dis_id;
    var coupon = e.currentTarget.dataset.coupon;
    var quantitys = e.currentTarget.dataset.quantity;
    var actualpayment = e.currentTarget.dataset.actualpayment;
    var name = e.currentTarget.dataset.name;
    var photo = e.currentTarget.dataset.photo;
    var sheng = e.currentTarget.dataset.sheng;
    var shi = e.currentTarget.dataset.shi;
    var qu = e.currentTarget.dataset.qu;
    var dizhi = e.currentTarget.dataset.dizhi;
    var cont = e.currentTarget.dataset.cont;
    var freight = e.currentTarget.dataset.freight;
    var conp = this.data.can_goods_coupon;
    var ids= e.currentTarget.dataset.id;
    var address = sheng + ' ' + shi + ' ' + qu + dizhi;
    var weekday = this.data.quantity.select_weekday1;
    var wtimes = this.data.wtimes;
  //  console.log(weekday);
    console.log(ids);
    if (price >= this.data.package_mail) {
      var freight = 0;
    } else {
      var freight = freight;
    }
    /*判断如果 优惠券找不到 赋值为空*/
    if (coupon == undefined) {
      var coupon = '';
    } else {
      var coupon = e.currentTarget.dataset.coupon;
    }
    /*判断如果 地址id找不到 赋值为空*/
    if (dis_id == undefined) {
      var dis_id = '';
    } else {
      var dis_id = e.currentTarget.dataset.dis_id;
    }
    /*判断如果 去结算是 地址为空 提示 去 选择 地址 否则 生成订单*/
    if (quantity == null) {
      wx.showToast({
        title: '请选择地址',
        icon: 'loading',
        duration: 2000
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else if (conp == 0) {
      wx.showToast({
        title: '使用商品券收货地址必须为北京市范围内',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
      var uid = wx.getStorageSync("userinfo").uid;
      var _this = this;
      if (weekday == undefined) {
        var obj ={
          member_id: uid,//用户id
          seller_id: 1,
          dis_id: dis_id,
          coupon: coupon,
          goods_money: price,
          quantity: quantitys,
          freight: freight,
          actualpayment: actualpayment,
          consigneename: name,
          consigneephone: photo,
          consigneeaddress: address,
          order_content: cont,
          consigneeaddressid: ids
        }
      }else{
        var obj = {
          member_id: uid,//用户id
          seller_id: 1,
          dis_id: dis_id,
          coupon: coupon,
          goods_money: price,
          quantity: quantitys,
          freight: freight,
          actualpayment: actualpayment,
          consigneename: name,
          consigneephone: photo,
          consigneeaddress: address,
          order_content: cont,
          consigneeaddressid: ids,
          post_time:wtimes,
        }
      }
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/Addordershow',
        data: obj,
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          const datas = res.data;
          console.log(datas);
          if (datas.status==false){
            wx.showToast({
              title: datas.data,
              icon: 'none',
              duration: 2000
            })
          }else{
            _this.setData({
              actualpayment: actualpayment,
              orderid: datas.orderid,//订单id
              order_number: datas.order_number
            })
            console.log(_this.data.actualpayment);
            wx.redirectTo({
              url: '../pay/pay?order_number=' + _this.data.order_number + '&is_goods_coupon=' + _this.data.is_goods_coupon + '&reduce_moeny=' + _this.data.reduce_moeny + '&satisfy_money=' + _this.data.satisfy_money + '&now_time=' + _this.data.now_time,
              success: function (res) { console.log(res) },
              fail: function (res) { console.log(res) },
              complete: function (res) { console.log(res) },
            })
          }
        }
      })
    }
  },
  /*点击 跳到商品详情*/
  urldetails(e) {
    let goodsid = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../details/details?goodsid=' + goodsid,
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })
  },
  /*优惠券*/
  commentsi(e) {
    let cp = e.currentTarget.dataset.moy;
    console.log(cp);
    wx.navigateTo({
      url: '../coupons/coupons?cp=' + cp + '&page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })
  },
  /*商品展示列表*/
  listshop() {
    wx.navigateTo({
      url: '../shoplist/shoplist',
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })
  },
  /*跳转到地址*/
  newaddress() {
    wx.navigateTo({
      url: '../newaddress/newaddress?page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })
  },
  onLoad: function (options) {
    console.log(options.id);
    var _this = this;
    _this.setData({
      page: options.page,
      goods_id: options.goods_id,
      spec_key: options.spec_key,
      num: options.num,
      dis_id: options.dis_id,
      Cart_address_id: options.id
    })
  },
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var pagess = getCurrentPages();
    var currPages = pagess[pages.length - 1];   //当前页面
    /*收货地址*/
    var item = currPage.data.items;
    console.log(currPages);
    var _this = this;
    var page = _this.data.page;
    var goods_id = _this.data.goods_id;
    var spec_key = _this.data.spec_key;
    var num = _this.data.num;
    var id = _this.data.Cart_address_id;
    var dis_id = _this.data.dis_id;
    function getNowTime() {
      var now = new Date();
      var h = now.getHours();
      var formatDate = h;
      return formatDate;
    }
    var uid = wx.getStorageSync("userinfo").uid;
    if (page == 2) {
      /*购物车结算的接口*/
      var urlshop = app.globalData.Murl + "/Applets/Cart/CartBuy";
      wx.request({
        url: urlshop,
        data: { member_id: uid, seller_id: 1 },
        method: "post",
        success: function (res) {
          const dastas = res.data;
          console.log(dastas);
          if (dastas.status == true) {
            wx.request({
              url: app.globalData.Murl + '/Applets/Cart/order1',
              data: {
                member_id: uid,
                seller_id: 1,
                dis_id: dis_id,
                Cart_address_id: item
              },
              method: "post",
              success: function (res) {
                console.log(res.data);
                var datalist = res.data;
                var godsorder = datalist.order;
                console.log(datalist.select_weekday1);
                var commpany = datalist.commpany;
                var can_goods_coupon = datalist.can_goods_coupon;
                var is_goods_coupon = datalist.is_goods_coupon;
                datalist.timestos = getNowTime(datalist.reviews_addtime);
                if (is_goods_coupon == 1) {
                  var reduce_moeny = datalist.reward_coupon.reduce_moeny;
                  var satisfy_money = datalist.reward_coupon.satisfy_money;
                  var now_time = datalist.reward_coupon.now_time;
                  _this.setData({
                    reduce_moeny: reduce_moeny,
                    satisfy_money: satisfy_money,
                    now_time: now_time,
                  })
                }
                if (datalist.address == null) {
                  _this.setData({
                    goodsorder: godsorder,
                    quantity: datalist,
                    is_goods_coupon: is_goods_coupon,
                    can_goods_coupon: can_goods_coupon,
                    address: datalist.address,
                    money: Number(datalist.money),
                    allsprice: Number(datalist.money) + Number(commpany.upto_amount),
                    package_mail: Number(datalist.commpany.package_mail)
                  })
                } else {
                  _this.setData({
                    goodsorder: godsorder,
                    quantity: datalist,
                    is_goods_coupon: is_goods_coupon,
                    can_goods_coupon: can_goods_coupon,
                    address: datalist.address,
                    loc: datalist.address.sheng,
                    money: Number(datalist.money),
                    allsprice: Number(datalist.money) + Number(commpany.upto_amount),
                    package_mail: Number(datalist.commpany.package_mail)
                  })

                }
                var allsprices = _this.data.allsprice;
                console.log(allsprices);
                var moneys = _this.data.money;
                if (datalist.coupon == null) {

                } else {
                  var prices = datalist.coupon.coupon_money;

                  _this.setData({
                    conprice: Number(allsprices - prices).toFixed(2),
                    compoins: Number(moneys - prices).toFixed(2),
                  })
                }
              }
            })
          } else if (dastas.status == false) {
            wx.redirectTo({
              url: '../m-order/m-order?sta=0',
            })
          }
        }
      })
    } else if (page == 1) {
      /*立即购买的接口*/
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
          console.log(dastas);
          if (dastas.status == true) {
            wx.request({
              url: app.globalData.Murl + '/Applets/Cart/order1',
              data: {
                member_id: uid,
                seller_id: 1,
                dis_id: dis_id,
                Cart_address_id: item
              },
              method: "post",
              success: function (res) {
                var datalist = res.data;
                console.log(datalist);
                var godsorder = datalist.order;
                var can_goods_coupon = datalist.can_goods_coupon;
                var is_goods_coupon = datalist.is_goods_coupon;
                console.log(is_goods_coupon);
                var commpany = datalist.commpany;
                datalist.timestos = getNowTime(datalist.reviews_addtime);
                if (is_goods_coupon == 1) {
                  var reduce_moeny = datalist.reward_coupon.reduce_moeny;
                  var satisfy_money = datalist.reward_coupon.satisfy_money;
                  var now_time = datalist.reward_coupon.now_time;
                  _this.setData({
                    reduce_moeny: reduce_moeny,
                    satisfy_money: satisfy_money,
                    now_time: now_time,
                  })
                }
                if (datalist.address == null) {
                  _this.setData({
                    goodsorder: godsorder,
                    quantity: datalist,
                    is_goods_coupon: is_goods_coupon,
                    can_goods_coupon: can_goods_coupon,
                    address: datalist.address,
                    money: Number(datalist.money),
                    allsprice: Number(datalist.money) + Number(commpany.upto_amount),
                    package_mail: Number(datalist.commpany.package_mail)
                  })
                } else {
                  _this.setData({
                    goodsorder: godsorder,
                    quantity: datalist,
                    is_goods_coupon: is_goods_coupon,
                    can_goods_coupon: can_goods_coupon,
                    address: datalist.address,
                    loc: datalist.address.sheng,
                    money: Number(datalist.money),
                    allsprice: Number(datalist.money) + Number(commpany.upto_amount),
                    package_mail: Number(datalist.commpany.package_mail)
                  })

                }
                var allsprices = _this.data.allsprice;
                console.log(allsprices);
                var moneys = _this.data.money;
                if (datalist.coupon == null) {

                } else {
                  var prices = datalist.coupon.coupon_money;

                  _this.setData({
                    conprice: Number(allsprices - prices).toFixed(2),
                    compoins: Number(moneys - prices).toFixed(2),
                  })
                }
              }
            })
          }
        }

      })

    }
  }
})