// pages/wantsBuy/wantsBuy.js
var util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    dataTitle: {
      type: Object,
      value: {
        name: '',
        showTip: ''
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // this.getwantsBuy();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    created() {
      this.getwantsBuy();
    }
  },
  methods: {
    getwantsBuy: function() {
      var that = this;
      var data = {
        one_cat_id: 1
      };
      var res = util.request('/Applets/Index/classify_content', data, "", "");
      res.then(function(data) {
        console.log(data)
        var arr = [];
        if (data.goods) {
          for (var i = 0; i < 6; i++) {
            if (data.goods[i].goods_name.length > 17) {
              data.goods[i].goods_name = data.goods[i].goods_name.substring(0, 16) + '...'
            }
            arr.push(data.goods[i])
          }
          that.setData({
            goods: arr
          })
        }
      })
    }
  }
})