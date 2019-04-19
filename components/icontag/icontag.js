// pages/icontag/icontag.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconUrl:{
      type:String,
      default:''
    },
    iconTitle:{
      type:String,
      default:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 1 有机 2无公害 3绿色 4转换期 5产地直供
    urlsArr:[
      '/image/new/icon_organic.png',
      '/image/new/icon_harmless.png',
      '/image/new/icon_greenpro.png',
      '/image/new/icon_conversion.png',
      '/image/new/icon_supply.png',
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
