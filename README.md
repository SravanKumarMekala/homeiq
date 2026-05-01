# HomeIQ 🏠⚡

**Smart Home Control Center with AI-Powered Automation**

A full-stack web application for controlling and automating home appliances with real-time updates, voice commands, auto-scheduling, and activity logging.

---

## 🚀 Live Deployment

### Backend API
- **Live API:** [supportive-clarity-production-1d0d.up.railway.app](https://supportive-clarity-production-1d0d.up.railway.app)
- **API Docs (Swagger):** [supportive-clarity-production-1d0d.up.railway.app/docs](https://supportive-clarity-production-1d0d.up.railway.app/docs)
- **Status:** ✅ Running on Railway

### Frontend Application
- **Live App:** [homeiq-production-3c7c.up.railway.app](https://homeiq-production-3c7c.up.railway.app)
- **Status:** ✅ Running on Railway

---

## ✨ Key Features

### Core Smart Home Control
- **🎮 Device Management** — Add, control, and delete devices in real-time
- **🏠 Room Organization** — Group devices by room (bedroom, kitchen, living room, etc.)
- **⚡ Energy Monitoring** — Track real-time power consumption per device
- **🎚️ Quick Controls** — One-click toggle switches for instant device control

### Advanced Features

#### 🎤 Voice Command Control
- **Speech Recognition** — "Turn on bedroom light" — natural voice commands
- **Browser-based** — No additional hardware needed (works in Chrome, Edge)
- **Smart Matching** — Automatically identifies devices from voice input
- **Real-time Feedback** — Instant visual confirmation of voice actions

#### ⏰ Auto Scheduler
- **Scheduled Automation** — Set devices to turn on/off at specific times
- **Recurring Rules** — Choose which days the schedule repeats
- **Background Execution** — Runs automatically every minute without manual intervention
- **Easy Management** — Create, view, and delete schedules with one click

#### 📊 Activity Logs
- **Complete History** — See every device action with timestamp
- **Filter Options** — Filter by action type (Turned ON / Turned OFF)
- **Action Source** — Know if action was triggered manually, by voice, schedule, or AI
- **Timeline View** — Easy-to-read chronological activity feed

#### 🔗 Guest Access with Time Limits
- **Temporary Access Links** — Share guest tokens with visitors
- **Auto-Expiring** — Access automatically expires after set duration (1hr to 3 days)
- **Room-Level Control** — Specify which rooms guests can access
- **One-Click Sharing** — Copy guest token to clipboard instantly
- **Revokable** — Manually delete tokens anytime

#### 🏆 Premium UI/UX
- **Dark Mode Theme** — Eye-friendly navy blue with cyan accents
- **Device Illustrations** — Beautiful SVG icons for each device type:
  - 💡 Light bulb with glow effect
  - 🌀 Spinning fan animation
  - ❄️ AC with cooling effect
  - 📺 TV screen display
  - 🔌 Generic appliance icon
- **Responsive Design** — Works seamlessly on desktop and tablet
- **Real-time Feedback** — Toast notifications for all actions
- **Smooth Animations** — Polished transitions and micro-interactions

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT tokens with password hashing
- **API Documentation:** Swagger UI / OpenAPI
- **Deployment:** Railway

### Frontend
- **Framework:** React 18 with Hooks
- **Build Tool:** Vite
- **Styling:** CSS-in-JS (inline styles with design tokens)
- **HTTP Client:** Axios
- **Voice API:** Web Speech Recognition API
- **Fonts:** Outfit (UI), JetBrains Mono (code/numbers)
- **Deployment:** Railway

### Database Schema
```
users
├── id (UUID, PK)
├── name, email, password_hash
├── role (owner/guest)
└── created_at

rooms
├── id (UUID, PK)
├── user_id (FK)
├── name, icon
└── created_at

devices
├── id (UUID, PK)
├── room_id (FK)
├── name, type, is_on, power_watts
├── settings (JSON)
└── updated_at

schedules
├── id (UUID, PK)
├── device_id (FK)
├── action (turn_on/turn_off)
├── scheduled_time, repeat_days
├── is_active
└── created_at

activity_logs
├── id (UUID, PK)
├── device_id (FK), user_id (FK)
├── action, triggered_by (manual/voice/schedule)
└── created_at

guest_access
├── id (UUID, PK)
├── owner_id (FK)
├── token, expires_at
├── allowed_rooms
└── created_at
```

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL 13+
- Git

### Backend Setup (Local Development)

```bash
# 1. Clone repository
git clone <repo-url>
cd homeiq/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose pydantic[email] "pydantic[email]" python-dotenv

# 4. Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://username:password@localhost:5432/homeiq
SECRET_KEY=your-secret-key-here
EOF

# 5. Create PostgreSQL database
psql -U postgres
CREATE DATABASE homeiq;
\q

# 6. Run database migrations
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"

# 7. Start backend server
python -m uvicorn main:app --reload
# Runs on http://127.0.0.1:8000
```

### Frontend Setup (Local Development)

```bash
# 1. Navigate to frontend
cd homeiq/frontend

# 2. Install dependencies
npm install

# 3. Create .env file (if needed)
# Make sure API points to backend URL in src/api.js

# 4. Start development server
npm run dev
# Runs on http://localhost:5173
```

---

## 🚀 Deployment (Railway)

### Backend Deployment
1. Connect your GitHub repository to Railway
2. Create new project → Import GitHub repo
3. Select `backend` as root directory
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   ```
5. Deploy!

### Frontend Deployment
1. Create another Railway project for frontend
2. Update `src/api.js` to point to deployed backend:
   ```javascript
   const API = axios.create({ 
     baseURL: 'https://supportive-clarity-production-1d0d.up.railway.app' 
   })
   ```
3. Build command: `npm run build`
4. Start command: `npm run preview`
5. Deploy!

---

## 📚 API Documentation

### Authentication Endpoints
```
POST /auth/register
POST /auth/login
```

### Room Management
```
GET    /rooms/              # List all rooms
POST   /rooms/              # Create room
DELETE /rooms/{room_id}     # Delete room
```

### Device Control
```
GET    /devices/                     # List all devices
POST   /devices/                     # Create device
GET    /devices/room/{room_id}       # Get room devices
PATCH  /devices/{device_id}/control  # Toggle device (is_on: true/false)
DELETE /devices/{device_id}          # Delete device
```

### Scheduling
```
GET    /schedules/                 # List all schedules
POST   /schedules/                 # Create schedule
DELETE /schedules/{schedule_id}    # Delete schedule
POST   /schedules/run-due          # Execute due schedules (automatic)
```

### Activity & Logs
```
GET /logs/                    # Get activity logs (last 50)
```

### Guest Access
```
POST   /guests/              # Generate guest token
GET    /guests/verify/{token}# Verify token validity
```

**Full interactive API docs:** [API Docs Link](https://supportive-clarity-production-1d0d.up.railway.app/docs)

---

## 🎯 How to Use

### First Time Setup
1. **Register Account** — Create account with email and password
2. **Add Room** — Click "+ Add Room" and select emoji + name
3. **Add Device** — Select room → "+ Add Device" with name, type, and wattage
4. **Control Device** — Click toggle switch to turn device ON/OFF

### Voice Commands
1. Click **"🎤 Voice Control"** button
2. Speak clearly: *"Turn on bedroom light"* or *"Turn off AC"*
3. App shows interpreted command
4. Device toggles automatically

### Schedule Automation
1. Go to **"⏰ Scheduler"** tab
2. Click **"+ New Schedule"**
3. Select device, action (ON/OFF), time, and repeat days
4. Save → Schedule runs automatically at set time every day

### Monitor Activity
1. Open **"📋 Activity"** tab
2. See all device actions with timestamps
3. Filter by "Turned ON" or "Turned OFF"
4. Know who/what triggered each action

### Share Guest Access
1. Go to **"🔗 Guest Access"** tab
2. Select duration (1 hr to 3 days)
3. Generate link → Copy token
4. Share with guest — Access auto-expires

---

## 🎨 Design Highlights

- **Color Scheme:** Navy (#080c14) background with cyan (#3b82f6) accents
- **Device Icons:** SVG animations that respond to device state
- **Responsive Grid:** Auto-fills device cards based on screen size
- **Energy Warnings:** Red alert when total consumption exceeds 1000W
- **Smooth Animations:** 0.3s transitions on all interactions
- **Accessibility:** Clear contrast ratios, readable fonts

---

## 📁 Project Structure

```
homeiq/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # PostgreSQL connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   └── routers/
│       ├── auth.py          # Login/register
│       ├── rooms.py         # Room CRUD
│       ├── devices.py       # Device control
│       ├── schedules.py     # Auto-scheduler
│       ├── logs.py          # Activity logs
│       └── guests.py        # Guest access
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx         # React entry point
│   │   ├── App.jsx          # Root component
│   │   ├── api.js           # Axios API client
│   │   ├── index.css        # Global styles
│   │   └── pages/
│   │       ├── Login.jsx    # Auth page
│   │       ├── Dashboard.jsx# Main dashboard
│   │       ├── Logs.jsx     # Activity feed
│   │       ├── Scheduler.jsx# Auto-scheduler
│   │       └── Guest.jsx    # Guest access
│   ├── package.json
│   └── vite.config.js
│
└── README.md                # This file
```

---

## 🔐 Security Features

- **Password Hashing** — SHA256 with salt
- **JWT Authentication** — 24-hour token expiry
- **CORS Enabled** — Secure cross-origin requests
- **Input Validation** — Pydantic models validate all inputs
- **Role-Based Access** — Owner vs Guest permissions
- **Time-Limited Guest Tokens** — Auto-expire after set duration

---

## 🚧 Future Enhancements

- [ ] Real IoT device integration (MQTT protocol)
- [ ] AI energy predictions and recommendations
- [ ] Mobile app (React Native)
- [ ] Multi-user household support
- [ ] Device scene creation (e.g., "Movie Mode")
- [ ] Power usage history and analytics
- [ ] Smart notifications and alerts
- [ ] Geolocation-based automation

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 About This Project

**HomeIQ** is a full-stack portfolio project demonstrating:
- Modern React with Hooks and state management
- FastAPI backend with SQLAlchemy ORM
- PostgreSQL database design
- Real-time WebSocket-like updates
- Web Speech API integration
- Responsive UI/UX design
- Railway deployment
- RESTful API design

Built with ❤️ as a smart home automation solution for a better living experience.

---

## 📞 Support

For issues, questions, or feature requests:
1. Check existing GitHub issues
2. Review API docs: [https://supportive-clarity-production-1d0d.up.railway.app/docs](https://supportive-clarity-production-1d0d.up.railway.app/docs)
3. Create new issue with detailed description

---

**Last Updated:** May 2026

**Version:** 2.0.0 (Production Ready)

**Status:** ✅ Fully Deployed & Operational
