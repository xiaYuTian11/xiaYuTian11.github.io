---
title: Spring Boot logback.xml 读取 yml 中配置
tags: [SpringBoot,logback]
abbrlink: cc464ebf
date: 2020-09-10 18:52:21
---

## 背景

​			最近部署Spring Boot项目时发现在logback.xml中配置的日志存放路径为相对路径，导致我以不同的方式启动项目时，日志文件生成的目录是不一致的，所以决定将 logback.xml中的日志文件存放路径改为相对路径，但是在使用中发现logback.xml 不能读取到 yml中的属性。

<!-- more -->

## 配置

​		由于Spring Boot 时加载顺序是先加载logback.xml,在加载application.yml,最后在加载logback-spring.xml文件。所以直接在logback.xml中配置读取yml是不行的。下面说下解决方案。

### 1.在yml 文件中配置日志存放路径

```yaml
log:
  file:
    path: /usr/soft/test/logs
```

### 2.将logback.xml名称改为 logback-spring.xml

### 3.在logback-spring.xml 加入spring属性读取yml配置

```xml
<springProperty scope="context" name="logPath" source="log.file.path" defaultValue="logs"/>
```

### 4.使用配置

```xml
<property name="LOG_PATH" value="${logPath}"/>
```





​		配置完成后，部署时就可以在启动前修改application.yml 文件中的相关配置，达到自定义的目的。