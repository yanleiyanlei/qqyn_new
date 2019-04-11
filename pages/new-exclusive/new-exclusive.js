const app = getApp();
Page({
  data: {
    flag: true,
  },
  showMask: function() {
    this.setData({
      flag: false
    })
  },
  closeMask: function() {
    this.setData({
      flag: true,
    })
  },
  onLoad: function() {
  },
  getQuan: function() {
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid)
    var member_id = uid;
    wx.request({
      url: 'https://m.test.7710mall.com/index.php/Applets/Lq/qudao',
      data: {
        member_id
      },
      method: "post",
      success: function(res) {
        console.log(res.data.status)
        // console.log(123)
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/m-coupon/m-coupon',
                })
              }, 1500);

            }
          })

        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1500);

            }
          })

        }
      },
      fail: function() {}
    })

  },
  // gowx: function() {
  //   wx.switchTab({
  //     url: '/pages/bution/bution',
  //   })
  // }
});