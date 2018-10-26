const app=getApp();
Page({
  data: {
    region: ["省", "市", "区"],
    customItem: "",
    defalt: false,
    name: '',
    phone: '',
    by_phone: '',
    address2: '',
    aid: "",
    akey: 0
  },
  onLoad: function (options) {
    var aid = options.aid;
    var that = this;
    this.setData({
       aid: aid,
       page:options.page,
       goods_id:options.goods_id,
       spec_key:options.spec_key,     
       num:options.num,   
    })
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_change_address',
      data: { address_id: aid },
      method: "post",
      success: function (res) {

        var obj = res.data[0]
        if (obj.akey == 0) {
          var flag = false;
        } else {
          var flag = true;
        }
        if (obj.qu == null) {
          that.setData({
            region: [obj.sheng, obj.shi],
            defalt: flag,
            address2: obj.address_content,
            name: obj.name,
            phone: obj.phone,
            by_phone: obj.beiyong_phone
          })
        } else {
          that.setData({
            region: [obj.sheng, obj.shi, obj.qu],
            defalt: flag,
            address2: obj.address_content,
            name: obj.name,
            phone: obj.phone,
            by_phone: obj.beiyong_phone
          })
        }

      },
      fail: function () {
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
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  defaltAddress: function (e) {
    var flag = e.currentTarget.dataset.defalt;
    if (!flag) {
      this.setData({
        defalt: !flag,
        akey: 1
      })
    } else {
      this.setData({
        defalt: !flag,
        akey: 0
      })
    }
  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    // console.log(formData)
    var aid = that.data.aid
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    var akey = this.data.akey;
    if (formData.address_content == "") {
      wx.showToast({
        title: "详细地址不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    if (formData.address_sheng[0] == "省" && formData.address_sheng[1] == "市" && formData.address_sheng[2] == "区") {
      wx.showToast({
        title: "区域不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if (formData.beiyong_phone != "") {
      if (!regPhone.exec(formData.beiyong_phone)) {
        wx.showToast({
          title: "备用手机号码格式错误",
          icon: 'none',
          duration: 1000
        })
      }

    }
    if (!regPhone.exec(formData.address_phone)) {
      wx.showToast({
        title: "手机号码格式错误",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    if (formData.address_name == "") {
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    // if(that.)
    var obj = { id: aid, member_id: uid, type: 1, akey: akey, address_name: formData.address_name, address_phone: formData.address_phone, beiyong_phone: formData.beiyong_phone, address_sheng: formData.address_sheng, address_content: formData.address_content }
    console.log(obj)
    if (formData.address_name != "" && regPhone.exec(formData.address_phone) && formData.address_sheng != "" && formData.address_content != "" && (regPhone.exec(formData.beiyong_phone) || formData.beiyong_phone == "")) {
      wx.request({
        url: app.globalData.Murl+'/Applets/User/SaveAddress',
        data: obj,
        method: "post",

        success: function (res) {
          // console.log(res)
          // console.log(123)
          if (res.data.result == 0) {
            wx.showToast({
              title: "修改失败",
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          } else {
            wx.showToast({
              title: "修改成功",
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.hideToast();
              wx.redirectTo({
                url: '/pages/newaddress/newaddress?page='+that.data.page+'&goods_id='+that.data.goods_id+'&spec_key='+that.data.spec_key+'&num='+that.data.num,
              })
            }, 1000)

          }

        }, fail: function () {
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
        }
      })


    }

  }

})