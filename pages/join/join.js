// pages/join/join.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:'',
    isShop:1,
    isImg:true,
    alertp:'您的信息已经提交成功，我们会尽快与您联系，请注意接听来电！',
    isshow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  isshop:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    if (id == 0) {
      this.setData({
        isShop: 0,
        isImg: false
      })
    } else {
      this.setData({
        isShop:1,
        isImg:true
      })
    }
  },
  close:function(){
    this.setData({
      isshow:false
    })
  },
  bindsubmit:function(e){
    console.log(e);

    let name = e.detail.value.name;
    let tel_val = e.detail.value.tel_input;
    let add_val = e.detail.value.textarea;
    let choose = this.data.isShop;
    let that = this;
    if (tel_val == '') {
      this.setData({
        alertp: '手机号码不能为空',
        isshow: true
      })
    } else if (!(/^1[3456789]\d{9}$/.test(tel_val)) && !/^(\d{3,4}\-)?\d{7,8}$/.test(tel_val) && !/^400[0-9]{7}$/
      .test(tel_val)) {
      this.setData({
        alertp: '手机号码格式有误',
        isshow: true
      })
    } else {
      let param = {
        name: name, phone: tel_val, address: add_val, choose: choose
      }
      wx.request({
        url: app.globalData.Murl +'/Applets/Bapi/joins',
        data:param,
        method:'POST',
        success:function(res){
          if (res.data.status == 1) {
            //console.log(111)
            that.setData({
              alertp: '您的信息已经提交成功，我们会尽快与您联系，请注意接听来电！',
              isshow:true,
              val:'',
              isShop: 1,
              isImg: true
            })
          }
        }
      })
      // let res = this.$api.post(api.BASEURL + 'Applets/Bapi/joins', param);
      // res.then(function (r) {
      //   //	console.log(r)
      //   that.isShop = 1;
      //   that.isImg = true;
      //   that.tel_input = 1;
      //   that.textarea = '';
      //   that.tel_input = '';
      //   that.name = '';
      //   // Toast(r.message);
      //   if (r.status == 1) {
      //     //console.log(111)
      //     that.alertp = '您的信息已经提交成功，我们会尽快与您联系，请注意接听来电！';
      //     that.isshow = true;
      //   }
      // }).catch(function (err) {
      //   console.log(err)
      // })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})