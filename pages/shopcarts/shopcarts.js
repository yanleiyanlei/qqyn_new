const app = getApp();
Page({
  data: {
    items: [],
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    totaYunfei: 99, //满99免除运费
    startX: 0, //开始坐标
    startY: 0,
    isTouchMove: false, //列表右滑状态
    hieneflae: false, //false =编辑状态  true
    settlEment: "去结算",
    modelHidden: "true",
    numbers: [], //获取到 要 删除的 列表的下标
    cartsid: [],
    zonprice: [], //总价减去包邮的价格
    hiddenLoading: true, //加载中
    ress: [],
    commpany: [],
    location: '',
    isquan: true //是否可以全选
  },
  /*计算总价*/
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].area == 1 && carts[i].store_count > 0) {
        if (carts[i].selected) { // 判断选中才会计算价格
          total += carts[i].goods_num * carts[i].goods_price; // 所有价格加起来
        }
      }
    }
    /*第二件商品 0元购*/
    /*for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        if (carts[i].goods_id == 23 || carts[i].goods_id == 347 || carts[i].goods_id == 300 || carts[i].goods_id == 327) {
          if (carts[i].goods_num > 1) {
            total += carts[i].goods_num * carts[i].goods_price - carts[i].goods_price;
          } else {
            total += carts[i].goods_num * carts[i].goods_price;
          }
        } else {
          total += carts[i].goods_num * carts[i].goods_price;
        }
      }
    }*/
    var dalist = this.data.dalist;
    var numprice = dalist.package_mail;
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      zonprice: Number(numprice - total).toFixed(2),
    });
    //判断是否有选中的  有商品券 商品
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].is_coupon == 1 && carts[i].selected == true) {
        this.setData({
          is_coupon: 1,
        })
      } else if (carts[i].is_coupon == 1 && carts[i].selected == false) {
        this.setData({
          is_coupon: 0,
        })
      }
    }
  },
  /*点击商品图片判断商品状态   跳到详情*/
  tiaodeilts(e) {
    let goodsid = e.currentTarget.dataset.id; //获取商品id
    const _url = app.globalData.Murl + "/Applets/Goods/goodsdetails"; //商品请求地址
    wx.request({
      url: _url, //商品请求地址
      data: {
        id: goodsid, //请求商品id
      },
      success: function(res) {
        console.log(res.data);
        if (res.data == -2) { //判断商品状态  res.data == -2 商品已经下架
          wx.showToast({
            title: '该商品已经下架',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.navigateTo({ //没有下架则跳转到详情页
            url: '../details/details?goodsid=' + goodsid, //跳转地址
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
      }
    })
  },
  goshop(e) { //结算功能
    //let goodsid= e.currentTarget.dataset.index;
    var uid = wx.getStorageSync("userinfo").uid; //获取用户id
    var urlshop = app.globalData.Murl + "/Applets/Cart/CartBuy";
    var carts = this.data.carts; //购物车赋值
    wx.request({ //获取购物车信息
      url: urlshop,
      data: {
        member_id: uid, //用户信息
        seller_id: 1 //传参 1
      },
      method: "post",
      success: function(res) {
        const dastas = res.data;
        console.log(dastas);
        for (var i = 0; i < carts.length; i++) {
          if (carts[i].selected == true) {
            var kc = Number(carts[i].store_count); //商品库存
            var num = Number(carts[i].goods_num); //选中商品数量
            var name = carts[i].goods_name; //商品名称
            var is_on_sale = carts[i].is_on_sale; //商品状态  1 上架   0 下架
            console.log(is_on_sale);
            if (is_on_sale == 0) {
              wx.showToast({
                title: name + '已下架,请选择其他商品',
                icon: 'none',
                duration: 2000
              })
              var flag = false;
              return false;
            }
            if (num > kc) {
              wx.showToast({
                title: name + '库存不足',
                icon: 'none',
                duration: 2000
              })

              var flag = false;
              return false;
            }
          }
        }
        if (flag) {
          wx.showToast({
            title: name + '库存不足',
            icon: 'none',
            duration: 2000
          })
          return false;
        } else if (dastas.status == true) {
          wx.navigateTo({
            url: '../theorder/theorder?page=' + 2,
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

        } else {
          wx.showToast({
            title: '请选择商品',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
        }
      }
    })
  },
  /*全选事件*/
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 获取全选状态
    selectAllStatus = !selectAllStatus; // 改变选中状态
    let carts = this.data.carts; //获取购物车信息
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid; //获取用户信息
    var _this = this;
    var value = _this.data.hieneflae; //删除 状态 
    console.log(value)     
    if (value == true) {
      if (selectAllStatus == true) { //选中状态
        for (let i = 0; i < carts.length; i++) {
          if (carts[i].area == 1 && carts[i].store_count > 0) {
            if (carts[i].selected == true) {

            } else {
              var kc = Number(carts[i].store_count); //每个商品的库存
              var num = Number(carts[i].goods_num); //每个商品的选中数量
              if (value == false) {
                wx.request({
                  url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect", //后台请求地址
                  data: {
                    member_id: uid, //用户id
                    cart_id: carts[i].id, //所选商品id
                    selected: 1,
                  },
                  method: "POST",
                  success: function(res) {

                    if (res.data.selected == 'true') { //后台返回 res.data.selected == 'true' 请求成功
                      let carts = _this.data.carts; //获取购物车信息
                      const selected = carts[i].selected; //获取商品的selected 选中状态
                      carts[i].selected = !selected; //改变商品选中状态
                      _this.getTotalPrice(); //重新计算总价
                      _this.setData({
                        carts: carts, //更新购物车
                      })

                    } else {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(function() {
                        wx.hideLoading()
                      }, 1000)
                    }
                  }
                })
              } else if (value == true) {
                wx.request({
                  url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect",
                  data: {
                    member_id: uid,
                    cart_id: carts[i].id,
                    selected: 1,
                  },
                  method: "POST",
                  success: function(res) {

                    // if (res.data.selected == 'true') {
                      let carts = _this.data.carts;
                      const selected = carts[i].selected;
                      carts[i].selected = !selected;
                      _this.getTotalPrice();
                      _this.setData({
                        carts: carts,
                      })

                    // } else {
                    //   wx.showToast({
                    //     title: '系统繁忙',
                    //     icon: 'none',
                    //     duration: 2000
                    //   })
                    //   setTimeout(function() {
                    //     wx.hideLoading()
                    //   }, 1000)
                    // }
                  }
                })
              } 
              // else {
              //   wx.showToast({
              //     title: '未选中的商品库存不足，请修改数量',
              //     icon: 'none',
              //     duration: 2000
              //   })
              // }
            }
          }
        }

      } else { //取消选中
        for (let i = 0; i < carts.length; i++) {
          if (carts[i].area == 1 && carts[i].store_count > 0) {
            if (carts[i].selected == false) {

            } else {
              wx.request({
                url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect",
                data: {
                  member_id: uid,
                  cart_id: carts[i].id,
                  selected: 0,
                },
                method: "POST",
                success: function(res) {
                  console.log(res.data);
                  // if (res.data.selected == 'true') {
                    let carts = _this.data.carts;
                    const selected = carts[i].selected;
                    carts[i].selected = !selected;
                    _this.getTotalPrice();
                    _this.setData({
                      carts: carts
                    })

                  // } else {
                  //   wx.showToast({
                  //     title: '系统繁忙',
                  //     icon: 'none',
                  //     duration: 2000
                  //   })
                  //   setTimeout(function() {
                  //     wx.hideLoading()
                  //   }, 1000)
                  // }
                }
              })
            }
          }
        }

      }
    } else {
      if (selectAllStatus == true) { //选中状态
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected == true) {

            } else {
              var kc = Number(carts[i].store_count); //每个商品的库存
              var num = Number(carts[i].goods_num); //每个商品的选中数量
              if (value == false) {
                wx.request({
                  url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect", //后台请求地址
                  data: {
                    member_id: uid, //用户id
                    cart_id: carts[i].id, //所选商品id
                    selected: 1,
                  },
                  method: "POST",
                  success: function(res) {

                    // if (res.data.selected == 'true') { //后台返回 res.data.selected == 'true' 请求成功
                      let carts = _this.data.carts; //获取购物车信息
                      const selected = carts[i].selected; //获取商品的selected 选中状态
                      carts[i].selected = !selected; //改变商品选中状态
                      _this.getTotalPrice(); //重新计算总价
                      _this.setData({
                        carts: carts, //更新购物车
                      })

                    // } else {
                    //   wx.showToast({
                    //     title: '系统繁忙',
                    //     icon: 'none',
                    //     duration: 2000
                    //   })
                    //   setTimeout(function() {
                    //     wx.hideLoading()
                    //   }, 1000)
                    // }
                  }
                })
              } else if (value == true) {
                wx.request({
                  url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect",
                  data: {
                    member_id: uid,
                    cart_id: carts[i].id,
                    selected: 1,
                  },
                  method: "POST",
                  success: function(res) {

                    if (res.data.selected == 'true') {
                      let carts = _this.data.carts;
                      const selected = carts[i].selected;
                      carts[i].selected = !selected;
                      _this.getTotalPrice();
                      _this.setData({
                        carts: carts,
                      })

                    } else {
                      wx.showToast({
                        title: '系统繁忙',
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(function() {
                        wx.hideLoading()
                      }, 1000)
                    }
                  }
                })
              }
              //  else {
              //   wx.showToast({
              //     title: '未选中的商品库存不足，请修改数量',
              //     icon: 'none',
              //     duration: 2000
              //   })
              // }
            }
        }

      } else { //取消选中
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected == false) {

            } else {
              wx.request({
                url: app.globalData.Murl + "/Applets/Cart/ajaxCartSelect",
                data: {
                  member_id: uid,
                  cart_id: carts[i].id,
                  selected: 0,
                },
                method: "POST",
                success: function(res) {
                  console.log(res.data);
                  // if (res.data.selected == 'true') {
                    let carts = _this.data.carts;
                    const selected = carts[i].selected;
                    carts[i].selected = !selected;
                    _this.getTotalPrice();
                    _this.setData({
                      carts: carts
                    })

                  // } else {
                  //   wx.showToast({
                  //     title: '系统繁忙',
                  //     icon: 'none',
                  //     duration: 2000
                  //   })
                  //   setTimeout(function() {
                  //     wx.hideLoading()
                  //   }, 1000)
                  // }
                }
              })
            }
        }

      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice(); // 重新获取总价
  },
  /*编辑*/
  toggle: function() {
    var value = !this.data.hieneflae;
    var carts = this.data.carts;
    let arr1 = [];
    console.log(carts);
    if (value == true) {
      const pages = getCurrentPages()
      const perpage = pages[pages.length - 1]
      perpage.onShow()
    }
    this.setData({
      hieneflae: value,
      isquan: true
    })
    for (let a = 0; a < carts.length; a++) {
        arr1.push(carts[a].selected)
    }
    console.log(arr1);
    if (arr1.indexOf(false) != -1) {
      this.setData({
        selectAllStatus: false,
      })
    } else {
      this.setData({
        selectAllStatus: true,
      })
    }
    console.log(this.data.selectAllStatus);
  },
  // 增加数量
  addCount(e) {
    var userinfo = wx.getStorageSync("userinfo"); //获取用户信息
    var uid = userinfo.uid; //获取用户id
    const index = e.currentTarget.dataset.index; //获取商品index
    const id = e.currentTarget.dataset.id; //获取商品id
    const goods_id = e.currentTarget.dataset.ids; //获取商品goods_id
    let carts = this.data.carts; //获取购物车信息
    var kc = e.currentTarget.dataset.key; //获取该商品库存
    let num = carts[index].goods_num; //获取商品选中
    num = Number(num) + 1; //商品数量每次加一
    console.log(goods_id);
    if (num > kc) { //数目大于库存
      wx.showToast({
        title: '库存不足！',
        icon: 'loading',
        duration: 2000,
      })
      return false;
    }
    carts[index].goods_num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    let addurl = app.globalData.Murl + "/Applets/Cart/ajaxCartCount";
    wx.request({
      url: addurl,
      data: {
        member_id: uid,
        cart_id: id,
        goods_num: num,
      },
      method: "POST",
      success: function(res) {
        console.log(res.data);
        if (res.data.result == 1) {


        } else {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
        }
      }
    })

  },
  // 减少数量
  minusCount(e) {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].goods_num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].goods_num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    let jinsurl = app.globalData.Murl + "/Applets/Cart/ajaxCartCount";
    wx.request({
      url: jinsurl,
      data: {
        member_id: uid,
        cart_id: id,
        goods_num: num,
      },
      method: "POST",
      success: function(res) {
        console.log(res.data);
        if (res.data.result == 1) {

        } else {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
        }
      }
    })
  },

  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.carts.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.carts.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      carts: that.data.carts
    })
  },
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  onLoad: function() {
    var uid = wx.getStorageSync("userinfo").uid;
    this.setData({
      uid: uid
    })
  },
  onShow: function() {
    const _that = this;
    var location = wx.getStorageSync("locationcity");
    _that.setData({
      is_coupon: 0,
      location: location
    })
    var uid = wx.getStorageSync("userinfo").uid; //获取用户uid
    /* if(value=='')*/
    var value = _that.data.hieneflae;
    if (value == false) {
      _that.setData({
        hieneflae: true, //设置默认为全选
      })
      console.log(_that.data.hieneflae);
    } else {
      console.log(123123);
    }


    var uid = _that.data.uid;
    console.log(uid);
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList"; //获取购物车数据
    wx.request({
      url: shopusr,
      data: {
        member_id: uid, //用户uid
        seller_id: 1,
        city: location
      },
      method: "POST",
      success: function(res) {
        const dalist = res.data;
        var carts = dalist.cartList; //购物车信息
        console.log(dalist);
        var package_mail = dalist.commpany.package_mail; //包邮的金额
        let total = 0;
        console.log(carts);
        for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
          if (carts[i].area == 1 && carts[i].store_count > 0) {
            if (carts[i].selected) { // 判断选中才会计算价格
              total += carts[i].goods_num * carts[i].goods_price; // 所有价格加起来
            }
          }
        }
        /*第二件商品 0元购*/
        /*for (let i = 0; i < carts.length; i++) {
          if (carts[i].selected == true) {
            if (carts[i].goods_id == 23 || carts[i].goods_id == 347 || carts[i].goods_id == 300 || carts[i].goods_id == 327) {
              if (carts[i].goods_num > 1) {
                total += carts[i].goods_num * carts[i].goods_price - carts[i].goods_price;
              } else {
                total += carts[i].goods_num * carts[i].goods_price;
              }
            } else {
              total += carts[i].goods_num * carts[i].goods_price;
            }
          }
        }*/
        let cartstrue = [];
        for (let i = 0; i < carts.length; i++) {
          if (carts[i].area == 1 && carts[i].store_count > 0) {
            cartstrue.push(carts[i].selected);
          }
        }
        if (cartstrue.length < 1) {
          _that.setData({
            selectAllStatus: false,
            isquan: false
          })
        } else {
          _that.setData({
            isquan: true
          })
          if (cartstrue.indexOf(false) !== -1) {
            _that.setData({
              selectAllStatus: false,
            })
          } else {
            _that.setData({
              selectAllStatus: true,
            })
          }
        }

        // console.log(_that.data.selectAllStatus)
        //赋值
        _that.setData({
          dalist: dalist.commpany,
          hasList: true, //购物车有信息
          carts: carts, //购物车
          commpany: dalist.commpany, //其他满多少包邮
          package_mail: Number(dalist.commpany.package_mail), //包邮的金额
          totalPrice: total.toFixed(2), //总价
          zonprice: Number(package_mail - total).toFixed(2), //总价差包邮的金额多少
        })
        //判断是否有选中的  有商品券 商品
        for (var i = 0; i < carts.length; i++) {
          if (carts[i].is_coupon == 1 && carts[i].selected == true) {
            _that.setData({
              is_coupon: 1,
            })
          } else if (carts[i].is_coupon == 1 && carts[i].selected == false) {
            _that.setData({
              is_coupon: 0,
            })
          }
        }
        console.log(_that.data.is_coupon);

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
  /*选择商品*/
  selectList(e) {
    const index = e.currentTarget.dataset.index; //商品所在位置
    const key = e.currentTarget.dataset.key; //自定义  0  或者  1
    const id = e.currentTarget.dataset.id; //商品id
    var _this = this;
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid; //用户id
    var value = _this.data.hieneflae; //删除 状态
    const kc = Number(e.currentTarget.dataset.kc); //商品库存
    const num = Number(e.currentTarget.dataset.num); //选中商品数量
    console.log(kc);
    console.log(num);
    const priceurl = app.globalData.Murl + "/Applets/Cart/ajaxCartSelect"; //请求后台地址
    if (value == true) {
      wx.request({
        url: priceurl,
        data: {
          member_id: uid,
          cart_id: id,
          selected: key,
        },
        method: "POST",
        success: function(res) {
          // if (res.data.selected == 'true') { //后台请求成功
            let carts = _this.data.carts; //购物车信息
            console.log(carts);
            const selected = carts[index].selected; //获取此商品选中状态
            carts[index].selected = !selected; //改变此商品的选中状态
            _this.getTotalPrice(); //重新计算商品总价
            _this.setData({
              carts: carts, //更新购物车信息
            })

            //判断购物车商品是否全补选中，如果全部选中，底部全选状态激活  selectAllStatus==true
            let cartstrue = [];
            for (let i = 0; i < carts.length; i++) {
              if (carts[i].area == 1 && carts[i].store_count>0) {
                cartstrue.push(carts[i].selected);
              }
            }
            //使用indeof进行对比查找
            if (cartstrue.indexOf(false) != -1) {
              _this.setData({
                selectAllStatus: false,
              })
            } else {
              _this.setData({
                selectAllStatus: true,
              })
            }
          // } else {
          //   wx.showToast({
          //     title: '系统繁忙',
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   setTimeout(function() {
          //     wx.hideLoading()
          //   }, 1000)
          // }

        }
      })
    } else if (value == false) {
      wx.request({
        url: priceurl,
        data: {
          member_id: uid,
          cart_id: id,
          selected: key,
        },
        method: "POST",
        success: function(res) {
          // if (res.data.selected == 'true') {
            let carts = _this.data.carts;
            console.log(carts);
            const selected = carts[index].selected;
            carts[index].selected = !selected;
            _this.getTotalPrice();
            _this.setData({
              carts: carts,
            })
            let cartstrue = [];
            for (let i = 0; i < carts.length; i++) {

                cartstrue.push(carts[i].selected);

            }

            if (cartstrue.indexOf(false) != -1) {
              _this.setData({
                selectAllStatus: false,
              })
            } else {
              _this.setData({
                selectAllStatus: true,
              })
            }
          // } else {
          //   wx.showToast({
          //     title: '系统繁忙',
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   setTimeout(function() {
          //     wx.hideLoading()
          //   }, 1000)
          // }
        }
      })
    }
  },
  /*删除*/
  deleteLists(e) {
    const key = e.currentTarget.dataset.key; //商品id
    let carts = this.data.carts; //购物车
    const index = e.currentTarget.dataset.index; //商品坐标
    var _this = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除该商品吗？',
      success: function(res) {
        if (res.confirm) { //确定删除
          wx.request({ //像后台发送请求删除此商品
            url: app.globalData.Murl + "/Applets/Cart/ajaxDelCart", //请求地址
            data: {
              ids: key, //商品id
            },
            method: "post",
            success: function(res) { //请求成功
              console.log(res.data);
              if (res.data.status == 1) { //当res.data.status==1 说明后台删除成功
                let carts = _this.data.carts; //购物车
                carts.splice(index, 1); //购物车删除此商品
                _this.getTotalPrice(); //重新计算总价
                _this.setData({
                  carts: carts //更新购物车
                });
                let cartstrue = [];
                for (let i = 0; i < carts.length; i++) { //便利购物车中每一件商品是否选中
                  cartstrue.push(carts[i].selected);
                }

                if (cartstrue.indexOf(false) !== -1) {
                  _this.setData({
                    selectAllStatus: false,
                  })
                } else { //购物车商品都为选中状态时全选激活
                  _this.setData({
                    selectAllStatus: true,
                  })
                }
              } else {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function() {
                  wx.hideLoading()
                }, 1000)
              }
            }
          })
        }
      }
    })
  },
  /*删除多个*/
  dellbutn(e) {
    let carts = this.data.carts;
    var cartsid = [];
    var _this = this;

    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        cartsid.push(carts[i].id);
      }
    }
    if (cartsid.length < 1) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var cartsids = cartsid.toString();
    console.log(cartsids)
    var _this = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除该商品吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl + "/Applets/Cart/ajaxDelCart",
            data: {
              ids: cartsids,
            },
            method: "post",
            success: function(res) {

              if (res.data.status == 1) {
                var userinfo = wx.getStorageSync("userinfo");
                var uid = userinfo.uid;
                const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
                wx.request({
                  url: shopusr,
                  data: {
                    member_id: uid,
                    seller_id: 1
                  },
                  method: "POST",
                  success: function(res) {
                    const dalist = res.data;
                    var carts = dalist.cartList;
                    let total = 0;
                    for (let i = 0; i < carts.length; i++) {
                      if (carts[i].selected == true) {
                        total += carts[i].goods_num * carts[i].goods_price;
                      }
                    }
                    _this.getTotalPrice();
                    _this.setData({
                      carts: carts,
                      totalPrice: total.toFixed(2),
                      zonprice: (99 - total).toFixed(2),
                    })

                  }
                })
              } else {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function() {
                  wx.hideLoading()
                }, 1000)
              }
            }
          })
        }
      }
    })
  }

})