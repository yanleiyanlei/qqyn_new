const app = getApp();
var user = require("../../lib/js/user.js")

Page({
  data: {
    aaaa:false
  },
  pagesm2() {
    wx.redirectTo({
      url: '../m-step2/m-step2',
    })
  },
  tiaocar: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  goshop(){
    wx.switchTab({
      url: '../index/index'
    });
  },
  onLoad: function (options) {
    var rice_rand = options.rice_rand;
    // var code_info = JSON.parse(options.code_info);
    // console.log(code_info)
    var code_info_price = options.code_info_price
    var code_info_num = options.code_info_num
    var code_info_man = options.code_info_man
    var team_id = options.team_id
    console.log(options)
    this.setData({
      rice_rand: rice_rand,
      code_info_price: code_info_price,
      code_info_num: code_info_num,
      code_info_man: code_info_man,

    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/create_detail',
      data: { team_id: team_id, member_id: wx.getStorageSync("userinfo").uid },
      method: 'post',
      success: function (res) {
        console.log(res)
        var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
        console.log(kk)
        var klist = [];
        if (kk != 0) {
          for (var i = 0; i < kk; i++) {
            klist.push(1)
          }
        }
        that.setData({
          actInfo: res.data.info,
          people_step: res.data.people_step,
          teamMember: res.data.info.member_info,
          ac_id: res.data.info.step_id,
          klist: klist,
          rice_rand: res.data.info.rice_rand,
          code_info: res.data.info.code_info,
          price:res.data.info.code_info[0].price
        })
        console.log(res.data.info.code_info[0].price)
        
      }
    })
  }
})