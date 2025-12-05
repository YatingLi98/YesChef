/**
 * Local Storage Utility
 */

// Initialize data
function initData() {
  // Initialize user list
  if (!wx.getStorageSync('users_list')) {
    wx.setStorageSync('users_list', [
      {
        id: '1',
        username: 'chef1',
        password: '123456',
        role: 'chef',
        nickname: 'Chef Master',
        avatar: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=Chef'
      },
      {
        id: '2',
        username: 'eater1',
        password: '123456',
        role: 'diner',
        nickname: 'Food Lover',
        avatar: 'https://via.placeholder.com/150/51cf66/ffffff?text=Eater'
      }
    ])
  }

  // Initialize food list
  if (!wx.getStorageSync('foods_list')) {
    wx.setStorageSync('foods_list', [])
  }

  // Initialize order list
  if (!wx.getStorageSync('orders_list')) {
    wx.setStorageSync('orders_list', [])
  }
}

// User related
function getUsers() {
  return wx.getStorageSync('users_list') || []
}

function addUser(user) {
  const users = getUsers()
  user.id = Date.now().toString()
  user.createdAt = new Date().toISOString()
  users.push(user)
  wx.setStorageSync('users_list', users)
  return user
}

function getUserByUsername(username) {
  const users = getUsers()
  return users.find(u => u.username === username)
}

// Food related
function getFoods() {
  return wx.getStorageSync('foods_list') || []
}

function getFoodById(id) {
  const foods = getFoods()
  return foods.find(f => f.id === id)
}

function addFood(food) {
  const foods = getFoods()
  food.id = Date.now().toString()
  food.createdAt = new Date().toISOString()
  foods.push(food)
  wx.setStorageSync('foods_list', foods)
  return food
}

function updateFood(id, updates) {
  const foods = getFoods()
  const index = foods.findIndex(f => f.id === id)
  if (index !== -1) {
    foods[index] = { ...foods[index], ...updates, updatedAt: new Date().toISOString() }
    wx.setStorageSync('foods_list', foods)
    return foods[index]
  }
  return null
}

function deleteFood(id) {
  let foods = getFoods()
  foods = foods.filter(f => f.id !== id)
  wx.setStorageSync('foods_list', foods)
  return true
}

// Order related
function getOrders() {
  return wx.getStorageSync('orders_list') || []
}

function getOrderById(id) {
  const orders = getOrders()
  return orders.find(o => o.id === id)
}

function getOrdersByUserId(userId) {
  const orders = getOrders()
  return orders.filter(o => o.userId === userId)
}

function getOrdersByChefId(chefId) {
  const orders = getOrders()
  return orders.filter(o => o.chefId === chefId)
}

function addOrder(order) {
  const orders = getOrders()
  order.id = Date.now().toString()
  order.createdAt = new Date().toISOString()
  order.status = 'pending' // pending, confirmed, completed, cancelled
  orders.push(order)
  wx.setStorageSync('orders_list', orders)
  return order
}

function updateOrder(id, updates) {
  const orders = getOrders()
  const index = orders.findIndex(o => o.id === id)
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() }
    wx.setStorageSync('orders_list', orders)
    return orders[index]
  }
  return null
}

// Statistics related
function getUserStats(userId) {
  const orders = getOrdersByUserId(userId)
  const completedOrders = orders.filter(o => o.status === 'completed')
  
  // Count food selections
  const foodCounts = {}
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (foodCounts[item.foodId]) {
        foodCounts[item.foodId].count += item.quantity
        foodCounts[item.foodId].foodName = item.foodName
      } else {
        foodCounts[item.foodId] = {
          foodId: item.foodId,
          foodName: item.foodName,
          count: item.quantity
        }
      }
    })
  })

  // Get Top 3
  const topFoods = Object.values(foodCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return {
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    topFoods: topFoods
  }
}

module.exports = {
  initData,
  // User
  getUsers,
  addUser,
  getUserByUsername,
  // Food
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
  // Order
  getOrders,
  getOrderById,
  getOrdersByUserId,
  getOrdersByChefId,
  addOrder,
  updateOrder,
  // Statistics
  getUserStats
}