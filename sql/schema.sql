-- ============================================================
-- Tinder Clone - MySQL 数据库建表脚本
-- 字符集: utf8mb4 (支持 emoji)
-- ============================================================

CREATE DATABASE IF NOT EXISTS tinder_clone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tinder_clone;

-- ============================================================
-- 1. 用户主表
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`                  VARCHAR(20)     NOT NULL COMMENT '手机号',
  `name`                   VARCHAR(50)     DEFAULT NULL COMMENT '昵称',
  `birthday`               DATE            DEFAULT NULL COMMENT '生日',
  `gender`                 ENUM('male','female','other') DEFAULT NULL,
  `sexual_orientation`     ENUM('straight','gay','bisexual','asexual','other') DEFAULT NULL,
  `looking_for`            ENUM('male','female','all') DEFAULT NULL,
  `bio`                    VARCHAR(500)    DEFAULT NULL COMMENT '个人简介',
  `school`                 VARCHAR(100)    DEFAULT NULL,
  `degree`                 VARCHAR(50)     DEFAULT NULL COMMENT '学历',
  `job_title`              VARCHAR(100)    DEFAULT NULL COMMENT '职位',
  `company`                VARCHAR(100)    DEFAULT NULL COMMENT '公司',
  `city`                   VARCHAR(100)    DEFAULT NULL COMMENT '城市',
  `height_cm`              SMALLINT        DEFAULT NULL COMMENT '身高(cm)',
  -- JSON 数组字段：直接存 JSON 字符串，简单高效
  `dating_purpose`         JSON            DEFAULT NULL COMMENT '约会目的，如["长期关系","短期约会"]',
  `interests`              JSON            DEFAULT NULL COMMENT '兴趣爱好',
  `lifestyles`             JSON            DEFAULT NULL COMMENT '生活方式，如{"smoking":"从不"}',
  `personality`            JSON            DEFAULT NULL COMMENT '性格标签',
  -- 账号状态
  `is_verified`            TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否照片认证',
  `membership`             ENUM('free','plus','gold','platinum') NOT NULL DEFAULT 'free',
  `membership_expires_at`  DATETIME        DEFAULT NULL,
  `stealth_mode`           TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '隐身模式',
  -- 道具数量
  `super_like_count`       SMALLINT        NOT NULL DEFAULT 1,
  `boost_count`            SMALLINT        NOT NULL DEFAULT 0,
  `read_receipt_count`     SMALLINT        NOT NULL DEFAULT 0,
  -- 引导流程
  `onboarding_complete`    TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_phone` (`phone`),
  KEY `idx_gender` (`gender`),
  KEY `idx_city` (`city`),
  KEY `idx_onboarding` (`onboarding_complete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户主表';


-- ============================================================
-- 2. 用户照片表（从 users.photos 数组拆出）
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_photos` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `url`         VARCHAR(500)    NOT NULL COMMENT '照片访问URL',
  `filename`    VARCHAR(200)    DEFAULT NULL COMMENT '服务器存储文件名',
  `sort_order`  TINYINT         NOT NULL DEFAULT 0 COMMENT '排序，0为主照片',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_sort` (`user_id`, `sort_order`),
  CONSTRAINT `fk_photos_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户照片表';


-- ============================================================
-- 3. 用户设置表（从 users.settings 拆出）
-- ============================================================
CREATE TABLE IF NOT EXISTS `user_settings` (
  `user_id`           BIGINT UNSIGNED NOT NULL,
  `distance_max_km`   SMALLINT        NOT NULL DEFAULT 50  COMMENT '最大距离(km)',
  `age_min`           TINYINT         NOT NULL DEFAULT 18  COMMENT '最小年龄',
  `age_max`           TINYINT         NOT NULL DEFAULT 60  COMMENT '最大年龄',
  `gender_preference` ENUM('male','female','all') NOT NULL DEFAULT 'all',
  `show_gender`       TINYINT(1)      NOT NULL DEFAULT 1,
  `show_age`          TINYINT(1)      NOT NULL DEFAULT 1,
  `show_distance`     TINYINT(1)      NOT NULL DEFAULT 1,
  `show_orientation`  TINYINT(1)      NOT NULL DEFAULT 0,
  `show_online_status` TINYINT(1)     NOT NULL DEFAULT 1,
  `updated_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户发现设置表';


-- ============================================================
-- 4. 滑动记录表（like / nope / super_like）
-- ============================================================
CREATE TABLE IF NOT EXISTS `actions` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`        BIGINT UNSIGNED NOT NULL COMMENT '操作者',
  `target_user_id` BIGINT UNSIGNED NOT NULL COMMENT '被操作者',
  `action_type`    ENUM('like','nope','super_like') NOT NULL,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  -- 同一对用户只保留最新一条（撤销后重新滑动）
  UNIQUE KEY `uq_user_target` (`user_id`, `target_user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_target_user_id` (`target_user_id`),
  CONSTRAINT `fk_actions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_actions_target` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='滑动记录表';


-- ============================================================
-- 5. 匹配表
-- ============================================================
CREATE TABLE IF NOT EXISTS `matches` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_a_id`   BIGINT UNSIGNED NOT NULL COMMENT '发起方',
  `user_b_id`   BIGINT UNSIGNED NOT NULL COMMENT '被匹配方',
  `match_type`  ENUM('normal','super_like') NOT NULL DEFAULT 'normal',
  `matched_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_match_pair` (`user_a_id`, `user_b_id`),
  KEY `idx_user_a` (`user_a_id`),
  KEY `idx_user_b` (`user_b_id`),
  CONSTRAINT `fk_matches_user_a` FOREIGN KEY (`user_a_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_matches_user_b` FOREIGN KEY (`user_b_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配表';


-- ============================================================
-- 6. 消息表
-- ============================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `match_id`    BIGINT UNSIGNED NOT NULL COMMENT '所属匹配',
  `sender_id`   BIGINT UNSIGNED NOT NULL COMMENT '发送者',
  `content`     TEXT            NOT NULL COMMENT '消息内容',
  `is_read`     TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_match_id` (`match_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_match_created` (`match_id`, `created_at`),
  CONSTRAINT `fk_messages_match` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天消息表';


-- ============================================================
-- 7. 通知表
-- ============================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '接收者',
  `type`        VARCHAR(50)     NOT NULL COMMENT '通知类型，如 match / message / system',
  `title`       VARCHAR(100)    DEFAULT NULL,
  `body`        VARCHAR(500)    DEFAULT NULL,
  `is_read`     TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_read` (`user_id`, `is_read`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';


-- ============================================================
-- 8. 探索分组表
-- ============================================================
CREATE TABLE IF NOT EXISTS `explore_groups` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100)    NOT NULL COMMENT '分组名称',
  `description` VARCHAR(300)    DEFAULT NULL,
  `cover_url`   VARCHAR(500)    DEFAULT NULL COMMENT '封面图',
  `sort_order`  TINYINT         NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='探索分组表';


-- ============================================================
-- 9. 探索分组成员关联表
-- ============================================================
CREATE TABLE IF NOT EXISTS `explore_group_members` (
  `group_id`  INT UNSIGNED    NOT NULL,
  `user_id`   BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_egm_group` FOREIGN KEY (`group_id`) REFERENCES `explore_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_egm_user`  FOREIGN KEY (`user_id`)  REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='探索分组成员关联表';
