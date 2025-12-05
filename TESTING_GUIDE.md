# 📱 Testing on Your Phone - Step by Step Guide

## Prerequisites
- WeChat app installed on your phone
- WeChat Developer Tools installed on your computer
- A WeChat account (for testing)

## Method 1: Preview in WeChat Developer Tools (Quickest)

### Step 1: Open Project in WeChat Developer Tools
1. Download and install [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. Open WeChat Developer Tools
3. Click "Mini Program" project type
4. Click "Import Project"
5. Fill in:
   - **Project Directory**: Browse to `q:\eating`
   - **AppID**: Click "Test Account" (or use your own AppID if you have one)
   - **Project Name**: Food Ordering
6. Click "Import"

### Step 2: Preview on Your Phone
1. In WeChat Developer Tools, click the **"Preview"** button (预览) in the top toolbar
2. A QR code will appear
3. **Open WeChat on your phone**
4. Tap the "+" icon → "Scan QR Code"
5. Scan the QR code from WeChat Developer Tools
6. The mini program will open directly on your phone!

**Note:** Preview mode expires after 30 minutes. Just generate a new QR code if needed.

---

## Method 2: Upload for Testing (For Longer Testing)

### Step 1: Register Mini Program (One-Time Setup)
1. Go to [WeChat Official Account Platform](https://mp.weixin.qq.com/)
2. Click "Register Now" → "Mini Program"
3. Follow the registration process:
   - Email verification
   - Fill in basic information
   - Admin verification (scan with WeChat)
4. Complete registration and get your **AppID**

### Step 2: Upload Mini Program
1. Open your project in WeChat Developer Tools
2. Replace "Test Account" with your real **AppID** in project settings
3. Click **"Upload"** button (上传) in the toolbar
4. Fill in version info:
   - Version: `1.0.0`
   - Description: `Initial version`
5. Click "Upload"

### Step 3: Set as Test Version
1. Go to [WeChat Mini Program Admin](https://mp.weixin.qq.com/)
2. Login with your admin WeChat account
3. Go to **"Development" → "Development Management"**
4. Find your uploaded version
5. Click **"Set as Test Version"**
6. Add testers (up to 15 people):
   - Click "Testers"
   - Add WeChat accounts that can test

### Step 4: Test on Phone
1. Open WeChat on your phone
2. Search for your mini program name in WeChat search
3. Or go to **"Discover" → "Mini Programs"** and find it
4. Tap to open and test!

---

## Method 3: Experience Code (For Multiple Testers)

### Generate Experience QR Code:
1. In WeChat Mini Program Admin panel
2. Go to **"Development" → "Development Management"**
3. Click **"Generate Experience Code"**
4. Download the QR code image
5. Share this QR code with testers

### Testers Can Access:
1. Scan the experience QR code with WeChat
2. Mini program opens directly
3. Full functionality available for testing

---

## 🎯 Quick Start Testing Flow

**Recommended for Immediate Testing:**

1. **Open WeChat Developer Tools**
2. **Import your project** (`q:\eating`)
3. **Click "Preview" button**
4. **Scan QR code with WeChat on your phone**
5. **Done! App opens on your phone**

---

## 📝 What to Test on Your Phone

### As a Diner:
1. ✅ Click "Login with WeChat"
2. ✅ Authorize the app
3. ✅ Select "Diner" role
4. ✅ Search for a chef (use ID: `1` for demo chef)
5. ✅ Browse menu
6. ✅ Add items to cart
7. ✅ Place order
8. ✅ Try "Lucky Food" feature
9. ✅ Check order history
10. ✅ View statistics dashboard

### As a Chef:
1. ✅ Click "Login with WeChat"
2. ✅ Select "Chef" role
3. ✅ Add new dishes with images
4. ✅ Share your menu ID
5. ✅ View incoming orders
6. ✅ Confirm orders

---

## 🔧 Troubleshooting

### "Cannot scan QR code"
- Make sure WeChat app is updated
- Check that you're using WeChat's built-in scanner (not phone camera)
- Try regenerating the QR code

### "Failed to load"
- Check internet connection
- Restart WeChat Developer Tools
- Clear WeChat cache: Me → Settings → General → Storage → Clear Cache

### "Permission denied"
- Make sure you clicked "Allow" when WeChat asks for authorization
- Go to WeChat Settings → Privacy → Authorization Management → Find your mini program → Enable permissions

### "Cannot find mini program"
- If using Method 2, wait 5-10 minutes after upload
- Make sure it's set as "Test Version"
- Check that your WeChat account is added as tester

---

## 💡 Tips

1. **Use Preview Mode First**: It's the fastest way to test
2. **Test with Friends**: Share experience QR code with friends to test the ordering flow
3. **Check on Different Phones**: Test on both iOS and Android if possible
4. **Use Real WeChat Account**: Get the authentic user experience
5. **Keep Developer Tools Open**: You can see console logs while testing on phone

---

## 📞 Need Help?

- [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/en/dev/framework/)
- [Developer Tools Guide](https://developers.weixin.qq.com/miniprogram/en/dev/devtools/devtools.html)

---

**🎉 That's it! You're ready to test on your phone!**

Start with the Preview method (Method 1) - it takes less than 2 minutes to get running on your phone.