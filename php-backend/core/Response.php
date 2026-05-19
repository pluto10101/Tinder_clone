<?php
/**
 * 统一响应工具
 * 前端拦截器要求格式：{ code: 0, message: "ok", data: ... }
 */
class Response {

    public static function ok(mixed $data = null): void {
        self::json(0, 'ok', $data);
    }

    public static function fail(int $code, string $message, int $httpStatus = 400): void {
        http_response_code($httpStatus);
        self::json($code, $message, null);
    }

    public static function notFound(string $message = 'Not Found'): void {
        self::fail(404, $message, 404);
    }

    public static function unauthorized(string $message = '未登录'): void {
        self::fail(401, $message, 401);
    }

    public static function badRequest(string $message = '参数错误'): void {
        self::fail(400, $message, 400);
    }

    private static function json(int $code, string $message, mixed $data): void {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['code' => $code, 'message' => $message, 'data' => $data],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        exit;
    }
}
