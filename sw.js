/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","a6981eb9cca88463aa5d6e863a1491e4"],["/archives/1f0b7068.html","1e7e9d834a846a0af02f06b6b0827590"],["/archives/1f43d92b.html","b2a5b0fb1f5c9c56511a06782e350b82"],["/archives/2020/08/index.html","7cb8de5f1c94235a7ff968ec01932414"],["/archives/2020/09/index.html","5137ea1971e7dd16f0711eff75dc6939"],["/archives/2020/10/index.html","c7cdc28c8bfa6435a3f99f38bb971bfa"],["/archives/2020/11/index.html","a02f58f95222272eee58ab20ce7f5cb4"],["/archives/2020/index.html","6935518693003853b5162d5b331d4b32"],["/archives/2020/page/2/index.html","dd5e81fa96c21b63a04eeae1783ae1d4"],["/archives/2021/03/index.html","751a84cb6b78f2152096be1d23df29fc"],["/archives/2021/index.html","cd627b72cc1acc6a11bca256a8a3e1da"],["/archives/2e20b53e.html","685402ed7af5884931dc41c614c325cf"],["/archives/407a3a38.html","0157fc3c8e5a3c9ea905ed97660ede15"],["/archives/456ca0f7.html","55a3c38e67d834d21b474f84b5afbf4d"],["/archives/75c25f59.html","f40a450b4a29e2d804d5f8e013643d2c"],["/archives/75c25f59/image-20200902151227315.png","7a4f7a6b8e392b240f9c76d07751b626"],["/archives/8b811d4f.html","de2b13dbd9b6fd088463bf15448d6604"],["/archives/8c55eb1b.html","f867e5cefe2d0174209024b87e8dd593"],["/archives/c096da2d.html","32b1c493a6e18fd657334d392770f875"],["/archives/c575efb2.html","3d008160d90441ab35af17b7725dddde"],["/archives/cc464ebf.html","7ea4932496e0054c5bf3c5de4e3c948c"],["/archives/fe88a97f.html","618dfef3461153cc85f7145c9d4422ea"],["/archives/index.html","818d5b3d7e9c916d243442169bf57fd0"],["/archives/page/2/index.html","211f31e1479a3ec511666f28402bbab7"],["/css/main.css","b1d91485fcad79f754c2155ae88eaa54"],["/google6bddafbde91de2e7.html","b7ebbab779e3a96c9135a8d331eec734"],["/images/algolia_logo.svg","88450dd56ea1a00ba772424b30b7d34d"],["/images/apple-touch-icon-next.png","fce961f0bd3cd769bf9c605ae6749bc0"],["/images/avatar.gif","7a2fe6b906600a9354cece6d9ced2992"],["/images/background.jpg","439ff29bff3a95ac62bde178e51902cc"],["/images/cc-by-nc-nd.svg","3b009b0d5970d2c4b18e140933547916"],["/images/cc-by-nc-sa.svg","cf2644b7aa5ebd3f5eab55329b4e7cb7"],["/images/cc-by-nc.svg","e63bcae937a1ae4cb6f83d8a1d26893c"],["/images/cc-by-nd.svg","78359b1307baffc2d0e8cffba5dee2dd"],["/images/cc-by-sa.svg","525d2a82716fe9860a65cf0ac5e231a0"],["/images/cc-by.svg","bd656500a74c634b4ff1333008c62cd8"],["/images/cc-zero.svg","2d6242e90c3082e7892cf478be605d26"],["/images/favicon-16x16-next.png","b8975923a585dbaa8519a6068e364947"],["/images/favicon-32x32-next.png","5a029563fe3214c96f68b46556670ea1"],["/images/logo.svg","88985471c188e5c5a765a8f233c54df5"],["/images/pig.jpg","c30c1ff2861fdb0d7db8813c8dba7146"],["/images/pig1.jpg","c4602ff7bfb49093da40bf7067cfeac0"],["/images/pig2.jpg","bc316557a2e255e0eac1dba9691c2a86"],["/images/pig3.jpg","ac4ec47e3b122387330a102c4d51083f"],["/index.html","90e961bb783929c23ee11d41268a9b5e"],["/js/algolia-search.js","d20ec0b4393509b0cdf3258e93d3b11d"],["/js/bookmark.js","a620f0daf2d31576b84e88d0adf0db03"],["/js/local-search.js","3607cdfc2ac57992db02aa090b3cc167"],["/js/love.js","4eb8683e8a28b7600b9b87c055837819"],["/js/motion.js","8bef16e3b3cb4a4185b083ad5c69cbbd"],["/js/next-boot.js","d8857bb171fe890adff1d8a104a1a726"],["/js/schemes/muse.js","160b26ee0326bfba83d6d51988716b08"],["/js/schemes/pisces.js","e383b31dff5fe3117bfb69c0bfb6b33d"],["/js/utils.js","766c5591ff85631b6b962ae3d57ae903"],["/lib/anime.min.js","864a144dbbc956381a47679ec57ab06c"],["/lib/font-awesome/css/all.min.css","76cb46c10b6c0293433b371bae2414b2"],["/lib/font-awesome/webfonts/fa-brands-400.woff2","a06da7f0950f9dd366fc9db9d56d618a"],["/lib/font-awesome/webfonts/fa-regular-400.woff2","c20b5b7362d8d7bb7eddf94344ace33e"],["/lib/font-awesome/webfonts/fa-solid-900.woff2","b15db15f746f29ffa02638cb455b8ec0"],["/lib/velocity/velocity.min.js","c1b8d079c7049879838d78e0b389965e"],["/lib/velocity/velocity.ui.min.js","444faf512fb24d50a5dec747cbbe39bd"],["/page/2/index.html","d391bc8d25cb2f6433ec2865b3beb79d"],["/resource/index.assets/34808f04-9191-4b01-9f83-34fe0cd27c53.jpg","3f77858974b913b1319021007711410c"],["/resource/index.html","f3fd955470f169164978738bec2030ab"],["/sw-register.js","9cba121c6911f687bd5c05fbe3e1c96d"],["/tags/ActiveMQ/index.html","672adb70f7a254f58637b77282cfd467"],["/tags/Git/index.html","7613a8e6a27e21e7b9dfd26e9fe02eb1"],["/tags/IO/index.html","d7d06d9a4f0b29d599c425680fdfc917"],["/tags/Jdk/index.html","be142ea7393b9b00cac1f678d695517e"],["/tags/Linux/index.html","78b5006f06ef6d4fafb401f39b663ae4"],["/tags/MQ/index.html","6c49f7176569f6d0f75ee34366aa2ff0"],["/tags/PostgreSQL/index.html","558b1f4666edce7caa666d44ebff069f"],["/tags/SPI/index.html","0c89de1bb6c358282294f3f0a70a44eb"],["/tags/SnowFlake/index.html","c69e67e0cd4306bcc80e6537550b3427"],["/tags/SpringBoot/index.html","2d6f686392a02801889e5676a3b79a0e"],["/tags/UidGenerator/index.html","478ff26556193d90e21392073aed6119"],["/tags/freemarker/index.html","cee15c327e2ffb104159a9e60037a4b8"],["/tags/logback/index.html","0789ad9a9215c4128feffd250016fd06"],["/tags/scp/index.html","53decf2e7fc7e516a44ef4e9485a8802"],["/tags/ssh/index.html","6eab5901f78272513086359cd99666b9"],["/tags/中文乱码/index.html","307a73265e32f7a44b95ba33ce11382b"],["/tags/代码生成器/index.html","2d271292925d445a5250c34d4e63fc31"],["/tags/分布式/index.html","e50c2815b9db088b78e33a707c395413"],["/tags/分布式ID/index.html","14db5ad26f0a3b09d75189071b1cd18f"],["/tags/初始化/index.html","169da8126e0f47c1768b0df5f681fcf6"],["/tags/日志，logback/index.html","8c6265b9b4fc37c9b85d69cacfed522d"],["/tags/远程仓库/index.html","9b13d102b4806237bd811cb31e1009d8"],["/tags/远程拷贝，备份，还原，dump/index.html","9a66b6e99c608abcd6cf3727e31b1005"]];
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
