---
title: Logback 配置模版
tags:
  - 日志，logback
abbrlink: c096da2d
date: 2020-11-01 22:20:38
---

​		官方文档地址：http://logback.qos.ch/documentation.html

<!-- more -->

## 依赖

```xml
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>1.2.3</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.3</version>
        </dependency>
```

## 配置

​	logback.xml   自用配置模版 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
    scan: 当此属性设置为 true 时，配置文件如果发生改变，将会被重新加载，默认值为 true。
    scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当 scan 为 true 时，此属性生效。默认的时间间隔为 1 分钟。
    debug: 当此属性设置为 true 时，将打印出 logback 内部日志信息，实时查看 logback 运行状态。默认值为 false。
-->
<configuration scan="true" scanPeriod="60 seconds" debug="false">

    <property name="logback.logDir" value="./logs"/>
    <property name="logback.appName" value="log"/>
    <property name="CONSOLE_LOG_PATTERN"
              value="%date{yyyy-MM-dd HH:mm:ss} | %highlight(%-5level) | %boldYellow(%thread) | %boldGreen(%logger.%method) | %highlight(%msg%n)"/>
    <property name="FILE_PATTERN" value="%date{yyyy-MM-dd HH:mm:ss} | %-1level | %thread | %logger.%method | %msg%n"/>

    <!-- 输出到控制台 ConsoleAppender -->
    <appender name="consoleLog" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <charset>UTF-8</charset>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
        <!-- 过滤器 -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
    </appender>

    <!-- 输出INFO日志到文件 -->
    <appender name="fileInfoLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--
            如果只是想要 Info 级别的日志，只是过滤 info 还是会输出 Error 日志，因为 Error 的级别高，
            所以我们使用下面的策略，可以避免输出 Error 的日志
        -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!--过滤 Error-->
            <level>ERROR</level>
            <!--匹配到就禁止-->
            <onMatch>DENY</onMatch>
            <!--没有匹配到就允许-->
            <onMismatch>ACCEPT</onMismatch>
        </filter>
        <!--
            日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则
            如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天
            的日志改名为今天的日期。即，<File> 的日志都是当天的。
        -->
        <File>${logback.logDir}/${logback.appName}_info.log</File>
        <!-- 滚动策略，按照时间和大小滚动 SizeAndTimeBasedRollingPolicy -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间 -->
            <FileNamePattern>${logback.logDir}/${logback.appName}_info_%d{yyyy-MM-dd}_%i.log</FileNamePattern>
            <!-- 只保留最近90天的日志 -->
            <maxHistory>90</maxHistory>
            <!-- 单文件最大值 -->
            <maxFileSize>100MB</maxFileSize>
            <!-- 用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志 -->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <!-- 日志输出编码格式化 -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <charset>UTF-8</charset>
            <pattern>${FILE_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 输出Error日志到文件-->
    <appender name="fileErrorLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 如果只是想要 Error 级别的日志，那么需要过滤一下，默认是 info 级别的，ThresholdFilter -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>Error</level>
        </filter>
        <!--
            日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则
            如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天
            的日志改名为今天的日期。即，<File> 的日志都是当天的。
        -->
        <File>${logback.logDir}/${logback.appName}_error.log</File>
        <!-- 滚动策略，按照时间滚动 TimeBasedRollingPolicy -->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间 -->
            <FileNamePattern>${logback.logDir}/${logback.appName}_error_%d{yyyy-MM-dd}_%i.log</FileNamePattern>
            <!-- 只保留最近90天的日志 -->
            <maxHistory>90</maxHistory>
            <!-- 单文件最大值 -->
            <maxFileSize>100MB</maxFileSize>
            <!-- 用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志 -->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <!-- 日志输出编码格式化 -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <charset>UTF-8</charset>
            <pattern>${FILE_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 异步输出 -->
    <appender name="asyncLog" class="ch.qos.logback.classic.AsyncAppender">
        <!-- 不丢失日志.默认的,如果队列的80%已满,则会丢弃TRACT、DEBUG、INFO级别的日志 -->
        <discardingThreshold>0</discardingThreshold>
        <!-- 更改默认的队列的深度,该值会影响性能.默认值为256 -->
        <queueSize>512</queueSize>
        <!-- 添加附加的appender,最多只能添加一个 -->
        <appender-ref ref="fileErrorLog"/>
    </appender>

    <!-- 指定最基础的日志输出级别 -->
    <root level="INFO">
        <!-- appender将会添加到这个loger -->
        <appender-ref ref="consoleLog"/>
        <appender-ref ref="fileInfoLog"/>
        <appender-ref ref="fileErrorLog"/>
        <appender-ref ref="asyncLog"/>
    </root>
</configuration>
```

**注意：配置里面百分号后有多余空格，需要删除，这是博客生成自动添加的，暂时没找到有效的处理手段！**

**比如：**

```xml
 <property name="CONSOLE_LOG_PATTERN"
              value="%date{yyyy-MM-dd HH:mm:ss} | %highlight(%-5level) | %boldYellow(%thread) | %boldGreen(%logger.%method) | %highlight(%msg%n)"/>
```

​	 **全局搜索%+空格然后替换成%即可。**