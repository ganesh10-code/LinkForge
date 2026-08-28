## Connect to MySQL container
docker exec -it mysql-db bash
mysql -u shortifyuser -p

**NOTE:** Docker-compose and .env is used if you want to run a mysql container. Also, you have to change application.properties.
**NOTE:** If you want to use Render hosted postgres, use only Dockerfile.


## INSTALL Render CLI on Linux or WSL:
```
curl -fsSL https://raw.githubusercontent.com/render-oss/cli/refs/heads/main/bin/install.sh | sh
```
```
render
```
```
render login
```
```
sudo apt install postgresql-client -y
```
```
render psql dpg-d3fq6715pdvs73bllbn0-a
```
```
 \dt;
 ```
```
 SELECT * FROM users;
 ```
```
\q
```


## API Documentation:
### **0. Health Check** — `GET`

```
http://localhost:8081/health
```

---

### **1. Register User** — `POST`

```
http://localhost:8081/api/auth/public/register
```

**Body (JSON):**

```json
{
  "username": "abhishek",
  "email": "abhishek@example.com",
  "password": "Abhi@123",
  "role": ["ROLE_USER"]
}
```

---

### **2. Login User** — `POST`

```
http://localhost:8081/api/auth/public/login
```

**Body (JSON):**

```json
{
  "username": "abhishek",
  "password": "Abhi@123"
}
```

---

### **3. Create Short URL** — `POST`

```
http://localhost:8081/api/urls/shorten
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Body (JSON):**

```json
{
  "originalUrl": "https://example.com/long-page"
}
```

---

### **4. Get User URLs** — `GET`

```
http://localhost:8081/api/urls/myurls
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

### **5. Delete Short URL** — `DELETE`

```
http://localhost:8081/api/urls/{shortUrl}
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```
---

### **6. Update Original URL** — `PUT`

```
http://localhost:8081/api/urls/{shortUrl}
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Body (JSON):**

```json
{
  "originalUrl": "https://example.com/new-long-page"
}
```

---

### **7. Get URL Analytics by Date Range** — `GET`

```
http://localhost:8081/api/urls/analytics/{shortUrl}?startDate=2025-10-01T00:00:00&endDate=2025-10-09T23:59:59
```

**Example:**

```
http://localhost:8081/api/urls/analytics/abc123?startDate=2025-10-01T00:00:00&endDate=2025-10-09T23:59:59
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

### **8. Get Total Clicks by Date Range** — `GET`

```
http://localhost:8081/api/urls/totalClicks?startDate=2025-10-01&endDate=2025-10-09
```

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

### **9. Redirect Short URL** — `GET`

```
http://localhost:8081/{shortUrl}
```

**Example:**

```
http://localhost:8081/abc123
```

**Description:**
Redirects (HTTP 302) to the original URL if found, else returns 404.



