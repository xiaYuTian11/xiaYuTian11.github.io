---
title: ServiceLoader (SPI)
tags: [Jdk,SPI]
abbrlink: c575efb2
date: 2020-09-09 19:25:44
---

## 概述

​		最近学习Spring Boot 启动过程时，发现加载配置类时用到了 `java.util.ServiceLoader`，后来发现不止Spring Boot 用到，其他很多框架，譬如Dubbo，JDBC，日志框架等。

​		SPI 的核心思想就是解耦。定则规则，然后其他人进行自定义实现规则。

<!-- more -->

## 使用

### 代码

SPI的使用其实非常简单，主要分为以下几个步骤：

- 定义一个接口及一个或多个实现类。

- 实现类必须带有无参构造方法。

- 在resources目录下创建META-INF/services目录，在services下创建一个以接口的全限定名为文件名的文件，将实现类的全限定名记录到这个文件里面，如果有多个实现类，直接换行进行记录，每行一个实现类。

- 通过 java.util.ServiceLoader load方法进行加载。

- 

    定义一个 Trip 接口：

    ```java
    package com.sunnyday.jdk;
    
    public interface Trip {
        void mode();
    }
    ```

    定义两个实现类：

    ```java
    package com.sunnyday.jdk.impl;
    
    public class RunTrip implements Trip {
        @Override
        public void mode() {
            System.out.println("跑步前进");
        }
    }
    
    public class WalkTrip implements Trip {
        @Override
        public void mode() {
            System.out.println("步行方式");
        }
    }
    ```

    

    在resources/META-INF/services 下创建名为 com.sunnyday.jdk.Trip的文件，内容如下：

    ```tex
    com.sunnyday.jdk.impl.RunTrip
    com.sunnyday.jdk.impl.WalkTrip
    ```



### 测试

执行测试方法

```jav
 	@Test
    public void test() {
        final ClassLoader classLoader = this.getClass().getClassLoader();
        final ServiceLoader<Trip> load = ServiceLoader.load(Trip.class, classLoader);
        for (Trip next : load) {
            next.mode();
        }
    }
```

控制台输出

```tex
跑步前进
步行方式
```

## 免配置文件

​		auto-service 是Google提供的工具类，可以在实现类上添加@AutoService 注解并指定接口，可以省去手动配置类全限定名的麻烦。

代码：

接口：

```java
package com.sunnyday.google;

/**
 * @author TMW
 * @date 2020/9/8 15:58
 */
public interface Weather {

    void report();
}

```

实现类：

```java
package com.sunnyday.google.impl;

import com.google.auto.service.AutoService;
import com.sunnyday.google.Weather;

/**
 * @author TMW
 * @date 2020/9/8 15:59
 */
@AutoService(Weather.class)
public class SunnyWeather implements Weather {
    @Override
    public void report() {
        System.out.println("明天艳阳高照");
    }
}


@AutoService(Weather.class)
public class RainWeather implements Weather {
    @Override
    public void report() {
        System.out.println("明天将要下雨");
    }
}
```

测试：

```java
@Test
void report() {
    final ClassLoader classLoader = this.getClass().getClassLoader();
    final ServiceLoader<Weather> weathers = ServiceLoader.load(Weather.class, classLoader);
    for (Weather weather : weathers) {
        weather.report();
    }
}
```

不用添加配置文件，运行测试类可以看到控制台一样可以正常输出。

```tex
明天将要下雨
明天艳阳高照
```



源码参考：https://github.com/xiaYuTian11/blog_demo/tree/master/SPI



