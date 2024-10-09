-- 创建数据库
CREATE DATABASE IF NOT EXISTS miaohesystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE miaohesystem;

-- 用户信息表
CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(64) NOT NULL UNIQUE COMMENT '微信用户OpenID',
    nickname VARCHAR(50) NOT NULL COMMENT '用户昵称',
    avatar_url VARCHAR(255) DEFAULT NULL COMMENT '用户头像URL',
    gender TINYINT DEFAULT NULL COMMENT '性别 (1=男, 2=女, 0=未知)',
    phone VARCHAR(20) DEFAULT NULL UNIQUE COMMENT '联系电话',
    email VARCHAR(100) DEFAULT NULL UNIQUE COMMENT '电子邮箱',
    password VARCHAR(255) DEFAULT NULL COMMENT '用户密码',
    permission_level TINYINT NOT NULL DEFAULT 0 COMMENT '权限等级 (0=普通用户, 1=管理员)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- 商品分类表
CREATE TABLE product_categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT DEFAULT NULL COMMENT '分类描述',
    parent_id BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (parent_id) REFERENCES product_categories(category_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 商品表
CREATE TABLE products (
    product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
    name VARCHAR(150) NOT NULL COMMENT '商品名称',
    description TEXT DEFAULT NULL COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    stock INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '库存数量',
    image_url VARCHAR(255) DEFAULT NULL COMMENT '商品图片URL',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '商品状态 (1=上架, 0=下架)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 订单表
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY COMMENT '订单ID，由用户ID和时间戳组成',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态 (0=待支付,1=已支付,2=已发货,3=已完成,4=已取消)',
    payment_method VARCHAR(50) DEFAULT NULL COMMENT '支付方式',
    payment_id VARCHAR(100) DEFAULT NULL COMMENT '支付交易号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单商品表
CREATE TABLE order_items (
    order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL COMMENT '订单ID',
    product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '购买数量',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '商品单价',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';


-- 会员储值卡表
CREATE TABLE membership_cards (
    card_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE COMMENT '用户ID',
    card_number VARCHAR(50) NOT NULL UNIQUE COMMENT '卡号',
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '余额',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '卡状态 (1=有效,0=无效)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员储值卡表';

-- 会员储值记录表
CREATE TABLE membership_transactions (
    transaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT UNSIGNED NOT NULL COMMENT '卡ID',
    type TINYINT NOT NULL COMMENT '交易类型 (1=充值, 2=消费, 3=退款)',
    amount DECIMAL(10,2) NOT NULL COMMENT '交易金额',
    balance_after DECIMAL(10,2) NOT NULL COMMENT '交易后余额',
    description VARCHAR(255) DEFAULT NULL COMMENT '交易描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (card_id) REFERENCES membership_cards(card_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员储值记录表';

-- 索引优化（根据外键和常用查询字段添加索引）
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_membership_transactions_card_id ON membership_transactions(card_id);
