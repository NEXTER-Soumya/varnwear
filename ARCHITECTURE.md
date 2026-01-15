# VarnWear Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  index   │  │ products │  │  admin   │  │  login   │   │
│  │  .html   │  │  .html   │  │  panel   │  │  .html   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│       └─────────────┴──────────────┴──────────────┘          │
│                          │                                    │
│                    ┌─────▼─────┐                            │
│                    │  js/api.js │  ← API Client             │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    HTTP Requests
                    (REST API)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      BACKEND                                 │
│                   ┌──────────────┐                          │
│                   │  server.js   │  ← Express Server        │
│                   └──────┬───────┘                          │
│                          │                                   │
│         ┌────────────────┼────────────────┐                │
│         │                │                │                 │
│    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐           │
│    │ Product │     │  User   │     │  Admin  │           │
│    │  Routes │     │ Routes  │     │ Routes  │           │
│    └────┬────┘     └────┬────┘     └────┬────┘           │
│         │               │               │                  │
│         └───────────────┼───────────────┘                  │
│                         │                                   │
│                   ┌─────▼─────┐                            │
│                   │ models.js │  ← Mongoose Models         │
│                   └─────┬─────┘                            │
└─────────────────────────┼────────────────────────────────┘
                          │
                    MongoDB Driver
                          │
┌─────────────────────────▼────────────────────────────────┐
│                    MONGODB DATABASE                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ products │  │  users   │  │  admins  │              │
│  │collection│  │collection│  │collection│              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                           │
│  Persistent Storage - Data survives restarts             │
└───────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼────────────────────────────────┐
│                   FILE SYSTEM                             │
│                 assets/images/                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ img1 │  │ img2 │  │ img3 │  │ img4 │                │
│  │ .jpg │  │ .jpg │  │ .jpg │  │ .jpg │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│                                                           │
│  Permanent Storage - Images survive restarts             │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Product Display Flow
```
User opens index.html
    ↓
JavaScript calls: await getAllProducts()
    ↓
api.js sends: GET /api/products
    ↓
server.js receives request
    ↓
Queries MongoDB products collection
    ↓
Returns products with image paths
    ↓
Frontend displays products with images
```

### 2. User Registration Flow
```
User fills registration form
    ↓
JavaScript calls: await registerUser(data)
    ↓
api.js sends: POST /api/users/register
    ↓
server.js receives request
    ↓
Hashes password with bcrypt
    ↓
Saves user to MongoDB users collection
    ↓
Returns success + user session
    ↓
Frontend stores session in localStorage
```

### 3. Image Upload Flow
```
Admin selects image file
    ↓
JavaScript calls: await uploadImage(file)
    ↓
api.js sends: POST /api/upload (multipart/form-data)
    ↓
server.js receives file
    ↓
Multer saves file to assets/images/
    ↓
Returns file path
    ↓
Admin saves product with image path
    ↓
Path stored in MongoDB
    ↓
Image persists permanently
```

## Component Responsibilities

### Frontend (HTML/CSS/JS)
- User interface
- Form handling
- Display logic
- Session management (localStorage)

### API Client (js/api.js)
- HTTP request handling
- Data transformation
- Error handling
- Maintains compatibility with old code

### Backend (server.js)
- Request routing
- Business logic
- Authentication
- File upload handling
- Database operations

### Database (MongoDB)
- Data persistence
- Query optimization
- Data integrity
- Backup/restore

### File System
- Image storage
- Static file serving
- Permanent storage

## Key Features

### Persistence
```
Before: localStorage → Cleared on restart ❌
After:  MongoDB → Survives restart ✅
```

### Images
```
Before: base64 in localStorage → Lost on restart ❌
After:  Files in assets/images/ → Permanent ✅
```

### Scalability
```
Before: Single browser, limited storage ❌
After:  Multi-user, unlimited storage ✅
```

### Security
```
Before: Plain text passwords ❌
After:  Bcrypt hashed passwords ✅
```
