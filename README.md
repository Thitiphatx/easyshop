# ⛏️ EasyShop - Minecraft Webshop

**EasyShop** คือระบบร้านค้าเว็บช็อปสำหรับเซิร์ฟเวอร์ Minecraft ที่ออกแบบด้วยธีม Minecraft Pixel/Retro Style สวยงาม ทันสมัย รองรับการจัดการแบบเครือข่าย Multi-Network Server

---

## 📸 ภาพตัวอย่างระบบ (Previews)

### 🏠 หน้าร้านค้าและหน้าแรก (Storefront)
| หน้าแรก (Home) | หน้าร้านค้า (Shop) |
| :---: | :---: |
| ![Home](./previews/home.png) | ![Shop](./previews/shop.png) |

### 💳 ระบบเติมเงิน (Topup)
![Topup](./previews/truewallet.png)

### 🛠️ ระบบหลังบ้านแอดมิน (Admin Backoffice)
| แดชบอร์ดและสถิติ (Dashboard) | จัดการเซิร์ฟเวอร์และสินค้า (Servers & Items) |
| :---: | :---: |
| ![Backoffice Dashboard](./previews/backoffice-1.png) | ![Backoffice Settings](./previews/backoffice-2.png) |
| **จัดการผู้เล่นและแต้ม (Users)** | **ประวัติและตั้งค่าระบบ (History & Settings)** |
| ![Backoffice Users](./previews/backoffice-3.png) | ![Backoffice History](./previews/backoffice-4.png) |

---

## ✨ Features (คุณสมบัติเด่น)

- 🎨 **Minecraft Style Design**: UI/UX ตกแต่งสไตล์ Minecraft พร้อมไอคอนแบบพิกเซล (Pixel Art Icons) และธีมสีที่เข้ากับบรรยากาศของเกมอย่างลงตัว
- 🌐 **Multi-Network Server Support**: รองรับการจัดการหลายเซิร์ฟเวอร์ภายในเน็ตเวิร์กเดียว สั่งรันคำสั่ง RCON แยกตามแต่ละเซิร์ฟเวอร์เมื่อผู้เล่นซื้อสินค้า
- 🔐 **AuthMe Integration**: ระบบล็อกอินเชื่อมต่อกับฐานข้อมูลของปลั๊กอิน `AuthMe` โดยตรง รองรับการตรวจสอบรหัสผ่านอย่างปลอดภัย
- 💎 **PlayerPoints Integration**: ซิงค์แต้ม/พอยท์กับปลั๊กอิน `PlayerPoints` เพื่อใช้แต้มในการซื้อไอเทม
- 💸 **Payment Gateways (ระบบเติมเงินอัตโนมัติ)**:
  - **TrueMoney Wallet**: เติมเงินผ่านซองของขวัญ (Voucher) อัตโนมัติ ตรวจสอบยอดและเติมพอยท์ทันที
  - **ธนาคาร (Bank Transfer)**: เติมเงินผ่านการสแกนสลิป ตรวจสอบความถูกต้องและสลิปซ้ำผ่าน API ของ **EasySlip**
  - **Point Multiplier**: ระบบตั้งค่าตัวคูณแต้มตามช่วงเวลาโปรโมชั่น
- 🏆 **Ranking Leaderboard**: แสดงอันดับยอดการเติมเงินของผู้เล่นแบบเรียลไทม์
- ⚙️ **Admin Backoffice (ระบบจัดการหลังบ้าน)**:
  - **Dashboard**: แสดงสรุปยอดขาย สถิติการเติมเงิน รายได้ และกราฟสรุปภาพรวม
  - **Server Management**: เพิ่ม/แก้ไข/ลบเซิร์ฟเวอร์ พร้อมกำหนดการเชื่อมต่อ RCON (Host, Port, Password)
  - **Item Management**: จัดการสินค้า หมวดหมู่ ราคา และคำสั่ง (Command) ที่จะรันในเซิร์ฟเวอร์
  - **User Management**: ค้นหาผู้เล่น ปรับยอดแต้ม และกำหนดสิทธิ์แอดมิน
  - **Transaction & Topup Logs**: ตรวจสอบประวัติการซื้อสินค้าและการเติมเงินย้อนหลัง
  - **Image Manager & Banners**: จัดการรูปภาพในระบบและแบนเนอร์ประชาสัมพันธ์
  - **System Settings**: ตั้งค่าชื่อเว็บ, คำอธิบาย, ข้อมูลเซิร์ฟเวอร์, API Key EasySlip และเบอร์ TrueWallet

---

## 🗃️ Database (โครงสร้างฐานข้อมูล)

ระบบใช้ **Prisma ORM** เชื่อมต่อกับ **PostgreSQL** โดยแชร์ข้อมูลร่วมกับปลั๊กอิน Minecraft:

| Model / Table | หน้าที่และการทำงาน |
| :--- | :--- |
| `authme` | ตารางข้อมูลผู้เล่น เชื่อมโยงกับปลั๊กอิน **AuthMe** (username, password hash, email, isAdmin, uuid) |
| `playerpoints_points` | ตารางเก็บแต้มพอยท์ของผู้เล่น เชื่อมโยงกับปลั๊กอิน **PlayerPoints** ผ่าน `uuid` |
| `server` | รายการเซิร์ฟเวอร์ในเครือข่าย พร้อมข้อมูลการเชื่อมต่อ RCON (`rconHost`, `rconPort`, `rconPassword`) |
| `item` | ข้อมูลสินค้าในร้านค้า (ชื่อ, คำอธิบาย, รูปภาพ, ราคา, หมวดหมู่, และคำสั่ง RCON `command`) |
| `transaction` | ประวัติการซื้อสินค้า บันทึกผู้ซื้อ, สินค้า, เซิร์ฟเวอร์, ราคา และคำสั่งที่รัน |
| `topup` | ประวัติการเติมเงิน บันทึกผู้ใช้, จำนวนเงิน, แต้มที่ได้, ช่องทาง (`TRUEWALLET` / `BANK`), และสถานะ |
| `setting` | ตั้งค่าหลักของเว็บไซต์ (ชื่อเว็บ, ข้อมูลเซิร์ฟเวอร์, อัตราคูณแต้ม, EasySlip API Key, เบอร์ TrueWallet) |
| `banner` | จัดการภาพแบนเนอร์ประชาสัมพันธ์และลิงก์ปลายทาง |

---

## 📁 Structure (โครงสร้างโปรเจกต์)

```text
easyshop/
├── app/
│   ├── (main)/
│   │   ├── (home)/              # หน้าแรก (Home)
│   │   ├── ranking/             # หน้าจัดอันดับยอดการเติมเงิน (Leaderboard)
│   │   ├── shop/                # หน้าร้านค้า เลือกสินค้าตามเซิร์ฟเวอร์
│   │   ├── topup/               # หน้าเติมเงิน TrueMoney Wallet & สแกนสลิป
│   │   ├── user/                # หน้าข้อมูลส่วนตัวและประวัติของผู้เล่น
│   │   └── webshop/             # ระบบหลังบ้านแอดมิน (Admin Backoffice)
│   │       ├── dashboard/       # แดชบอร์ดสรุปสถิติและรายได้
│   │       ├── images/          # จัดการไฟล์รูปภาพ
│   │       ├── purchase-history/# ตรวจสอบประวัติการซื้อไอเทม
│   │       ├── setting/         # ตั้งค่าเว็บไซต์และการเชื่อมต่อ
│   │       ├── topup/           # ประวัติและสถานะการเติมเงิน
│   │       └── users/           # จัดการผู้ใช้และแต้ม
│   ├── actions/                 # Server Actions (Business Logic, Auth, RCON, Payment)
│   ├── contexts/                # React Contexts (User, Theme, State)
│   ├── setup/                   # หน้าติดตั้งระบบเริ่มต้น (Setup Wizard)
│   └── globals.css              # สไตล์หลัก ธีม Minecraft และ Tailwind CSS
├── components/                  # UI Components (Button, Modal, Card, Table, Navbar ฯลฯ)
├── constants/                   # ค่าคงที่ต่างๆ
├── lib/                         # ยูทิลิตี้ (Prisma Client, EasySlip, Crypto, Turnstile)
├── previews/                    # ภาพตัวอย่างหน้าจอของระบบสำหรับ README
├── prisma/
│   ├── schema.prisma            # นิยามโครงสร้างฐานข้อมูล Prisma
│   └── seed.ts                  # ข้อมูลเริ่มต้น (Seeding)
├── docker-compose.yml           # คอนฟิก Docker สำหรับ PostgreSQL Service
├── Dockerfile                   # Dockerfile สำหรับ Build & Run Webshop
├── package.json                 # การตั้งค่า Dependencies และ Scripts
└── proxy.ts                     # Reverse proxy / Networking helper
```

---

## 🚀 Getting Started (การเริ่มต้นใช้งาน)

### ข้อกำหนดเบื้องต้น (Prerequisites)
- [Node.js](https://nodejs.org/) (v20+) หรือ [Bun](https://bun.sh/) (แนะนำ)
- [PostgreSQL](https://www.postgresql.org/) (v15+) (หรือรันผ่าน Docker)
- เซิร์ฟเวอร์ Minecraft ที่เปิดใช้งาน **RCON**, ปลั๊กอิน **AuthMe** และ **PlayerPoints** (เชื่อมต่อฐานข้อมูล PostgreSQL เดียวกัน)

### 1. ติดตั้ง Dependencies
```bash
bun install
# หรือ
npm install
```

### 2. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env` หรือสร้างไฟล์ `.env` ที่ root directory:
```bash
cp .env.example .env
```

ตัวอย่างการกำหนดค่าใน `.env`:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/easyshop?schema=public"

# Docker Compose PostgreSQL config (กรณีรัน Database ผ่าน docker-compose)
POSTGRES_DATABASE="easyshop"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"

# Docker Compose Minecraft Server RCON config (กรณีรันผ่าน docker-compose)
RCON_PORT=25575
RCON_PASSWORD="minecraft"

# Authentication & Security
JWT_SECRET="your-super-secret-jwt-key"
ENCRYPT_SECRET="your-encryption-secret-key"
EASYSHOP_SETUP_KEY="your-setup-key"

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE="your-turnstile-site-key"
TURNSTILE_SECRET="your-turnstile-secret-key"

# Application URL (optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. ตั้งค่าปลั๊กอิน AuthMe ให้เชื่อมต่อกับ Database
แก้ไขไฟล์ config ของ AuthMe ให้ตรงกับฐานข้อมูลในไฟล์ `.env`:
- **หากรันเซิร์ฟเวอร์ผ่าน Docker**: แก้ไขที่ไฟล์ `minecraft_data/plugins/AuthMe/config.yml`
- **หากใช้เซิร์ฟเวอร์ภายนอก (ไม่ได้รันผ่าน Docker)**: ไปที่โฟลเดอร์เซิร์ฟเวอร์ของคุณแล้วแก้ไขไฟล์ `plugins/AuthMe/config.yml`

```yaml
DataSource:
  backend: POSTGRESQL
  caching: false
  mySQLHost: postgres-db       # หากรันผ่าน docker-compose ใช้ 'postgres-db' (หรือ 'localhost' หากรันตรง)
  mySQLPort: '5432'
  mySQLUseSSL: false
  mySQLCheckServerCertificate: false
  mySQLUsername: easyshop      # ให้ตรงกับ POSTGRES_USER ใน .env
  mySQLPassword: '1234'        # ให้ตรงกับ POSTGRES_PASSWORD ใน .env
  mySQLDatabase: easyshop      # ให้ตรงกับ POSTGRES_DATABASE ใน .env
  mySQLTablename: authme
```

### 4. รัน Service ด้วย Docker (Database & Minecraft Server)
เริ่มต้นรันฐานข้อมูล PostgreSQL และเซิร์ฟเวอร์ Minecraft:
```bash
# รัน Services ในพื้นหลัง
docker compose up -d
```

### 5. เตรียมฐานข้อมูลและ Prisma
```bash
# สร้าง Prisma Client
bunx prisma generate

# พุชสคีมาไปยังฐานข้อมูล
bunx prisma db push
```

### 6. รันระบบสำหรับการพัฒนา (Development)
```bash
bun run dev
# หรือ
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

### (เสริม) Build Image ของเว็บไซต์
```bash
docker build -t easyshop:latest .
```
