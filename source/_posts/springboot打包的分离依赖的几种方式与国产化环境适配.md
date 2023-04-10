---
title: springboot打包的分离依赖的几种方式与国产化环境适配
tags:
  - Springboot
  - maven
  - 国产化
  - 金蝶
  - 东方通
abbrlink: 24385ec7
date: 2023-04-10 21:42:46
---

##  概述

​		Spring Boot 项目打包默认会将资源文件一起打包，如果涉及到现场部署会不停的更改相关配置就会很烦，所以可以采用将配置文件及相关依赖分离出来。

​		下面主要介绍几种方式：**分离 resources不分离lib、分离 resources及lib、国产化东方通打包、国产化金蝶打包及国产化前端注意事项**

<!-- more -->

## 分离 resources不分离lib

### pom.xml

```xml
<build>
        <finalName>cpm-${project.version}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <excludes>
                    <exclude>templates/**</exclude>
                    <exclude>**/*.xls</exclude>
                    <exclude>**/*.xlsx</exclude>
                    <exclude>**/*.xlsm</exclude>
                    <exclude>**/*.doc</exclude>
                    <exclude>**/*.docx</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>false</filtering>
                <includes>
                    <include>templates/**</include>
                    <include>**/*.xls</include>
                    <include>**/*.xlsx</include>
                    <include>**/*.xlsm</include>
                    <include>**/*.doc</include>
                    <include>**/*.docx</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <!-- 将静态资源排除出 jar 包 -->
                    <excludes>
                        <exclude>*.**</exclude>
                        <exclude>static/**</exclude>
                        <exclude>public/**</exclude>
                        <exclude>templates/**</exclude>
                        <!-- 自定义自己的配置文件 -->
                        <exclude>*.yml</exclude>
                        <exclude>icbc.properties</exclude>
                    </excludes>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <!-- MANIFEST.MF 中 Class-Path 加入前缀 -->
                            <classpathPrefix>lib/</classpathPrefix>
                            <!-- jar 包不包含唯一版本标识 -->
                            <useUniqueVersions>false</useUniqueVersions>
                            <!-- 指定启动类的包路径 -->
                            <mainClass>top.tanmw.demo.DemoApplication</mainClass>
                        </manifest>
                        <manifestEntries>
                            <!--MANIFEST.MF 中 Class-Path 加入资源文件目录 -->
                            <Class-Path>config/ </Class-Path>
                        </manifestEntries>
                    </archive>
                    <!-- 指定打出的 jar 包路径 -->
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.4.1</version>
                <configuration>
                    <createDependencyReducedPom>false</createDependencyReducedPom>
                    <filters>
                        <filter>
                            <artifact>*:*</artifact>
                            <excludes>
                                <exclude>META-INF/*.SF</exclude>
                                <exclude>META-INF/*.sf</exclude>
                                <exclude>META-INF/*.DSA</exclude>
                                <exclude>META-INF/*.dsa</exclude>
                                <exclude>META-INF/*.RSA</exclude>
                                <exclude>META-INF/*.rsa</exclude>
                                <exclude>META-INF/*.EC</exclude>
                                <exclude>META-INF/*.ec</exclude>
                                <exclude>META-INF/MSFTSIG.SF</exclude>
                                <exclude>META-INF/MSFTSIG.RSA</exclude>
                            </excludes>
                        </filter>
                    </filters>
                    <artifactSet>
                        <includes>
                            <include>*:*</include>
                        </includes>
                    </artifactSet>
                </configuration>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- 这个插件是用来复制项目的静态资源 -->
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
                            <!--                            <delimiters>-->
                            <!--                                <delimiter>@</delimiter>-->
                            <!--                            </delimiters>-->
                            <useDefaultDelimiters>false</useDefaultDelimiters>
                            <resources>
                                <resource>
                                    <!-- 指定静态资源的路径 -->
                                    <directory>src/main/resources</directory>
                                    <!--                                    &lt;!&ndash; 处理文件时替换文件中的变量 &ndash;&gt;-->
                                    <filtering>true</filtering>
                                    <!-- 指定需要复制的文件 -->
                                    <includes>
                                        <include>application.yml</include>
                                        <include>icbc.propertiesl</include>
                                    </includes>
                                </resource>
                                <resource>
                                    <!-- 指定静态资源的路径 -->
                                    <directory>src/main/resources</directory>
                                    <filtering>false</filtering>
                                    <!-- 指定需要复制的文件 -->
                                    <includes>
                                        <include>application.yml</include>
                                        <include>*.xml</include>
                                        <include>*.properties</include>
                                        <include>public/**</include>
                                        <include>static/**</include>
                                        <include>templates/**</include>
                                    </includes>
                                    <excludes>
                                        <exclude>assembly.xml</exclude>
                                    </excludes>
                                </resource>
                            </resources>
                            <!-- 指定复制到该目录下 -->
                            <outputDirectory>${project.build.directory}/config</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <!--     打包 zip    -->
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
    <!-- 不包含根目录，如果为 true，生成的压缩文件会有一个根目录 -->
    <includeBaseDirectory>false</includeBaseDirectory>
    <!-- 指定需要压缩的文件清单 -->
    <fileSets>
        <fileSet>
            <directory>${project.build.directory}/config/</directory>
            <outputDirectory>config</outputDirectory>
        </fileSet>
        <fileSet>
            <directory>${project.build.directory}/</directory>
            <includes>
                <include>${project.build.finalName}.jar</include>
            </includes>
            <outputDirectory>./</outputDirectory>
        </fileSet>
        <!-- 自定义 shell 脚本存放路径 -->
        <fileSet>
            <directory>${project.basedir}/shell/</directory>
            <outputDirectory>shell</outputDirectory>
            <includes>
                <include>*.sh</include>
                <include>*.bat</include>
            </includes>
        </fileSet>
    </fileSets>
</assembly>
```

​		如果有本地依赖，可以尝试使用com.googlecode.addjars-maven-plugin插件，最好的方式还是将本地jar安装到仓库在进行打包。

```xml
<plugin>
                <groupId>com.googlecode.addjars-maven-plugin</groupId>
                <artifactId>addjars-maven-plugin</artifactId>
                <version>1.0.5</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>add-jars</goal>
                        </goals>
                        <configuration>
                            <resources>
                                <resource>
                                    <directory>${basedir}/lib</directory>
                                </resource>
                            </resources>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
```



## 分离 resources及lib

### pom.xml

```xml
<build>
        <finalName>demo-${project.version}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <excludes>
                    <exclude>templates/**</exclude>
                    <exclude>**/*.xls</exclude>
                    <exclude>**/*.xlsx</exclude>
                    <exclude>**/*.xlsm</exclude>
                    <exclude>**/*.doc</exclude>
                    <exclude>**/*.docx</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>false</filtering>
                <includes>
                    <include>templates/**</include>
                    <include>**/*.xls</include>
                    <include>**/*.xlsx</include>
                    <include>**/*.xlsm</include>
                    <include>**/*.doc</include>
                    <include>**/*.docx</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <!-- 将静态资源排除出 jar 包 -->
                    <excludes>
                        <exclude>*.**</exclude>
                        <exclude>static/**</exclude>
                        <exclude>public/**</exclude>
                        <exclude>templates/**</exclude>
                        <!-- 自定义自己的配置文件 -->
                        <exclude>*.yml</exclude>
                    </excludes>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <!-- MANIFEST.MF 中 Class-Path 加入前缀 -->
                            <classpathPrefix>lib/</classpathPrefix>
                            <!-- jar 包不包含唯一版本标识 -->
                            <useUniqueVersions>false</useUniqueVersions>
                            <!-- 指定启动类的包路径 -->
                            <mainClass>top.tanmw.demo.demoApplication</mainClass>
                        </manifest>
                        <manifestEntries>
                            <!--MANIFEST.MF 中 Class-Path 加入资源文件目录 -->
                            <Class-Path>config/ lib/efficient-1.2.0.jar</Class-Path>
                        </manifestEntries>
                    </archive>
                    <!-- 指定打出的 jar 包路径 -->
                    <outputDirectory>${project.build.directory}</outputDirectory>
                </configuration>
            </plugin>
            <!-- 这个插件是用来复制项目依赖的 jar 包 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.5.0</version>
                <executions>
                    <execution>
                        <!-- 自定义 -->
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <!-- 复制依赖的 jar 包 -->
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <!-- 将依赖的 jar 包复制到该路径下 -->
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.4.1</version>
                <configuration>
                    <createDependencyReducedPom>false</createDependencyReducedPom>
                    <filters>
                        <filter>
                            <artifact>*:*</artifact>
                            <excludes>
                                <exclude>META-INF/*.SF</exclude>
                                <exclude>META-INF/*.sf</exclude>
                                <exclude>META-INF/*.DSA</exclude>
                                <exclude>META-INF/*.dsa</exclude>
                                <exclude>META-INF/*.RSA</exclude>
                                <exclude>META-INF/*.rsa</exclude>
                                <exclude>META-INF/*.EC</exclude>
                                <exclude>META-INF/*.ec</exclude>
                                <exclude>META-INF/MSFTSIG.SF</exclude>
                                <exclude>META-INF/MSFTSIG.RSA</exclude>
                            </excludes>
                        </filter>
                    </filters>
                    <artifactSet>
                        <includes>
                            <include>com.zenith:leader</include>
                        </includes>
                    </artifactSet>
                </configuration>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- 这个插件是用来复制项目的静态资源 -->
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
                            <!--                            <delimiters>-->
                            <!--                                <delimiter>@</delimiter>-->
                            <!--                            </delimiters>-->
                            <useDefaultDelimiters>false</useDefaultDelimiters>
                            <resources>
                                <resource>
                                    <!-- 指定静态资源的路径 -->
                                    <directory>src/main/resources</directory>
                                    <!--                                    &lt;!&ndash; 处理文件时替换文件中的变量 &ndash;&gt;-->
                                    <filtering>true</filtering>
                                    <!-- 指定需要复制的文件 -->
                                    <includes>
                                        <include>application.yml</include>
                                    </includes>
                                </resource>
                                <resource>
                                    <!-- 指定静态资源的路径 -->
                                    <directory>src/main/resources</directory>
                                    <filtering>false</filtering>
                                    <!-- 指定需要复制的文件 -->
                                    <includes>
                                        <include>application-${env}.yml</include>
                                        <include>*.xml</include>
                                        <include>*.properties</include>
                                        <include>public/**</include>
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
            <!--     打包 zip    -->
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



### assembly.xml 

同上面一样



## 东方通war包部署

### pom.xml

```xaml
<build>
        <finalName>ykz-leader-${project.version}</finalName>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <excludes>
                    <exclude>templates/**</exclude>
                    <exclude>**/*.xls</exclude>
                    <exclude>**/*.xlsx</exclude>
                    <exclude>**/*.xlsm</exclude>
                    <exclude>**/*.doc</exclude>
                    <exclude>**/*.docx</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>false</filtering>
                <includes>
                    <include>templates/**</include>
                    <include>**/*.xls</include>
                    <include>**/*.xlsx</include>
                    <include>**/*.xlsm</include>
                    <include>**/*.doc</include>
                    <include>**/*.docx</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                    <packagingExcludes>
                        %regex[WEB-INF/lib/tomcat-embed.*],
                        %regex[WEB-INF/lib/spring-boot-starter-tomcat.*]
                    </packagingExcludes>
                    <webResources>
                        <resource>
                            <directory>/lib</directory>
                            <targetPath>WEB-INF/lib</targetPath>
                            <filtering>false</filtering>
                            <includes>
                                <include>**/*.jar</include>
                            </includes>
                        </resource>
                    </webResources>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <finalName>${project.parent.artifactId}</finalName>
                    <excludeGroupIds>
                        org.apache.tomcat.embed,
                        org.springframework.boot
                    </excludeGroupIds>
                    <!--本地依赖jar文件打进部署包-->
                    <includeSystemScope>true</includeSystemScope>
                    <jvmArguments>-Dfile.encoding=UTF-8</jvmArguments>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal><!--可以把依赖的包都打包到生成的Jar包中-->
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

## 金蝶部署

### pom.xml

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                    <packagingExcludes>
<!--                        %regex[WEB-INF/lib/tomcat-embed.*],-->
                        %regex[WEB-INF/lib/spring-boot-starter-tomcat.*]
                    </packagingExcludes>
                    <webResources>
                        <resource>
                            <directory>./lib</directory>
                            <targetPath>WEB-INF/lib</targetPath>
                            <filtering>false</filtering>
                            <includes>
                                <include>**/*.jar</include>
                            </includes>
                        </resource>
                        <!--                        <resource>-->
                        <!--                            <directory>src/main/resources</directory>-->
                        <!--                            <filtering>true</filtering>-->
                        <!--                            <targetPath>WEB-INF/classes</targetPath>-->
                        <!--                            <includes>-->
                        <!--                                <include>application.yml</include>-->
                        <!--                            </includes>-->
                        <!--                        </resource>-->
                    </webResources>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <finalName>${project.parent.parent.artifactId}</finalName>
                    <excludeGroupIds>
<!--                        org.apache.tomcat.embed,-->
                        org.springframework.boot
                    </excludeGroupIds>
                    <!--本地依赖jar文件打进部署包-->
                    <includeSystemScope>true</includeSystemScope>
                    <jvmArguments>-Dfile.encoding=UTF-8</jvmArguments>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal><!--可以把依赖的包都打包到生成的Jar包中-->
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
```

## 国产化前端打包注意事项

注意国产化环境前端打包需要在根目录下放置**WEB-INF**文件夹，包含一个**web.xml**文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
          http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
 version="3.1" metadata-complete="true">
 <display-name>Router for AAS</display-name>
 <error-page>
   <error-code>404</error-code>
   <location>/index.html</location>
 </error-page>
</web-app>

```

![Snipaste_2023-04-10_22-13-44](/images/Snipaste_2023-04-10_22-13-44.png)

![Snipaste_2023-04-10_22-18-13](/images/Snipaste_2023-04-10_22-18-13.png)