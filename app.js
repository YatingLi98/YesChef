// app.js
App({
  onLaunch() {
    console.log('=== App onLaunch ===')
    
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

    // Check login status and navigate accordingly
    this.checkAndNavigate()
  },

  onShow() {
    console.log('=== App onShow ===')
  },

  checkAndNavigate() {
    const userInfo = wx.getStorageSync('userInfo')
    const activeRole = wx.getStorageSync('activeRole')
    
    console.log('Checking login status...')
    console.log('User info:', userInfo)
    console.log('Active role:', activeRole)
    
    if (userInfo && activeRole) {
      // User is logged in
      this.globalData.userInfo = userInfo
      this.globalData.activeRole = activeRole
      console.log('User logged in, navigating to:', activeRole, 'home')
      
      // Navigate to appropriate home page
      setTimeout(() => {
        this.navigateToRoleHome(activeRole)
      }, 100)
    } else {
      // No user data, stay on current page (will be diner menu which will show login prompt)
      console.log('No user data, waiting for login')
    }
  },

  // Login (WeChat only)
  login(userInfo, initialRole = 'diner') {
    console.log('=== app.login() called ===')
    console.log('User info:', userInfo)
    console.log('Initial role:', initialRole)
    
    this.globalData.userInfo = userInfo
    this.globalData.activeRole = initialRole
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('activeRole', initialRole)
    
    console.log('Stored in global data and storage')
    console.log('Calling navigateToRoleHome...')
    
    // Navigate based on active role
    this.navigateToRoleHome(initialRole)
  },

  // Switch role
  switchRole(newRole) {
    if (newRole !== 'chef' && newRole !== 'diner') {
      console.error('Invalid role:', newRole)
      return
    }
    
    this.globalData.activeRole = newRole
    wx.setStorageSync('activeRole', newRole)
    
    // Navigate to new role's home
    this.navigateToRoleHome(newRole)
    
    wx.showToast({
      title: `Switched to ${newRole === 'chef' ? 'Chef' : 'Diner'} mode`,
      icon: 'success'
    })
  },

  // Navigate to role home
  navigateToRoleHome(role) {
    console.log('=== navigateToRoleHome() called ===')
    console.log('Role:', role)
    
    if (role === 'chef') {
      // Chef page is not in tabBar, use redirectTo to avoid reLaunch loop
      console.log('Navigating to Chef page with redirectTo...')
      wx.redirectTo({
        url: '/pages/chef/menu-manager/menu-manager',
        success: () => {
          console.log('Navigation to Chef page successful')
        },
        fail: (err) => {
          console.error('Navigation to Chef page failed:', err)
        }
      })
    } else {
      // Diner page is in tabBar, use switchTab
      console.log('Navigating to Diner page with switchTab...')
      wx.switchTab({
        url: '/pages/diner/menu/menu',
        success: () => {
          console.log('Navigation to Diner page successful')
        },
        fail: (err) => {
          console.error('Navigation to Diner page failed:', err)
        }
      })
    }
  },

  // Get current active role
  getActiveRole() {
    return this.globalData.activeRole || wx.getStorageSync('activeRole') || 'diner'
  },

  // Logout
  logout() {
    this.globalData.userInfo = null
    this.globalData.activeRole = null
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('activeRole')
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },

  globalData: {
    userInfo: null,
    activeRole: null, // 'chef' or 'diner' - current active role
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