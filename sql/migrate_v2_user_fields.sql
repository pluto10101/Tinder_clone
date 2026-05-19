-- ============================================================
-- Migration v2: 扩充用户表字段，覆盖所有前端填写项
-- 执行方式：在 phpMyAdmin 或 MySQL 命令行中执行此文件
-- 数据库：tinder_clone_db
-- ============================================================

USE tinder_clone_db;

-- ============================================================
-- 1. users 表：拆出 lifestyles JSON 里的高频分析字段为独立列
--    方便 GROUP BY / COUNT 等聚合查询做用户埋点分析
-- ============================================================

ALTER TABLE `users`
  -- 饮酒习惯（原 lifestyles.drinking）
  ADD COLUMN `drinking`            VARCHAR(50)  DEFAULT NULL COMMENT '饮酒习惯' AFTER `height_cm`,

  -- 吸烟习惯（原 lifestyles.smoking）
  ADD COLUMN `smoking`             VARCHAR(50)  DEFAULT NULL COMMENT '吸烟习惯' AFTER `drinking`,

  -- 运动频率（原 lifestyles.exercise）
  ADD COLUMN `exercise`            VARCHAR(50)  DEFAULT NULL COMMENT '运动频率' AFTER `smoking`,

  -- 宠物情况（原 lifestyles.pets）
  ADD COLUMN `pets`                VARCHAR(50)  DEFAULT NULL COMMENT '宠物情况' AFTER `exercise`,

  -- 星座（原 personality 数组里的星座项，拆出独立列方便筛选）
  ADD COLUMN `zodiac`              VARCHAR(20)  DEFAULT NULL COMMENT '星座' AFTER `pets`,

  -- 沟通方式（原 personality 数组里的沟通方式项）
  ADD COLUMN `communication_style` VARCHAR(50)  DEFAULT NULL COMMENT '沟通方式' AFTER `zodiac`,

  -- 爱的语言（原 personality 数组里的爱的方式项）
  ADD COLUMN `love_language`       VARCHAR(50)  DEFAULT NULL COMMENT '爱的语言' AFTER `communication_style`,

  -- 家庭计划（ProfileEdit 半弹窗，之前存在 lifestyles 扩展字段里）
  ADD COLUMN `family_plan`         VARCHAR(50)  DEFAULT NULL COMMENT '家庭计划' AFTER `love_language`,

  -- 语言（ProfileEdit 半弹窗，多选，存 JSON 数组）
  ADD COLUMN `languages`           JSON         DEFAULT NULL COMMENT '会说的语言，如["中文","英语"]' AFTER `family_plan`,

  -- 社交媒体活跃度（ProfileEdit / Settings 半弹窗）
  ADD COLUMN `social_media_activity` VARCHAR(50) DEFAULT NULL COMMENT '社交媒体活跃度' AFTER `languages`,

  -- 个人资料扩展字段（存放其他半弹窗选项，如"外出"/"我的周末"等，保持灵活性）
  ADD COLUMN `profile_extras`      JSON         DEFAULT NULL COMMENT '其他个人资料扩展字段 JSON';


-- ============================================================
-- 2. user_settings 表：补充前端设置页的开关字段
-- ============================================================

ALTER TABLE `user_settings`
  -- 是否显示在线状态（Settings 页已有但 schema 里缺少）
  -- show_online_status 已存在，跳过

  -- 最少照片数筛选（Settings 页 minPhotos 滑块）
  ADD COLUMN `min_photos_filter`   TINYINT      NOT NULL DEFAULT 1 COMMENT '发现时对方最少照片数' AFTER `show_online_status`,

  -- 是否显示超出距离的用户
  ADD COLUMN `show_beyond_distance` TINYINT(1)  NOT NULL DEFAULT 1 COMMENT '距离不足时显示更远用户' AFTER `min_photos_filter`,

  -- 是否显示超出年龄范围的用户
  ADD COLUMN `show_beyond_age`     TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '年龄不足时显示超出范围用户' AFTER `show_beyond_distance`;


-- ============================================================
-- 3. 为新增的高频查询列加索引（方便埋点分析）
-- ============================================================

ALTER TABLE `users`
  ADD INDEX `idx_drinking`  (`drinking`),
  ADD INDEX `idx_smoking`   (`smoking`),
  ADD INDEX `idx_exercise`  (`exercise`),
  ADD INDEX `idx_zodiac`    (`zodiac`),
  ADD INDEX `idx_family_plan` (`family_plan`);


-- ============================================================
-- 4. 数据迁移：把已有 lifestyles JSON 里的数据迁移到新独立列
--    （仅迁移有值的行，不影响 NULL 行）
-- ============================================================

UPDATE `users`
SET
  `drinking` = CASE
    WHEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.drinking')) != 'null'
    THEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.drinking'))
    ELSE NULL
  END,
  `smoking` = CASE
    WHEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.smoking')) != 'null'
    THEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.smoking'))
    ELSE NULL
  END,
  `exercise` = CASE
    WHEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.exercise')) != 'null'
    THEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.exercise'))
    ELSE NULL
  END,
  `pets` = CASE
    WHEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.pets')) != 'null'
    THEN JSON_UNQUOTE(JSON_EXTRACT(`lifestyles`, '$.pets'))
    ELSE NULL
  END
WHERE `lifestyles` IS NOT NULL;

-- 迁移 personality 数组里的星座到独立列
-- 星座列表
UPDATE `users`
SET `zodiac` = (
  SELECT opt FROM JSON_TABLE(
    `personality`,
    '$[*]' COLUMNS (opt VARCHAR(20) PATH '$')
  ) AS jt
  WHERE opt IN (
    '摩羯座','水瓶座','双鱼座','白羊座','金牛座','双子座',
    '巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座'
  )
  LIMIT 1
)
WHERE `personality` IS NOT NULL AND `zodiac` IS NULL;

-- 迁移沟通方式
UPDATE `users`
SET `communication_style` = (
  SELECT opt FROM JSON_TABLE(
    `personality`,
    '$[*]' COLUMNS (opt VARCHAR(50) PATH '$')
  ) AS jt
  WHERE opt IN ('热衷发消息','喜欢打电话','喜欢视频聊天','不热衷发消息','最好当面')
  LIMIT 1
)
WHERE `personality` IS NOT NULL AND `communication_style` IS NULL;

-- 迁移爱的语言
UPDATE `users`
SET `love_language` = (
  SELECT opt FROM JSON_TABLE(
    `personality`,
    '$[*]' COLUMNS (opt VARCHAR(50) PATH '$')
  ) AS jt
  WHERE opt IN ('体贴的表示','礼物','身体碰触','赞美','共度时光')
  LIMIT 1
)
WHERE `personality` IS NOT NULL AND `love_language` IS NULL;

SELECT '✅ Migration v2 完成' AS status;
