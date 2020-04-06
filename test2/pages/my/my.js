// pages/my/my.js
const app = getApp()
let isInitSelfShow = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: true,
    subscribe: true,
    comment: true,
    history: true,
    i: 0,
    j: 0,
    k: 0,
    l: 0,
    isShow: false,
    subShow: true,
    pageNo: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onCollection()
  },

  //获取登录信息
  getInfo: function(event) {
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/user/message',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === '0000') {
          that.setData({
            user: res.data.data
          })
        } else {
          wx.showToast({
            title: '用户信息获取失败',
            duration: 1000,
            image: '/images/icon/xxx.png'
          })
        }
      }
    })
  },

  //跳转去设置
  onSet: function(event) {
    wx.navigateTo({
      url: '../my-info/my-info'
    })
  },

  //收藏列表
  onCollection: function(event) {
    let that = this
    let i = this.data.i
    if (i < 1) {
      let collection = this.data.collection
      collection = !collection
      this.setData({
        pageNo: 1,
        collection: collection,
        subscribe: true,
        comment: true,
        history: true,
        subShow: true,
        i: ++i,
        j: 0,
        k: 0,
        l: 0
      })
      //向服务器请求收藏信息
      wx.request({
        url: app.globalData.host + '/xhblog/favorite/listbyuser',
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        data: {
          'pageNo': 1,
          'pageSize': 10
        },
        success(res) {
          console.log(res.data)
          if (res.data.code === '0000') {
            that.setData({
              contents: res.data.data.data
            })
          } else {
            wx.showToast({
              title: '收藏列表获取失败',
              duration: 1000,
              image: '/images/icon/xxx.png'
            })
          }
        }
      })
    } else {
      return
    }
  },

  //关注作者列表
  onSubscribe: function(event) {
    let that = this
    let j = this.data.j
    if (j < 1) {
      let subscribe = this.data.subscribe
      subscribe = !subscribe
      this.setData({
        pageNo: 1,
        collection: true,
        subscribe: subscribe,
        comment: true,
        history: true,
        subShow: false,
        i: 0,
        j: ++j,
        k: 0,
        l: 0
      })
      wx.request({
        url: app.globalData.host + '/xhblog/follow/listbyuser',
        data: {
          'pageNo': 1,
          'pageSize': 10
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success(res) {
          console.log(res.data)
          if (res.data.code === '0000') {
            that.setData({
              blogers: res.data.data.data
            })
          } else {
            wx.showToast({
              title: '请求失败',
              duration: 1000,
              image: '/images/icon/xxx.png'
            })
          }
        }
      })
    } else {
      return
    }
  },

  //评论列表
  onComment: function(event) {
    let k = this.data.k
    if (k < 1) {
      let comment = this.data.comment
      comment = !comment
      this.setData({
        pageNo: 1,
        collection: true,
        subscribe: true,
        comment: comment,
        history: true,
        subShow: true,
        i: 0,
        j: 0,
        k: ++k,
        l: 0
      })
    } else {
      return
    }
  },

  //浏览历史记录列表
  onHistory: function(event) {
    let that = this
    let l = this.data.l
    if (l < 1) {
      let history = this.data.history
      history = !history
      this.setData({
        pageNo: 1,
        collection: true,
        subscribe: true,
        comment: true,
        history: history,
        subShow: true,
        i: 0,
        j: 0,
        k: 0,
        l: ++l
      })
      wx.request({
        url: app.globalData.host + '/xhblog/browse/list',
        data: {
          'pageNo': 1,
          'pageSize': 10
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success(res) {
          console.log(res.data)
          if (res.data.code === '0000') {
            that.setData({
              contents: res.data.data.data
            })
          } else {
            wx.showToast({
              title: '请求失败',
              duration: 1000,
              image: '/images/icon/xxx.png'
            })
          }
        }
      })
    } else {
      return
    }
    // 发送请求
  },

  //实现页面跳转
  onBlogTap: function(event) {
    let blogId = event.currentTarget.dataset.blogid
    wx.navigateTo({
      url: "../blog-detail/blog-detail?id=" + blogId
    })
  },

  //实现收藏，取消收藏
  onCollectionTap: function(event) {
    let that = this
    let BlogId = event.currentTarget.dataset.blogid
    let tempId = 0
    for (let i = 0; i < this.data.contents.length; i++) {
      if (this.data.contents[i].id === BlogId) {
        tempId = i
      }
    }
    let isFavorite = this.data.contents[tempId].isFavorite
    if (isFavorite === null) {
      //向后台发送收藏数据
      wx.request({
        url: app.globalData.host + '/xhblog/favorite/save',
        method: "POST",
        data: {
          'blogId': BlogId
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success(res) {
          if (res.data.code === '0000') {
            let temp = 'contents[' + tempId + '].isFavorite'
            that.setData({
              [temp]: 1
            })
            wx.showToast({
              title: "收藏成功",
              duration: 1000,
              icon: "success"
            })
          } else {
            wx.showToast({
              title: '收藏失败',
              duration: 1000,
              icon: "none"
            })
          }
        }
      })
    } else {
      //取消收藏
      wx.request({
        url: app.globalData.host + '/xhblog/favorite/blog/' + BlogId,
        method: "DELETE",
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success(res) {
          if (res.data.code === '0000') {
            let temp = 'contents[' + tempId + '].isFavorite'
            that.setData({
              [temp]: null
            })
            wx.showToast({
              title: "取消收藏",
              duration: 1000,
              icon: "success"
            })
          } else {
            wx.showToast({
              title: '取消收藏失败',
              duration: 1000,
              icon: "none"
            })
          }
        }
      })
    }
  },

  //刷新收藏数据
  onRefreshHot: function(data) {
    if (data) {
      let id = data.blogId
      let value = data.isFavorite
      let tempId = 0
      for (let i = 0; i < this.data.contents.length; i++) {
        if (this.data.contents[i].id === id) {
          tempId = i
        }
      }
      let temp = 'contents[' + tempId + '].isFavorite'
      if (value === 1) {
        this.setData({
          [temp]: 1
        })
      } else {
        this.setData({
          [temp]: null
        })
      }
      // 清队上次通信数据
      wx.removeStorageSync('hotdata')
    } else {

    }
  },

  //刷新评论数据
  onRefreshCom: function(data) {
    if (data) {
      let id = parseInt(data.blogId)
      let value = data.length
      let tempId = 0
      for (let i = 0; i < this.data.contents.length; i++) {
        if (this.data.contents[i].id === id) {
          tempId = i
        }
      }
      let temp = 'contents[' + tempId + '].commentCount'
      this.setData({
        [temp]: value
      })
      // 清队上次通信数据
      wx.removeStorageSync('hotcomment')
    } else {

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getInfo()
    // 页面初始化也会触发onShow，这种情况可能不需要检查通信
    if (isInitSelfShow) return

    let hotdata = wx.getStorageSync('hotdata')
    let hotcomment = wx.getStorageSync('hotcomment')
    //刷新点赞信息
    this.onRefreshHot(hotdata)
    //刷新评论数据
    this.onRefreshCom(hotcomment)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    isInitSelfShow = false
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  collection: function() {
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/favorite/listbyuser',
      data: {
        pageSize: 10,
        pageNo: this.data.pageNo
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === '0000') {
          if (res.data.data.data.length > 0) {
            let arr1 = that.data.contents
            let arr2 = res.data.data.data
            arr1 = arr1.concat(arr2)
            that.setData({
              contents: arr1
            })
          } else {
            wx.showToast({
              title: '没有更多内容了',
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

  subscribe: function() {
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/follow/listbyuser',
      data: {
        pageSize: 10,
        pageNo: this.data.pageNo
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === '0000') {
          if (res.data.data.data.length > 0) {
            let arr1 = that.data.contents
            let arr2 = res.data.data.data
            arr1 = arr1.concat(arr2)
            that.setData({
              contents: arr1
            })
          } else {
            wx.showToast({
              title: '没有更多内容了',
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

  comment: function() {
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/follow/listbyuser',
      data: {
        pageSize: 10,
        pageNo: this.data.pageNo
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res.data.data)
        if (res.data.code === '0000') {
          if (res.data.data.data.length > 0) {
            let arr1 = that.data.contents
            let arr2 = res.data.data.data
            arr1 = arr1.concat(arr2)
            that.setData({
              contents: arr1
            })
          } else {
            wx.showToast({
              title: '没有更多内容了',
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

  history: function() {
    let pageNo = this.data.pageNo + 1
    this.setData({
      pageNo: pageNo
    })
    let that = this
    wx.request({
      url: app.globalData.host + '/xhblog/browse/list',
      data: {
        pageSize: 10,
        pageNo: this.data.pageNo
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === '0000') {
          if (res.data.data.data.length > 0) {
            let arr1 = that.data.contents
            let arr2 = res.data.data.data
            arr1 = arr1.concat(arr2)
            that.setData({
              contents: arr1
            })
          } else {
            wx.showToast({
              title: '没有更多内容了',
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

  onReachBottom: function() {
    let collection = this.data.collection
    let subscribe = this.data.subscribe
    let comment = this.data.comment
    let history = this.data.history
    let arr = [collection, subscribe, comment, history]
    let i = 0
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === false) {
        i = j
      }
    }
    if (i == 0) {
      //请求收藏列表接口
      this.collection()
    }
    if (i == 1) {
      //请求博主列表接口
      this.subscribe()
    }
    if (i == 2) {
      //请求评论列表接口
      this.comment()
    }
    if (i == 3) {
      //请求历史记录列表接口
      this.history()
    }
  }
})