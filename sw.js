/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","a6981eb9cca88463aa5d6e863a1491e4"],["/archives/1f0b7068.html","3d43c2c2ef284af9a12089b6af290792"],["/archives/1f43d92b.html","10ea6c1c1a47f46e0e97c78eb85761c5"],["/archives/2020/08/index.html","13d2be3060aceaaea5593b9140cd190e"],["/archives/2020/09/index.html","98c308ac03911510ea9010122647a011"],["/archives/2020/10/index.html","7b8792bd9dfc902a74345b64ad8d10b3"],["/archives/2020/11/index.html","e6e5fed619f694f2659a48bfe8d0fb20"],["/archives/2020/index.html","2ff301c805f5acd24d6d9c49bca9c5ed"],["/archives/2020/page/2/index.html","b55416d7c2e6c4cc1f0d6f606f27cc97"],["/archives/2021/03/index.html","694509a1f017c931c0798d4a714e97ca"],["/archives/2021/12/index.html","b6191a5d1a766582e6216d04a1b88116"],["/archives/2021/index.html","eb5171fdd497d2031a35d8976a3b1a33"],["/archives/2023/04/index.html","b2025cfc9516c9954489858fa2c452f4"],["/archives/2023/index.html","1bf6d2d132d8da0fdc964ab0707bbf98"],["/archives/24385ec7.html","7bfaa4a9c10ca95794c79adc02e4f58a"],["/archives/2e20b53e.html","7ec78c5be00c112b20c8ed91582c7bcd"],["/archives/407a3a38.html","a5a024d303440f22b853ec62d5f1b90d"],["/archives/456ca0f7.html","7fe291777593be6639be3b697a7fe601"],["/archives/75c25f59.html","4f1cc624c063fcb0247f46b1b8d92dec"],["/archives/75c25f59/image-20200902151227315.png","7a4f7a6b8e392b240f9c76d07751b626"],["/archives/8b811d4f.html","81cc29a9485a206855732c3e94b0c906"],["/archives/8c55eb1b.html","acc4ffb3909fb4980d5b906800c24e6e"],["/archives/a67e061c.html","0d27320783f76f1970337ed2bfd9ac02"],["/archives/c096da2d.html","b9bfcce4078d18b8273efc1973cc6a55"],["/archives/c575efb2.html","d4cebc3c4de5989d0aa6f8f097aaa7ac"],["/archives/cc464ebf.html","5c8d79481a41d1a186b198a0733245f3"],["/archives/fe88a97f.html","0b32425611c10f96e5283145b878414a"],["/archives/index.html","262a114c78954cd0c135103ab6b26e49"],["/archives/page/2/index.html","448beb84be6892d9c15357621ad3195d"],["/css/main.css","75e351bcad19c9e4bf7039bf20b3970b"],["/google6bddafbde91de2e7.html","606b8bbf84949b735ffa98ada4620014"],["/images/Backend.png","18fd9ef7da1cdfbc1f889016f9087292"],["/images/DevOps.png","a783ed0d4574386a1088af1a230099ea"],["/images/Frontend.png","52d338ea9db3305d506b07d780501b97"],["/images/Snipaste_2023-04-10_22-13-44.png","b451c24ecafe498bc1750cff3aa07fb2"],["/images/Snipaste_2023-04-10_22-18-13.png","1b0e9e743adfca3e463bdbc21c592100"],["/images/algolia_logo.svg","88450dd56ea1a00ba772424b30b7d34d"],["/images/apple-touch-icon-next.png","fce961f0bd3cd769bf9c605ae6749bc0"],["/images/avatar.gif","7a2fe6b906600a9354cece6d9ced2992"],["/images/background.jpg","439ff29bff3a95ac62bde178e51902cc"],["/images/cc-by-nc-nd.svg","3b009b0d5970d2c4b18e140933547916"],["/images/cc-by-nc-sa.svg","cf2644b7aa5ebd3f5eab55329b4e7cb7"],["/images/cc-by-nc.svg","e63bcae937a1ae4cb6f83d8a1d26893c"],["/images/cc-by-nd.svg","78359b1307baffc2d0e8cffba5dee2dd"],["/images/cc-by-sa.svg","525d2a82716fe9860a65cf0ac5e231a0"],["/images/cc-by.svg","bd656500a74c634b4ff1333008c62cd8"],["/images/cc-zero.svg","2d6242e90c3082e7892cf478be605d26"],["/images/favicon-16x16-next.png","b8975923a585dbaa8519a6068e364947"],["/images/favicon-32x32-next.png","5a029563fe3214c96f68b46556670ea1"],["/images/logo.svg","88985471c188e5c5a765a8f233c54df5"],["/images/pig.jpg","c30c1ff2861fdb0d7db8813c8dba7146"],["/images/pig1.jpg","c4602ff7bfb49093da40bf7067cfeac0"],["/images/pig2.jpg","bc316557a2e255e0eac1dba9691c2a86"],["/images/pig3.jpg","ac4ec47e3b122387330a102c4d51083f"],["/index.html","343496efbca3d9741690760fc830fa3b"],["/js/algolia-search.js","d20ec0b4393509b0cdf3258e93d3b11d"],["/js/bookmark.js","a620f0daf2d31576b84e88d0adf0db03"],["/js/local-search.js","3607cdfc2ac57992db02aa090b3cc167"],["/js/love.js","4eb8683e8a28b7600b9b87c055837819"],["/js/motion.js","8bef16e3b3cb4a4185b083ad5c69cbbd"],["/js/next-boot.js","d8857bb171fe890adff1d8a104a1a726"],["/js/schemes/muse.js","160b26ee0326bfba83d6d51988716b08"],["/js/schemes/pisces.js","e383b31dff5fe3117bfb69c0bfb6b33d"],["/js/utils.js","766c5591ff85631b6b962ae3d57ae903"],["/lib/anime.min.js","864a144dbbc956381a47679ec57ab06c"],["/lib/font-awesome/css/all.min.css","76cb46c10b6c0293433b371bae2414b2"],["/lib/font-awesome/webfonts/fa-brands-400.woff2","a06da7f0950f9dd366fc9db9d56d618a"],["/lib/font-awesome/webfonts/fa-regular-400.woff2","c20b5b7362d8d7bb7eddf94344ace33e"],["/lib/font-awesome/webfonts/fa-solid-900.woff2","b15db15f746f29ffa02638cb455b8ec0"],["/lib/velocity/velocity.min.js","c1b8d079c7049879838d78e0b389965e"],["/lib/velocity/velocity.ui.min.js","444faf512fb24d50a5dec747cbbe39bd"],["/page/2/index.html","ab65f9ac108f53fd585650575bc7946a"],["/resource/index.assets/34808f04-9191-4b01-9f83-34fe0cd27c53.jpg","3f77858974b913b1319021007711410c"],["/resource/index.html","4fa781e1adc60b88de2fb2c92399f709"],["/sw-register.js","0f6d3f2ece266530dc3d1d21d583e11b"],["/tags/ActiveMQ/index.html","cfa3b819640af480e9de1508b1efaadf"],["/tags/Git/index.html","7f61b44f72446d17f8dfa7db25090159"],["/tags/IO/index.html","63f8538278353848379b478c82bf3cba"],["/tags/Java/index.html","20e7921296b23e2079217ffd2cfcb339"],["/tags/Jdk/index.html","46bf7e09a381341a289c72ebd7b2c3a3"],["/tags/Linux/index.html","095167d57fc56a2a0ded0be345a0aac2"],["/tags/MQ/index.html","5449df8ddcda0de3dededf2cbca052ac"],["/tags/PostgreSQL/index.html","574b29d3e1dc36f3d6ba9fa5888b1d1c"],["/tags/SPI/index.html","048e1180da9395d2eaad38fdf2d785c1"],["/tags/SnowFlake/index.html","6048b4ab0d05b9f28de333ac51aa78e0"],["/tags/SpringBoot/index.html","a0e3027dde853869d1934f23cd0eb251"],["/tags/UidGenerator/index.html","272b89f7e62a108bac5f94da678258df"],["/tags/freemarker/index.html","aa3cc6da34180e55e58f8e4bc3ea9ca3"],["/tags/logback/index.html","94d59bf63a99347c27a51be039af2ed8"],["/tags/maven/index.html","6cf223354b96f5f1588c02e58c2bb7cf"],["/tags/scp/index.html","8e0c376eedf9dff30264671d527b5a63"],["/tags/ssh/index.html","92781c4379ab754339559dc304294b1c"],["/tags/东方通/index.html","eec1b35fd4da0a868a2f345ce1b42d96"],["/tags/中文乱码/index.html","ae2c72875d004f854996634155049d73"],["/tags/代码生成器/index.html","fdb796d2d98bf1564d877c158782aef7"],["/tags/分布式/index.html","00148d7f02ebff96da1c031ff8d9b166"],["/tags/分布式ID/index.html","6e5c32a9de65b288854207dbf9c8f5cd"],["/tags/初始化/index.html","a60220c4d770aff73fab897c5612f9d1"],["/tags/国产化/index.html","0cddf2f1822adc53c20675143a2efad9"],["/tags/日志，logback/index.html","9c06fb06724d6bb1c3fc6373b44fc264"],["/tags/程序员/index.html","4b424a0fb770348824228680af6c471a"],["/tags/路线/index.html","85015dc6a682090a415edc9d18ab7277"],["/tags/远程仓库/index.html","ec338b6d593d01882182fc58da48c9e1"],["/tags/远程拷贝，备份，还原，dump/index.html","ed3c9edd9d3d131254d7a82bb3d578d0"],["/tags/金蝶/index.html","c7269c9ed8af9d914676eb55ebe86c89"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
