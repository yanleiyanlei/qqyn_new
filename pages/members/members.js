const app = getApp();
Page({
  data: {
    topimg: "display:block",
    coning: 'display:none',
    tabScrollTop: 500,
    tabFixed: 'display:none',
    mebersi: "display:none",
    region: ["省", "市", "区"],
    customItem: "",
    defalt: false,
    akey: 0,
    checkout: true,
    memberones: 'display:none'
  },
  seless: function (e) {
    var speck = e.currentTarget.dataset.id;
    //选中的规格

    var specks = this.data.specks;
    console.log(speck);
    var that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Onn/down",
      data: {
        spec_key: speck,
        specks: specks
      },
      method: 'post',
      success: function (res) {
        console.log(res);
        var goods = that.data.goods;
        that.setData({
          goods: res.data.goods,
          speckss: speck
        })
      }
    })
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop > this.data.tabScrollTop) {
      this.setData({
        tabFixed: 'display:block',
      })
    } else {
      this.setData({
        tabFixed: 'display:none',
      })
    }
  },
  lsgm: function () {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Onn/address",
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        console.log(res.data);
        var address = res.data.address;
        if(address.length==0){
          that.setData({
            nonemore:"display:none"
          })
        }
        var twoshu = address.slice(0, 2)
        that.setData({
          address: address,
          twoshu: twoshu,
        })
      },
      fail: function (res) {
        //console.log(res)
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
      },
      complete: function () {

      }
    })
    var specks = this.data.specks;
    var goods = this.data.goods;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].radio == 1) {
        var goods_id = goods[i].goods_id;
        var goods_name = goods[i].goods_name;
        var spec_key = goods[i].spec_key;
        var spec_name = goods[i].spec_name;
        var radio = goods[i].radio;
      }
    }
    if (goods_id == undefined) {
      wx.showToast({
        title: '请选择套餐',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        goods_id: goods_id,
        goods_name: goods_name,
        spec_key: spec_key,
        spec_name: spec_name,
        mebersi: "display:block",
        overhier: "height:900rpx;overflow: hidden;"
      })
    }

  },
  selectimg(e) {
    var speck = e.currentTarget.dataset.id;
    var speckss = this.data.speckss;
    console.log(speck);
    var that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Onn/radio",
      data: {
        spec_key: speck,
        speckss: speckss
      },
      method: 'post',
      success: function (res) {
        console.log(res);
        var goods = that.data.goods;
        that.setData({
          goods: res.data.goods,
          specks: speck
        })
      }
    })
  },
  gengdadd() {
    var address = this.data.address;
    console.log(address);
    if (address.length <= 3) {
      wx.showToast({
        title: '暂无更多地址',
        icon: "none",
        duration: 3000
      })
    } else {
      this.setData({
        twoshu: address,
        nonemore: "display:none",
        notadas: "height:600rpx;overflow-y: auto"
      })
    }

  },
  bindRegionChange: function (e) {

    if (e.detail.value[0] == "北京市" || e.detail.value[0] == "天津市" || e.detail.value[0] == "河北省") {
      this.setData({
        region: e.detail.value
      })
    } else {
      wx.showToast({
        title: '商城暂时仅支持京津冀的配送',
        icon: "none",
        duration: 3000
      })
    }
  },
  offs: function () {
    var address = this.data.address;
    var twoshu = address.slice(0, 2)
    this.setData({
      notadas:"height:auto",
      mebersi: "display:none",
      nonemore:"disblay:block",
      overhier: "height:auto;overflow: hidden;"
    })
  },
  onLoad() {
    // console.log(this.data.imgsrc);

  },
  onShow() {

    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var that = this;
    wx.request({
      url: app.globalData.Murl + "Applets/Onn/index",
      data: {
        member_id: uid,
      },
      method: 'post',
      success: function (res) {
        console.log(res.data);
        if (res.data.status == true) {
          that.setData({
            memberones: 'display:block',
            mebersi: "display:none",
          })
        } else if (res.data.status == false) {
          wx.request({
            url: app.globalData.Murl + "/Applets/Onn/goods",
            data: {

            },
            method: 'post',
            success: function (res) {
              console.log(res);
              that.setData({
                goods: res.data.goods
              })
            }
          })
        }
      }
    })
  },
  //去我的小店
  gomyshop() {
    app.globalData.store = 1
    wx.switchTab({
      url: '../index/index'
    })
  },
  chexkadd(e) {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var id = e.currentTarget.dataset.id;
    var state = e.currentTarget.dataset.state;
    console.log(state);
    console.log(id);
    var that = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Onn/radio_address",
      data: {
        id: id,
        radio: state,
        member_id: uid
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.address);
        var twoshu = that.data.twoshu;
        var status = res.data.address;
        var statuss = 0;
        for (var i = 0; i < status.length; i++) {
          if (status[i].radio == 'true') {
            statuss = 1;
            that.setData({
              bloons: true,
            })
          }
        }
        if (statuss == 0) {
          that.setData({
            bloons: false,
          })
        }
        // console.log(twoshu.length);
        if (twoshu.length > 3) {
          that.setData({
            twoshu: res.data.address,
          })
        } else if (twoshu.length <= 3) {
          that.setData({
            twoshu: res.data.address.slice(0, 2),

          })
        }
      }
    })
  },
  formSubmit: function (e) {
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    var openid = wx.getStorageSync("userinfo").openId;
    var shuju = this.data.twoshu;
    var goods_id = this.data.goods_id;
    var goods_name = this.data.goods_name;
    var spec_key = this.data.spec_key;
    var spec_name = this.data.spec_name;
    for (var i = 0; i < shuju.length; i++) {
      if (shuju[i].radio == 'true') {
        var address_id = shuju[i].id;
        var sheng = shuju[i].sheng;
        var shi = shuju[i].shi;
        var qu = shuju[i].qu;
        var address_content = shuju[i].address_content;
        var name = shuju[i].name;
        var phone = shuju[i].phone;
        var member_id = uid;
      }
    }
    var that = this;
    var formData = e.detail.value;
    if (address_id == undefined) {
     
     var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
      if (formData.address_name == "" || formData.address_sheng[0] == "省" || formData.address_names == "" ||  !regPhone.exec(formData.address_namea)) {
        wx.showToast({
          title: "请将收货地址或者电话填写正确",
          icon: 'none',
          duration: 1000
        })
      }else{
        var obj = {
          address_id: '',
          sheng: formData.address_sheng[0],
          shi: formData.address_sheng[1],
          qu: formData.address_sheng[2],
          address_content: formData.address_name,
          name: formData.address_names,
          phone: formData.address_namea,
          member_id: uid,
          seller_id: 1,
          goods_id: goods_id,
          goods_name: goods_name,
          spec_key: spec_key,
        }
        var that = this;
        wx.request({
          url: app.globalData.Murl + "/Applets/Onn/taocan",
          data: obj,
          method: 'post',
          success: function (res) {
            console.log(res.data);
            that.setData({
              vip_id: res.data.vip_id
            })
            if (res.data.status == 1) {
              wx.navigateTo({
                url: '../pay199/pay199?vip_id=' + that.data.vip_id,
                success: function (res) { console.log(res) },
                fail: function (res) { console.log(res) },
                complete: function (res) { console.log(res) },
              })
            }
          }
        })
      }
    } else if (address_id != "") {
      var obj = {
        address_id: address_id,
        sheng: sheng,
        shi: shi,
        qu: qu,
        address_content: address_content,
        name: name,
        phone: phone,
        member_id: uid,
        seller_id: 1,
        goods_id: goods_id,
        goods_name: goods_name,
        spec_key: spec_key,
      }
      var that = this;
      wx.request({
        url: app.globalData.Murl + "/Applets/Onn/taocan",
        data: obj,
        method: 'post',
        success: function (res) {
          console.log(res.data);
          that.setData({
            vip_id: res.data.vip_id
          })
          if (res.data.status == 1) {

            console.log(that.data.vip_id);
            wx.navigateTo({
              url: '../pay199/pay199?vip_id=' + that.data.vip_id,
              success: function (res) { console.log(res) },
              fail: function (res) { console.log(res) },
              complete: function (res) { console.log(res) },
            })
          }
        }
      })
    }
  }
})