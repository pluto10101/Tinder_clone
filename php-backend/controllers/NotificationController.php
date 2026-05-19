<?php
/**
 * Notifications 模块
 * GET /notifications
 * PUT /notifications/read-all
 */
class NotificationController {

    /** 获取当前用户的通知列表 */
    public static function getList(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $stmt = $db->prepare(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC'
        );
        $stmt->execute([$uid]);
        $list = array_map(function ($n) {
            $n['id']      = (int)$n['id'];
            $n['user_id'] = (int)$n['user_id'];
            $n['is_read'] = (bool)$n['is_read'];
            return $n;
        }, $stmt->fetchAll());

        Response::ok($list);
    }

    /** 全部标记为已读 */
    public static function readAll(): void {
        $uid = Request::requireUserId();
        $db  = getDb();

        $db->prepare(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?'
        )->execute([$uid]);

        Response::ok([]);
    }
}
