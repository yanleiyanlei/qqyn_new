const app = getApp();
Page( {  
  data: {  
    tabArr: {  
      curHdIndex: 0,  
      curBdIndex: 0  
    },
    indicatorDots: true,
    autoplay: false,//banner图时候自动播放
    interval: 5000,//轮换的 速度
    duration: 1000,
    reviewsnum:[],//评论总数
    datares:[],
    goodsReviewimg:[],//获取到的  图片的 路径 
    datalis:[],//评论列表数据
     modelHidden:true,//图片放大默认隐藏
    pcSrc:"http://www.77farmers.com/",//pc上的评论图pain路径
    wechatSrc:"http://m.77farmers.com/Public/Uploads/",//手机上的评论图pain路径
    dImg:"http://ss.bjzzdk.com/Public/Uploads/",//微信上的评论地址
    src:"http://www.77farmers.com/Public/Home/images/morentouxiang.png",//默认的 头像
    Ydatalis:[],//有图
    goodscommes:[],//好评
    chascommes:[],//差评
    centscommes:[],//中评
  },  
  tabFun: function(e){  
    //获取触发事件组件的dataset属性  
    var _datasetId=e.target.dataset.id;  
    var _obj={};  
    _obj.curHdIndex=_datasetId;  
    _obj.curBdIndex=_datasetId;  
    this.setData({  
      tabArr: _obj  
    });  
  },  
  /*图片放大*/
  modalinput:function(e){ 
    var src = e.currentTarget.dataset.src;//获取data-src
        this.setData({  
           modelHidden: !this.data.modelHidden,
           goodsReviewimg:src
        })  
    },
    /*隐藏图片*/
   modalinputs:function(){  
        this.setData({  
           modelHidden: !this.data.modelHidden 
        })  
    },
  onLoad: function(options) { 
        const that=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/goodsreviews",
           data:{
              goods_id:options.goods_id,
              seller_id:'1'
          },
          method: "POST",
          success: function(res) {
            //console.log(res.data);
            const  datalist = res.data;
            that.setData({
              reviewsnum:datalist.reviewsnum,
              datares:datalist,
            })
          }
      }) 
       function toDate(number){  
            const dateTime = new Date(number * 1000);  
            const year = dateTime.getFullYear();  
            const month = dateTime.getMonth() + 1;  
            const day = dateTime.getDate();  
            const hour = dateTime.getHours();  
            const minute = dateTime.getMinutes();  
            const second = dateTime.getSeconds();  
            const now = new Date();  
            const now_new = Date.parse(now.toDateString());  //typescript转换写法  
            const milliseconds = now_new - dateTime;  
            const timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;  
            return timeSpanStr;  
        }
        /*全部 评论*/
        const _that=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/reviewlist",
           data:{
              goods_id:options.goods_id,
              seller_id:'1',
              reviewlevel:'0'
          },
          method: "POST",
          success: function(res) {
            /*将评论的 时间 循环添加到数据中*/
            const  datalist = res.data;
            const  datas=datalist.goodsreviews;
             for(var i=0;i<datas.length;i++){  
      
                       datas[i].timesto =toDate(datas[i].reviews_addtime)  
             } 
            //console.log(res.data);
            _that.setData({
              datalis:datalist.goodsreviews,
            })
          }
      }) 
          /*有图 评论*/
        const _thats=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/reviewlist",
           data:{
              goods_id:options.goods_id,
              seller_id:'1',
              reviewlevel:'img'
          },
          method: "POST",
          success: function(res) {
            /*将评论的 时间 循环添加到数据中*/
            const  datalist = res.data;
            const  datas=datalist.goodsreviews;
             for(var i=0;i<datas.length;i++){  
      
                       datas[i].timesto =toDate(datas[i].reviews_addtime)  
             } 
           // console.log(res.data);
            _thats.setData({
              Ydatalis:datalist.goodsreviews,
            })
          }
      }) 
       /*好的评论*/
        const _this=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/reviewlist",
           data:{
              goods_id:options.goods_id,
              seller_id:'1',
              reviewlevel:'3'
          },
          method: "POST",
          success: function(res) {
            /*将评论的 时间 循环添加到数据中*/
            const  datalist = res.data;
            const  datas=datalist.goodsreviews;
             for(var i=0;i<datas.length;i++){  
      
                       datas[i].timesto =toDate(datas[i].reviews_addtime)  
             } 
            //console.log(res.data);
            _this.setData({
              goodscommes:datalist.goodsreviews,
            })
          }
      }) 
    /*zhong评论*/
        const _cent=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/reviewlist",
           data:{
              goods_id:options.goods_id,
              seller_id:'1',
              reviewlevel:'2'
          },
          method: "POST",
          success: function(res) {
            /*将评论的 时间 循环添加到数据中*/
            const  datalist = res.data;
            const  datas=datalist.goodsreviews;
             for(var i=0;i<datas.length;i++){  
      
                       datas[i].timesto =toDate(datas[i].reviews_addtime)  
             } 
           // console.log(res.data);
            _cent.setData({
              centscommes:datalist.goodsreviews,
            })
          }
      }) 

    /*差评论*/
        const ca=this;
          wx.request({
           url:app.globalData.Murl+"/Applets/Goods/reviewlist",
           data:{
              goods_id:options.goods_id,
              seller_id:'1',
              reviewlevel:'1'
          },
          method: "POST",
          success: function(res) {
            /*将评论的 时间 循环添加到数据中*/
            const  datalist = res.data;
            const  datas=datalist.goodsreviews;
             for(var i=0;i<datas.length;i++){  
      
                       datas[i].timesto =toDate(datas[i].reviews_addtime)  
             } 
            //console.log(res.data);
            ca.setData({
              chascommes:datalist.goodsreviews,
            })
          }
      }) 
  } 
});  