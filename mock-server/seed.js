/**
 * Seed script: 生成 20 个 Mock 用户（带真实 Unsplash 图片）
 * 运行：npm run seed
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const USERS_DATA = [
  {
    name: '月亮邮递员',
    gender: 'male',
    birthday: '2002-03-15',
    bio: '川大本，保研中科院直博，健身，180',
    school: '四川大学',
    job_title: '研究生',
    city: '成都',
    height_cm: 180,
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: 'Nick Leon',
    gender: 'male',
    birthday: '1999-07-22',
    bio: '27岁/177/ENTJ/大厂打工人/年薪50/爱好健身',
    school: '浙江大学',
    job_title: '产品经理',
    city: '杭州',
    height_cm: 177,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '麦片爱吃肉',
    gender: 'male',
    birthday: '2003-11-08',
    bio: '喜欢猫咪和摄影，周末常去咖啡馆',
    school: '复旦大学',
    job_title: '摄影师',
    city: '上海',
    height_cm: 175,
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '星河漫步',
    gender: 'female',
    birthday: '2000-05-20',
    bio: '设计师/旅行爱好者/INFP',
    school: '中央美术学院',
    job_title: 'UI设计师',
    city: '北京',
    height_cm: 165,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '温柔的风',
    gender: 'female',
    birthday: '2001-09-12',
    bio: '爱音乐爱生活，吉他弹唱中',
    school: '武汉大学',
    job_title: '音乐老师',
    city: '武汉',
    height_cm: 162,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '阳光少年',
    gender: 'male',
    birthday: '2001-01-30',
    bio: '篮球/健身/阳光开朗大男孩',
    school: '清华大学',
    job_title: '软件工程师',
    city: '北京',
    height_cm: 183,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488161628813-04466f0cc7d4?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '咖啡与猫',
    gender: 'female',
    birthday: '2000-12-05',
    bio: '两只猫的铲屎官/咖啡重度依赖',
    school: '南京大学',
    job_title: '自由职业者',
    city: '南京',
    height_cm: 160,
    photos: [
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '深海鱼',
    gender: 'male',
    birthday: '1998-06-18',
    bio: '潜水教练/旅行30+国家/ENTP',
    school: '中山大学',
    job_title: '潜水教练',
    city: '深圳',
    height_cm: 178,
    photos: [
      'https://images.unsplash.com/photo-1501196354995-cbb51c65adc2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '甜甜圈',
    gender: 'female',
    birthday: '2002-04-14',
    bio: '烘焙爱好者/甜品控/周末市集摆摊',
    school: '同济大学',
    job_title: '烘焙师',
    city: '上海',
    height_cm: 158,
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '代码诗人',
    gender: 'male',
    birthday: '1999-08-25',
    bio: '全栈工程师/开源贡献者/咖啡续命',
    school: '北京大学',
    job_title: '全栈工程师',
    city: '北京',
    height_cm: 176,
    photos: [
      'https://images.unsplash.com/photo-1480429370612-2cd0cecfe595?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '森林精灵',
    gender: 'female',
    birthday: '2001-02-28',
    bio: '瑜伽/冥想/素食主义/热爱大自然',
    school: '厦门大学',
    job_title: '瑜伽教练',
    city: '厦门',
    height_cm: 168,
    photos: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '夜行者',
    gender: 'male',
    birthday: '2000-10-10',
    bio: 'DJ/电子音乐制作人/夜猫子',
    school: '上海音乐学院',
    job_title: 'DJ',
    city: '上海',
    height_cm: 181,
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '小鹿斑比',
    gender: 'female',
    birthday: '2003-07-07',
    bio: '大三在读/追星/二次元/社恐',
    school: '华东师范大学',
    job_title: '学生',
    city: '上海',
    height_cm: 163,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '山顶的风',
    gender: 'male',
    birthday: '1997-03-20',
    bio: '登山/越野跑/户外探险/自由灵魂',
    school: '西安交通大学',
    job_title: '户外领队',
    city: '西安',
    height_cm: 179,
    photos: [
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '奶茶少女',
    gender: 'female',
    birthday: '2002-08-16',
    bio: '奶茶一天三杯/追剧达人/吃货',
    school: '浙江大学',
    job_title: '新媒体运营',
    city: '杭州',
    height_cm: 161,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '吉他少年',
    gender: 'male',
    birthday: '2001-11-11',
    bio: '民谣/吉他/写歌/livehouse常客',
    school: '四川音乐学院',
    job_title: '音乐人',
    city: '成都',
    height_cm: 174,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488161628813-04466f0cc7d4?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '画画的鱼',
    gender: 'female',
    birthday: '2000-06-30',
    bio: '插画师/水彩/油画/展览爱好者',
    school: '中国美术学院',
    job_title: '插画师',
    city: '杭州',
    height_cm: 164,
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '篮球小王子',
    gender: 'male',
    birthday: '2002-09-05',
    bio: '校队主力/运动阳光/寻找长期关系',
    school: '北京体育大学',
    job_title: '体育教练',
    city: '北京',
    height_cm: 188,
    photos: [
      'https://images.unsplash.com/photo-1501196354995-cbb51c65adc2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1480429370612-2cd0cecfe595?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '薄荷糖',
    gender: 'female',
    birthday: '2001-04-22',
    bio: '护士/温柔体贴/喜欢做饭',
    school: '北京协和医学院',
    job_title: '护士',
    city: '北京',
    height_cm: 166,
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop',
    ],
  },
  {
    name: '云端旅人',
    gender: 'male',
    birthday: '1998-12-01',
    bio: '飞行员/环球旅行/摄影/红酒',
    school: '中国民航大学',
    job_title: '飞行员',
    city: '广州',
    height_cm: 182,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop',
    ],
  },
];

const INTERESTS_POOL = ['旅行', '美食', '音乐', '电影', '摄影', '阅读', '健身', '瑜伽', '跑步', '游泳', '咖啡', '红酒', '登山', '冲浪', '滑雪', '烘焙', '宠物', '艺术', '桌游', '游戏'];
const PERSONALITY_POOL = ['外向', '内向', '幽默', '冒险', '浪漫', '理性', '感性', '乐观', '温柔', '独立'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randSubset(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function main() {
  const users = USERS_DATA.map((u, i) => ({
    id: 1001 + i,
    phone: `138${String(10000000 + i).slice(-8)}`,
    name: u.name,
    birthday: u.birthday,
    gender: u.gender,
    sexual_orientation: 'straight',
    looking_for: u.gender === 'female' ? 'male' : 'female',
    bio: u.bio,
    school: u.school,
    degree: '本科',
    job_title: u.job_title,
    company: null,
    city: u.city,
    height_cm: u.height_cm,
    dating_purpose: randSubset(['长期关系', '短期约会', '交朋友', '还不确定'], 1, 2),
    interests: randSubset(INTERESTS_POOL, 3, 5),
    lifestyles: {
      smoking: rand(['从不', '偶尔']),
      drinking: rand(['从不', '偶尔', '经常']),
      exercise: rand(['偶尔', '经常', '每天']),
    },
    personality: randSubset(PERSONALITY_POOL, 2, 4),
    photos: u.photos.map((url, j) => ({ id: (1001 + i) * 100 + j, url, sort_order: j })),
    is_verified: Math.random() < 0.5,
    membership: 'free',
    membership_expires_at: null,
    stealth_mode: false,
    super_like_count: 1,
    boost_count: 0,
    read_receipt_count: 0,
    onboarding_complete: true,
    settings: {
      distance_max_km: 50,
      age_min: 18,
      age_max: 60,
      gender_preference: 'all',
      show_gender: true,
      show_age: true,
      show_distance: true,
      show_orientation: false,
      show_online_status: true,
    },
    created_at: new Date().toISOString(),
  }));

  const groups = [
    { id: 1, name: '运动爱好者', cover_image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop', category: 'interest', user_ids: users.slice(0, 8).map(u => u.id) },
    { id: 2, name: '音乐达人', cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop', category: 'interest', user_ids: users.slice(5, 15).map(u => u.id) },
    { id: 3, name: '美食家', cover_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', category: 'interest', user_ids: users.slice(3, 12).map(u => u.id) },
    { id: 4, name: '旅行者', cover_image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop', category: 'interest', user_ids: users.slice(7, 18).map(u => u.id) },
    { id: 5, name: '摄影师', cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop', category: 'interest', user_ids: users.slice(2, 10).map(u => u.id) },
  ];

  const db = {
    users,
    actions: [],
    matches: [],
    messages: [],
    groups,
    notifications: [],
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log(`✅ Seed completed: ${users.length} users, ${groups.length} groups`);
  console.log(`   DB file: ${DB_PATH}`);
}

main();
