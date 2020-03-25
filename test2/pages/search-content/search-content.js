// pages/search-content/search-content.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let formData = options.formdata
    this.searchList(formData)
    this.setData({
      searchInput: formData
    })
  },

  //根据关键字查找
  searchList: function(formData) {
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/blog/search',
      data: {
        key: formData,
        pageSize: 20
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code === '0000') {
          if (res.data.data.data.length > 0) {
            that.setData({
              contents: res.data.data.data
            })
          } else {
            that.setData({
              contents: ''
            })
            wx.showToast({
              title: '无相关内容',
              duration: 1000,
              icon: "none"
            })
          }
        } else {
          wx.showToast({
            title: '请求失败',
            duration: 1000,
            image: '/images/icon/xxx.png'
          })
        }
      }
    })
  },

  //根据关键字查询
  search: function(event) {
    let formData = event.detail.value.trim()
    if (formData) {
      this.searchList(formData)
    } else {
      wx.showToast({
        title: "输入不能为空",
        duration: 1000,
        icon: "none"
      })
    }
  },

  //实现收藏，取消收藏
  onCollectionTap: function(event) {
    let BlogId = event.currentTarget.dataset.blogid
    let temp = 'contents[' + BlogId + '].collected'
    let collected = this.data.contents[BlogId].collected
    collected = !collected
    //向后台发送收藏数据未做

    this.setData({
      [temp]: collected
    })
    wx.showToast({
      title: collected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    })
  },

  //实现页面跳转
  onBlogTap: function(event) {
    let blogId = event.currentTarget.dataset.blogid
    wx.navigateTo({
      url: "../blog-detail/blog-detail?id=" + blogId
    })
  },


  //控制关闭icon显示隐藏
  controlClose: function(event) {
    let searchKey = event.detail.value
    if (searchKey) {
      this.setData({
        isShow: true
      })
    } else {
      this.setData({
        isShow: false
      })
    }
  },

  //点击关闭按钮返回搜索页面
  back: function(event) {
    wx.navigateBack({
      url: "../search/search"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})