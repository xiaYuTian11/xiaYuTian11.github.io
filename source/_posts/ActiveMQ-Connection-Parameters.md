---
title: ActiveMQ Connection Parameters
tags: [MQ,ActiveMQ]
abbrlink: 75c25f59
date: 2020-09-02 14:36:19
---

## 背景

​		  最近项目需要搭建ActiveMQ进行消息传输，但是在使用过程中发现与ActiveMQ长时间连接，但是没进行消息传输，或者网络波动等情况会造成连接挂掉的情况，由于ActiveMQ是支持断线重连机制，在此记录下使用到的几个配置及其中的一个坑。

<!--more-->

## 使用

​		本次只在代码中使用时配置到，如果需要在服务器上配置，请查看[官方文档](https://activemq.apache.org/failover-transport-reference.html)。

**配置多个MQ防止其中一个宕机。**

```java
// randomize 是否随机访问
failover:(tcp://primary:61616,tcp://secondary:61616)?randomize=false
```

**配置消息异步发送**

```java
// useAsyncSend 是否启用异步发送消息
// producerWindowSize 当发送消息大于 10M 也会启用异步发送
jms.useAsyncSend=true&jms.producerWindowSize=10240 
```

​		配置异步发送消息可以对发送消息状态进行处理，如果发送失败可以自定义进行重新发送。

```java
((ActiveMQMessageProducer) producer).send(message, new AsyncCallback() {
    @Override
    public void onSuccess() {
        log.info(" sendMessage to {} : {}", queue, text);
    }

    @Override
    public void onException(JMSException exception) {
        boolean flag;
        for (int i = 0; i < 5; i++) {
            log.error("sendMessage to {} 错误,进行重试", queue);
            try {
                producer.send(message);
                flag = true;
            } catch (JMSException e) {
                log.error("sendMessage to {} with {} 重试错误,消息未正确发送", queue, text);
                flag = false;
            }
            if (flag) {
                break;
            } else {
                try {
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException e) {
                    log.error("重发消息休眠异常", e);
                }
            }
        }
    }
});
```

**配置最大断线最大重试次数**

```java
// https://activemq.apache.org/redelivery-policy
// 默认重试次数为6次，之后就会进入死信队列，-1表示进行无限制重试
jms.redeliveryPolicy.maximumRedeliveries=-1
```

**配置重新连接等待时间**

```java
// https://activemq.apache.org/failover-transport-reference.html
// initialReconnectDelay 第一次重新连接前的延迟时间（毫秒）
// maxReconnectDelay 第二和后续的重新连接尝试之间的最大延迟（毫秒）。
initialReconnectDelay=10&maxReconnectDelay=15000
```

**禁用不活动自动断线**

```java
// https://activemq.apache.org/configuring-wire-formats
// 最大不活动时间（毫秒），超过会自动终止连接，默认是30000ms。
// 禁用非活动监视将值设置为 <= 0 即可。
wireFormat.maxInactivityDuration=0 
```

##坑

​			当时禁用非活动监视时，照着官方文档上设置的如下：

```java
ActiveMQConnectionFactory cf = new ActiveMQConnectionFactory("tcp://localhost:61616?wireFormat.cacheEnabled=false&wireFormat.tightEncodingEnabled=false");
// 将参数替换成 wireFormat.maxInactivityDuration=0 
ActiveMQConnectionFactory cf = new ActiveMQConnectionFactory("tcp://localhost:61616?wireFormat.maxInactivityDuration=0");
```

​			启动生成者时出现错误：**Invalid connect parameters: {wireFormat.maxInactivityDuration=0}**

![image-20200902151227315](./75c25f59/image-20200902151227315.png)

​		正确的设置方式：

```java
failover://(tcp://47.110.133.228:61616?wireFormat.maxInactivityDuration=0)?jms.useAsyncSend=true......
```

## Failover （故障转移）

​			启用故障转移后，当由于某种原因与当前服务器的连接丢失时，客户端可以自动重新连接到另一台服务器。故障转移 URI 始终使用故障转移前缀启动，服务器的 URI 列表包含在一组括号中。

​			Failover URL 示例：

```xml
failover:(tcp://host1:5672,tcp://host2:5672)
```

​			`Failover 模式默认会无限次的断线自动重连`。更多的配置可以参考[Failover Configuration options](https://activemq.apache.org/components/nms/providers/amqp/uri-configuration)

