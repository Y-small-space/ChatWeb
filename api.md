# API 接口定义

## **通用错误响应格式**

```json
{
  "code": number,  // HTTP 状态码
  "message": "错误描述",
  "error": "详细错误信息"
}
```

### 常见错误码

- 400: 请求参数错误
- 401: 未授权或 token 无效
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

---

## **1. 认证相关接口**

### 1.1 注册用户

**路径**: `POST /api/v1/register`  
**描述**: 用户注册

#### 请求体

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string" // 可选
}
```

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "string",
    "username": "string",
    "email": "string",
    "phone": "string",
    "created_at": "string"
  }
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "错误信息",
  "error": "具体错误原因"
}
```

### 1.2 用户登录

**路径**: `POST /api/v1/login`  
**描述**: 用户登录

#### 请求体

```json
{
  "email": "string",
  "password": "string"
}
```

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string",
    "user": {
      "user_id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

#### 错误响应

```json
{
  "code": 401,
  "message": "登录失败",
  "error": "邮箱或密码错误"
}
```

---

## **2. 用户相关接口**

### 2.1 获取用户资料

**路径**: `GET /api/v1/user/profile`  
**描述**: 获取当前用户资料  
**请求头**:

- Authorization: Bearer `{token}`

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "string",
    "username": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### 2.2 更新用户资料

**路径**: `PUT /api/v1/user/profile`  
**描述**: 更新用户资料  
**请求头**:

- Authorization: Bearer `{token}`

#### 请求体

```json
{
  "username": "string",
  "avatar": "string",
  "phone": "string"
}
```

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user_id": "string",
    "username": "string",
    "avatar": "string",
    "phone": "string",
    "updated_at": "string"
  }
}
```

---

## **3. 聊天相关接口**

### 3.1 WebSocket 连接

**路径**: `GET /api/v1/ws`  
**描述**: 建立 WebSocket 连接  
**请求头**:

- Authorization: Bearer `{token}`
- Connection: Upgrade
- Upgrade: websocket

---

### 3.2 发送消息

**路径**: `POST /api/v1/chat/message`  
**描述**: 发送聊天消息  
**请求头**:

- Authorization: Bearer `{token}`

#### 请求体

```json
{
  "type": "text|image|file",
  "content": "string",
  "receiver_id": "string", // 私聊时使用
  "group_id": "string" // 群聊时使用
}
```

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "message_id": "string",
    "type": "string",
    "content": "string",
    "sender_id": "string",
    "receiver_id": "string",
    "group_id": "string",
    "created_at": "string"
  }
}
```

---

### 3.3 获取消息列表

**路径**: `GET /api/v1/chat/messages`  
**描述**: 获取聊天记录  
**请求头**:

- Authorization: Bearer `{token}`

#### 查询参数

- receiver_id: string (私聊)
- group_id: string (群聊)
- limit: number (默认 20)
- offset: number (默认 0)

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "messages": [
      {
        "message_id": "string",
        "type": "string",
        "content": "string",
        "sender_id": "string",
        "receiver_id": "string",
        "group_id": "string",
        "created_at": "string",
        "read_by": [
          {
            "user_id": "string",
            "read_at": "string"
          }
        ]
      }
    ],
    "total": number
  }
}
```

---

## **4. 群组相关接口**

### 4.1 创建群组

**路径**: `POST /api/v1/group`  
**描述**: 创建新群组  
**请求头**:

- Authorization: Bearer `{token}`

#### 请求体

```json
{
  "name": "string",
  "description": "string",
  "avatar": "string" // 可选
}
```

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "group_id": "string",
    "name": "string",
    "description": "string",
    "avatar": "string",
    "creator_id": "string",
    "created_at": "string"
  }
}
```
