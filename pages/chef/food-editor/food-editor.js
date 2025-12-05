// pages/chef/food-editor/food-editor.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    isEdit: false,
    foodId: null,
    name: '',
    description: '',
    instructions: '',
    images: [],
    tags: [],
    tagsStr: ''
  },

  onLoad(options) {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo || userInfo.role !== 'chef') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    // Check if editing existing food
    if (options.id) {
      this.loadFood(options.id)
    }
  },

  loadFood(foodId) {
    const food = storage.getFoodById(foodId)
    if (food) {
      this.setData({
        isEdit: true,
        foodId: foodId,
        name: food.name,
        description: food.description,
        instructions: food.instructions,
        images: food.images || [],
        tags: food.tags || [],
        tagsStr: (food.tags || []).join(', ')
      })
    }
  },

  onNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    })
  },

  onInstructionsInput(e) {
    this.setData({
      instructions: e.detail.value
    })
  },

  onTagsInput(e) {
    const tagsStr = e.detail.value
    const tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag)
    this.setData({
      tagsStr,
      tags
    })
  },

  onAddImage() {
    wx.showModal({
      title: 'Add Image',
      content: 'Enter image URL (or use placeholder)',
      editable: true,
      placeholderText: 'https://...',
      success: (res) => {
        if (res.confirm) {
          let imageUrl = res.content.trim()
          if (!imageUrl) {
            // Use placeholder if no URL provided
            imageUrl = `https://via.placeholder.com/600x400/ff6b6b/ffffff?text=Food+${this.data.images.length + 1}`
          }
          const images = [...this.data.images, imageUrl]
          this.setData({ images })
        }
      }
    })
  },

  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images.filter((_, i) => i !== index)
    this.setData({ images })
  },

  onSave() {
    const { name, description, instructions, images, tags, isEdit, foodId } = this.data
    const app = getApp()
    const userInfo = app.globalData.userInfo

    // Validate
    if (!name || !description || !instructions) {
      wx.showToast({
        title: 'Please fill required fields',
        icon: 'none'
      })
      return
    }

    if (images.length === 0) {
      wx.showToast({
        title: 'Please add at least one image',
        icon: 'none'
      })
      return
    }

    const foodData = {
      name,
      description,
      instructions,
      images,
      tags,
      chefId: userInfo.id,
      chefName: userInfo.nickname
    }

    if (isEdit) {
      // Update existing food
      storage.updateFood(foodId, foodData)
      wx.showToast({
        title: 'Updated successfully',
        icon: 'success'
      })
    } else {
      // Add new food
      storage.addFood(foodData)
      wx.showToast({
        title: 'Created successfully',
        icon: 'success'
      })
    }

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  onCancel() {
    wx.navigateBack()
  }
})