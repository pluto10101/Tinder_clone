<?php
/**
 * 轻量路由器
 * 支持路径参数，如 /profile/photos/:id
 */
class Router {

    private array $routes = [];

    public function get(string $pattern, callable $handler): void {
        $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): void {
        $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, callable $handler): void {
        $this->add('PUT', $pattern, $handler);
    }

    public function delete(string $pattern, callable $handler): void {
        $this->add('DELETE', $pattern, $handler);
    }

    private function add(string $method, string $pattern, callable $handler): void {
        $this->routes[] = [
            'method'  => $method,
            'pattern' => $pattern,
            'handler' => $handler,
            'regex'   => $this->patternToRegex($pattern),
        ];
    }

    /** 分发请求，找不到路由返回 404 */
    public function dispatch(): void {
        $method = Request::method();
        $path   = Request::path();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            if (preg_match($route['regex'], $path, $matches)) {
                // 提取命名参数
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                call_user_func($route['handler'], $params);
                return;
            }
        }

        Response::notFound("Not Found: {$method} {$path}");
    }

    /** 将路由模式转为正则，如 /photos/:id → /photos/(?P<id>[^/]+) */
    private function patternToRegex(string $pattern): string {
        $regex = preg_replace('/:([a-zA-Z_]+)/', '(?P<$1>[^/]+)', $pattern);
        return '#^' . $regex . '$#';
    }
}
