// pages/login/login.js
const storage = require('../../utils/storage.js')

Page({
  data: {
    username: '',
    password: '',
    role: 'diner' // default role
  },

  onLoad() {
    // Initialize storage data
    storage.initData()
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  onRoleChange(e) {
    this.setData({
      role: e.currentTarget.dataset.role
    })
  },

  onLogin() {
    const { username, password, role } = this.data

    // Validate input
    if (!username || !password) {
      wx.showToast({
        title: 'Please enter username and password',
        icon: 'none'
      })
      return
    }

    // Find user
    const user = storage.getUserByUsername(username)

    if (!user) {
      wx.showToast({
        title: 'User not found',
        icon: 'none'
      })
      return
    }

    // Verify password
    if (user.password !== password) {
      wx.showToast({
        title: 'Incorrect password',
        icon: 'none'
      })
      return
    }

    // Verify role
    if (user.role !== role) {
      wx.showToast({
        title: `This account is not a ${role}`,
        icon: 'none'
      })
      return
    }

    // Login success
    wx.showToast({
      title: 'Login successful',
      icon: 'success'
    })

    // Save login state
    const app = getApp()
    app.login(user)
  },

  onWeChatLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: 'Authorization cancelled',
        icon: 'none'
      })
      return
    }

    const wechatUserInfo = e.detail.userInfo
    
    // Check if user exists in local storage
    const existingUser = storage.getUserByUsername(wechatUserInfo.nickName)
    
    if (existingUser) {
      // User exists, login directly
      wx.showToast({
        title: 'Login successful',
        icon: 'success'
      })
      
      const app = getApp()
      app.login(existingUser)
    } else {
      // New user, need to select role
      wx.showModal({
        title: 'Welcome!',
        content: 'Are you a Chef or a Diner?',
        confirmText: 'Chef',
        cancelText: 'Diner',
        success: (res) => {
          const role = res.confirm ? 'chef' : 'diner'
          
          // Create new user with WeChat info
          const newUser = storage.addUser({
            username: wechatUserInfo.nickName,
            password: Date.now().toString(), // Generate random password
            nickname: wechatUserInfo.nickName,
            role: role,
            avatar: wechatUserInfo.avatarUrl,
            wechatAuth: true
          })

          wx.showToast({
            title: 'Account created!',
            icon: 'success'
          })

          const app = getApp()
          app.login(newUser)
        }
      })
    }
  },

  onGoToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})