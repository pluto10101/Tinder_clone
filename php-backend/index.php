<?php
/**
 * Tinder Clone PHP Backend
 * 统一入口文件，所有请求经 .htaccess 重写到此处
 */

// ---- CORS（允许前端 Vite dev server 跨域访问）----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id');

// 预检请求直接返回 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---- 加载核心类 ----
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/core/Response.php';
require_once __DIR__ . '/core/Request.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/UserHelper.php';

// ---- 加载控制器 ----
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProfileController.php';
require_once __DIR__ . '/controllers/DiscoverController.php';
require_once __DIR__ . '/controllers/MatchController.php';
require_once __DIR__ . '/controllers/ExploreController.php';
require_once __DIR__ . '/controllers/NotificationController.php';

// ---- 注册路由 ----
$router = new Router();

// 健康检查
$router->get('/', function () {
    Response::ok(['name' => 'tinder-clone-php-backend', 'version' => '1.0.0', 'time' => date('c')]);
});

// Auth
$router->post('/auth/sms/send',    [AuthController::class, 'sendSms']);
$router->post('/auth/sms/verify',  [AuthController::class, 'verifySms']);
$router->post('/auth/logout',      [AuthController::class, 'logout']);

// Profile（注意 reorder 路由要在 :id 之前注册，否则会被 :id 匹配）
$router->get('/profile',                      [ProfileController::class, 'get']);
$router->put('/profile',                      [ProfileController::class, 'update']);
$router->post('/profile/photos',              [ProfileController::class, 'uploadPhoto']);
$router->put('/profile/photos/reorder',       [ProfileController::class, 'reorderPhotos']);
$router->delete('/profile/photos/:id',        [ProfileController::class, 'deletePhoto']);
$router->get('/profile/completeness',         [ProfileController::class, 'completeness']);

// Discover
$router->get('/discover/cards',               [DiscoverController::class, 'getCards']);
$router->post('/discover/swipe',              [DiscoverController::class, 'swipe']);
$router->post('/discover/rewind',             [DiscoverController::class, 'rewind']);
$router->get('/discover/filters',             [DiscoverController::class, 'getFilters']);
$router->put('/discover/filters',             [DiscoverController::class, 'updateFilters']);

// Matches
$router->get('/matches',                      [MatchController::class, 'getMatches']);
$router->get('/matches/likes',                [MatchController::class, 'getLikes']);
$router->delete('/matches/:id',               [MatchController::class, 'deleteMatch']);

// Explore
$router->get('/explore/groups',               [ExploreController::class, 'getGroups']);
$router->get('/explore/groups/:id/users',     [ExploreController::class, 'getGroupUsers']);

// Notifications
$router->get('/notifications',                [NotificationController::class, 'getList']);
$router->put('/notifications/read-all',       [NotificationController::class, 'readAll']);

// ---- 分发请求 ----
$router->dispatch();
