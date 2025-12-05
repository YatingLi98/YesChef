// app.js
App({
  onLaunch() {
    // Initialize cloud development environment (if using cloud development)
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // WeChat Login
    wx.login({
      success: res => {
        console.log('WeChat login successful', res.code)
        this.globalData.wxCode = res.code
      }
    })

    // Check login status
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.userRole = userInfo.role // 'chef' or 'diner'
      console.log('User logged in:', userInfo)
    } else {
      // Redirect to login page
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },

  // Login
  login(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.userRole = userInfo.role
    wx.setStorageSync('userInfo', userInfo)
    
    // Navigate based on role
    if (userInfo.role === 'chef') {
      wx.switchTab({
        url: '/pages/chef/menu-manager/menu-manager'
      })
    } else {
      wx.switchTab({
        url: '/pages/diner/menu/menu'
      })
    }
  },

  // Logout
  logout() {
    this.globalData.userInfo = null
    this.globalData.userRole = null
    wx.removeStorageSync('userInfo')
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },

  globalData: {
    userInfo: null,
    userRole: null, // 'chef' or 'diner'
    apiUrl: 'https://your-api-domain.com/api',
    wxCode: null,
    // Data storage keys
    storageKeys: {
      foods: 'foods_list',
      orders: 'orders_list',
      users: 'users_list'
    }
  }
})