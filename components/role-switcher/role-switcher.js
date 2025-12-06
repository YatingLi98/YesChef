// components/role-switcher/role-switcher.js
Component({
  properties: {},

  data: {
    activeRole: 'diner'
  },

  lifetimes: {
    attached() {
      this.updateRole()
    }
  },

  pageLifetimes: {
    show() {
      this.updateRole()
    }
  },

  methods: {
    updateRole() {
      const app = getApp()
      const activeRole = app.getActiveRole()
      this.setData({ activeRole })
    },

    onSwitchRole() {
      const { activeRole } = this.data
      const newRole = activeRole === 'chef' ? 'diner' : 'chef'
      
      wx.showModal({
        title: 'Switch Role',
        content: `Switch to ${newRole === 'chef' ? 'Chef' : 'Diner'} mode?`,
        confirmText: 'Switch',
        success: (res) => {
          if (res.confirm) {
            const app = getApp()
            app.switchRole(newRole)
          }
        }
      })
    }
  }
})