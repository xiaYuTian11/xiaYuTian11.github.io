---
title: Git项目初始化并提交远程仓库
tags:
  - Git
  - 初始化
  - 远程仓库
abbrlink: 456ca0f7
date: 2020-11-18 17:20:49
---

​        在日常开发中经常用 Git 进行代码管理，通常在本地写完代码后需要提交到远程仓库，但是由于第一次关联的时候，可能本地与远程仓库的代码不一致，导致初次提交失败，在此记录下解决方案。

<!-- more -->

##### 1.新建远程仓库，获得仓库地址

```sh
https://github.com/xiaYuTian11/learning_demo.git
```

##### 2.初始化本地仓库

```sh
git init
```

##### 3.将忽略文件添加到 ==.gitignore==

##### 4.添加需要版本控制的文件

```sh
git add .
```

##### 5.暂存本地代码

```sh
git commit -m "提交内容";
```

##### 6.关联远程仓库地址

```sh
git remote add origin https://github.com/xiaYuTian11/learning_demo.git
```

##### 7.拉取代码包括历史代码

```sh
git pull origin master --allow-unrelated-histories
```

##### 8.推送本地代码到远程仓库

```sh
git push -u origin master
```

##### 9.查看提交日志

```sh
# 查看提交信息，包括版本号(如:420717bd175bf65149b90d0bb0d2cf6ff7e353dd)，可用于版本回退
git log
```

##### 10.回退到指定版本

```sh
# 版本号可以只写前几位，Git 会自动去找。也不能只写前一两位，否则会找到多个版本号。
# git reset --hard 420717bd175bf65149b90d0bb0d2cf6ff7e353dd
# []：可写可不写
# {}：那就必须要在{}内给出的选择里选一个。
# <>：表示必选
# | : 分隔括号或大括号内的语法项目。只能选择一个项目。 
git reset --hard  <版本号 >
```





​	 完结㋡㋡