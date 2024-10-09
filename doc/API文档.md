# API 文档
## 目录

- [认证与授权](#认证与授权)
- [用户 API](#用户-api)
  - [微信小程序登录](#微信小程序登录)
  - [获取所有用户](#获取所有用户)
  - [获取单个用户信息](#获取单个用户信息)
  - [更新用户信息](#更新用户信息)
  - [删除用户](#删除用户)
- [商品 API](#商品-api)
  - [创建新商品](#创建新商品)
  - [获取所有商品](#获取所有商品)
  - [获取单个商品](#获取单个商品)
  - [更新商品信息](#更新商品信息)
  - [删除商品](#删除商品)
- [商品分类 API](#商品分类-api)
  - [创建商品分类](#创建商品分类)
  - [获取所有商品分类](#获取所有商品分类)
  - [获取单个商品分类](#获取单个商品分类)
  - [更新商品分类](#更新商品分类)
  - [删除商品分类](#删除商品分类)
- [订单 API](#订单-api)
  - [创建新订单](#创建新订单)
  - [获取所有订单](#获取所有订单)
  - [获取单个订单](#获取单个订单)
  - [更新订单](#更新订单)
  - [删除订单](#删除订单)
- [会员卡 API](#会员卡-api)
  - [创建会员卡](#创建会员卡)
  - [获取所有会员卡](#获取所有会员卡)
  - [获取单个会员卡](#获取单个会员卡)
  - [更新会员卡信息](#更新会员卡信息)
  - [删除会员卡](#删除会员卡)
  - [创建会员交易记录](#创建会员交易记录)
- [支付 API](#支付-api)
  - [发起微信支付](#发起微信支付)
  - [微信支付结果通知回调](#微信支付结果通知回调)
- [错误处理](#错误处理)
- [请求示例](#请求示例)
- [备注](#备注)

---

## 认证与授权

- **认证中间件**：`authenticateToken`，用于验证 JWT 令牌，确保用户已登录。
- **授权中间件**：`authorize(permission_level)`，用于验证用户的权限等级。
  - `0`：普通用户
  - `1`：管理员

---

## 用户 API

### 微信小程序登录

- **URL**：`POST /weixin-login`
- **描述**：使用微信小程序的 `code` 进行登录，获取用户信息并生成 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "code": "微信登录凭证code"
    }
    ```

- **响应示例**：

  - **成功**：

    ```json
    {
      "token": "JWT令牌",
      "user": {
        "user_id": 1,
        "openid": "微信OpenID",
        "nickname": "用户昵称",
        "avatar_url": null,
        "gender": null,
        "phone": null,
        "email": null,
        "permission_level": 0,
        "created_at": "2023-09-15T08:00:00.000Z",
        "updated_at": "2023-09-15T08:00:00.000Z"
      }
    }
    ```

  - **失败**：

    ```json
    {
      "message": "错误信息"
    }
    ```

### 获取所有用户

- **URL**：`GET /api/users`
- **描述**：获取所有用户的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：无
- **响应示例**：

  ```json
  [
    {
      "user_id": 1,
      "openid": "微信OpenID",
      "nickname": "用户昵称",
      "avatar_url": null,
      "gender": null,
      "phone": null,
      "email": null,
      "permission_level": 0,
      "created_at": "2023-09-15T08:00:00.000Z",
      "updated_at": "2023-09-15T08:00:00.000Z"
    },
    {
      "user_id": 2,
      "openid": "微信OpenID",
      "nickname": "用户昵称",
      "avatar_url": null,
      "gender": null,
      "phone": null,
      "email": null,
      "permission_level": 0,
      "created_at": "2023-09-16T08:00:00.000Z",
      "updated_at": "2023-09-16T08:00:00.000Z"
    }
  ]
  ```

### 获取单个用户信息

- **URL**：`GET /api/users/:id`
- **描述**：根据用户 ID 获取用户详细信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：用户的唯一标识符。

- **响应示例**：

  ```json
  {
    "user_id": 1,
    "openid": "微信OpenID",
    "nickname": "用户昵称",
    "avatar_url": null,
    "gender": null,
    "phone": null,
    "email": null,
    "permission_level": 0,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 更新用户信息

- **URL**：`PUT /api/users/:id`
- **描述**：更新指定用户的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：用户的唯一标识符。

  - **Body**（JSON，可选字段）：

    ```json
    {
      "nickname": "新的昵称",
      "email": "新的邮箱",
      "phone": "新的电话号码",
      "password": "新的密码",
      "permission_level": 1
    }
    ```

- **响应示例**：

  ```json
  {
    "message": "用户信息更新成功"
  }
  ```

### 删除用户

- **URL**：`DELETE /api/users/:id`
- **描述**：删除指定用户。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：用户的唯一标识符。

- **响应**：

  - **成功**：HTTP 状态码 `204 No Content`，无响应内容。

---

## 商品 API

### 创建新商品

- **URL**：`POST /api/products`
- **描述**：创建新的商品。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "category_id": 1,
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "stock": 100,
      "image_url": "http://example.com/image.jpg",
      "status": 1
    }
    ```

- **响应示例**：

  ```json
  {
    "product_id": 1,
    "category_id": 1,
    "name": "商品名称",
    "description": "商品描述",
    "price": 99.99,
    "stock": 100,
    "image_url": "http://example.com/image.jpg",
    "status": 1,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 获取所有商品

- **URL**：`GET /api/products`
- **描述**：获取商品列表。
- **权限**：公开访问。
- **请求参数**：无
- **响应示例**：

  ```json
  [
    {
      "product_id": 1,
      "category_id": 1,
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "stock": 100,
      "image_url": "http://example.com/image.jpg",
      "status": 1,
      "created_at": "2023-09-15T08:00:00.000Z",
      "updated_at": "2023-09-15T08:00:00.000Z",
      "category": {
        "category_id": 1,
        "name": "分类名称",
        "description": "分类描述"
      }
    }
  ]
  ```

### 获取单个商品

- **URL**：`GET /api/products/:id`
- **描述**：获取指定商品的详细信息。
- **权限**：公开访问。
- **请求参数**：

  - **路径参数**：

    - `id`：商品的唯一标识符。

- **响应示例**：

  ```json
  {
    "product_id": 1,
    "category_id": 1,
    "name": "商品名称",
    "description": "商品描述",
    "price": 99.99,
    "stock": 100,
    "image_url": "http://example.com/image.jpg",
    "status": 1,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z",
    "category": {
      "category_id": 1,
      "name": "分类名称",
      "description": "分类描述"
    }
  }
  ```

### 更新商品信息

- **URL**：`PUT /api/products/:id`
- **描述**：更新指定商品的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：商品的唯一标识符。

  - **Body**（JSON，可选字段）：

    ```json
    {
      "name": "新的商品名称",
      "price": 89.99,
      "stock": 150
    }
    ```

- **响应示例**：

  ```json
  {
    "product_id": 1,
    "category_id": 1,
    "name": "新的商品名称",
    "description": "商品描述",
    "price": 89.99,
    "stock": 150,
    "image_url": "http://example.com/image.jpg",
    "status": 1,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z"
  }
  ```

### 删除商品

- **URL**：`DELETE /api/products/:id`
- **描述**：删除指定商品。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：商品的唯一标识符。

- **响应**：

  - **成功**：HTTP 状态码 `204 No Content`，无响应内容。

---

## 商品分类 API

### 创建商品分类

- **URL**：`POST /api/categories`
- **描述**：创建新的商品分类。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "name": "分类名称",
      "description": "分类描述",
      "parent_id": null
    }
    ```

- **响应示例**：

  ```json
  {
    "category_id": 1,
    "name": "分类名称",
    "description": "分类描述",
    "parent_id": null,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 获取所有商品分类

- **URL**：`GET /api/categories`
- **描述**：获取商品分类列表。
- **权限**：公开访问。
- **请求参数**：无
- **响应示例**：

  ```json
  [
    {
      "category_id": 1,
      "name": "分类名称",
      "description": "分类描述",
      "parent_id": null,
      "created_at": "2023-09-15T08:00:00.000Z",
      "updated_at": "2023-09-15T08:00:00.000Z"
    }
  ]
  ```

### 获取单个商品分类

- **URL**：`GET /api/categories/:id`
- **描述**：获取指定商品分类的详细信息。
- **权限**：公开访问。
- **请求参数**：

  - **路径参数**：

    - `id`：商品分类的唯一标识符。

- **响应示例**：

  ```json
  {
    "category_id": 1,
    "name": "分类名称",
    "description": "分类描述",
    "parent_id": null,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 更新商品分类

- **URL**：`PUT /api/categories/:id`
- **描述**：更新指定商品分类的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：商品分类的唯一标识符。

  - **Body**（JSON，可选字段）：

    ```json
    {
      "name": "新的分类名称",
      "description": "新的分类描述"
    }
    ```

- **响应示例**：

  ```json
  {
    "category_id": 1,
    "name": "新的分类名称",
    "description": "新的分类描述",
    "parent_id": null,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z"
  }
  ```

### 删除商品分类

- **URL**：`DELETE /api/categories/:id`
- **描述**：删除指定商品分类。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：商品分类的唯一标识符。

- **响应**：

  - **成功**：HTTP 状态码 `204 No Content`，无响应内容。

---

## 订单 API

### 创建新订单

- **URL**：`POST /api/orders`
- **描述**：创建新的订单。
- **权限**：已登录用户（任意 `permission_level`）。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "items": [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 1
        }
      ],
      "payment_method": "微信支付"
    }
    ```

- **响应示例**：

  ```json
  {
    "order_id": "ORDER1234567890",
    "user_id": 1,
    "total_amount": "299.97",
    "status": 0,
    "payment_method": "微信支付",
    "payment_id": null,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 获取所有订单

- **URL**：`GET /api/orders`
- **描述**：获取订单列表。
- **权限**：已登录用户。
  - **管理员**：获取所有订单。
  - **普通用户**：获取自己的订单。
- **认证**：需要 JWT 令牌。
- **请求参数**：无
- **响应示例**：

  ```json
  [
    {
      "order_id": "ORDER1234567890",
      "user_id": 1,
      "total_amount": "299.97",
      "status": 0,
      "payment_method": "微信支付",
      "payment_id": null,
      "created_at": "2023-09-15T08:00:00.000Z",
      "updated_at": "2023-09-15T08:00:00.000Z",
      "user": {
        "user_id": 1,
        "nickname": "用户昵称",
        "email": null
      },
      "orderItems": [
        {
          "order_item_id": 1,
          "order_id": "ORDER1234567890",
          "product_id": 1,
          "quantity": 2,
          "unit_price": "99.99",
          "total_price": "199.98",
          "product": {
            "product_id": 1,
            "name": "商品名称",
            "price": 99.99
          }
        },
        {
          "order_item_id": 2,
          "order_id": "ORDER1234567890",
          "product_id": 2,
          "quantity": 1,
          "unit_price": "99.99",
          "total_price": "99.99",
          "product": {
            "product_id": 2,
            "name": "商品名称2",
            "price": 99.99
          }
        }
      ]
    }
  ]
  ```

### 获取单个订单

- **URL**：`GET /api/orders/:id`
- **描述**：获取指定订单的详细信息。
- **权限**：已登录用户。
  - **管理员**：可访问所有订单。
  - **普通用户**：只能访问自己的订单。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：订单的唯一标识符。

- **响应示例**：

  ```json
  {
    "order_id": "ORDER1234567890",
    "user_id": 1,
    "total_amount": "299.97",
    "status": 0,
    "payment_method": "微信支付",
    "payment_id": null,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z",
    "user": {
      "user_id": 1,
      "nickname": "用户昵称",
      "email": null
    },
    "orderItems": [
      {
        "order_item_id": 1,
        "order_id": "ORDER1234567890",
        "product_id": 1,
        "quantity": 2,
        "unit_price": "99.99",
        "total_price": "199.98",
        "product": {
          "product_id": 1,
          "name": "商品名称",
          "price": 99.99
        }
      },
      {
        "order_item_id": 2,
        "order_id": "ORDER1234567890",
        "product_id": 2,
        "quantity": 1,
        "unit_price": "99.99",
        "total_price": "99.99",
        "product": {
          "product_id": 2,
          "name": "商品名称2",
          "price": 99.99
        }
      }
    ]
  }
  ```

### 更新订单

- **URL**：`PUT /api/orders/:id`
- **描述**：更新指定订单的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：订单的唯一标识符。

  - **Body**（JSON，可选字段）：

    ```json
    {
      "status": 1,
      "payment_method": "支付宝",
      "payment_id": "新交易号"
    }
    ```

- **响应示例**：

  ```json
  {
    "order_id": "ORDER1234567890",
    "user_id": 1,
    "total_amount": "299.97",
    "status": 1,
    "payment_method": "支付宝",
    "payment_id": "新交易号",
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z"
  }
  ```

### 删除订单

- **URL**：`DELETE /api/orders/:id`
- **描述**：删除指定订单。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：订单的唯一标识符。

- **响应**：

  - **成功**：HTTP 状态码 `204 No Content`，无响应内容。

---

## 会员卡 API

### 创建会员卡

- **URL**：`POST /api/membership/cards`
- **描述**：为指定用户创建会员卡。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "user_id": 1
    }
    ```

- **响应示例**：

  ```json
  {
    "card_id": 1,
    "user_id": 1,
    "card_number": "生成的卡号",
    "balance": "0.00",
    "status": 1,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-15T08:00:00.000Z"
  }
  ```

### 获取所有会员卡

- **URL**：`GET /api/membership/cards`
- **描述**：获取会员卡列表。
- **权限**：已登录用户。
  - **管理员**：获取所有会员卡。
  - **普通用户**：获取自己的会员卡。
- **认证**：需要 JWT 令牌。
- **请求参数**：无
- **响应示例**：

  ```json
  [
    {
      "card_id": 1,
      "user_id": 1,
      "card_number": "生成的卡号",
      "balance": "100.00",
      "status": 1,
      "created_at": "2023-09-15T08:00:00.000Z",
      "updated_at": "2023-09-16T08:00:00.000Z",
      "user": {
        "user_id": 1,
        "nickname": "用户昵称",
        "email": null,
        "phone": null
      }
    }
  ]
  ```

### 获取单个会员卡

- **URL**：`GET /api/membership/cards/:id`
- **描述**：获取指定会员卡的详细信息。
- **权限**：已登录用户。
  - **管理员**：可访问所有会员卡。
  - **普通用户**：只能访问自己的会员卡。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：会员卡的唯一标识符。

- **响应示例**：

  ```json
  {
    "card_id": 1,
    "user_id": 1,
    "card_number": "生成的卡号",
    "balance": "100.00",
    "status": 1,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z",
    "user": {
      "user_id": 1,
      "nickname": "用户昵称",
      "email": null,
      "phone": null
    }
  }
  ```

### 更新会员卡信息

- **URL**：`PUT /api/membership/cards/:id`
- **描述**：更新指定会员卡的信息。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：会员卡的唯一标识符。

  - **Body**（JSON，可选字段）：

    ```json
    {
      "balance": "200.00",
      "status": 0
    }
    ```

- **响应示例**：

  ```json
  {
    "card_id": 1,
    "user_id": 1,
    "card_number": "生成的卡号",
    "balance": "200.00",
    "status": 0,
    "created_at": "2023-09-15T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z"
  }
  ```

### 删除会员卡

- **URL**：`DELETE /api/membership/cards/:id`
- **描述**：删除指定会员卡。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **路径参数**：

    - `id`：会员卡的唯一标识符。

- **响应**：

  - **成功**：HTTP 状态码 `204 No Content`，无响应内容。

### 创建会员交易记录

- **URL**：`POST /api/membership/transactions`
- **描述**：为会员卡创建交易记录。
- **权限**：仅管理员（`permission_level >= 1`）可访问。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "card_id": 1,
      "type": 1,
      "amount": "50.00",
      "description": "充值50元"
    }
    ```

- **响应示例**：

  ```json
  {
    "transaction_id": 1,
    "card_id": 1,
    "type": 1,
    "amount": "50.00",
    "balance_after": "150.00",
    "description": "充值50元",
    "created_at": "2023-09-16T08:00:00.000Z",
    "updated_at": "2023-09-16T08:00:00.000Z"
  }
  ```

---

## 支付 API

### 发起微信支付

- **URL**：`POST /api/payment/wxpay`
- **描述**：发起微信支付，生成支付参数供前端调用微信支付。
- **权限**：已登录用户（任意 `permission_level`）。
- **认证**：需要 JWT 令牌。
- **请求参数**：

  - **Body**（JSON）：

    ```json
    {
      "order_id": "ORDER1234567890"
    }
    ```

- **响应示例**：

  ```json
  {
    "timeStamp": "1694764800",
    "nonceStr": "随机字符串",
    "package": "prepay_id=wx201410272009395522657a690389285100",
    "signType": "RSA",
    "paySign": "签名字符串"
  }
  ```

### 微信支付结果通知回调

- **URL**：`POST /api/payment/wxpay/notify`
- **描述**：微信支付结果的异步通知接口，由微信服务器调用。
- **权限**：公开访问。
- **请求参数**：

  - **Headers**：

    - `Wechatpay-Signature`：微信支付签名。
    - `Wechatpay-Timestamp`：时间戳。
    - `Wechatpay-Nonce`：随机数。
    - `Wechatpay-Serial`：证书序列号。

  - **Body**（JSON）：

    ```json
    {
      "id": "通知的唯一标识",
      "create_time": "通知的创建时间",
      "event_type": "RESOURCE.SUCCESS",
      "resource_type": "encrypt-resource",
      "resource": {
        "algorithm": "AEAD_AES_256_GCM",
        "ciphertext": "密文",
        "nonce": "随机串",
        "associated_data": "附加数据",
        "original_type": "transaction"
      },
      "summary": "支付成功"
    }
    ```

- **响应**：

  - **成功**：

    ```json
    {
      "code": "SUCCESS",
      "message": "成功"
    }
    ```

  - **失败**：

    ```json
    {
      "code": "FAIL",
      "message": "失败原因"
    }
    ```

- **注意事项**：

  - **签名验证**：服务器需要验证微信支付通知的签名，确保通知的真实性。
  - **资源解密**：需要使用 `WECHAT_API_V3_KEY` 对通知中的 `resource` 进行解密，获取交易信息。

---

## 错误处理

- **400 Bad Request**：请求参数有误或验证失败。
- **401 Unauthorized**：未提供有效的认证信息或签名验证失败。
- **403 Forbidden**：权限不足，无法访问资源。
- **404 Not Found**：请求的资源不存在。
- **500 Internal Server Error**：服务器内部错误。

---

## 请求示例

### 发起微信支付示例

**请求**：

```http
POST /api/payment/wxpay
Content-Type: application/json
Authorization: Bearer <JWT令牌>

{
  "order_id": "ORDER1234567890"
}
```

**响应**：

```json
{
  "timeStamp": "1694764800",
  "nonceStr": "随机字符串",
  "package": "prepay_id=wx201410272009395522657a690389285100",
  "signType": "RSA",
  "paySign": "签名字符串"
}
```

---

## 备注

- 所有日期时间均为 ISO 8601 格式。
- 金额均为字符串格式，保留两位小数。
- 在请求时，请确保在请求头中包含必要的认证信息，如 JWT 令牌。
- **安全性**：在处理微信支付回调通知时，务必验证签名并正确解密资源，以确保交易的安全性。
- **环境变量配置**：在使用支付接口前，请确保已正确配置微信支付相关的环境变量，如 `WECHAT_APPID`、`WECHAT_MCHID`、`WECHAT_API_V3_KEY` 等。
