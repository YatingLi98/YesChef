# Authentication & Role Switching Guide

## Overview

This WeChat Mini Program uses a **WeChat-only authentication system** where each user account supports **dual roles** (Chef and Diner). Users can seamlessly switch between roles without logging out.

---

## Authentication Flow

### 1. Login Process

**Users can ONLY login through WeChat:**

1. User opens the app
2. Clicks "Login with WeChat" button
3. Authorizes the mini program
4. System checks if user exists:
   - **Existing User**: Logs in automatically with default Diner role
   - **New User**: Prompted to choose starting role (Chef or Diner)

**Key Implementation:**
- File: [`pages/login/login.js`](pages/login/login.js)
- Uses WeChat [`wx.login()`](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) and `getUserInfo` button
- Simulates OpenID with `wx_${nickName}` format
- Creates account with both roles enabled

### 2. User Account Structure

Each user account has:

```javascript
{
  id: "unique_id",
  openid: "wx_nickname",          // Simulated WeChat OpenID
  username: "User Display Name",
  nickname: "User Display Name",
  avatar: "https://...",          // WeChat avatar URL
  wechatAuth: true,
  hasChefRole: true,              // Everyone has both roles
  hasDinerRole: true,
  createdAt: "ISO date"
}
```

**Storage Functions:**
- [`getUserByWechatId()`](utils/storage.js:57): Find user by OpenID
- [`addUser()`](utils/storage.js:45): Create new user
- [`updateUser()`](utils/storage.js:69): Update user info

---

## Role Switching System

### Active Role Concept

- Each user has **ONE active role** at any time
- Active role determines which pages/features are accessible
- Stored in: `wx.getStorageSync('activeRole')` 
- Possible values: `'chef'` or `'diner'`

### App-Level Role Management

**File:** [`app.js`](app.js)

**Key Functions:**

#### `switchRole(newRole)`
```javascript
app.switchRole('chef')  // Switch to Chef mode
app.switchRole('diner') // Switch to Diner mode
```
- Updates global state
- Saves to storage
- Navigates to appropriate home page
- Shows success toast

#### `getActiveRole()`
```javascript
const role = app.getActiveRole()  // Returns 'chef' or 'diner'
```

#### `navigateToRoleHome(role)`
- Chef → [`/pages/chef/menu-manager/menu-manager`](pages/chef/menu-manager/menu-manager.wxml)
- Diner → [`/pages/diner/menu/menu`](pages/diner/menu/menu.wxml)

---

## Role Switcher Component

### Visual Indicator & Switch Button

**Component:** [`/components/role-switcher/`](components/role-switcher/)

**Features:**
- Floating badge in top-right corner
- Shows current active role with emoji
- Click to switch roles with confirmation dialog
- Color-coded:
  - Chef: Red (#ff6b6b)
  - Diner: Green (#51cf66)

**Usage:**

Add to any page JSON:
```json
{
  "usingComponents": {
    "role-switcher": "/components/role-switcher/role-switcher"
  }
}
```

Add to WXML:
```xml
<view class="container">
  <role-switcher />
  <!-- rest of page content -->
</view>
```

**Already Added To:**
- All Chef pages
- All Diner tab pages (menu, orders, dashboard, lucky-food)

---

## Page Access by Role

### Chef Mode Pages

When active role is `'chef'`:

1. **Menu Manager** ([`pages/chef/menu-manager/`](pages/chef/menu-manager/))
   - Dashboard showing dishes and orders
   - Share menu ID
   
2. **Food Editor** ([`pages/chef/food-editor/`](pages/chef/food-editor/))
   - Add/edit dishes
   - Upload images
   - Set cooking instructions

3. **Orders View** ([`pages/chef/orders/`](pages/chef/orders/))
   - View incoming orders
   - Confirm/complete orders

### Diner Mode Pages

When active role is `'diner'`:

1. **Browse Menu** ([`pages/diner/menu/`](pages/diner/menu/))
   - Search for chefs
   - Browse available dishes
   - Add to cart

2. **Lucky Food** ([`pages/diner/lucky-food/`](pages/diner/lucky-food/))
   - Random food suggester
   - Spinning wheel animation

3. **Order History** ([`pages/diner/order-history/`](pages/diner/order-history/))
   - View past orders
   - Check order status

4. **Statistics** ([`pages/diner/dashboard/`](pages/diner/dashboard/))
   - Top 3 favorite foods
   - Total order count

---

## Tab Bar Behavior

**Current Implementation:**
- Tab bar shows **Diner pages only** (defined in [`app.json`](app.json))
- Chef must navigate via Menu Manager page buttons
- Role switcher component provides quick access

**Technical Limitation:**
- WeChat Mini Programs don't support dynamic tab bar switching
- Tab bar configuration is static in `app.json`

**Alternative Approaches:**
1. Keep current tab bar as Diner-focused (most common use case)
2. Add role switcher to all pages for quick access
3. Users can switch roles from any page

---

## Data Isolation

### How Data is Separated by Role

**Orders:**
```javascript
// Chef sees orders FOR their dishes
storage.getOrdersByChefId(userId)

// Diner sees orders THEY placed
storage.getOrdersByUserId(userId)
```

**Foods:**
```javascript
// Chef manages their own dishes
foods.filter(f => f.chefId === userId)

// Diner sees dishes from any chef
storage.getFoods()
```

**Storage Functions:**
- [`getOrdersByChefId()`](utils/storage.js:111): Orders for chef's dishes
- [`getOrdersByUserId()`](utils/storage.js:106): Orders placed by diner
- [`getUserStats()`](utils/storage.js:138): Statistics by user ID

---

## Testing the System

### Test Flow

1. **First Login:**
   ```
   Open app → Login with WeChat → Choose "Start as Diner"
   ```

2. **Switch to Chef:**
   ```
   Tap role badge → Confirm switch → Redirected to Menu Manager
   ```

3. **Create Dish as Chef:**
   ```
   Add New Dish → Fill details → Save
   ```

4. **Switch to Diner:**
   ```
   Tap role badge → Confirm switch → Back to Menu
   ```

5. **Order as Diner:**
   ```
   Search chef ID → Browse dishes → Add to cart → Place order
   ```

6. **Switch Back to Chef:**
   ```
   Tap role badge → Confirm → See new order in Orders page
   ```

---

## Key Differences from Old System

| Feature | Old System | New System |
|---------|-----------|------------|
| **Login Method** | Username/Password OR WeChat | WeChat ONLY |
| **Roles per Account** | One role (Chef OR Diner) | Both roles (Chef AND Diner) |
| **Role Switching** | Not possible | Seamless switching |
| **Account Creation** | Register page with role selection | Auto-create on first WeChat login |
| **Authentication** | Local username/password check | WeChat OpenID |
| **Demo Accounts** | chef1/diner1 with passwords | Not needed |

---

## Implementation Files

### Core Authentication
- [`app.js`](app.js) - App-level auth & role management
- [`pages/login/login.js`](pages/login/login.js) - WeChat login handler
- [`pages/login/login.wxml`](pages/login/login.wxml) - Simplified login UI
- [`utils/storage.js`](utils/storage.js) - User CRUD operations

### Role Switcher Component
- [`components/role-switcher/role-switcher.js`](components/role-switcher/role-switcher.js)
- [`components/role-switcher/role-switcher.wxml`](components/role-switcher/role-switcher.wxml)
- [`components/role-switcher/role-switcher.wxss`](components/role-switcher/role-switcher.wxss)
- [`components/role-switcher/role-switcher.json`](components/role-switcher/role-switcher.json)

### Updated Pages
All chef and diner pages now include the role-switcher component.

---

## Security Considerations

### Production Implementation

**Current (Development):**
- Simulated OpenID using nickname
- Local storage only
- No backend verification

**Recommended (Production):**

1. **Backend OpenID Exchange:**
   ```javascript
   wx.login({
     success: (res) => {
       // Send code to your backend
       wx.request({
         url: 'https://your-api.com/wechat/login',
         data: { code: res.code },
         success: (apiRes) => {
           // Backend returns real openid and session_key
           const { openid, session_key } = apiRes.data
         }
       })
     }
   })
   ```

2. **Server-Side User Management:**
   - Store users in database (not local storage)
   - Validate session tokens
   - Secure API endpoints

3. **OpenID Privacy:**
   - Never expose OpenID to frontend logs
   - Use session tokens for auth
   - Implement token refresh

---

## Troubleshooting

### Common Issues

**Issue:** "Authorization cancelled"
- **Cause:** User denied getUserInfo permission
- **Solution:** Re-click login button and approve

**Issue:** Role switcher not showing
- **Cause:** Component not registered in page JSON
- **Solution:** Add to `usingComponents` in page.json

**Issue:** Data from wrong role showing
- **Cause:** Filtering by wrong ID
- **Solution:** Check if using `userId` vs `chefId` correctly

**Issue:** Can't find other user's menu
- **Cause:** Simulated OpenID may differ
- **Solution:** In development, check actual stored user IDs

---

## Future Enhancements

Possible improvements:

1. **Role Permissions:**
   - Add granular permissions (view, edit, delete)
   - Role-based feature flags

2. **Profile Management:**
   - Separate Chef and Diner profiles
   - Different avatars per role

3. **Notification System:**
   - Push notifications for new orders (Chef)
   - Order status updates (Diner)

4. **Analytics:**
   - Track time spent in each role
   - Most-used features per role

5. **Admin Role:**
   - Add third role for platform management
   - User moderation tools

---

## Summary

✅ **Single WeChat account** = Both Chef and Diner capabilities  
✅ **One-tap role switching** = Seamless transition  
✅ **Visual indicator** = Always know current role  
✅ **Simple authentication** = Just WeChat login button  
✅ **Data isolation** = Proper separation between role contexts  

The new system provides maximum flexibility while maintaining clear role boundaries for functionality and data access.