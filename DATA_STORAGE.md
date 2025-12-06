# 💾 Data Storage Documentation

## Overview

The YesChef mini program currently uses **WeChat Local Storage** for all data persistence. This means data is stored locally on each user's device.

---

## 📍 Storage Location

### Where Data is Stored:
- **Location**: Device local storage (managed by WeChat)
- **Type**: Key-value pairs using `wx.setStorageSync()` and `wx.getStorageSync()`
- **Scope**: Per user, per device
- **Persistence**: Data remains until manually cleared or app is uninstalled

### Storage Keys Used:

```javascript
// Main data storage keys
'users_list'      // All registered users
'foods_list'      // All dishes created by chefs
'orders_list'     // All orders placed
'cart'            // Current user's shopping cart
'selectedChefId'  // Currently selected chef
'lucky_history'   // Lucky food selection history
'userInfo'        // Current logged-in user info
```

---

## 📊 Data Structure

### 1. Users List (`users_list`)
Stores all registered user accounts:

```javascript
[
  {
    id: "1234567890",           // Unique user ID (timestamp)
    username: "chef1",           // Login username
    password: "123456",          // Password (plain text - for demo only)
    nickname: "Chef Master",     // Display name
    role: "chef",                // User role: 'chef' or 'diner'
    avatar: "https://...",       // Profile picture URL
    wechatAuth: true,            // Whether logged in via WeChat
    createdAt: "2024-01-01T..."  // Account creation timestamp
  },
  // ... more users
]
```

### 2. Foods List (`foods_list`)
Stores all dishes created by chefs:

```javascript
[
  {
    id: "1234567890",              // Unique food ID
    name: "Kung Pao Chicken",      // Dish name
    description: "Spicy...",       // Description
    instructions: "Step 1...",     // Cooking instructions
    images: ["url1", "url2"],      // Array of image URLs (max 5)
    tags: ["Chinese", "Spicy"],    // Category tags
    chefId: "1234567890",          // Creator's user ID
    chefName: "Chef Master",       // Creator's name
    createdAt: "2024-01-01T...",   // Creation timestamp
    updatedAt: "2024-01-02T..."    // Last update timestamp
  },
  // ... more dishes
]
```

### 3. Orders List (`orders_list`)
Stores all orders placed by diners:

```javascript
[
  {
    id: "1234567890",              // Unique order ID
    userId: "9876543210",          // Diner's user ID
    userName: "Food Lover",        // Diner's name
    chefId: "1234567890",          // Chef's user ID
    items: [                       // Ordered items
      {
        foodId: "1111111111",
        foodName: "Kung Pao Chicken",
        chefId: "1234567890",
        chefName: "Chef Master",
        image: "https://...",
        quantity: 2
      }
    ],
    note: "Extra spicy please",    // Special instructions
    status: "pending",             // Order status: pending/completed/cancelled
    createdAt: "2024-01-01T...",   // Order timestamp
    updatedAt: "2024-01-02T..."    // Last status update
  },
  // ... more orders
]
```

### 4. Shopping Cart (`cart`)
Current user's cart (per device):

```javascript
[
  {
    foodId: "1111111111",
    foodName: "Kung Pao Chicken",
    chefId: "1234567890",
    chefName: "Chef Master",
    image: "https://...",
    quantity: 2
  },
  // ... more cart items
]
```

### 5. User Info (`userInfo`)
Currently logged-in user:

```javascript
{
  id: "1234567890",
  username: "chef1",
  nickname: "Chef Master",
  role: "chef",
  avatar: "https://..."
}
```

---

## 🔄 Data Flow

### When User Logs In:
1. User enters credentials or uses WeChat login
2. `utils/storage.js` checks `users_list` for matching user
3. User data stored in `userInfo` key
4. App navigates to appropriate dashboard based on role

### When Chef Creates Dish:
1. Chef fills in dish details
2. `storage.addFood()` generates unique ID
3. Dish added to `foods_list` array
4. List saved to local storage
5. Menu refreshed automatically

### When Diner Places Order:
1. Diner adds items to `cart`
2. Cart saved to local storage
3. On checkout, order created with unique ID
4. Order added to `orders_list`
5. Cart cleared
6. Chef can view order in their orders list

---

## ⚠️ Current Limitations

### 1. **Device-Specific Data**
- Data is NOT synced across devices
- Each device has its own local storage
- If user switches devices, they start fresh

### 2. **No Real-Time Updates**
- Changes only visible after page refresh
- Chef doesn't get instant notifications of new orders
- Multiple users don't see each other's changes in real-time

### 3. **Data Isolation**
- Chef A cannot see Chef B's dishes
- Diner can only order from one chef at a time
- No global food discovery feature

### 4. **Storage Limits**
- WeChat local storage limit: ~10MB
- Large number of images could hit limits
- No automatic cleanup of old data

### 5. **No Backup**
- Data lost if:
  - App is uninstalled
  - WeChat cache is cleared
  - Device is reset
- No cloud backup or recovery

---

## 🚀 Recommended Upgrades

### For Production Use:

### 1. **WeChat Cloud Development** (Recommended)
```javascript
// Replace local storage with cloud database
wx.cloud.database().collection('users').add({
  data: userInfo
})
```

**Benefits:**
- ✅ Multi-device sync
- ✅ Real-time updates
- ✅ Automatic backups
- ✅ Better security
- ✅ Larger storage capacity

### 2. **Custom Backend API**
```javascript
// Use your own server
wx.request({
  url: 'https://your-api.com/users',
  method: 'POST',
  data: userInfo
})
```

**Benefits:**
- ✅ Full control over data
- ✅ Custom business logic
- ✅ Integration with other services
- ✅ Advanced security features

### 3. **Hybrid Approach**
- Use local storage for cart (temporary data)
- Use cloud for users, foods, orders (persistent data)
- Sync on app launch and significant actions

---

## 🔧 How to Migrate to Cloud Storage

### Step 1: Enable WeChat Cloud Development
1. Open WeChat Developer Tools
2. Click "Cloud Development" button
3. Create new cloud environment
4. Get environment ID

### Step 2: Update `app.js`
```javascript
wx.cloud.init({
  env: 'your-env-id',
  traceUser: true
})
```

### Step 3: Replace Storage Functions
Replace functions in `utils/storage.js`:

```javascript
// OLD: Local storage
function addUser(user) {
  const users = wx.getStorageSync('users_list') || []
  users.push(user)
  wx.setStorageSync('users_list', users)
}

// NEW: Cloud database
function addUser(user) {
  return wx.cloud.database()
    .collection('users')
    .add({ data: user })
}
```

### Step 4: Update All Pages
Update pages to use async/await:

```javascript
// OLD
const foods = storage.getFoods()

// NEW
const foods = await storage.getFoods()
```

---

## 📊 Storage Usage Monitor

### Check Current Storage:
```javascript
wx.getStorageInfo({
  success(res) {
    console.log('Current size:', res.currentSize, 'KB')
    console.log('Limit:', res.limitSize, 'KB')
    console.log('Keys:', res.keys)
  }
})
```

### Clear All Data (for testing):
```javascript
wx.clearStorage()
```

### Clear Specific Data:
```javascript
wx.removeStorageSync('cart')           // Clear cart
wx.removeStorageSync('lucky_history')  // Clear history
```

---

## 🛡️ Security Considerations

### Current Implementation:
⚠️ **Not suitable for production:**
- Passwords stored in plain text
- No encryption
- No server-side validation
- Anyone with device access can read data

### Recommended for Production:
1. **Never store passwords locally**
2. **Use token-based authentication**
3. **Encrypt sensitive data**
4. **Validate on server-side**
5. **Implement proper session management**

---

## 📝 Summary

### Current State:
- ✅ Simple and easy to test
- ✅ No backend required
- ✅ Works offline
- ✅ Fast performance
- ❌ Not production-ready
- ❌ No data sync
- ❌ Limited security

### For Production:
Consider migrating to **WeChat Cloud Development** or a **custom backend API** for real-world deployment.

---

## 📞 Questions?

For implementation help with cloud storage migration, refer to:
- [WeChat Cloud Development Docs](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [WeChat Storage API](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)