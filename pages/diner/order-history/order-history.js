// pages/diner/order-history/order-history.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    orders: []
  },

  onLoad() {
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo || userInfo.role !== 'diner') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    const orders = storage.getOrdersByUserId(userInfo.id)
    
    // Sort by creation time (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Format dates
    const formattedOrders = orders.map(order => ({
      ...order,
      createdAt: this.formatDate(order.createdAt),
      chefName: order.items.length > 0 ? order.items[0].chefName : 'Unknown'
    }))

    this.setData({
      orders: formattedOrders
    })
  },

  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  },

  onBrowseMenu() {
    wx.switchTab({
      url: '/pages/diner/menu/menu'
    })
  }
})