// pages/login/login.js
const storage = require('../../utils/storage.js')

Page({
  data: {},

  onLoad() {
    // Initialize storage data
    storage.initData()
  },

  onWeChatLogin() {
    console.log('=== Login button clicked ===')
    
    // Show loading
    wx.showLoading({
      title: 'Logging in...',
      mask: true
    })

    // Get WeChat login code
    wx.login({
      success: (loginRes) => {
        const code = loginRes.code
        console.log('WeChat login code:', code)
        
        // In production: Send code to backend to get real openid
        // For development: Use code as simulated openid
        const simulatedOpenId = `wx_${code.substring(0, 8)}`
        console.log('Simulated OpenID:', simulatedOpenId)
        
        // For development, generate mock user info
        const timestamp = Date.now()
        const mockUserInfo = {
          nickName: `User${timestamp.toString().substring(8)}`,
          avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
        }
        console.log('Mock user info:', mockUserInfo)
        
        wx.hideLoading()
        
        // Check if user exists by openid
        const existingUser = storage.getUserByWechatId(simulatedOpenId)
        console.log('Existing user:', existingUser)
        
        if (existingUser) {
          // User exists, login with default role (diner)
          console.log('Logging in existing user as diner')
          
          // Save user data IMMEDIATELY before navigation
          wx.setStorageSync('userInfo', existingUser)
          wx.setStorageSync('activeRole', 'diner')
          console.log('User data saved to storage')

          // Update global data
          const app = getApp()
          app.globalData.userInfo = existingUser
          app.globalData.activeRole = 'diner'
          console.log('Global data updated')
          
          wx.showToast({
            title: 'Welcome back!',
            icon: 'success',
            duration: 1500
          })
          
          setTimeout(() => {
            console.log('Navigating to diner home')
            app.navigateToRoleHome('diner')
          }, 1500)
        } else {
          // New user, create account with both roles
          console.log('Creating new user...')
          this.createNewUser(mockUserInfo, simulatedOpenId)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('wx.login failed:', err)
        wx.showToast({
          title: 'Login failed, please try again',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  createNewUser(userInfo, openid) {
    console.log('=== Creating new user ===')
    console.log('User info:', userInfo)
    console.log('OpenID:', openid)
    
    wx.showModal({
      title: 'Welcome! 🎉',
      content: 'Choose your starting role. You can switch anytime!',
      confirmText: 'Chef',
      cancelText: 'Diner',
      success: (res) => {
        console.log('Modal response:', res)
        const initialRole = res.confirm ? 'chef' : 'diner'
        console.log('Selected role:', initialRole)
        
        // Create new user with WeChat info
        // User has BOTH roles, but starts with one active
        const newUser = storage.addUser({
          openid: openid,
          username: userInfo.nickName,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          wechatAuth: true,
          hasChefRole: true,  // Everyone has both roles
          hasDinerRole: true
        })
        console.log('New user created:', newUser)

        // Save user data IMMEDIATELY before navigation
        wx.setStorageSync('userInfo', newUser)
        wx.setStorageSync('activeRole', initialRole)
        console.log('User data saved to storage')

        // Update global data
        const app = getApp()
        app.globalData.userInfo = newUser
        app.globalData.activeRole = initialRole
        console.log('Global data updated')

        wx.showToast({
          title: `Welcome as ${initialRole === 'chef' ? 'Chef' : 'Diner'}!`,
          icon: 'success',
          duration: 1500
        })

        setTimeout(() => {
          console.log('Navigating to role home:', initialRole)
          app.navigateToRoleHome(initialRole)
        }, 1500)
      },
      fail: (err) => {
        console.error('Modal failed:', err)
      }
    })
  }
})