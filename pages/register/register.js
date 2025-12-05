// pages/register/register.js
const storage = require('../../utils/storage.js')

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    role: 'diner'
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

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  onNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  onRoleChange(e) {
    this.setData({
      role: e.currentTarget.dataset.role
    })
  },

  onRegister() {
    const { username, password, confirmPassword, nickname, role } = this.data

    // Validate input
    if (!username || !password || !confirmPassword || !nickname) {
      wx.showToast({
        title: 'Please fill all fields',
        icon: 'none'
      })
      return
    }

    // Validate username length
    if (username.length < 3) {
      wx.showToast({
        title: 'Username must be at least 3 characters',
        icon: 'none'
      })
      return
    }

    // Validate password length
    if (password.length < 6) {
      wx.showToast({
        title: 'Password must be at least 6 characters',
        icon: 'none'
      })
      return
    }

    // Check password match
    if (password !== confirmPassword) {
      wx.showToast({
        title: 'Passwords do not match',
        icon: 'none'
      })
      return
    }

    // Check if username exists
    const existingUser = storage.getUserByUsername(username)
    if (existingUser) {
      wx.showToast({
        title: 'Username already exists',
        icon: 'none'
      })
      return
    }

    // Create new user
    const newUser = storage.addUser({
      username,
      password,
      nickname,
      role,
      avatar: role === 'chef' 
        ? 'https://via.placeholder.com/150/ff6b6b/ffffff?text=Chef'
        : 'https://via.placeholder.com/150/51cf66/ffffff?text=Eater'
    })

    wx.showToast({
      title: 'Registration successful!',
      icon: 'success'
    })

    // Auto login after registration
    setTimeout(() => {
      const app = getApp()
      app.login(newUser)
    }, 1500)
  },

  onGoToLogin() {
    wx.navigateBack()
  }
})