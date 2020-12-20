---
title: PostgreSQL 数据备份还原与远程拷贝
tags:
  - PostgreSQL
  - Linux
  - 远程拷贝，备份，还原，dump
  - ssh
  - scp
abbrlink: 2e20b53e
date: 2020-11-26 19:54:00
---

​	PostgreSQL 数据库备份与还原命令。

​	文件远程服务器拷贝到本地与本地拷贝到远程服务器命令。

<!--more-->

## PostgreSQL

​		postgresql默认管理员账户是postgres，利用该账户进入数据库进行操作

```sh
su postgres
```



### pg_dump

​	pg_dump 把一个数据库转储为纯文本文件或者是其它格式。

​	语法：

```sh
pg_dump [选项]... [数据库名字]
```

参数：

```sh
一般选项：

-f,  --file=FILENAME          输出文件或目录名
-F,  --format=c|d|t|p         输出文件格式 (定制, 目录, tar)
						   明文 (默认值))
-j,  --jobs=NUM               执行多个并行任务进行备份转储工作
-v,  --verbose                详细模式
-V,  --version                输出版本信息，然后退出
-Z,  --compress=0-9           被压缩格式的压缩级别
--lock-wait-timeout=TIMEOUT  在等待表锁超时后操作失败
--no-sync                    do not wait for changes to be written safely to disk
-?,  --help                   显示此帮助, 然后退出



控制输出内容选项：

-a, --data-only              只转储数据,不包括模式
-b, --blobs                  在转储中包括大对象
-B, --no-blobs               exclude large objects in dump
-c, --clean                  在重新创建之前，先清除（删除）数据库对象
-C, --create                 在转储中包括命令,以便创建数据库
-E, --encoding=ENCODING      转储以ENCODING形式编码的数据
-n, --schema=SCHEMA          只转储指定名称的模式
-N, --exclude-schema=SCHEMA  不转储已命名的模式
-o, --oids                   在转储中包括 OID
-O, --no-owner               在明文格式中, 忽略恢复对象所属者

-s, --schema-only            只转储模式, 不包括数据
-S, --superuser=NAME         在明文格式中使用指定的超级用户名
-t, --table=TABLE            只转储指定名称的表
-T, --exclude-table=TABLE    不转储指定名称的表
-x, --no-privileges          不要转储权限 (grant/revoke)
--binary-upgrade             只能由升级工具使用
--column-inserts             以带有列名的INSERT命令形式转储数据
--disable-dollar-quoting     取消美元 (符号) 引号, 使用 SQL 标准引号
--disable-triggers           在只恢复数据的过程中禁用触发器
--enable-row-security        启用行安全性（只转储用户能够访问的内容）
--exclude-table-data=TABLE   不转储指定名称的表中的数据
--if-exists              当删除对象时使用IF EXISTS
--inserts                    以INSERT命令，而不是COPY命令的形式转储数据
--no-publications            do not dump publications
--no-security-labels         不转储安全标签的分配
--no-subscriptions           do not dump subscriptions
--no-synchronized-snapshots  在并行工作集中不使用同步快照
--no-tablespaces             不转储表空间分配信息
--no-unlogged-table-data     不转储没有日志的表数据
--quote-all-identifiers      所有标识符加引号，即使不是关键字
--section=SECTION            备份命名的节 (数据前, 数据, 及 数据后)
--serializable-deferrable   等到备份可以无异常运行
--snapshot=SNAPSHOT          为转储使用给定的快照
--strict-names               要求每个表和/或schema包括模式以匹配至少一个实体
--use-set-session-authorization 	使用 SESSION AUTHORIZATION 命令代替ALTER OWNER 命令来设置所有权



联接选项：

-d, --dbname=DBNAME       对数据库 DBNAME备份
-h, --host=主机名        数据库服务器的主机名或套接字目录
-p, --port=端口号        数据库服务器的端口号
-U, --username=名字      以指定的数据库用户联接
-w, --no-password        永远不提示输入口令
-W, --password           强制口令提示 (自动)
--role=ROLENAME          在转储前运行SET ROLE

```



例子：

```sh
# 用psql还原
pg_dump -d [数据库名称] -Oxvf [路径/文件名.扩展名]
# 用pg_restore还原
pg_dump -Fc -f [路径/文件名.扩展名] [数据库名称]
```

### psql

​	psql 是 PostgreSQL 的交互式客户端工具。

语法：

```sh
psql [选项]... [数据库名称 [用户名称]]
```

参数:

``` sh
通用选项：

-c,--command=命令        执行单一命令(SQL或内部指令)然后结束
-d, --dbname=数据库名称   指定要连接的数据库 (默认："l1xnan")
-f, --file=文件名      从文件中执行命令然后退出
-l, --list             列出所有可用的数据库,然后退出
-v, --set=, --variable=NAME=VALUE
					   设置psql变量NAME为VALUE
					   (例如，-v ON_ERROR_STOP=1)
-V, --version            输出版本信息, 然后退出
-X, --no-psqlrc         不读取启动文档(~/.psqlrc)
-1 ("one"), --single-transaction
					  作为一个单一事务来执行命令文件(如果是非交互型的)
-?, --help[=options]     显示此帮助，然后退出
--help=commands      列出反斜线命令，然后退出
--help=variables     列出特殊变量，然后退出

输入和输出选项：

-a, --echo-all          显示所有来自于脚本的输入
-b, --echo-errors        回显失败的命令
-e, --echo-queries      显示发送给服务器的命令
-E, --echo-hidden        显示内部命令产生的查询
-L, --log-file=文件名  将会话日志写入文件
-n, --no-readline       禁用增强命令行编辑功能(readline)
-o, --output=FILENAME 将查询结果写入文件(或 |管道)
-q, --quiet             以沉默模式运行(不显示消息，只有查询结果)
-s, --single-step       单步模式 (确认每个查询)
-S, --single-line        单行模式 (一行就是一条 SQL 命令)

输出格式选项：

-A, --no-align           使用非对齐表格输出模式
-F, --field-separator=STRING
		 为字段设置分隔符,用于不整齐的输出(默认："|")
-H, --html             HTML 表格输出模式
-P, --pset=变量[=参数]    设置将变量打印到参数的选项(查阅 \pset 命令)
-R, --record-separator=STRING
		 为不整齐的输出设置字录的分隔符(默认：换行符号)
-t, --tuples-only      只打印记录i
-T, --table-attr=文本   设定 HTML 表格标记属性（例如,宽度,边界)
-x, --expanded           打开扩展表格输出
-z, --field-separator-zero
					   为不整齐的输出设置字段分隔符为字节0
-0, --record-separator-zero
					   为不整齐的输出设置记录分隔符为字节0

联接选项：

-h, --host=主机名        数据库服务器主机或socket目录(默认："本地接口")
-p, --port=端口        数据库服务器的端口(默认："5432")
-U, --username=用户名    指定数据库用户名(默认："l1xnan")
-w, --no-password       永远不提示输入口令
-W, --password           强制口令提示 (自动)

```

例子：

```sh
# 需要新进行还原的数据库新建
psql -d [还原的数据库名称] -abef [备份数据库路径及文件名]
```



### pg_restore

​	pg_restore 从一个归档中恢复一个由 pg_dump 创建的 PostgreSQL 数据库。

语法：

```sh
pg_restore [选项]... [文件名]
```

参数：

```sh
一般选项：

-d, --dbname=名字        连接数据库名字
-f, --file=文件名        输出文件名
-F, --format=c|d|t       备份文件格式(应该自动进行)
-l, --list               打印归档文件的 TOC 概述
-v, --verbose            详细模式
-V, --version            输出版本信息, 然后退出
-?, --help               显示此帮助, 然后退出

恢复控制选项：

-a, --data-only             只恢复数据, 不包括模式
-c, --clean                  在重新创建之前，先清除（删除）数据库对象
-C, --create                 创建目标数据库
-e, --exit-on-error          发生错误退出, 默认为继续
-I, --index=NAME             恢复指定名称的索引
-j, --jobs=NUM               执行多个并行任务进行恢复工作
-L, --use-list=FILENAME      从这个文件中使用指定的内容表排序
                            输出
-n, --schema=NAME            在这个模式中只恢复对象
-N, --exclude-schema=NAME    do not restore objects in this schema
-O, --no-owner               不恢复对象所属者
-P, --function=NAME(args)    恢复指定名字的函数
-s, --schema-only           只恢复模式, 不包括数据
-S, --superuser=NAME         使用指定的超级用户来禁用触发器
-t, --table=NAME             restore named relation (table, view, etc.)
-T, --trigger=NAME          恢复指定名字的触发器
-x, --no-privileges          跳过处理权限的恢复 (grant/revoke)
-1, --single-transaction     作为单个事务恢复
--disable-triggers           在只恢复数据的过程中禁用触发器
--enable-row-security        启用行安全性
--if-exists              当删除对象时使用IF EXISTS
--no-data-for-failed-tables  对那些无法创建的表不进行
                            数据恢复
--no-publications            do not restore publications
--no-security-labels         不恢复安全标签信息
--no-subscriptions           do not restore subscriptions
--no-tablespaces             不恢复表空间的分配信息
--section=SECTION            恢复命名节 (数据前、数据及数据后)
--strict-names               要求每个表和/或schema包括模式以匹配至少一个实体
--use-set-session-authorization    使用 SESSION AUTHORIZATION 命令代替ALTER OWNER 命令来设置所有权

联接选项：

-h, --host=主机名        数据库服务器的主机名或套接字目录
-p, --port=端口号        数据库服务器的端口号
-U, --username=名字      以指定的数据库用户联接
-w, --no-password        永远不提示输入口令
-W, --password           强制口令提示 (自动)
--role=ROLENAME          在恢复前执行SET ROLE操作 

选项 -I, -n, -P, -t, -T, 以及 --section 可以组合使用和指定多次用于选择多个对象.

```



如果没有提供输入文件名，则使用标准输入。

例子：

```sh
pg_restore -d [数据库名称] [备份数据库路径及文件名]
```

## scp 远程拷贝

​	scp 是 secure copy 的简写，用于在 Linux 下进行远程拷贝文件的命令，和它类似的命令有 cp，不过 cp 只是在本机进行拷贝不能跨服务器，而且 scp 传输是加密的。当你服务器硬盘变为只读 read only system 时，用 scp 可以帮你把文件移出来。

> 类似的工具有 rsync；scp 消耗资源少，不会提高多少系统负荷，在这一点上，rsync 就远远不及它了。rsync 比 scp 会快一点，但当小文件多的情况下，rsync 会导致硬盘 I/O 非常高，而 scp 基本不影响系统正常使用。

命令格式：

```sh
scp [参数] [原路径] [目标路径]
```

参数：

```sh
-1 强制 scp 命令使用协议 ssh1
-2 强制 scp 命令使用协议 ssh2
-4 强制 scp 命令只使用 IPv4 寻址
-6 强制 scp 命令只使用 IPv6 寻址
-B 使用批处理模式（传输过程中不询问传输口令或短语）
-C 允许压缩。（将 - C 标志传递给 ssh，从而打开压缩功能）
-p 留原文件的修改时间，访问时间和访问权限。
-q 不显示传输进度条。
-r 递归复制整个目录。
-v 详细方式显示输出。scp 和 ssh (1) 会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
-c cipher 以 cipher 将数据传输进行加密，这个选项将直接传递给 ssh。
-F ssh_config 指定一个替代的 ssh 配置文件，此参数直接传递给 ssh。
-i identity_file 从指定文件中读取传输时使用的密钥文件，此参数直接传递给 ssh。
-l limit 限定用户所能使用的带宽，以 Kbit/s 为单位。
-o ssh_option 如果习惯于使用 ssh_config (5) 中的参数传递方式，
-P port 注意是大写的 P, port 是指定数据传输用到的端口号
-S program 指定加密传输时所使用的程序。此程序必须能够理解 ssh (1) 的选项。
```

例子：

### 1.从远处复制文件到本地目录 

```sh
# 从 192.168.119.111 机器上的 /tmp/test.sql 文件到本地 ./ 目录中
scp root@192.168.119.111:/tmp/test.sql ./
```

### 2.从远处复制目录到本地

```sh
# 从 192.168.119.111 机器上的 /tmp/ 目录递归到本地 ./ 目录中
scp -r root@192.168.119.111:/tmp/ ./
```

### 3.上传本地文件到远程机器指定目录

```sh
# 将本地test.sql 文件拷贝到 192.168.119.111 机器上的 /tmp/下并重命名为test01.sql
scp test.sql root@192.168.119.111:/tmp/test01.sql
```

### 4.上传本地目录到远程机器指定目录

```sh
# 将本地 touchpad_ELANTECH_13.6.10.2_W10x64 文件夹递归拷贝到192.168.119.111 机器上的 /tmp/
scp -r touchpad_ELANTECH_13.6.10.2_W10x64\ root@192.168.119.111:/tmp
```



```sh
# 登录服务器查看拷贝情况
ssh root@192.168.119.111
```



