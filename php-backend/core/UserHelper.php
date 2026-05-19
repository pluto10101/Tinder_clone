<?php
/**
 * 用户数据组装工具
 * 将数据库多表数据拼装成前端期望的 UserProfile 结构
 */
class UserHelper {

    /**
     * 根据 user_id 查询完整用户信息（含照片和设置）
     * 返回前端 UserProfile 格式的数组，找不到返回 null
     */
    public static function getProfile(int $userId): ?array {
        $db = getDb();

        // 主表
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        if (!$user) return null;

        return self::formatUser($user);
    }

    /**
     * 将数据库行格式化为前端 UserProfile 格式
     */
    public static function formatUser(array $user): array {
        $db = getDb();
        $uid = (int)$user['id'];

        // 照片
        $stmt = $db->prepare(
            'SELECT id, url, sort_order FROM user_photos WHERE user_id = ? ORDER BY sort_order ASC'
        );
        $stmt->execute([$uid]);
        $photos = array_map(function ($p) {
            return [
                'id'         => (int)$p['id'],
                'url'        => $p['url'],
                'sort_order' => (int)$p['sort_order'],
            ];
        }, $stmt->fetchAll());

        // 设置
        $stmt = $db->prepare('SELECT * FROM user_settings WHERE user_id = ?');
        $stmt->execute([$uid]);
        $settings = $stmt->fetch();
        if (!$settings) {
            $settings = [
                'distance_max_km'   => 50,
                'age_min'           => 18,
                'age_max'           => 60,
                'gender_preference' => 'all',
                'show_gender'       => true,
                'show_age'          => true,
                'show_distance'     => true,
                'show_orientation'  => false,
                'show_online_status'=> true,
            ];
        }

        return [
            'id'                    => $uid,
            'phone'                 => $user['phone'],
            'name'                  => $user['name'],
            'birthday'              => $user['birthday'],
            'gender'                => $user['gender'],
            'sexual_orientation'    => $user['sexual_orientation'],
            'looking_for'           => $user['looking_for'],
            'bio'                   => $user['bio'],
            'school'                => $user['school'],
            'degree'                => $user['degree'],
            'job_title'             => $user['job_title'],
            'company'               => $user['company'],
            'city'                  => $user['city'],
            'height_cm'             => $user['height_cm'] !== null ? (int)$user['height_cm'] : null,
            'photos'                => $photos,
            // JSON 数组字段
            'dating_purpose'        => self::decodeJson($user['dating_purpose'], []),
            'interests'             => self::decodeJson($user['interests'], []),
            'lifestyles'            => self::decodeJson($user['lifestyles'], (object)[]),
            'personality'           => self::decodeJson($user['personality'], []),
            'languages'             => self::decodeJson($user['languages'] ?? null, []),
            'profile_extras'        => self::decodeJson($user['profile_extras'] ?? null, (object)[]),
            // 生活习惯独立列
            'drinking'              => $user['drinking'] ?? null,
            'smoking'               => $user['smoking'] ?? null,
            'exercise'              => $user['exercise'] ?? null,
            'pets'                  => $user['pets'] ?? null,
            // 性格独立列
            'zodiac'                => $user['zodiac'] ?? null,
            'communication_style'   => $user['communication_style'] ?? null,
            'love_language'         => $user['love_language'] ?? null,
            // 其他独立字段
            'family_plan'           => $user['family_plan'] ?? null,
            'social_media_activity' => $user['social_media_activity'] ?? null,
            // 账号状态
            'is_verified'           => (bool)$user['is_verified'],
            'membership'            => $user['membership'],
            'membership_expires_at' => $user['membership_expires_at'],
            'stealth_mode'          => (bool)$user['stealth_mode'],
            'super_like_count'      => (int)$user['super_like_count'],
            'boost_count'           => (int)$user['boost_count'],
            'read_receipt_count'    => (int)$user['read_receipt_count'],
            'onboarding_complete'   => (bool)$user['onboarding_complete'],
            'settings'              => [
                'distance_max_km'     => (int)$settings['distance_max_km'],
                'age_min'             => (int)$settings['age_min'],
                'age_max'             => (int)$settings['age_max'],
                'gender_preference'   => $settings['gender_preference'],
                'show_gender'         => (bool)$settings['show_gender'],
                'show_age'            => (bool)$settings['show_age'],
                'show_distance'       => (bool)$settings['show_distance'],
                'show_orientation'    => (bool)$settings['show_orientation'],
                'show_online_status'  => (bool)$settings['show_online_status'],
                'min_photos_filter'   => (int)($settings['min_photos_filter'] ?? 1),
                'show_beyond_distance'=> (bool)($settings['show_beyond_distance'] ?? true),
                'show_beyond_age'     => (bool)($settings['show_beyond_age'] ?? true),
            ],
            'created_at' => $user['created_at'],
        ];
    }

    /** 安全解码 JSON 字段 */
    public static function decodeJson(?string $val, mixed $default): mixed {
        if ($val === null || $val === '') return $default;
        $decoded = json_decode($val, true);
        return ($decoded !== null) ? $decoded : $default;
    }
}
