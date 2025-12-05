// pages/diner/dashboard/dashboard.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    stats: {
      totalOrders: 0,
      completedOrders: 0,
      topFoods: []
    }
  },

  onLoad() {
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  loadStats() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo || userInfo.role !== 'diner') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    const stats = storage.getUserStats(userInfo.id)
    
    this.setData({
      stats: stats
    })
  }
})