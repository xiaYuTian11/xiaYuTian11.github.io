/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","a6981eb9cca88463aa5d6e863a1491e4"],["/archives/1f0b7068.html","8a7b09adb9e7f397efb916bc41a6c42e"],["/archives/1f43d92b.html","6dfea80e81f6e864c663bdd03a1b8211"],["/archives/2020/08/index.html","88eaa67e9857322406b46afee0abcf79"],["/archives/2020/09/index.html","3895180760c4e2c343469d5b8a49a726"],["/archives/2020/10/index.html","fade11c88d352d54cd0d37475e3b221c"],["/archives/2020/11/index.html","e15376715b7c0dd3880291adf564990d"],["/archives/2020/index.html","066adef818b22f944df0160d11841da4"],["/archives/2020/page/2/index.html","712d05eea5ba1beb7ec703c43f79a938"],["/archives/2021/03/index.html","b6cd0248a5f3d4eff540e7a1607a665b"],["/archives/2021/12/index.html","f05bd31cf135c7ce841d97ac3b68a617"],["/archives/2021/index.html","57123dab8f9937e4614858d27ce0bd02"],["/archives/2e20b53e.html","51ca62fa5fc4b314b2afbbbecdad7cd8"],["/archives/407a3a38.html","844a1933df1473e569e4b30267b559c2"],["/archives/456ca0f7.html","650567392607af325b527cb033ea27d9"],["/archives/75c25f59.html","eb9c2025af7512cd60dab3e6a112577a"],["/archives/75c25f59/image-20200902151227315.png","7a4f7a6b8e392b240f9c76d07751b626"],["/archives/8b811d4f.html","bb3b97f6012576d34ca63b38e90ea67b"],["/archives/8c55eb1b.html","1a1ee6b40e04d455a7cf896f5a0283af"],["/archives/a67e061c.html","a066b2239c588b2ad896b773490e45f1"],["/archives/c096da2d.html","d7a8b128403ed1e16c90928920208727"],["/archives/c575efb2.html","5c08d6520b22ab1aa319beea533b0444"],["/archives/cc464ebf.html","fffa58b585d030fe3ff659eb0da0ee27"],["/archives/fe88a97f.html","a9af27e14872adcd41b8ffd5273dc0e3"],["/archives/index.html","332d7b09840c3d408208f3c160876651"],["/archives/page/2/index.html","41d7d741a45dceedc6049a2dc69d5b8b"],["/css/main.css","40881086c87db7f0aadfeff619253031"],["/google6bddafbde91de2e7.html","a85644e45117b845707023f84ee57f5a"],["/images/algolia_logo.svg","88450dd56ea1a00ba772424b30b7d34d"],["/images/apple-touch-icon-next.png","fce961f0bd3cd769bf9c605ae6749bc0"],["/images/avatar.gif","7a2fe6b906600a9354cece6d9ced2992"],["/images/background.jpg","439ff29bff3a95ac62bde178e51902cc"],["/images/cc-by-nc-nd.svg","3b009b0d5970d2c4b18e140933547916"],["/images/cc-by-nc-sa.svg","cf2644b7aa5ebd3f5eab55329b4e7cb7"],["/images/cc-by-nc.svg","e63bcae937a1ae4cb6f83d8a1d26893c"],["/images/cc-by-nd.svg","78359b1307baffc2d0e8cffba5dee2dd"],["/images/cc-by-sa.svg","525d2a82716fe9860a65cf0ac5e231a0"],["/images/cc-by.svg","bd656500a74c634b4ff1333008c62cd8"],["/images/cc-zero.svg","2d6242e90c3082e7892cf478be605d26"],["/images/favicon-16x16-next.png","b8975923a585dbaa8519a6068e364947"],["/images/favicon-32x32-next.png","5a029563fe3214c96f68b46556670ea1"],["/images/logo.svg","88985471c188e5c5a765a8f233c54df5"],["/images/pig.jpg","c30c1ff2861fdb0d7db8813c8dba7146"],["/images/pig1.jpg","c4602ff7bfb49093da40bf7067cfeac0"],["/images/pig2.jpg","bc316557a2e255e0eac1dba9691c2a86"],["/images/pig3.jpg","ac4ec47e3b122387330a102c4d51083f"],["/index.html","a2602b694025d010c8fafc278ccca567"],["/js/algolia-search.js","d20ec0b4393509b0cdf3258e93d3b11d"],["/js/bookmark.js","a620f0daf2d31576b84e88d0adf0db03"],["/js/local-search.js","3607cdfc2ac57992db02aa090b3cc167"],["/js/love.js","4eb8683e8a28b7600b9b87c055837819"],["/js/motion.js","8bef16e3b3cb4a4185b083ad5c69cbbd"],["/js/next-boot.js","d8857bb171fe890adff1d8a104a1a726"],["/js/schemes/muse.js","160b26ee0326bfba83d6d51988716b08"],["/js/schemes/pisces.js","e383b31dff5fe3117bfb69c0bfb6b33d"],["/js/utils.js","766c5591ff85631b6b962ae3d57ae903"],["/lib/anime.min.js","864a144dbbc956381a47679ec57ab06c"],["/lib/font-awesome/css/all.min.css","76cb46c10b6c0293433b371bae2414b2"],["/lib/font-awesome/webfonts/fa-brands-400.woff2","a06da7f0950f9dd366fc9db9d56d618a"],["/lib/font-awesome/webfonts/fa-regular-400.woff2","c20b5b7362d8d7bb7eddf94344ace33e"],["/lib/font-awesome/webfonts/fa-solid-900.woff2","b15db15f746f29ffa02638cb455b8ec0"],["/lib/velocity/velocity.min.js","c1b8d079c7049879838d78e0b389965e"],["/lib/velocity/velocity.ui.min.js","444faf512fb24d50a5dec747cbbe39bd"],["/page/2/index.html","c6195517482c301434ef482504280d9f"],["/resource/index.assets/34808f04-9191-4b01-9f83-34fe0cd27c53.jpg","3f77858974b913b1319021007711410c"],["/resource/index.html","7696ac4e511074c7ae55aa2c7fffeb61"],["/sw-register.js","8760bbf5b0d846ee96f3f4f39b4dab64"],["/tags/ActiveMQ/index.html","ddbca63fa664307e2082bc00257f4f41"],["/tags/Git/index.html","b796b9995abf5fe9113d21c3033e2a31"],["/tags/IO/index.html","cf992a63dd069348dba980d30e731f5c"],["/tags/Java/index.html","7620ff76f6cbdcf9fd065c42e586636d"],["/tags/Jdk/index.html","fa8db5f28f519ba3ee0245694a7427ed"],["/tags/Linux/index.html","07b0ad033b3c9bbb914ff8b5eb399d5c"],["/tags/MQ/index.html","ea9842a69f044af1cd8ec95b28d89fcc"],["/tags/PostgreSQL/index.html","b75864e3dc54a60ca265c1aaa0948e07"],["/tags/SPI/index.html","c5249404b4db5dc69c94a07e672ebf88"],["/tags/SnowFlake/index.html","77e51ec9309a1b5807098b47346f8db3"],["/tags/SpringBoot/index.html","92468e070e4bd643c574767e4310445b"],["/tags/UidGenerator/index.html","c9dfbf932ad6f33a16160ae68849e608"],["/tags/freemarker/index.html","1ec02684745e483d099a268972322321"],["/tags/logback/index.html","b920bc62396df7345349d6f8b4690409"],["/tags/scp/index.html","0819331c204f424da8cfa40766d019c1"],["/tags/ssh/index.html","469a42b675d54c106270d17286b114f3"],["/tags/中文乱码/index.html","1f6e8991f157ae8cef9a055d3dc1d674"],["/tags/代码生成器/index.html","42c4161db6470984d0233eddc81f8c35"],["/tags/分布式/index.html","f2048269170cced4fa18c91c9d59cb6b"],["/tags/分布式ID/index.html","e362f1e0abd8961ac1e298e12ef1e3d5"],["/tags/初始化/index.html","455bdec3f17c39c927b4f479a5a2ad2a"],["/tags/日志，logback/index.html","fb04d610021ac3322ad10c25dad3b123"],["/tags/程序员/index.html","dfb094bfaddbbd5d1dee498b7add87a5"],["/tags/路线/index.html","bc7d674356c5372e6090f62998fbb9a5"],["/tags/远程仓库/index.html","8db0fde15c657b0f76e615a285736efd"],["/tags/远程拷贝，备份，还原，dump/index.html","7ce74a97b27d13e5866742a6a8839a1c"]];
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
