---
title: Spring Boot 2.x 整合 UidGenerator
tags:
  - SpringBoot
  - UidGenerator
  - 分布式
  - 分布式ID
abbrlink: 1f43d92b
date: 2020-10-15 21:02:24
---

## 1.概述

​	SpringBoot 2.x整合[百度UidGenerator](https://github.com/baidu/uid-generator),MySQL 版本10+。下载[百度UidGenerator](https://github.com/baidu/uid-generator)源码进行编译打成Jar引入整合工程。

<!-- more -->

## 2.创建表结构

```sql
DROP TABLE IF EXISTS WORKER_NODE;
CREATE TABLE WORKER_NODE
(
ID BIGINT NOT NULL AUTO_INCREMENT COMMENT 'auto increment id',
HOST_NAME VARCHAR(64) NOT NULL COMMENT 'host name',
PORT VARCHAR(64) NOT NULL COMMENT 'port',
TYPE INT NOT NULL COMMENT 'node type: ACTUAL or CONTAINER',
LAUNCH_DATE DATE NOT NULL COMMENT 'launch date',
MODIFIED TIMESTAMP NOT NULL COMMENT 'modified time',
CREATED TIMESTAMP NOT NULL COMMENT 'created time',
PRIMARY KEY(ID)
)
 COMMENT='DB WorkerID Assigner for UID Generator',ENGINE = INNODB;
```

## 3.源码打包

​	将UidGenerator下载到本地打成jar包，新建SpringBoot项目，和pom.xml文件同级目录创建lib文件夹，将生成的jar包放入到lib文件夹中，同时在pom.xml中引入依赖

## 4.相关依赖

pom.xml引入相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>2.1.3</version>
    </dependency>
    <dependency>
        <groupId>commons-lang</groupId>
        <artifactId>commons-lang</artifactId>
        <version>2.6</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
        <exclusions>
            <exclusion>
                <groupId>org.junit.vintage</groupId>
                <artifactId>junit-vintage-engine</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>com.baidu.fsg</groupId>
        <artifactId>uid-generator</artifactId>
        <scope>system</scope>
        <systemPath>${project.basedir}/lib/uid-generator-1.0.0-SNAPSHOT.jar</systemPath>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <scope>test</scope>
    </dependency>
```

## 5.数据库连接配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.01:3306/demo
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    hikari:
      minimum-idle: 1
      maximum-pool-size: 12
      idle-timeout: 10000
      max-lifetime: 180000
      connection-timeout: 60000  
      connection-test-query: select 1

mybatis:
  mapper-locations: classpath*:/mapper/WorkerNodeMapper.xml
```

## 6.整合

​	直接用源代码里的相关配置及类会导致SpringBoot启动后DisposableWorkerIdAssigner注入不了workerNodeDAO的问题。所以将源码中的部分代码拷贝到本地工程中。

1.拷贝WorkerNodeDAO.java到自己的SpringBoot项目中，重命名WorkerNodeMapper.java

2.拷贝WORKER_NODE.xml到自己的SpringBoot项目中，重命名成WorkerNodeMapper.xml

3.拷贝DisposableWorkerIdAssigner.java到SpringBoot项目中，重命名为DisposableWorkerIdAssignerMy.java

4.将WorkerNodeMapper.xml中namespace改成本地对应的WorkerNodeMapper.java全限定名称

```xml
<mapper namespace="com.example.uidgenerator.dao.WorkerNodeMapper">
```

5.将DisposableWorkerIdAssignerMy类中注入的WorkerNodeDAO改为WorkerNodeMapper

```java
@Autowired
private WorkerNodeMapper workerNodeDAO;
```



6.创建UidGenerator配置类

```java
@Configuration
public class UidGeneratorConfiguration {
    @Bean
    public DisposableWorkerIdAssignerMy disposableWorkerIdAssigner() {
        return new DisposableWorkerIdAssignerMy();
    }

    /**
     * disposableWorkerIdAssigner的入参对象类型最好使用 WorkerIdAssigner，
     * 否则其他地方引入CGLib动态代理的时候可能会导致代理混用的问题
     *
     * @param disposableWorkerIdAssigner
     * @return
     */
    @Bean
    public CachedUidGenerator cachedUidGenerator(DisposableWorkerIdAssignerMy disposableWorkerIdAssigner){
        CachedUidGenerator cachedUidGenerator = new CachedUidGenerator();
        cachedUidGenerator.setWorkerIdAssigner(disposableWorkerIdAssigner);
        //以下为可选配置, 如未指定将采用默认值
        cachedUidGenerator.setTimeBits(29);
        cachedUidGenerator.setWorkerBits(21);
        cachedUidGenerator.setSeqBits(13);
        cachedUidGenerator.setEpochStr("2016-09-20");

        //RingBuffer size扩容参数, 可提高UID生成的吞吐量
        //默认:3， 原bufferSize=8192, 扩容后bufferSize= 8192 << 3 = 65536
        cachedUidGenerator.setBoostPower(3);
        // 指定何时向RingBuffer中填充UID, 取值为百分比(0, 100), 默认为50
        // 举例: bufferSize=1024, paddingFactor=50 -> threshold=1024 * 50 / 100 = 512.
        // 当环上可用UID数量 < 512时, 将自动对RingBuffer进行填充补全
        //<property name="paddingFactor" value="50"></property>

        //另外一种RingBuffer填充时机, 在Schedule线程中, 周期性检查填充
        //默认:不配置此项, 即不实用Schedule线程. 如需使用, 请指定Schedule线程时间间隔, 单位:秒
        cachedUidGenerator.setScheduleInterval(60L);



        //拒绝策略: 当环已满, 无法继续填充时
        //默认无需指定, 将丢弃Put操作, 仅日志记录. 如有特殊需求, 请实现RejectedPutBufferHandler接口(支持Lambda表达式)
        //<property name="rejectedPutBufferHandler" ref="XxxxYourPutRejectPolicy"></property>
        //cachedUidGenerator.setRejectedPutBufferHandler();
        //拒绝策略: 当环已空, 无法继续获取时 -->
        //默认无需指定, 将记录日志, 并抛出UidGenerateException异常. 如有特殊需求, 请实现RejectedTakeBufferHandler接口(支持Lambda表达式) -->
        //<property name="rejectedTakeBufferHandler" ref="XxxxYourTakeRejectPolicy"></property>

        return cachedUidGenerator;
    }


}

```

7.启动类配置

```java
@SpringBootApplication
@ComponentScan({"com.baidu.fsg","com.example.uidgenerator"})
@MapperScan("com.example.uidgenerator")
public class UidGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(UidGeneratorApplication.class, args);
	}

}
```

## 7.测试

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = UidGeneratorApplication.class)
class UidGeneratorApplicationTests {
    @Autowired
    private UidGenerator uidGenerator;

    @Test
    public void contextLoads() {
        for (int i = 0; i < 100000; i++) {
            System.out.println(uidGenerator.getUID());
        }
    }

}
```

​	运行测试类可以看到控制台输出生成的唯一ID，数据库也会出现相应的记录。

​	Demo源代码地址：https://github.com/xiaYuTian11/learning_demo/tree/master/uid-generator

