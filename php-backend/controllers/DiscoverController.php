<?php
/**
 * Discover 模块
 * GET  /discover/cards
 * POST /discover/swipe
 * POST /discover/rewind
 * GET  /discover/filters
 * PUT  /discover/filters
 */
class DiscoverController {

    /** 获取推荐卡片列表 */
    public static function getCards(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        // 获取当前用户设置
        $stmt = $db->prepare('SELECT * FROM user_settings WHERE user_id = ?');
        $stmt->execute([$uid]);
        $settings = $stmt->fetch();

        // 已滑动过的用户 ID
        $stmt = $db->prepare('SELECT target_user_id FROM actions WHERE user_id = ?');
        $stmt->execute([$uid]);
        $swipedIds = array_column($stmt->fetchAll(), 'target_user_id');

        // 构建排除条件
        $excludeIds   = array_merge([$uid], $swipedIds);
        $placeholders = implode(',', array_fill(0, count($excludeIds), '?'));

        // 查询候选用户（已完成引导、非隐身）
        $sql = "SELECT * FROM users
                WHERE id NOT IN ({$placeholders})
                  AND onboarding_complete = 1
                  AND stealth_mode = 0
                ORDER BY RAND()
                LIMIT 20";

        $stmt = $db->prepare($sql);
        $stmt->execute($excludeIds);
        $candidates = $stmt->fetchAll();

        // 组装卡片数据（附加随机距离）
        $cards = array_map(function ($user) {
            $profile           = UserHelper::formatUser($user);
            $profile['distance'] = rand(1, 50);
            return $profile;
        }, $candidates);

        Response::ok($cards);
    }

    /** 滑动操作（like / nope / super_like） */
    public static function swipe(): void {
        $uid  = Request::requireUserId();
        $body = Request::json();

        $targetId = (int)($body['target_user_id'] ?? 0);
        $action   = $body['action'] ?? '';

        if ($targetId <= 0 || !in_array($action, ['like', 'nope', 'super_like'])) {
            Response::badRequest('参数缺失');
        }

        $db = getDb();

        // 写入或更新滑动记录（UNIQUE KEY 保证唯一）
        $db->prepare(
            'INSERT INTO actions (user_id, target_user_id, action_type)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE action_type = VALUES(action_type), created_at = NOW()'
        )->execute([$uid, $targetId, $action]);

        $matched = false;
        $match   = null;

        // like / super_like 有 30% 概率触发匹配
        if (in_array($action, ['like', 'super_like']) && (mt_rand(1, 10) <= 3)) {
            // 检查是否已存在匹配
            $stmt = $db->prepare(
                'SELECT id FROM matches
                 WHERE (user_a_id = ? AND user_b_id = ?) OR (user_a_id = ? AND user_b_id = ?)'
            );
            $stmt->execute([$uid, $targetId, $targetId, $uid]);
            $existing = $stmt->fetch();

            if (!$existing) {
                $matchType = ($action === 'super_like') ? 'super_like' : 'normal';
                $db->prepare(
                    'INSERT INTO matches (user_a_id, user_b_id, match_type) VALUES (?, ?, ?)'
                )->execute([$uid, $targetId, $matchType]);
                $matchId = (int)$db->lastInsertId();

                $match = [
                    'id'         => $matchId,
                    'user_a_id'  => $uid,
                    'user_b_id'  => $targetId,
                    'match_type' => $matchType,
                    'matched_at' => date('Y-m-d\TH:i:s.000\Z'),
                ];
                $matched = true;

                // 生成匹配通知
                $stmt = $db->prepare('SELECT name FROM users WHERE id = ?');
                $stmt->execute([$targetId]);
                $other = $stmt->fetch();
                $otherName = $other['name'] ?? '对方';

                $db->prepare(
                    'INSERT INTO notifications (user_id, type, title, body)
                     VALUES (?, \'match\', \'新匹配\', ?)'
                )->execute([$uid, "你和 {$otherName} 互相喜欢！"]);
            }
        }

        Response::ok(['matched' => $matched, 'match' => $match]);
    }

    /** 撤销上一次滑动 */
    public static function rewind(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $stmt = $db->prepare(
            'SELECT id, target_user_id FROM actions
             WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
        );
        $stmt->execute([$uid]);
        $last = $stmt->fetch();

        if (!$last) Response::notFound('没有可撤销的操作');

        $db->prepare('DELETE FROM actions WHERE id = ?')->execute([$last['id']]);

        Response::ok(['target_user_id' => (int)$last['target_user_id']]);
    }

    /** 获取发现筛选设置 */
    public static function getFilters(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $stmt = $db->prepare('SELECT * FROM user_settings WHERE user_id = ?');
        $stmt->execute([$uid]);
        $s = $stmt->fetch();

        if (!$s) {
            Response::ok(['distance_max_km' => 50, 'age_min' => 18, 'age_max' => 60, 'gender_preference' => 'all']);
            return;
        }

        Response::ok([
            'distance_max_km'    => (int)$s['distance_max_km'],
            'age_min'            => (int)$s['age_min'],
            'age_max'            => (int)$s['age_max'],
            'gender_preference'  => $s['gender_preference'],
            'show_gender'        => (bool)$s['show_gender'],
            'show_age'           => (bool)$s['show_age'],
            'show_distance'      => (bool)$s['show_distance'],
            'show_orientation'   => (bool)$s['show_orientation'],
            'show_online_status' => (bool)$s['show_online_status'],
        ]);
    }

    /** 更新发现筛选设置 */
    public static function updateFilters(): void {
        $uid  = Request::requireUserId();
        $body = Request::json();

        $allowed = [
            'distance_max_km', 'age_min', 'age_max', 'gender_preference',
            'show_gender', 'show_age', 'show_distance', 'show_orientation', 'show_online_status',
        ];

        $db         = getDb();
        $setClauses = [];
        $values     = [];

        foreach ($body as $col => $val) {
            if (!in_array($col, $allowed)) continue;
            $setClauses[] = "`{$col}` = ?";
            $values[]     = $val;
        }

        if (!empty($setClauses)) {
            $values[] = $uid;
            $db->prepare(
                'INSERT INTO user_settings (user_id) VALUES (?)
                 ON DUPLICATE KEY UPDATE ' . implode(', ', $setClauses)
            );
            // 用 UPDATE 更安全
            $db->prepare('UPDATE user_settings SET ' . implode(', ', $setClauses) . ' WHERE user_id = ?')
               ->execute($values);
        }

        // 返回最新设置
        $stmt = $db->prepare('SELECT * FROM user_settings WHERE user_id = ?');
        $stmt->execute([$uid]);
        $s = $stmt->fetch();

        Response::ok([
            'distance_max_km'    => (int)$s['distance_max_km'],
            'age_min'            => (int)$s['age_min'],
            'age_max'            => (int)$s['age_max'],
            'gender_preference'  => $s['gender_preference'],
            'show_gender'        => (bool)$s['show_gender'],
            'show_age'           => (bool)$s['show_age'],
            'show_distance'      => (bool)$s['show_distance'],
            'show_orientation'   => (bool)$s['show_orientation'],
            'show_online_status' => (bool)$s['show_online_status'],
        ]);
    }
}
