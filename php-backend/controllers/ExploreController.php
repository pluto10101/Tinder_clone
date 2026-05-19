<?php
/**
 * Explore 模块
 * GET /explore/groups
 * GET /explore/groups/:id/users
 */
class ExploreController {

    /** 获取所有探索分组 */
    public static function getGroups(): void {
        $db   = getDb();
        $stmt = $db->query('SELECT * FROM explore_groups ORDER BY sort_order ASC');
        $groups = $stmt->fetchAll();

        // 附加每组的用户数量
        $result = array_map(function ($g) use ($db) {
            $stmt = $db->prepare(
                'SELECT COUNT(*) FROM explore_group_members WHERE group_id = ?'
            );
            $stmt->execute([(int)$g['id']]);
            $g['user_count'] = (int)$stmt->fetchColumn();
            $g['id']         = (int)$g['id'];
            return $g;
        }, $groups);

        Response::ok($result);
    }

    /** 获取指定分组的用户列表 */
    public static function getGroupUsers(array $params): void {
        $gid = (int)($params['id'] ?? 0);
        if ($gid <= 0) Response::badRequest('参数错误');

        $db = getDb();

        // 检查分组存在
        $stmt = $db->prepare('SELECT id FROM explore_groups WHERE id = ?');
        $stmt->execute([$gid]);
        if (!$stmt->fetch()) Response::notFound('分组不存在');

        $stmt = $db->prepare(
            'SELECT u.* FROM users u
             INNER JOIN explore_group_members egm ON egm.user_id = u.id
             WHERE egm.group_id = ?'
        );
        $stmt->execute([$gid]);
        $users = $stmt->fetchAll();

        $result = array_map([UserHelper::class, 'formatUser'], $users);
        Response::ok($result);
    }
}
