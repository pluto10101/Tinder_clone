<?php
/**
 * Matches 模块
 * GET    /matches
 * DELETE /matches/:id
 * GET    /matches/likes
 */
class MatchController {

    /** 获取匹配列表（含最后一条消息和未读数） */
    public static function getMatches(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $stmt = $db->prepare(
            'SELECT * FROM matches WHERE user_a_id = ? OR user_b_id = ? ORDER BY matched_at DESC'
        );
        $stmt->execute([$uid, $uid]);
        $matches = $stmt->fetchAll();

        $result = [];
        foreach ($matches as $m) {
            $otherId = ((int)$m['user_a_id'] === $uid) ? (int)$m['user_b_id'] : (int)$m['user_a_id'];

            // 对方用户信息
            $stmt2 = $db->prepare('SELECT * FROM users WHERE id = ?');
            $stmt2->execute([$otherId]);
            $otherUser = $stmt2->fetch();
            $otherProfile = $otherUser ? UserHelper::formatUser($otherUser) : null;

            // 最后一条消息
            $stmt3 = $db->prepare(
                'SELECT * FROM messages WHERE match_id = ? ORDER BY created_at DESC LIMIT 1'
            );
            $stmt3->execute([(int)$m['id']]);
            $lastMessage = $stmt3->fetch() ?: null;

            // 未读数
            $stmt4 = $db->prepare(
                'SELECT COUNT(*) FROM messages WHERE match_id = ? AND sender_id != ? AND is_read = 0'
            );
            $stmt4->execute([(int)$m['id'], $uid]);
            $unreadCount = (int)$stmt4->fetchColumn();

            $result[] = [
                'id'           => (int)$m['id'],
                'user_a_id'    => (int)$m['user_a_id'],
                'user_b_id'    => (int)$m['user_b_id'],
                'match_type'   => $m['match_type'],
                'matched_at'   => $m['matched_at'],
                'other_user'   => $otherProfile,
                'last_message' => $lastMessage,
                'unread_count' => $unreadCount,
            ];
        }

        Response::ok($result);
    }

    /** 删除匹配（取消配对） */
    public static function deleteMatch(array $params): void {
        $uid = Request::requireUserId();
        $mid = (int)($params['id'] ?? 0);
        if ($mid <= 0) Response::badRequest('参数错误');

        $db = getDb();

        // 确认匹配属于当前用户
        $stmt = $db->prepare(
            'SELECT id FROM matches WHERE id = ? AND (user_a_id = ? OR user_b_id = ?)'
        );
        $stmt->execute([$mid, $uid, $uid]);
        if (!$stmt->fetch()) Response::notFound('匹配不存在');

        // 级联删除消息（外键已设置 ON DELETE CASCADE，此处显式删除也可）
        $db->prepare('DELETE FROM messages WHERE match_id = ?')->execute([$mid]);
        $db->prepare('DELETE FROM matches WHERE id = ?')->execute([$mid]);

        Response::ok([]);
    }

    /** 获取喜欢我的人列表（mock：随机返回已完成引导的用户） */
    public static function getLikes(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $stmt = $db->prepare(
            'SELECT * FROM users
             WHERE id != ? AND onboarding_complete = 1
             ORDER BY RAND() LIMIT 15'
        );
        $stmt->execute([$uid]);
        $users = $stmt->fetchAll();

        $result = array_map([UserHelper::class, 'formatUser'], $users);
        Response::ok($result);
    }
}
