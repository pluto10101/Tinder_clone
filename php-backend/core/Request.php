<?php
/**
 * 请求工具：读取 body / header / 当前用户ID
 */
class Request {

    /** 读取 JSON body，返回数组 */
    public static function json(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) return [];
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    /** 从 X-User-Id header 获取当前用户ID */
    public static function userId(): ?int {
        $val = $_SERVER['HTTP_X_USER_ID'] ?? null;
        return ($val !== null && is_numeric($val)) ? (int)$val : null;
    }

    /** 要求登录，否则直接响应 401 */
    public static function requireUserId(): int {
        $uid = self::userId();
        if ($uid === null) {
            Response::unauthorized();
        }
        return $uid;
    }

    /** 获取 GET 参数 */
    public static function query(string $key, mixed $default = null): mixed {
        return $_GET[$key] ?? $default;
    }

    /** 获取当前 HTTP 方法 */
    public static function method(): string {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    /** 获取请求路径（去掉 query string）
     *  Nginx 通过 fastcgi_param PATH_INFO 或 REQUEST_URI 传递路径
     *  try_files $uri $uri/ /index.php?$query_string 模式下直接用 REQUEST_URI
     */
    public static function path(): string {
        // Nginx 下优先使用 PATH_INFO（如果配置了的话）
        if (!empty($_SERVER['PATH_INFO'])) {
            return '/' . ltrim($_SERVER['PATH_INFO'], '/');
        }
        $uri  = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        return '/' . ltrim($path, '/');
    }
}
