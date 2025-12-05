# 🍔 Food Ordering WeChat Mini Program

A WeChat Mini Program for ordering food with friends. Features two user roles: **Chef** (creates and manages menu) and **Diner** (browses menu and places orders).

## 📋 Features

### 👨‍🍳 Chef Features
1. **Menu Management**
   - Create and edit dishes with name, description, and images
   - Add detailed cooking instructions
   - Organize dishes with tags
   - Delete dishes from menu

2. **Order Management**
   - View all incoming orders
   - See pending and completed orders
   - Confirm or cancel orders
   - Track customer information

3. **Menu Sharing**
   - Share menu ID with diners
   - Diners can browse and order from shared menu

### 🍽️ Diner Features
1. **Menu Browsing**
   - Search for chef by ID
   - View available dishes with images and descriptions
   - Filter by tags
   - View detailed cooking instructions

2. **Order Placement**
   - Add dishes to cart
   - Review cart before ordering
   - Add special instructions/notes
   - Place orders to chef

3. **Order History**
   - View all past orders
   - Track order status (pending/completed)
   - See order details and notes

4. **Lucky Food Suggester** 🎲
   - Random dish selector when indecisive
   - Animated wheel spin
   - View recent lucky food history
   - Quick add to cart

5. **Statistics Dashboard** 📊
   - Total orders count
   - Completed orders tracking
   - Top 3 most ordered dishes
   - Personalized insights

## 🚀 Getting Started

### Prerequisites
- WeChat Developer Tools
- Node.js (optional, for development)

### Installation

1. Clone or download this project
```bash
git clone <repository-url>
cd eating
```

2. Open in WeChat Developer Tools
   - Launch WeChat Developer Tools
   - Click "Import Project"
   - Select the project directory
   - Enter your AppID (or use test AppID)

3. The project structure:
```
eating/
├── app.js                 # App configuration
├── app.json              # Global configuration
├── app.wxss              # Global styles
├── sitemap.json          # SEO configuration
├── utils/
│   └── storage.js        # Local storage utilities
├── pages/
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   ├── chef/            # Chef role pages
│   │   ├── menu-manager/    # Menu management
│   │   ├── food-editor/     # Add/edit dishes
│   │   └── orders/          # Order management
│   ├── diner/           # Diner role pages
│   │   ├── menu/            # Browse menu
│   │   ├── order-history/   # Order history
│   │   ├── dashboard/       # Statistics
│   │   └── lucky-food/      # Lucky food suggester
│   └── shared/          # Shared pages
│       └── food-detail/     # Food details view
└── README.md
```

## 👤 Login Options

### Option 1: WeChat Account Login (Recommended)
Simply click "Login with WeChat" button on the login page:
1. Authorize the app to access your WeChat profile
2. Select your role (Chef or Diner) on first login
3. Your account will be created automatically using your WeChat profile

### Option 2: Demo Accounts
Use these pre-configured demo accounts for testing:

**Chef Account:**
- Username: `chef1`
- Password: `123456`
- Role: Chef

**Diner Account:**
- Username: `diner1`
- Password: `123456`
- Role: Diner

### Option 3: Register New Account
Create a custom account with username and password through the registration page.

## 📱 User Guide

### For Chefs

1. **Login**
   - Use WeChat login (auto-creates account on first use)
   - Or use demo account
   - Or register new chef account

2. **Access Dashboard**
3. **Add Dishes**
   - Click "Add New Dish" button
   - Fill in dish name, description, and cooking instructions
   - Add up to 5 images (can use image URLs)
   - Add tags for organization
   - Save dish

4. **Share Menu**
   - Click "Share Menu with Diners"
   - Copy your Chef ID
   - Share ID with diners

5. **Manage Orders**
   - View orders in Orders tab
   - Confirm or cancel pending orders
   - Track order history

### For Diners

1. **Login**
   - Use WeChat login (auto-creates account on first use)
   - Or use demo account
   - Or register new diner account

2. **Find Chef Menu**
   - Click "Find Chef" button
   - Enter Chef ID provided by chef
   - Browse available dishes

3. **Place Order**
   - Add dishes to cart
   - Review cart items
   - Add optional notes
   - Place order

4. **Use Lucky Food**
   - Go to Lucky tab
   - Spin the wheel for random suggestion
   - Add suggested food to cart or view details

5. **View Statistics**
   - Check Stats tab for ordering insights
   - See top 3 favorite dishes
   - Track total orders

## 🔐 WeChat Login Integration

The app now supports WeChat account login:

### Features:
- **One-Click Login**: Users can login with their WeChat account
- **Auto Registration**: New users are automatically registered on first login
- **Profile Integration**: Uses WeChat avatar and nickname
- **Role Selection**: First-time users choose between Chef or Diner role
- **Persistent Login**: Account is saved locally for future sessions

### How It Works:
1. User clicks "Login with WeChat" button
2. WeChat prompts for authorization
3. App receives user profile (nickname, avatar)
4. If first time: User selects role (Chef/Diner)
5. Account created/retrieved and user is logged in
6. User navigates to appropriate dashboard

### Testing:
- In WeChat Developer Tools, the authorization will use test data
- On real devices, it will use your actual WeChat account
- Each WeChat account can only have one role (Chef or Diner)

## 🛠️ Technical Details

### Data Storage
The app uses WeChat's local storage for data persistence:
- **users_list**: User accounts (chef/diner)
- **foods_list**: All dishes created by chefs
- **orders_list**: All orders placed by diners
- **cart**: Current shopping cart (per user)
- **selectedChefId**: Currently selected chef
- **lucky_history**: Lucky food selection history

### Key Files

**app.js**
- Global app configuration
- User authentication management
- Role-based navigation

**utils/storage.js**
- CRUD operations for users, foods, and orders
- Statistics calculation
- Data initialization

### Styling
- Modern gradient backgrounds
- Card-based UI components
- Responsive design
- Smooth animations

## 🎨 Customization

### Adding New Features
1. Create new page in `pages/` directory
2. Add page configuration in `app.json`
3. Implement page logic in `.js` file
4. Design UI in `.wxml` file
5. Style in `.wxss` file

### Modifying Colors
Edit the gradient colors in page `.wxss` files:
```css
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Adding New User Fields
Update the user object in `utils/storage.js`:
```javascript
{
  id: '...',
  username: '...',
  password: '...',
  role: 'chef' | 'diner',
  nickname: '...',
  avatar: '...',
  // Add new fields here
}
```

## 📝 Development Notes

### Important Considerations
1. **Image URLs**: Currently uses placeholder images. Replace with actual image upload functionality or CDN links.
2. **Authentication**: Uses simple local storage. Consider implementing proper authentication for production.
3. **Data Sync**: All data is local. Implement cloud database (e.g., WeChat Cloud Development) for multi-device sync.
4. **Order Notifications**: Add real-time notifications when orders are placed/updated.

### Future Enhancements
- [ ] Cloud database integration
- [ ] Real-time order notifications
- [ ] Image upload from camera/album
- [ ] Payment integration
- [ ] Chef ratings and reviews
- [ ] Search and filter functionality
- [ ] Order delivery tracking
- [ ] Multiple language support

## 🐛 Troubleshooting

### Common Issues

**"User not found" error**
- Ensure you're using the correct demo credentials
- Try registering a new account

**"No dishes available"**
- Chef hasn't added any dishes yet
- Verify you entered the correct Chef ID

**Cart not updating**
- Refresh the page
- Clear app storage and restart

**Orders not showing**
- Ensure orders are placed to the correct chef
- Check order status filter (pending/completed)

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for food lovers and chefs**