// pages/chef/orders/orders.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    currentTab: 'pending',
    orderList: [],
    pendingCount: 0,
    completedCount: 0
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

    if (!userInfo || userInfo.role !== 'chef') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    const allOrders = storage.getOrdersByChefId(userInfo.id)
    
    // Sort by creation time (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const pendingOrders = allOrders.filter(o => o.status === 'pending')
    const completedOrders = allOrders.filter(o => o.status === 'completed')

    // Format dates
    const formatOrders = (orders) => {
      return orders.map(order => ({
        ...order,
        createdAt: this.formatDate(order.createdAt)
      }))
    }

    this.setData({
      pendingCount: pendingOrders.length,
      completedCount: completedOrders.length
    })

    this.filterOrders()
  },

  filterOrders() {
    const app = getApp()
    const userInfo = app.globalData.userInfo
    const allOrders = storage.getOrdersByChefId(userInfo.id)
    
    const filtered = allOrders
      .filter(o => o.status === this.data.currentTab)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(order => ({
        ...order,
        createdAt: this.formatDate(order.createdAt)
      }))

    this.setData({
      orderList: filtered
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

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    })
    this.filterOrders()
  },

  onConfirmOrder(e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: 'Confirm Order',
      content: 'Confirm this order as completed?',
      success: (res) => {
        if (res.confirm) {
          storage.updateOrder(orderId, { status: 'completed' })
          wx.showToast({
            title: 'Order confirmed',
            icon: 'success'
          })
          this.loadOrders()
        }
      }
    })
  },

  onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id
    
    wx.showModal({
      title: 'Cancel Order',
      content: 'Are you sure you want to cancel this order?',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          storage.updateOrder(orderId, { status: 'cancelled' })
          wx.showToast({
            title: 'Order cancelled',
            icon: 'success'
          })
          this.loadOrders()
        }
      }
    })
  }
})