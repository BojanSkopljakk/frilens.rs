# Frilens.rs

Frilens.rs is a Next.js web application designed to help freelancers in Serbia manage their income and tax obligations. The platform allows users to record their earnings, calculate taxes, and optimize their tax payments. Premium features, such as advanced analytics, are available through a subscription model powered by LemonSqueezy.

---

## 🚀 Features

- **📌 Income Tracking:** Log and manage earnings in multiple currencies.
- **📊 Tax Calculation:** Automatic tax calculations using Models A and B.
- **💰 Tax Payment Management:** Track and manage paid taxes to prevent duplicate payments.
- **📈 Advanced Statistics:** Yearly and quarterly income vs. tax reports.
- **🔐 Authentication:** Google OAuth and email/password authentication.
- **💳 Subscription Payments:** Integrated with LemonSqueezy for premium feature access.
- **📱 Responsive Design:** Optimized for both desktop and mobile users.

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js** (App Router)
- **React.js**
- **Tailwind CSS**
- **daisyui**
- **Chart.js** for data visualization

### **Backend**
- **Node.js**
- **MongoDB** with Mongoose
- **LemonSqueezy API** for subscription management
- **Google API** for google authentication
- **ExchangeRate-API** for 24/7 exchange rate conversion

### **DevOps**
- **Vercel** for Deployment

---

## 📦 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/frilens-rs.git
cd frilens-rs

```
**2. Install Dependencies**
```bash
npm install
```
**3. Set Up Environment Variables**
```bash
MONGO_URI
AUTH_SECRET
GOOGLE_ID
GOOGLE_SECRET
EXCHANGE_RATE_API_KEY=4324b4ebaf4f318dfec6994e
BASE_URL
LEMON_SQUEEZY_API_KEY
LEMON_SQUEEZY_STORE_ID
LEMON_SQUEEZY_WEBHOOK_SIGNATURE
LS_VARIANT_ID
```
**4. Run the Application**
```bash
npm run dev
```
Visit http://localhost:3000 to see the app in action.

### **📂 Project Structure**
```ruby
├── app/
│   ├── api/                  # API Routes (LemonSqueezy, Profile, Payments)
│   ├── components/           # Reusable React Components (Buttons, Charts)
│   ├── libs/                 # Utility Libraries (e.g., Mongoose connection)
│   ├── models/               # Mongoose Schemas (User, Payments, Taxes)
│   └── styles/               # Tailwind CSS Configurations
│
├── public/                   # Static Files (images, etc.)
├── .env.local                # Environment Variables (Not included in repo)
├── next.config.js            # Next.js Configuration
└── package.json              # Dependencies and Scripts
```
### **🔮 Future Improvements**
- ✅ Implement detailed unit and integration tests
- ✅ Improve UI/UX design for better user experience
- ✅ Add multi-language support for non-Serbian users
- ✅ Improve the conversion rate logic







