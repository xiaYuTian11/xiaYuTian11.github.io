---
title: PostgreSQL Logical Replication(逻辑复制)
tags: PostgreSQL
abbrlink: 8c55eb1b
date: 2020-08-28 20:37:19
---

## 概述

​        Postgres 9.4（2014 年 12 月发布）引入了一项称为逻辑复制（Logical Replication）的新功能。逻辑复制允许从数据库实时流式传输到外部系统的更改。物理复制和逻辑复制的区别在于逻辑复制以逻辑格式发送数据，而物理复制以二进制格式发送数据。

<!-- more -->

​		详细介绍查看官方文档：https://jdbc.postgresql.org/documentation/head/replication.html

## 配置

​        Postgresql 要想使用逻辑复制必须先将 postgresql. conf 中 wal_level 配置为 logical,相应的 max_wal_senders 复制使用者的数量要合理配置，max_replication_slots 要使用逻辑复制必须大于0；

`postgresql. conf`

```xml
wal_level = logical
max_wal_senders = 8
max_replication_slots = 2
```

`pg_hba. conf`

```xml
local   replication   all                   trust
host    replication   all   127.0.0.1/32    md5
host    replication   all   ::1/128         md5
host	all			  all   0.0.0.0/0		md5  
# 更多配置含义查看：http://shouce.jb51.net/postgresql9_4_4/auth-pg-hba-conf.html
```



## 使用

​		  逻辑复制使用复制槽在服务器上保留 WAL 日志，并定义用于将 WAL 日志解码为所需格式的解码插件，例如，您可以将更改解码为 json等格式。这里方便演示使用 test_decoding 插件进行解码。

​		  更多插件查看：https://wiki.postgresql.org/wiki/Logical_Decoding_Plugins

**针对整个数据库的逻辑复制**

```java
public static void main(String[] args) throws SQLException, InterruptedException {
        String url = "jdbc:postgresql://127.0.0.1:5432/dev";
        Properties props = new Properties();
        PGProperty.USER.set(props, "postgres");
        PGProperty.PASSWORD.set(props, "20191809");
        PGProperty.ASSUME_MIN_SERVER_VERSION.set(props, "9.4");
        PGProperty.REPLICATION.set(props, "database");
        PGProperty.PREFER_QUERY_MODE.set(props, "simple");

        Connection con = DriverManager.getConnection(url, props);
        PGConnection replConnection = con.unwrap(PGConnection.class);
        Statement statement = con.createStatement();
        
        // 删除复制槽
        // replConnection.getReplicationAPI().dropReplicationSlot("demo_logical_slot");
		
    	// 创建 demo_logical_slot
        replConnection.getReplicationAPI()
                .createReplicationSlot()
                .logical()
                .withSlotName("demo_logical_slot")
                .withOutputPlugin("test_decoding")
                .make();

        // 创建逻辑复制流，设置超时时间
        PGReplicationStream stream = replConnection.getReplicationAPI()
                .replicationStream()
                .logical()
                .withSlotName("demo_logical_slot")
                .withSlotOption("include-xids", false)
                .withSlotOption("skip-empty-xacts", true)
                .withStatusInterval(20, TimeUnit.SECONDS)
                .start();
		
       // 更改数据库表数据，这里可以获取数据
        while (true) {
            // non blocking receive message
            ByteBuffer msg = stream.readPending();

            if (msg == null) {
                TimeUnit.MILLISECONDS.sleep(10L);
                continue;
            }

            int offset = msg.arrayOffset();
            byte[] source = msg.array();
            int length = source.length - offset;
            final String s = new String(source, offset, length);
            System.out.println(s);
            // feedback
            // 反馈服务器，向服务器提供已成功接收并应用于消费者的日志序列编号 （LSN）
            stream.setAppliedLSN(stream.getLastReceiveLSN());
            stream.setFlushedLSN(stream.getLastReceiveLSN());
        }
    }
```



**只针对指定表的逻辑复制**

步骤：

1。创建针对表创建订阅，及接收数据的操作类型

```sql
CREATE PUBLICATION YOUR_PUBLICATION_NAME) FOR TABLE YOUR_TABLE_NAME WITH (publish = 'insert,update,delete');
```

2。设置表同步数据的字段，最后 FULL 参数可变。

参照官方文档：https://www.postgresql.org/docs/10/sql-altertable.html#SQL-CREATETABLE-REPLICA-IDENTITY

```sql
ALTER TABLE TABLE_NAME REPLICA IDENTITY FULL
```

3。创建复制槽

```sql
CREATE_REPLICATION_SLOT  YOUR_SOLT_NAME  有效期  LOGICAL 解码插件名称;
```

4。获取PGReplicationStream，同上。

详情参照官方文档地址：http://www.postgres.cn/docs/11/sql-createpublication.html

解码插件可以参考：https://github.com/debezium/debezium

完整代码可以查看： https://github.com/xiaYuTian11/postgresql-message