---
title: Spring Boot 分离资源文件打包及部署脚本
tags: SpringBoot
abbrlink: 1f0b7068
date: 2020-09-04 19:24:30
---



## 概述

​			Spring Boot 项目打包默认会将资源文件一起打包，如果涉及到现场部署会不停的更改相关配置就会很烦，所以可以采用将配置文件及相关依赖分离出来。

<!-- more -->

## 打包

### pom.xml 

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <!-- 将静态资源排除出jar包 -->
                    <excludes>
                        <exclude>static/**</exclude>
                        <exclude>templates/**</exclude>
                        <!-- 自定义自己的配置文件 -->
                        <exclude>*.yml</exclude>
                    </excludes>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <!-- MANIFEST.MF 中 Class-Path 加入前缀 -->
                            <classpathPrefix>lib/</classpathPrefix>
                            <!-- jar包不包含唯一版本标识 -->
                            <useUniqueVersions>false</useUniqueVersions>
                            <!-- 指定启动类的包路径 -->
                            <mainClass>com.demo.Application</mainClass>
                        </manifest>
                        <manifestEntries>
                            <!--MANIFEST.MF 中 Class-Path 加入资源文件目录 -->
                            <Class-Path>config/</Class-Path>
                        </manifestEntries>
                    </archive>
                    <!-- 指定打出的jar包路径 -->
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>
            <!-- 这个插件是用来复制项目依赖的jar包 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <executions>
                    <execution>
                        <!-- 自定义 -->
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <!-- 复制依赖的jar包 -->
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <!-- 将依赖的jar包复制到该路径下 -->
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- 这个插件是用来复制项目的静态资源-->
            <plugin>
                <artifactId>maven-resources-plugin</artifactId>
                <executions>
                    <execution>
                        <!-- 自定义 -->
                        <id>copy-resources</id>
                        <phase>package</phase>
                        <goals>
                            <!-- 复制静态资源 -->
                            <goal>copy-resources</goal>
                        </goals>
                        <configuration>
                            <resources>
                                <resource>
                                    <!-- 指定静态资源的路径 -->
                                    <directory>src/main/resources</directory>
                                    <!-- 指定需要复制的文件 -->
                                    <includes>
                                        <include>*.*</include>
                                        <include>static/**</include>
                                        <include>templates/**</include>
                                    </includes>
                                </resource>
                            </resources>
                            <!-- 指定复制到该目录下 -->
                            <outputDirectory>${project.build.directory}/config</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <!-- 以上配置后你的文件打包后的文件目录如下
                -lib
                -config
                -项目名.jar
             -->
            <!-- 这个插件使用来将分离出来的静态资源和依赖的jar包(就是上面说到的文件目录)，
        压缩成一个zip文件。个人感觉这个蛮方便的 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <!-- 这个插件需要指定一个配置文件 -->
                    <descriptors>
                        <descriptor>src/main/resources/assembly.xml</descriptor>
                    </descriptors>
                </configuration>
                <executions>
                    <execution>
                        <!-- 自定义 -->
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <!-- 只执行一次 -->
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

​			关于 MANIFEST.MF 的介绍可以查看[这篇博客](https://juejin.im/post/6844903876877893640)。

### assembly.xml

```xml
<assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0
                      http://maven.apache.org/xsd/assembly-1.1.0.xsd">
    <id>package</id>
    <formats>
        <!-- 可以根据自己的需求定义压缩文件的格式 -->
        <format>zip</format>
    </formats>
    <!-- 不包含根目录，如果为true，生成的压缩文件会有一个根目录 -->
    <includeBaseDirectory>false</includeBaseDirectory>
    <!-- 指定需要压缩的文件清单 -->
    <fileSets>
        <fileSet>
            <!-- 指定你需要压缩的文件目录 -->
            <directory>${project.build.directory}/lib/</directory>
            <!-- 指定压缩后的文件目录 -->
            <outputDirectory>lib</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/config/</directory>
            <outputDirectory>config</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/</directory>
            <includes>
                <include>*.jar</include>
            </includes>
            <outputDirectory>/</outputDirectory>
        </fileSet>
        <!-- 自定义shell脚本存放路径 -->
        <fileSet>
            <directory>shell/</directory>
            <outputDirectory>/</outputDirectory>
            <includes>
                <include>*.sh</include>
            </includes>
        </fileSet>
    </fileSets>
</assembly>
```

### loader.path

​		资源文件打包分离后，启动jar时不能正常加载资源目录及lib,，解决方案是在启动时添加loader.path参数，具体可以参考官方文档：https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#executable-jar-launching

```sh
# jar lib resource 位于同一文件夹下
java -jar -Xms512m -Xmx2048m -Dloader.path=lib,resources test.jar
```

## 部署脚本

### deploy.sh

```sh
#!/bin/bash
# 自定义jdk路径
#JDK_HOME="/usr/software/java/jdk1.8.0_212/bin/java"
VM_OPTS="-Xms512m -Xmx2048m"
SPB_OPTS=" -Dloader.path=lib,config"
APP_LOCATION="/home/qrcode-v0.0.1.jar"
APP_NAME="qrcode-v0.0.1.jar"

start() {
 echo "=============================start=============================="
 PID_CMD="ps -ef |grep $APP_NAME |grep -v grep |awk '{print $2}'"
 PID=$(eval $PID_CMD)
 if [[ -n $PID ]]; then
    echo "$APP_NAME is already running,PID is $PID"
 else
    nohup java $VM_OPTS -jar $APP_LOCATION $SPB_OPTS > /dev/null 2>&1 &
    echo "nohup java $VM_OPTS -jar $APP_LOCATION $SPB_OPTS > /dev/null 2>&1 &"
    echo "Start $APP_NAME successfully!" 
 fi  
 echo "=============================start=============================="
}

stop() {
 echo "=============================stop=============================="
 PID=$(eval ps -ef |grep $APP_NAME |grep -v grep |awk '{print $2}')
 if [[ -n $PID ]]; then
    kill -9 $PID
    echo "$APP_NAME is stop in PID $PID"
    sleep 1 
 else
    echo "$APP_NAME is not running!!!"
 fi
 echo "=============================stop=============================="
}

restart() {
  echo "=============================restart=============================="
  stop
  start
  echo "=============================restart=============================="
}

status() {
  echo "=============================status==============================" 
  PID_CMD="ps -ef |grep $APP_NAME |grep -v grep |awk '{print $2}'"
  PID=$(eval $PID_CMD)
  if [[ -n $PID ]]; then
       echo "$APP_NAME is running,PID is $PID"
  else
       echo "$APP_NAME is not running!!!"
  fi
  echo "=============================status=============================="
}

info() {
  echo "=============================info=============================="
  echo "APP_LOCATION: $APP_LOCATION"
  echo "APP_NAME: $APP_NAME"
  echo "JDK_HOME: $JDK_HOME"
  echo "VM_OPTS: $VM_OPTS"
  echo "SPB_OPTS: $SPB_OPTS"
  echo "=============================info=============================="
}

help() {
   echo "start: start server"
   echo "stop: shutdown server"
   echo "restart: restart server"
   echo "status: display status of server"
   echo "info: display info of server"
   echo "help: help info"
}

case $1 in
start)
    start
    ;;
stop)
    stop
    ;;
restart)
    restart
    ;;
status)
    status
    ;;
info)
    info
    ;;
help)
    help
    ;;
*)
    help
    ;;
esac
exit $?


```



## dos2unix

​			windows 上编写的脚本在Linux上运行会出现错误，可以用dos2unix进行转义。

1.安装dos2unix

```sh
yum install -y dos2unix
```

2.转义sh文件

```sh
dos2unix deploy.sh
```

​			转义成功就可以正常运行了

##	Linux 开机自启动 SpringBoot 项目

1.编写启动脚本 deploy.sh，参考上面。

2.给 deploy.sh 文件添加执行权限

```shell
chmod +x /usr/soft/sync/deploy.sh
```

3.给/etc/rc.d/rc.local文件添加执行权限

```shell
chmod +x /etc/rc.d/rc.local
```

4.在 /etc/rc.d/rc.local 文件末尾添加启动脚本命令

```sh
su - root -c '/usr/soft/sync/deploy.sh start'
```

5.重启服务器验证脚本是否自启动成功。



相关配置可以根据自己需求进行修改，至此就可以愉快的进行玩耍啦！

