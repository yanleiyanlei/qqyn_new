const app = getApp();
Page({
  data: {
    items: [],
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
    totaYunfei: 99,  //满99免除运费
    startX: 0, //开始坐标
    startY: 0,
    isTouchMove: false,
    hieneflae: false,
    settlEment: "去结算",
    modelHidden: "true",
    numbers: [],//获取到 要 删除的 列表的下标
    cartsid: [],
    zonprice: [],
    hiddenLoading: true,
    ress: [],
    commpany: [],
  },
  /*计算总价*/
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
        if(carts[i].selected) {                   // 判断选中才会计算价格
            total += carts[i].goods_num * carts[i].goods_price;     // 所有价格加起来
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
    var numprice=dalist.package_mail;
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(1),
      zonprice: Number(numprice - total).toFixed(1),
    });
    //判断是否有选中的  有商品券 商品
   for(var i=0;i<carts.length;i++){
     if (carts[i].is_coupon == 1 && carts[i].selected==true) {
        this.setData({
          is_coupon:1,
        })
     } else if (carts[i].is_coupon == 1 && carts[i].selected == false){
       this.setData({
         is_coupon:0,
       })
     }
   }
  },
  /*点击商品图片跳到详情*/
  tiaodeilts(e) {
    let goodsid = e.currentTarget.dataset.id;
    const _url = app.globalData.Murl+"/Applets/Goods/goodsdetails";
    wx.request({
      url: _url,
      data: {
        id: goodsid,
      },
      success: function (res) {
        console.log(res.data);
       if(res.data==-2){
         wx.showToast({
           title: '该商品已经下架',
           icon: 'none',
           duration: 2000
         })
       }else{
         wx.navigateTo({
           url: '../details/details?goodsid=' + goodsid,
           success: function (res) { console.log(res) },
           fail: function (res) { console.log(res) },
           complete: function (res) { console.log(res) },
         })
       }
      }
    })
  },
  goshop(e) {
    //let goodsid= e.currentTarget.dataset.index;
    var uid = wx.getStorageSync("userinfo").uid;
    var urlshop = app.globalData.Murl+"/Applets/Cart/CartBuy";
    var carts = this.data.carts;
    wx.request({
      url: urlshop,
      data: { member_id: uid, seller_id: 1 },
      method: "post",
      success: function (res) {
        const dastas = res.data;
        console.log(dastas);
        for (var i = 0; i < carts.length; i++) {
          if (carts[i].selected == true) {
            var kc = Number(carts[i].store_count);
            var num = Number(carts[i].goods_num);
            var name = carts[i].goods_name;
            var is_on_sale = carts[i].is_on_sale;
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
        }else if (dastas.status == true) {
              wx.navigateTo({
                url: '../theorder/theorder?page=' + 2,
                success: function (res) { console.log(res) },
                fail: function (res) { console.log(res) },
                complete: function (res) { console.log(res) },
              })

        } else {
          wx.showToast({
            title: '请选择商品',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      }
    })
  },
  /*全选事件*/
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var _this = this;
    var value = _this.data.hieneflae;//删除 状态

    if (selectAllStatus == true) {       //选中状态
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].selected == true) {

        } else {
          var kc = Number(carts[i].store_count);
          var num = Number(carts[i].goods_num);
          if (value == false) {
            wx.request({
              url: app.globalData.Murl+"/Applets/Cart/ajaxCartSelect",
              data: {
                member_id: uid,
                cart_id: carts[i].id,
                selected: 1,
              },
              method: "POST",
              success: function (res) {

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
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 1000)
                }
              }
            })
          } else if (value == true && kc >= num) {
            wx.request({
              url: app.globalData.Murl+"/Applets/Cart/ajaxCartSelect",
              data: {
                member_id: uid,
                cart_id: carts[i].id,
                selected: 1,
              },
              method: "POST",
              success: function (res) {

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
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 1000)
                }
              }
            })
          } else {
            wx.showToast({
              title: '未选中的商品库存不足，请修改数量',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }

    } else {                          //取消选中
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].selected == false) {

        } else {
          wx.request({
            url: app.globalData.Murl+"/Applets/Cart/ajaxCartSelect",
            data: {
              member_id: uid,
              cart_id: carts[i].id,
              selected: 0,
            },
            method: "POST",
            success: function (res) {
              console.log(res.data);
              if (res.data.selected == 'true') {
                let carts = _this.data.carts;
                const selected = carts[i].selected;
                carts[i].selected = !selected;
                _this.getTotalPrice();
                _this.setData({
                  carts: carts
                })

              } else {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 1000)
              }
            }
          })
        }
      }

    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  /*编辑*/
  toggle: function () {
    var value = !this.data.hieneflae;
    var carts = this.data.carts;
    this.setData({
      hieneflae: value,
    })
  },
  // 增加数量
  addCount(e) {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const goods_id = e.currentTarget.dataset.ids;
    let carts = this.data.carts;
    var kc = e.currentTarget.dataset.key;//获取data-num
    let num = carts[index].goods_num;
    num = Number(num) + 1;
    console.log(goods_id);
    if (num > kc) {
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
    let addurl = app.globalData.Murl+"/Applets/Cart/ajaxCartCount";
    wx.request({
      url: addurl,
      data: {
        member_id: uid,
        cart_id: id,
        goods_num: num,
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if (res.data.result == 1) {


        } else {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
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
    let jinsurl = app.globalData.Murl+"/Applets/Cart/ajaxCartCount";
    wx.request({
      url: jinsurl,
      data: {
        member_id: uid,
        cart_id: id,
        goods_num: num,
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if (res.data.result == 1) {

        } else {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      }
    })
  },

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.carts.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.carts.forEach(function (v, i) {
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
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  onLoad: function () {
    var uid = wx.getStorageSync("userinfo").uid;
    this.setData({
      uid: uid
    })
  },
  onShow: function () {
    const _that = this; 
    _that.setData({
      is_coupon: 0,
    })
    var uid = wx.getStorageSync("userinfo").uid;
    /* if(value=='')*/
    var value = _that.data.hieneflae;
    if (value == false) {
      _that.setData({
        hieneflae: true,
      })
      console.log(_that.data.hieneflae);
    } else {
      console.log(123123);
    }


    var uid = _that.data.uid;
    console.log(uid);
    const shopusr = app.globalData.Murl+"/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function (res) {
        const dalist = res.data;
        var carts = dalist.cartList;
        console.log(dalist);
        var package_mail = dalist.commpany.package_mail;
        let total = 0;
        console.log(carts);
         for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
              if(carts[i].selected) {                   // 判断选中才会计算价格
                  total += carts[i].goods_num * carts[i].goods_price;     // 所有价格加起来
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
          cartstrue.push(carts[i].selected);
        }
        if (cartstrue.indexOf(false) !== -1) {
          _that.setData({
            selectAllStatus: false,
          })
        } else {
          _that.setData({
            selectAllStatus: true,
          })
        }
        //赋值
        _that.setData({
          dalist: dalist.commpany,
          hasList: true,
          carts: carts,
          commpany: dalist.commpany,
          package_mail: Number(dalist.commpany.package_mail),
          totalPrice: total.toFixed(1),
          zonprice: Number(package_mail - total).toFixed(1),
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
  /*选择商品*/
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    const key = e.currentTarget.dataset.key;
    const id = e.currentTarget.dataset.id;
    var _this = this;
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var value = _this.data.hieneflae;//删除 状态
    const kc = Number(e.currentTarget.dataset.kc);
    const num = Number(e.currentTarget.dataset.num);
    console.log(kc);
    console.log(num);
    const priceurl = app.globalData.Murl+"/Applets/Cart/ajaxCartSelect";
    if (value == false) {
      wx.request({
        url: priceurl,
        data: {
          member_id: uid,
          cart_id: id,
          selected: key,
        },
        method: "POST",
        success: function (res) {
          if (res.data.selected == 'true') {
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
          //使用indeof进行对比查找
            if (cartstrue.indexOf(false) !== -1) {
              _this.setData({
                selectAllStatus: false,
              })
            } else {
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
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          }
        }
      })
    } else if (value == true) {
      wx.request({
        url: priceurl,
        data: {
          member_id: uid,
          cart_id: id,
          selected: key,
        },
        method: "POST",
        success: function (res) {
          if (res.data.selected == 'true') {
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

            if (cartstrue.indexOf(false) !== -1) {
              _this.setData({
                selectAllStatus: false,
              })
            } else {
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
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          }
        }
      })
    } else {
      wx.showToast({
        title: '库存不足,请重新选择数量',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /*删除*/
  deleteLists(e) {
    const key = e.currentTarget.dataset.key;
    let carts = this.data.carts;
    const index = e.currentTarget.dataset.index;
    var _this = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除该商品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl+"/Applets/Cart/ajaxDelCart",
            data: {
              ids: key,
            },
            method: "post",
            success: function (res) {
              console.log(res.data);
              if (res.data.status == 1) {
                let carts = _this.data.carts;
                carts.splice(index, 1);
                _this.getTotalPrice();
                _this.setData({
                  carts: carts
                });
                let cartstrue = [];
                for (let i = 0; i < carts.length; i++) {
                  cartstrue.push(carts[i].selected);
                }

                if (cartstrue.indexOf(false) !== -1) {
                  _this.setData({
                    selectAllStatus: false,
                  })
                } else {
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
                setTimeout(function () {
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
      } else {
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 2000
        })
      }
    }
    var cartsids = cartsid.toString();
    var _this = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除该商品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl+"/Applets/Cart/ajaxDelCart",
            data: {
              ids: cartsids,
            },
            method: "post",
            success: function (res) {

              if (res.data.status == 1) {
                var userinfo = wx.getStorageSync("userinfo");
                var uid = userinfo.uid;
                const shopusr = app.globalData.Murl+"/Applets/Cart/ajaxCartList";
                wx.request({
                  url: shopusr,
                  data: {
                    member_id: uid,
                    seller_id: 1
                  },
                  method: "POST",
                  success: function (res) {
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
                      totalPrice: total.toFixed(1),
                      zonprice: (99 - total).toFixed(1),
                    })

                  }
                })
              } else {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {
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
