// components/addAddSub/addAndSub.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type: 'String',
      value: ''
    },
    index:{
      type: "Number",
      value: ""
    },
    carts:{
      type: 'string',
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    minusCount:function(e){
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
      this.triggerEvent('changeCarts', carts)
      let jinsurl = app.globalData.Murl + "/Applets/Cart/ajaxCartCount";
      wx.request({
        url: jinsurl,
        data: {
          member_id: uid,
          cart_id: id,
          goods_num: num,
        },
        method: "POST",
        success: function (res) {
          // console.log(res.data);
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
    addCount: function (e) {
      var userinfo = wx.getStorageSync("userinfo"); //获取用户信息
      var uid = userinfo.uid; //获取用户id
      const index = e.currentTarget.dataset.index; //获取商品index
      const id = e.currentTarget.dataset.id; //获取商品id
      const goods_id = e.currentTarget.dataset.ids; //获取商品goods_id
      let carts = this.data.carts; //获取购物车信息
      var kc = e.currentTarget.dataset.key; //获取该商品库存
      let num = carts[index].goods_num; //获取商品选中
      num = Number(num) + 1; //商品数量每次加一
      //console.log(goods_id);
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
      //console.log(carts)
      this.triggerEvent('changeCarts', carts)
      // this.getTotalPrice();
      let addurl = app.globalData.Murl + "/Applets/Cart/ajaxCartCount";
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
    }
  },
})
