const app = getApp();
Page({
  data: {
    iskong: false,
    address: []
  },
  tiatheror(e) {
    var id = e.currentTarget.dataset.id;
    var city = e.currentTarget.dataset.city;
    var sheng = e.currentTarget.dataset.sheng;
    var qu = e.currentTarget.dataset.qu;
    var address_content = e.currentTarget.dataset.address_content;
    var add = sheng + city + qu + address_content;
    wx.setStorageSync("locationid", id);
    wx.setStorageSync("locationcity", city)
    wx.setStorageSync("locationadd", add)
    // let pages = getCurrentPages();//当前页面
    // let prevPage = pages[pages.length-2];//上一页面
    // prevPage.setData({//直接给上移页面赋值
    //    items: e.currentTarget.dataset.id,
    // });
    // console.log(prevPage.data.item);
    wx.navigateBack({ //返回
      delta: 1
    })
    /* wx.redirectTo({
              url: '../theorder/theorder?id='+id+'&page='+this.data.page+'&goods_id='+this.data.goods_id+'&spec_key='+this.data.spec_key+'&num='+this.data.num,
            success: function(res) {console.log(res)},
            fail: function(res) {console.log(res)},
            complete: function(res) {console.log(res)},
          })*/
  },
  onLoad: function(options) {

    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    console.log(options.goods_id);
    var that = this;
    that.setData({
      page: options.page,
      goods_id: options.goods_id,
      spec_key: options.spec_key,
      num: options.num,
    })
    wx.request({
      url: app.globalData.Murl + "/Applets/User/m_address2",
      data: {
        member_id: uid
      },
      method: "post",
      success: function(res) {
        console.log(213123);
        that.setData({
          iskong: res.data.status,
          address: res.data.select
        })

      },
      fail: function(res) {
        console.log(res)
      },
      complete: function() {

      }
    })
  },
  edit: function(event) {
    var id = event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;

    wx.redirectTo({
      url: '/pages/newchangeaddress/newchangeaddress?aid=' + aid + '&page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
    })

  },
  delete: function(event) {
    var id = event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    var that = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除地址信息？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl + "/Applets/User/DelAddress",
            data: {
              address_id: aid
            },
            method: "post",
            success: function(res) {
              console.log(res.data);
              if (res.data.status) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1000
                })
                wx.request({
                  url: app.globalData.Murl + "/Applets/User/m_address2",
                  data: {
                    member_id: uid
                  },
                  method: "post",
                  success: function(res) {
                    console.log(res.data);
                    that.setData({
                      iskong: res.data.status,
                      address: res.data.select
                    })

                  },
                  fail: function(res) {
                    //console.log(res)
                  },
                  complete: function() {

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
        } else if (res.cancel) {

        }
      }
    })

  },
  defaltAddress: function(event) {
    var flag = event.currentTarget.dataset.defalt;
    var id = event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    console.log(aid);
    console.log(id);
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/SaveKey',
      data: {
        member_id: id,
        id: aid
      },
      method: "post",
      success: function(res) {
        console.log(res.data);
        if (res.data.result == 1) {
          // wx.redirectTo({
          //   url: 'm-address'
          // })
          wx.request({
            url: app.globalData.Murl + "/Applets/User/m_address2",
            data: {
              member_id: uid
            },
            method: "post",
            success: function(res) {
              console.log(res.data);
              that.setData({
                iskong: res.data.status,
                address: res.data.select
              })

            },
            fail: function(res) {
              //console.log(res)
            },
            complete: function() {

            }
          })
        } else if (res.data.result == 0) {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.hideToast();
          }, 1000)
        } else if (res.data.result == 2) {
          wx.showToast({
            title: '当前地址是默认地址',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function() {
            wx.hideToast();
          }, 1000)
        }
      },
      fail: function() {
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
  addaddress() {
    wx.redirectTo({
      url: '../newaddaddress/newaddaddress?page=' + this.data.page + '&goods_id=' + this.data.goods_id + '&spec_key=' + this.data.spec_key + '&num=' + this.data.num,
    })
  }
})