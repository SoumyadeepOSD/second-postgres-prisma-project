# Project Overview

## Sections

### 1. User Authentication/CRUD
- **Signup**: \[x]\
- **Login**: \[x]\
- **Forgot-password**: \[ ]\
- **Fetch All Users from DB**: \[x]\
- **Additional Token Implementation**: Refresh/Access tokens are implemented for secure authentication flow.

### 2. Todo CRUD
- **Create**: \[x]\
- **Read Todo of Logged-in User**: \[x]\
- **Update**: \[x]\
- **Delete**: \[x]\
- **Fetch All Todos of All Users**: \[x]\

---

## Database Schema

### **User Table**
| Column         | Type     | Constraints                     |
|----------------|----------|----------------------------------|
| id             | Int      | Primary Key, Auto-increment     |
| first_name     | String   | Required                        |
| last_name      | String   | Required                        |
| email          | String   | Unique, Required                |
| password       | String   | Required                        |
| accessToken    | String   | Optional                        |
| refreshToken   | String   | Optional                        |

### **Todo Table**
| Column         | Type     | Constraints                     |
|----------------|----------|----------------------------------|
| id             | Int      | Primary Key, Auto-increment     |
| title          | String   | Required                        |
| description    | String   | Required                        |
| status         | String   | Required                        |
| userId         | Int      | Foreign Key (references User)   |

