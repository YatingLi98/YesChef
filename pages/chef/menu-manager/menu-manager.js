// pages/chef/menu-manager/menu-manager.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    userInfo: null,
    foodList: [],
    orderCount: 0
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // Reload data when page shows (e.g., after adding/editing food)
    this.loadData()
  },

  loadData() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo || userInfo.role !== 'chef') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    // Get all foods created by this chef
    const allFoods = storage.getFoods()
    const myFoods = allFoods.filter(food => food.chefId === userInfo.id)

    // Get orders for this chef
    const orders = storage.getOrdersByChefId(userInfo.id)

    this.setData({
      userInfo,
      foodList: myFoods,
      orderCount: orders.length
    })
  },

  onAddFood() {
    wx.navigateTo({
      url: '/pages/chef/food-editor/food-editor'
    })
  },

  onEditFood(e) {
    const foodId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/chef/food-editor/food-editor?id=${foodId}`
    })
  },

  onDeleteFood(e) {
    const foodId = e.currentTarget.dataset.id
    const food = storage.getFoodById(foodId)

    wx.showModal({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${food.name}"?`,
      success: (res) => {
        if (res.confirm) {
          storage.deleteFood(foodId)
          wx.showToast({
            title: 'Deleted successfully',
            icon: 'success'
          })
          this.loadData()
        }
      }
    })
  },

  onViewOrders() {
    wx.navigateTo({
      url: '/pages/chef/orders/orders'
    })
  },

  onShareMenu() {
    const app = getApp()
    const userInfo = app.globalData.userInfo
    
    wx.showModal({
      title: 'Share Menu',
      content: `Share your menu ID with diners: ${userInfo.id}\n\nDiners can use this ID to view and order from your menu.`,
      showCancel: false,
      confirmText: 'Copy ID',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: userInfo.id,
            success: () => {
              wx.showToast({
                title: 'ID copied!',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  onLogout() {
    wx.showModal({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.logout()
        }
      }
    })
  }
})