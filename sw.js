/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","a6981eb9cca88463aa5d6e863a1491e4"],["/about/index.html","12d6bb75afbdc95e2c05d982f1f2cbeb"],["/archives/1f0b7068.html","6c0391099e53d6710d3d4733a48c15d2"],["/archives/1f43d92b.html","7779666ba9b003c84683d967ef467feb"],["/archives/2020/08/index.html","395e1bd4983b3a363d7f4c44a83f8244"],["/archives/2020/09/index.html","d7171bd28d6345f1f3c4afe1b5ac3bf2"],["/archives/2020/10/index.html","ceab4a70e3163e480b17bcdbac8e4b65"],["/archives/2020/11/index.html","f372916ba5ec6e8e0ce04a87d5ea65e7"],["/archives/2020/index.html","91c4bda20b0d331ccd23bc8a9435f1e3"],["/archives/2020/page/2/index.html","57724f240d641b74ab4455d21b0330ef"],["/archives/2021/03/index.html","cf21a47c8424cc1168ed21fdd559041a"],["/archives/2021/12/index.html","aaf65a7f37e48ba78f6b36fb652ddad9"],["/archives/2021/index.html","00c01800848a4d672bcd3f27c98e0082"],["/archives/2023/04/index.html","00046dc641e9a07da97b42c10801209c"],["/archives/2023/index.html","370c8e7242e280206ffdc02f53c4fa40"],["/archives/24385ec7.html","b9cbc19d58263636863c547ef966c3df"],["/archives/2e20b53e.html","40665c34de049064825f633fa111b9e1"],["/archives/407a3a38.html","11434c95e84062029af4d8c638e255c9"],["/archives/456ca0f7.html","f1bded6ec597214152b9b96c323d948d"],["/archives/75c25f59.html","6010adda2480c6fd643d4a50a9cf8c91"],["/archives/75c25f59/image-20200902151227315.png","7a4f7a6b8e392b240f9c76d07751b626"],["/archives/8b811d4f.html","fad0965e890c9d9d1024e21ef815db13"],["/archives/8c55eb1b.html","63f2e11141ff73f0c75e3043370e053a"],["/archives/9c2f68c4.html","cffa5d44ef134bb47b7a56a398269c5e"],["/archives/a67e061c.html","2c4dbed6e8e8a7276aa3c14cb996c18a"],["/archives/c096da2d.html","bb1a8c1440b090143a475c51abdd6306"],["/archives/c575efb2.html","13c7b846f789f6f35449b677a60a22dc"],["/archives/cc464ebf.html","ec6ecad9c88514934efcd9d244791ee7"],["/archives/fe88a97f.html","29500da0da863f195519f280d7bdfd78"],["/archives/index.html","798c554ed3cc0cdf1311dbebf2952f07"],["/archives/page/2/index.html","26c35a477be8e41810f502c8e4ce06b5"],["/css/main.css","ec454b0fb20d703e8f0da06b44200b10"],["/google6bddafbde91de2e7.html","a788a2a990c3a292e614529f96339db6"],["/images/Backend.png","18fd9ef7da1cdfbc1f889016f9087292"],["/images/DevOps.png","a783ed0d4574386a1088af1a230099ea"],["/images/Frontend.png","52d338ea9db3305d506b07d780501b97"],["/images/Snipaste_2023-04-10_22-13-44.png","b451c24ecafe498bc1750cff3aa07fb2"],["/images/Snipaste_2023-04-10_22-18-13.png","1b0e9e743adfca3e463bdbc21c592100"],["/images/algolia_logo.svg","88450dd56ea1a00ba772424b30b7d34d"],["/images/apple-touch-icon-next.png","fce961f0bd3cd769bf9c605ae6749bc0"],["/images/avatar.gif","7a2fe6b906600a9354cece6d9ced2992"],["/images/background.jpg","439ff29bff3a95ac62bde178e51902cc"],["/images/background.png","3b66422395ea46aaabd6017a9bc9b8ec"],["/images/background1.png","0b54574c2762554bd2ce5f3ae7723082"],["/images/background3.png","ef0f94f4a05cf34d24defa47c64cc1f0"],["/images/cc-by-nc-nd.svg","3b009b0d5970d2c4b18e140933547916"],["/images/cc-by-nc-sa.svg","cf2644b7aa5ebd3f5eab55329b4e7cb7"],["/images/cc-by-nc.svg","e63bcae937a1ae4cb6f83d8a1d26893c"],["/images/cc-by-nd.svg","78359b1307baffc2d0e8cffba5dee2dd"],["/images/cc-by-sa.svg","525d2a82716fe9860a65cf0ac5e231a0"],["/images/cc-by.svg","bd656500a74c634b4ff1333008c62cd8"],["/images/cc-zero.svg","2d6242e90c3082e7892cf478be605d26"],["/images/favicon-16x16-next.png","b8975923a585dbaa8519a6068e364947"],["/images/favicon-32x32-next.png","5a029563fe3214c96f68b46556670ea1"],["/images/logo.svg","88985471c188e5c5a765a8f233c54df5"],["/images/pig.jpg","e1f0026327ac3fd11a87210ecb3a9274"],["/images/pig1.jpg","c4602ff7bfb49093da40bf7067cfeac0"],["/images/pig2.jpg","bc316557a2e255e0eac1dba9691c2a86"],["/images/pig3.jpg","ac4ec47e3b122387330a102c4d51083f"],["/images/pig4.jpg","c30c1ff2861fdb0d7db8813c8dba7146"],["/index.html","059b989b5b248661af3a3c12d6b2b1f2"],["/js/algolia-search.js","d20ec0b4393509b0cdf3258e93d3b11d"],["/js/bookmark.js","a620f0daf2d31576b84e88d0adf0db03"],["/js/local-search.js","3607cdfc2ac57992db02aa090b3cc167"],["/js/love.js","4eb8683e8a28b7600b9b87c055837819"],["/js/motion.js","8bef16e3b3cb4a4185b083ad5c69cbbd"],["/js/next-boot.js","d8857bb171fe890adff1d8a104a1a726"],["/js/schemes/muse.js","160b26ee0326bfba83d6d51988716b08"],["/js/schemes/pisces.js","e383b31dff5fe3117bfb69c0bfb6b33d"],["/js/utils.js","766c5591ff85631b6b962ae3d57ae903"],["/lib/anime.min.js","864a144dbbc956381a47679ec57ab06c"],["/lib/font-awesome/css/all.min.css","76cb46c10b6c0293433b371bae2414b2"],["/lib/font-awesome/webfonts/fa-brands-400.woff2","a06da7f0950f9dd366fc9db9d56d618a"],["/lib/font-awesome/webfonts/fa-regular-400.woff2","c20b5b7362d8d7bb7eddf94344ace33e"],["/lib/font-awesome/webfonts/fa-solid-900.woff2","b15db15f746f29ffa02638cb455b8ec0"],["/lib/velocity/velocity.min.js","c1b8d079c7049879838d78e0b389965e"],["/lib/velocity/velocity.ui.min.js","444faf512fb24d50a5dec747cbbe39bd"],["/page/2/index.html","2903641f5a39e9bb061e65e0f50d49bf"],["/resource/index.assets/34808f04-9191-4b01-9f83-34fe0cd27c53.jpg","3f77858974b913b1319021007711410c"],["/resource/index.html","a1023981de56860a2b0d529520c46183"],["/sw-register.js","1353d5e909695e37b1b3959eebb1be93"],["/tags/ActiveMQ/index.html","a0bde00f7d35131af12f979b034b0c9b"],["/tags/Git/index.html","78a697e4835d98001124070a619f1d48"],["/tags/IO/index.html","574993055c3ad453e89afe3052773126"],["/tags/Java/index.html","b9639595bad85828916f8312efa2f9df"],["/tags/Jdk/index.html","4981aa954590e48099be1ec1bbbfaaeb"],["/tags/Linux/index.html","7da6f64c39c6d5b74a99adcc55cdd45b"],["/tags/MQ/index.html","dd17e100d87552c06279332178514005"],["/tags/PostgreSQL/index.html","db61ec064800f8062787718496397c1f"],["/tags/SPI/index.html","d09fb380b33541c990aeb9202f2377b3"],["/tags/SnowFlake/index.html","95335d978df29c39e83b951d67e93112"],["/tags/SpringBoot/index.html","cc525c30c75eff5368b40e6140a118c1"],["/tags/UidGenerator/index.html","c4e7d1840f3576fc0ea34379e3e893bd"],["/tags/freemarker/index.html","e38fde5d982effcc5c59aea1e18494d5"],["/tags/index.html","df341a45355fda86478683218a5b500f"],["/tags/logback/index.html","95efb30a5079d825e0c385deb415ecda"],["/tags/maven/index.html","14d90fe3bbdf489a06289f73758d6977"],["/tags/scp/index.html","f704dc95eb4c12dfad22bd90b81d30e7"],["/tags/shell/index.html","eb3dae856f49fbd92cb09868e6136b15"],["/tags/spring/index.html","ef73d70154f172593582e297462ea55e"],["/tags/ssh/index.html","9461994afa6e4e17806c581a50664b2d"],["/tags/东方通/index.html","967a6b12f3e086aad6282faa43843bf4"],["/tags/中文乱码/index.html","c347e36711b46ab9a439637b05e00a87"],["/tags/代码生成器/index.html","7dcce6bdefcaf60e6e32177044e6c5d2"],["/tags/分布式/index.html","a7410af01e682be0c83b0394faad1c7b"],["/tags/分布式ID/index.html","7b1a13234f0cd5d2ca9aac4489434aa5"],["/tags/初始化/index.html","b1cc7bb71f0fcee5c85ebb1119c1cb4d"],["/tags/国产化/index.html","bd29fd01f5708c67e8a35de4db1b953e"],["/tags/日志，logback/index.html","f52d2cec476484dc3f9f223a3262f305"],["/tags/程序员/index.html","337d3991fbae19a0b49abcd0fa99dcb9"],["/tags/路线/index.html","fa664a9356a4420c2ed93bd81a844fec"],["/tags/远程仓库/index.html","06fda83818ad2baca4ac3a68dced519d"],["/tags/远程拷贝，备份，还原，dump/index.html","da9ff8f1ab64aa470c5f52dc5050fad9"],["/tags/金蝶/index.html","1e3533432932be48164f9477584f0b92"]];
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
