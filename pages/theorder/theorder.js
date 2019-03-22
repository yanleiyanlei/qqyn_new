const app = getApp()

Page({
  data: {
    loc: " ", //收货地址  用来判断送达时间
    goodsorder: [], //商品信息
    quantity: [], //商品数量
    address: [], //地址
    allsprice: [], //提交订单总额
    money: [], //商品提交总价
    couponprice: [],
    monprice: [],
    conprice: [],
    item: " ",
    selAddress: " ",
    package_mail: [],
    userName: '', //用户留言
    weCharstatus: false, // 全选状态，默认全选
    yuestutea: false,
    jine: "",
    datalist: "", //后台传过来的全部信息
    total: " ", //后台传过来的商品价格
    lasttotal: " ", //最后实付的总价
    coupon_money: " ", //优惠卷金额
    upto_amount: " ", //运费
    package_mail: "", //满减的价格 例如 “99.00”
    isset: "", //是否可以去结算
    popup:false
  },
  userNameInput: function(e) { //用户留言
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
        wtimes: undefined
      })
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

//关闭弹窗

  closepop:function(){
    this.setData({
      popup:false
    })
  },

  subdingr: function() {
    console.log(this.data.isset)
    if (this.data.isset == 2) {
      var popup = true
    } else {
      var popup = false
      var _this = this;
      var quantity = _this.data.quantity;
      var weekday = _this.data.quantity.select_weekday1;
      console.log(_this.data.quantity.coupon)
      console.log(_this.data.quantity.coupon)
      if (quantity.address == null) {
        wx.showToast({
          title: '请选择地址',
          icon: 'loading',
          duration: 2000
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      } else {
        var wi = wx.getStorageSync("wi");
        var uid = wx.getStorageSync("userinfo").uid;

        if (quantity.coupon == null) { //没有优惠券
          var dis_id = null; //优惠券id
          var coupon = 0; //优惠券信息
        } else { //有优惠券
          var dis_id = _this.data.quantity.coupon.dis_id; //优惠券id
          var coupon = _this.data.quantity.coupon.coupon_money; //优惠券信息
        }
        if (weekday == undefined) {
          var post_time = null //订单有蔬菜选择蔬菜送达时间
        } else {
          var post_time = _this.data.wtimes //订单有蔬菜选择蔬菜送达时间
        }
        var obj = {
          wi: wi, //by yan.lei 把wi拿出来传到提交订单接口
          member_id: uid, //用户id
          seller_id: 1,
          dis_id: dis_id,
          coupon: coupon,
          goods_money: _this.data.quantity.money, //后台传过来的总价
          quantity: _this.data.quantity.quantity, //商品信息
          freight: _this.data.upto_amount, //运费
          actualpayment: _this.data.lasttotal, //实付价格
          consigneename: _this.data.quantity.address.name, //用户姓名  
          consigneephone: _this.data.quantity.address.phone, //用户电话
          consigneeaddress: _this.data.quantity.address.sheng + _this.data.quantity.address.shi + _this.data.quantity.address.qu + _this.data.quantity.address.address_content, //用户全部地址信息
          order_content: _this.data.userName, //用户留言
          consigneeaddressid: _this.data.quantity.address.id, //地址id
          post_time: post_time, //订单有蔬菜选择蔬菜送达时间
        }
        wx.request({
          url: app.globalData.Murl + '/Applets/Cart/Addordershow',
          data: obj,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            _this.setData({
              actualpayment: _this.data.lasttotal, //订单最终价格
              orderid: res.data.orderid, //订单id
              order_number: res.data.order_number //订单号
            })
            console.log(_this.data.orderid);
            console.log(_this.data.order_number);
            wx.redirectTo({
              url: '../pay/pay?order_number=' + _this.data.order_number + '&is_goods_coupon=' + _this.data.is_goods_coupon + '&reduce_moeny=' + _this.data.reduce_moeny + '&satisfy_money=' + _this.data.satisfy_money + '&now_time=' + _this.data.now_time,
              success: function(res) {
                console.log(res)
              },
              fail: function(res) {
                console.log(res)
              },
              complete: function(res) {
                console.log(res)
              }
            })
          }
        })
        console.log(obj)
      }
    }
    this.setData({
      popup: popup
    })
  },
  /*去结算按钮 生成订单*/
  // subdingr(e) {
  //   var quantity = e.currentTarget.dataset.key;
  //   var price = e.currentTarget.dataset.price;
  //   var dis_id = e.currentTarget.dataset.dis_id;
  //   var coupon = e.currentTarget.dataset.coupon;
  //   var quantitys = e.currentTarget.dataset.quantity;
  //   var actualpayment = e.currentTarget.dataset.actualpayment;
  //   var name = e.currentTarget.dataset.name;
  //   var photo = e.currentTarget.dataset.photo;
  //   var sheng = e.currentTarget.dataset.sheng;
  //   var shi = e.currentTarget.dataset.shi;
  //   var qu = e.currentTarget.dataset.qu;
  //   var dizhi = e.currentTarget.dataset.dizhi;
  //   var cont = e.currentTarget.dataset.cont;
  //   var freight = e.currentTarget.dataset.freight;
  //   var conp = this.data.can_goods_coupon;
  //   var ids = e.currentTarget.dataset.id;
  //   var address = sheng + ' ' + shi + ' ' + qu + dizhi;
  //   var weekday = this.data.quantity.select_weekday1;
  //   var wtimes = this.data.wtimes;
  //   //  console.log(weekday);
  //   console.log(ids);
  //   console.log(price);
  //   console.log(this.data.package_mail);
  //   if (price >= this.data.package_mail) {
  //     var freight = 0;
  //   } else {
  //     var freight = freight;
  //   }
  //   /*判断如果 优惠券找不到 赋值为空*/
  //   if (coupon == undefined) {
  //     var coupon = '';
  //   } else {
  //     var coupon = e.currentTarget.dataset.coupon;
  //   }
  //   /*判断如果 地址id找不到 赋值为空*/
  //   if (dis_id == undefined) {
  //     var dis_id = '';
  //   } else {
  //     var dis_id = e.currentTarget.dataset.dis_id;
  //   }
  //   /*判断如果 去结算是 地址为空 提示 去 选择 地址 否则 生成订单*/
  //   if (quantity == null) {
  //     wx.showToast({
  //       title: '请选择地址',
  //       icon: 'loading',
  //       duration: 2000
  //     })
  //     setTimeout(function() {
  //       wx.hideLoading()
  //     }, 1000)
  //   } else if (conp == 0) {
  //     wx.showToast({
  //       title: '使用商品券收货地址必须为北京市范围内',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     setTimeout(function() {
  //       wx.hideLoading()
  //     }, 1000)
  //   } else {
  //     var wi = wx.getStorageSync("wi");
  //     var uid = wx.getStorageSync("userinfo").uid;
  //     var _this = this;
  //     if (weekday == undefined) { //小哥哥能不能加个备注，蔬菜
  //       var obj = {
  //         wi: wi, //by yan.lei 把wi拿出来传到提交订单接口
  //         member_id: uid, //用户id
  //         seller_id: 1,
  //         dis_id: dis_id,
  //         coupon: coupon,
  //         goods_money: price,
  //         quantity: quantitys,
  //         freight: freight,
  //         actualpayment: actualpayment,
  //         consigneename: name,
  //         consigneephone: photo,
  //         consigneeaddress: address,
  //         order_content: cont,
  //         consigneeaddressid: ids
  //       }
  //     } else {
  //       var obj = {
  //         wi: wi, //by yan.lei
  //         member_id: uid, //用户id
  //         seller_id: 1,
  //         dis_id: dis_id,
  //         coupon: coupon,
  //         goods_money: price,
  //         quantity: quantitys,
  //         freight: freight,
  //         actualpayment: actualpayment,
  //         consigneename: name,
  //         consigneephone: photo,
  //         consigneeaddress: address,
  //         order_content: cont,
  //         consigneeaddressid: ids,
  //         post_time: wtimes,
  //       }
  //     }
  //     wx.request({
  //       url: app.globalData.Murl + '/Applets/Cart/Addordershow',
  //       data: obj,
  //       method: 'POST',
  //       header: {
  //         'Content-Type': 'application/json'
  //       },
  //       success: function(res) {
  //         const datas = res.data;
  //         console.log('abc');
  //         console.log(datas);
  //         // if (datas.status==false){
  //         //   console.log(datas.data)
  //         //   wx.showToast({
  //         //     title: datas.data,
  //         //     icon: 'none',
  //         //     duration: 2000
  //         //   })
  //         // }else{
  //         _this.setData({
  //           actualpayment: actualpayment,
  //           orderid: datas.orderid, //订单id
  //           order_number: datas.order_number
  //         })
  //         console.log(_this.data.actualpayment);
  //         wx.redirectTo({
  //           url: '../pay/pay?order_number=' + _this.data.order_number + '&is_goods_coupon=' + _this.data.is_goods_coupon + '&reduce_moeny=' + _this.data.reduce_moeny + '&satisfy_money=' + _this.data.satisfy_money + '&now_time=' + _this.data.now_time,
  //           success: function(res) {
  //             console.log(res)
  //           },
  //           fail: function(res) {
  //             console.log(res)
  //           },
  //           complete: function(res) {
  //             console.log(res)
  //           },
  //         })
  //         // }
  //       }
  //     })
  //   }
  // },
  /*点击 跳到商品详情*/
  urldetails(e) {
    let goodsid = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../details/details?goodsid=' + goodsid,
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
  },
  /*优惠券*/
  commentsi(e) {
    let cp = e.currentTarget.dataset.moy;
    console.log(cp);
    wx.navigateTo({
      url: '../coupons/coupons?cp=' + cp + '&page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
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
  },
  /*商品展示列表*/
  listshop(e) {
    var temp_id = e.currentTarget.dataset.tid ;
    wx.navigateTo({
      url: '../shoplist/shoplist?temp_id=' + temp_id,
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
  },
  /*跳转到地址*/
  newaddress() {
    wx.navigateTo({
      url: '../newaddress/newaddress?page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
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
  },
  onLoad: function(options) {
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
  onShow: function() {
    var _this = this;
    var page = _this.data.page; //page= 2 购物车进入  page=1 商品立即购买进入
    console.log(page);
    var goods_id = _this.data.goods_id; //商品id
    var spec_key = _this.data.spec_key; //商品规格
    var num = _this.data.num; //商品数量
    var id = _this.data.Cart_address_id; //地址id
    var dis_id = _this.data.dis_id; //优惠卷id
    var uid = wx.getStorageSync("userinfo").uid; //用户id
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    var item = _this.data.items; //地址

    function getNowTime() { //计算下单事件如果超过上午十点  明天到达  否则  今日送达
      var now = new Date();
      var h = now.getHours();
      var formatDate = h;
      return formatDate;
    }
    if (page == 2) { //从购物车结算
      wx.request({
        url: app.globalData.Murl + "/Applets/Cart/CartBuy",
        data: {
          member_id: uid, //用户id
          seller_id: 1
        },
        method: "post",
        success: function(res) {
          if (res.data.status == true) { //请求成功获取信息
            wx.request({
              url: app.globalData.Murl + '/Applets/Cart/order1',
              data: {
                member_id: uid,
                seller_id: 1,
                dis_id: dis_id, //优惠卷id
                Cart_address_id: item //地址id
              },
              method: "post",
              success: function(res) {
                console.log(res.data);
                var isset = res.data.is_ok;
                var notgoods = res.data.not_show;
                var datalist = res.data; //返回的所有信息
                var godsorder = datalist.order; //商品信息
                var can_goods_coupon = datalist.can_goods_coupon; //商品卷可用数量
                var is_goods_coupon = datalist.is_goods_coupon; //优惠卷是否为商品类型卷
                datalist.timestos = getNowTime(datalist.reviews_addtime);
                if (is_goods_coupon == 1) { //当is_goods_coupon == 1说明有商品券
                  var reduce_moeny = datalist.reward_coupon.reduce_moeny;
                  var satisfy_money = datalist.reward_coupon.satisfy_money;
                  var now_time = datalist.reward_coupon.now_time;
                  _this.setData({
                    reduce_moeny: reduce_moeny,
                    satisfy_money: satisfy_money,
                    now_time: now_time,
                  })
                }
                if (datalist.address == null) { //当没有地址时
                  _this.setData({
                    goodsorder: godsorder, //商品信息
                    quantity: datalist, //返回的所有信息
                    is_goods_coupon: is_goods_coupon, //是否为商品卷
                    can_goods_coupon: can_goods_coupon, //商品卷可用数量
                    address: datalist.address, //地址
                    total: Number(datalist.money), //商品总价
                    package_mail: Number(datalist.commpany.package_mail), //满99减运费
                  })
                } else { //当有地址时
                  _this.setData({
                    goodsorder: godsorder, //商品信息
                    quantity: datalist, //返回的所有信息
                    is_goods_coupon: is_goods_coupon, //是否为商品卷
                    can_goods_coupon: can_goods_coupon, //商品卷可用数量
                    address: datalist.address, //地址
                    loc: datalist.address.sheng,
                    total: Number(datalist.money), //商品总价
                    package_mail: Number(datalist.commpany.package_mail), //满99减运费
                  })
                }
                if (datalist.coupon == null) { //没用优惠卷 coupon_money = 0
                  _this.setData({
                    coupon_money: Number("0.00")
                  })
                } else { //用优惠券 coupon_money = datalist.coupon.coupon_money
                  _this.setData({
                    coupon_money: Number(datalist.coupon.coupon_money)
                  })
                }

                _this.setData({
                  upto_amount: Number(datalist.yunfei),
                  notgoods: notgoods,
                  isset: isset
                })

                _this.setData({
                  lasttotal: Number(_this.data.total + _this.data.upto_amount - _this.data.coupon_money).toFixed(2)
                })
                console.log(_this.data.total);
                console.log(_this.data.lasttotal);
                console.log(_this.data.package_mail);
                console.log(_this.data.coupon_money);
                console.log(_this.data.upto_amount);
              }
            })
          } else if (res.data.status == false) { //跳转到我的订单页
            wx.redirectTo({
              url: '../m-order/m-order?sta=0',
            })
          }
        }
      })
    } else if (page == 1) { //商品立即结算过来
      // wx.request({
      //   url: app.globalData.Murl + "/Applets/Cart/CartBuy",
      //   data: {
      //     member_id: uid,
      //     seller_id: 1,
      //     goods_id: goods_id,
      //     spec_key: spec_key,
      //     goods_num: num,
      //   },
      //   method: "post",
      //   success: function(res) {
      //     if (res.data.status == true) { //请求成功获取信息
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/order1',
        data: {
          member_id: uid,
          seller_id: 1,
          dis_id: dis_id, //优惠卷id
          Cart_address_id: item //地址id
        },
        method: "post",
        success: function(res) {
          console.log(res.data);
          var isset = res.data.is_ok;
          var notgoods = res.data.not_show;
          var datalist = res.data; //返回的所有信息
          var godsorder = datalist.order; //商品信息
          var can_goods_coupon = datalist.can_goods_coupon; //商品卷可用数量
          var is_goods_coupon = datalist.is_goods_coupon; //优惠卷是否为商品类型卷
          datalist.timestos = getNowTime(datalist.reviews_addtime);
          if (is_goods_coupon == 1) { //当is_goods_coupon == 1说明有商品券
            var reduce_moeny = datalist.reward_coupon.reduce_moeny;
            var satisfy_money = datalist.reward_coupon.satisfy_money;
            var now_time = datalist.reward_coupon.now_time;
            _this.setData({
              reduce_moeny: reduce_moeny,
              satisfy_money: satisfy_money,
              now_time: now_time,
            })
          }
          if (datalist.address == null) { //当没有地址时
            _this.setData({
              goodsorder: godsorder, //商品信息
              quantity: datalist, //返回的所有信息
              is_goods_coupon: is_goods_coupon, //是否为商品卷
              can_goods_coupon: can_goods_coupon, //商品卷可用数量
              address: datalist.address, //地址
              total: Number(datalist.money), //商品总价
              package_mail: Number(datalist.commpany.package_mail), //满99减运费
            })
          } else { //当有地址时
            _this.setData({
              goodsorder: godsorder, //商品信息
              quantity: datalist, //返回的所有信息
              is_goods_coupon: is_goods_coupon, //是否为商品卷
              can_goods_coupon: can_goods_coupon, //商品卷可用数量
              address: datalist.address, //地址
              loc: datalist.address.sheng,
              total: Number(datalist.money), //商品总价
              package_mail: Number(datalist.commpany.package_mail), //满99减运费
            })
          }
          if (datalist.coupon == null) { //没用优惠卷 coupon_money = 0
            _this.setData({
              coupon_money: Number("0.00")
            })
          } else { //用优惠券 coupon_money = datalist.coupon.coupon_money
            _this.setData({
              coupon_money: Number(datalist.coupon.coupon_money)
            })
          }
          _this.setData({
            upto_amount: Number(datalist.yunfei),
            notgoods: notgoods,
            isset: isset
          })
          _this.setData({ 
            lasttotal: Number(_this.data.total + _this.data.upto_amount - _this.data.coupon_money).toFixed(2)
          })
          console.log(_this.data.total);
          console.log(_this.data.lasttotal);
          console.log(_this.data.package_mail);
          console.log(_this.data.coupon_money);
          console.log(_this.data.upto_amount);
        }
      })
      //     } else if (res.data.status == false) { //跳转到我的订单页
      //       wx.redirectTo({
      //         url: '../m-order/m-order?sta=0',
      //       })
      //     }
      //   }
      // })
    }
  },
  // onShow: function() {
  //   var pages = getCurrentPages();
  //   var currPage = pages[pages.length - 1]; //当前页面
  //   var pagess = getCurrentPages();
  //   var currPages = pagess[pages.length - 1]; //当前页面
  //   /*收货地址*/
  //   var item = currPage.data.items;
  //   console.log(item);
  //   var _this = this;
  //   var page = _this.data.page;
  //   var goods_id = _this.data.goods_id;
  //   var spec_key = _this.data.spec_key;
  //   var num = _this.data.num;
  //   var id = _this.data.Cart_address_id;
  //   var dis_id = _this.data.dis_id;

  //   function getNowTime() {
  //     var now = new Date();
  //     var h = now.getHours();
  //     var formatDate = h;
  //     return formatDate;
  //   }
  //   var uid = wx.getStorageSync("userinfo").uid;
  //   if (page == 2) { //如果page==2 说明是从购物车进入
  //     /*购物车结算的接口*/
  //     var urlshop = app.globalData.Murl + "/Applets/Cart/CartBuy";
  //     wx.request({
  //       url: urlshop,
  //       data: {
  //         member_id: uid,
  //         seller_id: 1
  //       },
  //       method: "post",
  //       success: function(res) {
  //         const dastas = res.data;
  //         console.log(dastas);
  //         if (dastas.status == true) {
  //           wx.request({
  //             url: app.globalData.Murl + '/Applets/Cart/order1',
  //             data: {
  //               member_id: uid,
  //               seller_id: 1,
  //               dis_id: dis_id, //优惠卷id
  //               Cart_address_id: item //地址id
  //             },
  //             method: "post",
  //             success: function(res) {
  //               console.log('abcd');
  //               console.log(res.data);
  //               var datalist = res.data; //返回的所有信息
  //               var godsorder = datalist.order; //商品信息
  //               console.log(datalist.select_weekday1);
  //               var commpany = datalist.commpany; //运费满减信息
  //               var can_goods_coupon = datalist.can_goods_coupon; //商品卷可用数量
  //               var is_goods_coupon = datalist.is_goods_coupon; //优惠卷是否为商品类型卷
  //               datalist.timestos = getNowTime(datalist.reviews_addtime);
  //               if (is_goods_coupon == 1) {
  //                 var reduce_moeny = datalist.reward_coupon.reduce_moeny;
  //                 var satisfy_money = datalist.reward_coupon.satisfy_money;
  //                 var now_time = datalist.reward_coupon.now_time;
  //                 _this.setData({
  //                   reduce_moeny: reduce_moeny,
  //                   satisfy_money: satisfy_money,
  //                   now_time: now_time,
  //                 })
  //               }
  //               if (datalist.address == null) { //当没有填写地址时
  //                 _this.setData({
  //                   goodsorder: godsorder, //商品信息
  //                   quantity: datalist, //返回的所有信息
  //                   is_goods_coupon: is_goods_coupon, //是否为商品卷
  //                   can_goods_coupon: can_goods_coupon, //商品卷可用数量
  //                   address: datalist.address, //地址
  //                   money: Number(datalist.money), //商品总价
  //                   allsprice: Number(datalist.money) + Number(commpany.upto_amount), //总价加上运费
  //                   package_mail: Number(datalist.commpany.package_mail) //满99减运费
  //                 })
  //               } else { //当填写地址时
  //                 _this.setData({
  //                   goodsorder: godsorder, //商品信息
  //                   quantity: datalist, //返回的所有信息
  //                   is_goods_coupon: is_goods_coupon, //是否为商品卷
  //                   can_goods_coupon: can_goods_coupon, //商品卷可用数量
  //                   address: datalist.address, //地址
  //                   loc: datalist.address.sheng,
  //                   money: Number(datalist.money), //商品总价
  //                   allsprice: Number(datalist.money) + Number(commpany.upto_amount), //总价加上运费
  //                   package_mail: Number(datalist.commpany.package_mail) //满99减运费
  //                 })

  //               }
  //               var allsprices = _this.data.allsprice; //总价加上运费赋值给allsprices      
  //               console.log(allsprices);
  //               console.log(_this.data.quantity);
  //               console.log(1234);
  //               console.log(_this.data.package_mail);
  //               if (_this.data.quantity.coupon == null) {
  //                 var jine = Number(_this.data.package_mail);
  //               } else {
  //                 var jine = Number(_this.data.package_mail) + Number(_this.data.quantity.coupon.coupon_money);
  //               }
  //               _this.setData({
  //                 jine: jine
  //               })
  //               console.log(jine)
  //               var moneys = _this.data.money; //商品总价赋值给moneys
  //               if (datalist.coupon == null) {

  //               } else {
  //                 var prices = datalist.coupon.coupon_money; //优惠卷金额

  //                 _this.setData({
  //                   conprice: Number(allsprices - prices).toFixed(2), // 当有邮费时的价格
  //                   compoins: Number(moneys - prices).toFixed(2), // 没有邮费时的价格
  //                 })
  //               }
  //             }
  //           })
  //         } else if (dastas.status == false) {
  //           wx.redirectTo({
  //             url: '../m-order/m-order?sta=0',
  //           })
  //         }
  //       }
  //     })

  //   } else if (page == 1) {
  //     /*立即购买的接口*/
  //     var _urlshop = app.globalData.Murl + "/Applets/Cart/goBuy";
  //     wx.request({
  //       url: _urlshop,
  //       data: {
  //         member_id: uid,
  //         seller_id: 1,
  //         goods_id: goods_id,
  //         spec_key: spec_key,
  //         goods_num: num,
  //       },
  //       method: "post",
  //       success: function(res) {
  //         const dastas = res.data;
  //         console.log(dastas);
  //         if (dastas.status == true) {
  //           wx.request({
  //             url: app.globalData.Murl + '/Applets/Cart/order1',
  //             data: {
  //               member_id: uid,
  //               seller_id: 1,
  //               dis_id: dis_id,
  //               Cart_address_id: item
  //             },
  //             method: "post",
  //             success: function(res) {
  //               var datalist = res.data;
  //               console.log(datalist);
  //               var godsorder = datalist.order;
  //               var can_goods_coupon = datalist.can_goods_coupon;
  //               var is_goods_coupon = datalist.is_goods_coupon;
  //               console.log(is_goods_coupon);
  //               var commpany = datalist.commpany;
  //               datalist.timestos = getNowTime(datalist.reviews_addtime);
  //               if (is_goods_coupon == 1) {
  //                 var reduce_moeny = datalist.reward_coupon.reduce_moeny;
  //                 var satisfy_money = datalist.reward_coupon.satisfy_money;
  //                 var now_time = datalist.reward_coupon.now_time;
  //                 _this.setData({
  //                   reduce_moeny: reduce_moeny,
  //                   satisfy_money: satisfy_money,
  //                   now_time: now_time,
  //                 })
  //               }
  //               if (datalist.address == null) {
  //                 _this.setData({
  //                   goodsorder: godsorder,
  //                   quantity: datalist,
  //                   is_goods_coupon: is_goods_coupon,
  //                   can_goods_coupon: can_goods_coupon,
  //                   address: datalist.address,
  //                   money: Number(datalist.money),
  //                   allsprice: Number(datalist.money) + Number(commpany.upto_amount),
  //                   package_mail: Number(datalist.commpany.package_mail)
  //                 })
  //               } else {
  //                 _this.setData({
  //                   goodsorder: godsorder,
  //                   quantity: datalist,
  //                   is_goods_coupon: is_goods_coupon,
  //                   can_goods_coupon: can_goods_coupon,
  //                   address: datalist.address,
  //                   loc: datalist.address.sheng,
  //                   money: Number(datalist.money),
  //                   allsprice: Number(datalist.money) + Number(commpany.upto_amount),
  //                   package_mail: Number(datalist.commpany.package_mail)
  //                 })

  //               }
  //               var allsprices = _this.data.allsprice;
  //               console.log(allsprices);

  //               if (_this.data.quantity.coupon == null) {
  //                 var jine = Number(_this.data.package_mail);
  //               } else {
  //                 var jine = Number(_this.data.package_mail) + Number(_this.data.quantity.coupon.coupon_money);
  //               }
  //               _this.setData({
  //                 jine: jine
  //               })
  //               var moneys = _this.data.money;
  //               if (datalist.coupon == null) {

  //               } else {
  //                 var prices = datalist.coupon.coupon_money;

  //                 _this.setData({
  //                   conprice: Number(allsprices - prices).toFixed(2),
  //                   compoins: Number(moneys - prices).toFixed(2),
  //                 })
  //               }
  //             }
  //           })
  //         }
  //       }

  //     })

  //   }


  // }
})