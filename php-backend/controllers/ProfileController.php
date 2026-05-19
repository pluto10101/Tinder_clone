<?php
/**
 * Profile 模块
 * GET    /profile
 * PUT    /profile
 * POST   /profile/photos
 * DELETE /profile/photos/:id
 * PUT    /profile/photos/reorder
 * GET    /profile/completeness
 */
class ProfileController {

    /** 获取当前用户资料 */
    public static function get(): void {
        $uid     = Request::requireUserId();
        $profile = UserHelper::getProfile($uid);
        if (!$profile) Response::notFound('用户不存在');
        Response::ok($profile);
    }

    /** 更新用户资料（PATCH 语义，只更新传入字段） */
    public static function update(): void {
        $uid  = Request::requireUserId();
        $body = Request::json();

        // 调试日志（确认请求到达后端）
        $logDir = __DIR__ . '/../logs/';
        if (!is_dir($logDir)) mkdir($logDir, 0755, true);
        file_put_contents(
            $logDir . 'profile_update.log',
            date('Y-m-d H:i:s') . " uid={$uid} body=" . json_encode($body, JSON_UNESCAPED_UNICODE) . "\n",
            FILE_APPEND
        );

        // 不允许覆盖的字段
        $protected = ['id', 'phone', 'created_at', 'updated_at'];
        foreach ($protected as $key) unset($body[$key]);

        if (empty($body)) {
            Response::badRequest('没有可更新的字段');
        }

        $db = getDb();

        // 检查用户存在
        $stmt = $db->prepare('SELECT id FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        if (!$stmt->fetch()) Response::notFound('用户不存在');

        // 分离 settings 字段
        $settingsData = null;
        if (isset($body['settings'])) {
            $settingsData = $body['settings'];
            unset($body['settings']);
        }

        // JSON 字段列表
        $jsonFields = ['dating_purpose', 'interests', 'lifestyles', 'personality', 'languages', 'profile_extras'];

        // ENUM 字段：null 值直接写 NULL，不做 json_encode
        $enumFields = ['gender', 'sexual_orientation', 'looking_for'];

        try {
            // 构建 users 表 SET 子句
            if (!empty($body)) {
                $setClauses = [];
                $values     = [];
                foreach ($body as $col => $val) {
                    // 只允许已知列，防止 SQL 注入
                    if (!self::isAllowedColumn($col)) continue;

                    $setClauses[] = "`{$col}` = ?";

                    if (in_array($col, $jsonFields)) {
                        // JSON 字段：数组/对象序列化
                        $values[] = ($val === null) ? null : json_encode($val, JSON_UNESCAPED_UNICODE);
                    } elseif (in_array($col, $enumFields)) {
                        // ENUM 字段：空字符串转 null，避免 MySQL ENUM 报错
                        $values[] = ($val === '' || $val === null) ? null : $val;
                    } else {
                        $values[] = ($val === '') ? null : $val;
                    }
                }
                if (!empty($setClauses)) {
                    $values[] = $uid;
                    $db->prepare('UPDATE users SET ' . implode(', ', $setClauses) . ' WHERE id = ?')
                       ->execute($values);
                }
            }

            // 更新 settings
            if ($settingsData && is_array($settingsData)) {
                $allowedSettings = [
                    'distance_max_km', 'age_min', 'age_max', 'gender_preference',
                    'show_gender', 'show_age', 'show_distance', 'show_orientation', 'show_online_status',
                ];
                // 布尔字段：强制转 0/1，防止空字符串导致 TINYINT 报错
                $boolSettings = ['show_gender', 'show_age', 'show_distance', 'show_orientation', 'show_online_status'];
                // 整数字段
                $intSettings  = ['distance_max_km', 'age_min', 'age_max'];

                $setClauses = [];
                $values     = [];
                foreach ($settingsData as $col => $val) {
                    if (!in_array($col, $allowedSettings)) continue;
                    $setClauses[] = "`{$col}` = ?";
                    if (in_array($col, $boolSettings)) {
                        $values[] = ($val === '' || $val === null) ? 0 : (int)(bool)$val;
                    } elseif (in_array($col, $intSettings)) {
                        $values[] = ($val === '' || $val === null) ? 0 : (int)$val;
                    } else {
                        $values[] = $val;
                    }
                }
                if (!empty($setClauses)) {
                    $values[] = $uid;
                    $db->prepare('UPDATE user_settings SET ' . implode(', ', $setClauses) . ' WHERE user_id = ?')
                       ->execute($values);
                }
            }
        } catch (\PDOException $e) {
            // 把 SQL 错误写入日志并返回给前端，方便调试
            file_put_contents(
                $logDir . 'profile_update.log',
                date('Y-m-d H:i:s') . " SQL ERROR: " . $e->getMessage() . "\n",
                FILE_APPEND
            );
            Response::fail(500, 'SQL错误: ' . $e->getMessage(), 500);
        }

        $profile = UserHelper::getProfile($uid);
        Response::ok($profile);
    }

    /** 上传照片 */
    public static function uploadPhoto(): void {
        $uid = Request::requireUserId();

        // 调试日志
        $logDir = __DIR__ . '/../logs/';
        if (!is_dir($logDir)) mkdir($logDir, 0755, true);
        file_put_contents(
            $logDir . 'photo_upload.log',
            date('Y-m-d H:i:s') . " uid={$uid} files=" . json_encode($_FILES) . "\n",
            FILE_APPEND
        );

        if (empty($_FILES['photo'])) {
            Response::badRequest('未收到文件');
        }

        $file = $_FILES['photo'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::badRequest('文件上传失败，错误码: ' . $file['error']);
        }

        // 检查文件类型（通过扩展名 + 文件头魔数，不依赖 fileinfo 扩展）
        $originalName = strtolower($file['name']);
        $extMap = [
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
        ];
        $extRaw = pathinfo($originalName, PATHINFO_EXTENSION);
        if (!array_key_exists($extRaw, $extMap)) {
            Response::badRequest('不支持的文件类型，请上传 jpg/png/gif/webp');
        }

        // 读取文件头魔数二次验证
        $handle    = fopen($file['tmp_name'], 'rb');
        $magic     = fread($handle, 12);
        fclose($handle);
        $isImage = (
            substr($magic, 0, 2) === "\xFF\xD8"             // JPEG
            || substr($magic, 0, 8) === "\x89PNG\r\n\x1A\n" // PNG
            || substr($magic, 0, 6) === 'GIF87a'            // GIF87
            || substr($magic, 0, 6) === 'GIF89a'            // GIF89
            || substr($magic, 0, 4) === 'RIFF'              // WEBP (RIFF....WEBP)
        );
        if (!$isImage) {
            Response::badRequest('文件内容不是有效的图片');
        }

        $mime = $extMap[$extRaw];

        // 生成文件名
        $ext = match($mime) {
            'image/png'  => '.png',
            'image/gif'  => '.gif',
            'image/webp' => '.webp',
            default      => '.jpg',
        };
        $filename = time() . '-' . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 6) . $ext;
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
            Response::fail(500, '文件保存失败', 500);
        }

        // 构建访问 URL（统一用正斜杠，兼容 Windows 路径）
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host     = $_SERVER['HTTP_HOST'];
        $url      = "{$protocol}://{$host}/uploads/{$filename}";

        $db = getDb();

        // 获取当前照片数量作为 sort_order
        $stmt = $db->prepare('SELECT COUNT(*) FROM user_photos WHERE user_id = ?');
        $stmt->execute([$uid]);
        $sortOrder = (int)$stmt->fetchColumn();

        $db->prepare(
            'INSERT INTO user_photos (user_id, url, filename, sort_order) VALUES (?, ?, ?, ?)'
        )->execute([$uid, $url, $filename, $sortOrder]);

        $photoId = (int)$db->lastInsertId();

        Response::ok([
            'id'         => $photoId,
            'url'        => $url,
            'sort_order' => $sortOrder,
        ]);
    }

    /** 删除照片 */
    public static function deletePhoto(array $params): void {
        $uid = Request::requireUserId();
        $pid = (int)($params['id'] ?? 0);
        if ($pid <= 0) Response::badRequest('参数错误');

        $db = getDb();

        // 确认照片属于当前用户
        $stmt = $db->prepare('SELECT filename FROM user_photos WHERE id = ? AND user_id = ?');
        $stmt->execute([$pid, $uid]);
        $photo = $stmt->fetch();
        if (!$photo) Response::notFound('照片不存在');

        // 删除文件
        if ($photo['filename']) {
            $filePath = __DIR__ . '/../uploads/' . $photo['filename'];
            if (file_exists($filePath)) unlink($filePath);
        }

        $db->prepare('DELETE FROM user_photos WHERE id = ?')->execute([$pid]);

        // 重排 sort_order
        $stmt = $db->prepare(
            'SELECT id FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC'
        );
        $stmt->execute([$uid]);
        $remaining = $stmt->fetchAll();
        foreach ($remaining as $i => $row) {
            $db->prepare('UPDATE user_photos SET sort_order = ? WHERE id = ?')
               ->execute([$i, $row['id']]);
        }

        Response::ok([]);
    }

    /** 重排照片顺序 */
    public static function reorderPhotos(): void {
        $uid  = Request::requireUserId();
        $body = Request::json();
        $ids  = $body['ids'] ?? null;

        if (!is_array($ids)) Response::badRequest('参数错误');

        $db = getDb();
        foreach ($ids as $order => $photoId) {
            $db->prepare(
                'UPDATE user_photos SET sort_order = ? WHERE id = ? AND user_id = ?'
            )->execute([$order, (int)$photoId, $uid]);
        }

        $stmt = $db->prepare(
            'SELECT id, url, sort_order FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC'
        );
        $stmt->execute([$uid]);
        $photos = array_map(fn($p) => [
            'id'         => (int)$p['id'],
            'url'        => $p['url'],
            'sort_order' => (int)$p['sort_order'],
        ], $stmt->fetchAll());

        Response::ok($photos);
    }

    /** 计算资料完善度 */
    public static function completeness(): void {
        $uid     = Request::requireUserId();
        $profile = UserHelper::getProfile($uid);
        if (!$profile) Response::notFound('用户不存在');

        $items = [
            [
                'key'    => 'photos_ge_4',
                'weight' => 28,
                'done'   => count($profile['photos']) >= 4,
            ],
            [
                'key'    => 'bio',
                'weight' => 20,
                'done'   => !empty(trim($profile['bio'] ?? '')),
            ],
            [
                'key'    => 'about_me',
                'weight' => 10,
                'done'   => !empty($profile['job_title']) || !empty($profile['school']) || !empty($profile['city']),
            ],
            [
                'key'    => 'interests',
                'weight' => 12,
                'done'   => count($profile['interests']) >= 3,
            ],
            [
                'key'    => 'lifestyles',
                'weight' => 10,
                'done'   => count((array)$profile['lifestyles']) >= 2,
            ],
            [
                'key'    => 'personality',
                'weight' => 10,
                'done'   => count($profile['personality']) >= 3,
            ],
            [
                'key'    => 'basic',
                'weight' => 10,
                'done'   => !empty($profile['name']) && !empty($profile['birthday']) && !empty($profile['gender']),
            ],
        ];

        $completeness = array_sum(array_map(fn($i) => $i['done'] ? $i['weight'] : 0, $items));

        Response::ok(['completeness' => $completeness, 'items' => $items]);
    }

    /** 白名单：允许通过 update 修改的 users 表列 */
    private static function isAllowedColumn(string $col): bool {
        static $allowed = [
            // 基础信息
            'name', 'birthday', 'gender', 'sexual_orientation', 'looking_for',
            // 个人资料
            'bio', 'school', 'degree', 'job_title', 'company', 'city', 'height_cm',
            // JSON 数组字段
            'dating_purpose', 'interests', 'lifestyles', 'personality', 'languages',
            // 生活习惯独立列（从 lifestyles 拆出）
            'drinking', 'smoking', 'exercise', 'pets',
            // 性格/价值观独立列（从 personality 拆出）
            'zodiac', 'communication_style', 'love_language',
            // 其他独立字段
            'family_plan', 'social_media_activity',
            // 扩展 JSON
            'profile_extras',
            // 系统字段
            'stealth_mode', 'onboarding_complete',
        ];
        return in_array($col, $allowed);
    }
}
