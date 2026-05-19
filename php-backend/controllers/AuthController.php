<?php
/**
 * Auth 模块
 * POST /auth/sms/send
 * POST /auth/sms/verify
 * POST /auth/logout
 */
class AuthController {

    /** 发送短信验证码（mock：固定返回 123456） */
    public static function sendSms(): void {
        $body = Request::json();
        $phone = trim($body['phone'] ?? '');
        if ($phone === '') {
            Response::badRequest('手机号不能为空');
        }
        Response::ok(['code' => '123456', 'ttl' => 60]);
    }

    /** 验证短信验证码，不存在则自动注册 */
    public static function verifySms(): void {
        $body  = Request::json();
        $phone = trim($body['phone'] ?? '');
        $code  = trim($body['code']  ?? '');

        if ($phone === '' || $code === '') {
            Response::badRequest('参数缺失');
        }
        // mock：任意 4-6 位数字通过
        if (!preg_match('/^\d{4,6}$/', $code)) {
            Response::badRequest('验证码格式错误');
        }

        $db = getDb();

        // 查找或创建用户
        $stmt = $db->prepare('SELECT id, onboarding_complete FROM users WHERE phone = ?');
        $stmt->execute([$phone]);
        $user = $stmt->fetch();

        $isNew = false;
        if (!$user) {
            $isNew = true;
            $db->prepare(
                'INSERT INTO users (phone, dating_purpose, interests, lifestyles, personality, created_at)
                 VALUES (?, \'[]\', \'[]\', \'{}\', \'[]\', NOW())'
            )->execute([$phone]);
            $userId = (int)$db->lastInsertId();

            // 创建默认设置
            $db->prepare(
                'INSERT INTO user_settings (user_id) VALUES (?)'
            )->execute([$userId]);

            $onboardingComplete = false;
        } else {
            $userId             = (int)$user['id'];
            $onboardingComplete = (bool)$user['onboarding_complete'];
        }

        Response::ok([
            'token'               => 'mock_token_' . $userId,
            'user_id'             => $userId,
            'is_new_user'         => $isNew,
            'onboarding_complete' => $onboardingComplete,
        ]);
    }

    /** 登出（mock：直接返回成功） */
    public static function logout(): void {
        Response::ok([]);
    }
}
