---
title: 分布式ID方案--SnowFlake（雪花算法）
tags:
  - 分布式ID
  - SnowFlake
abbrlink: 8b811d4f
date: 2020-10-14 21:11:49
---

## 原理

​		 SnowFlake 算法来源于 Twitter，用于生成全局唯一 ID的一种算法。SnowFlake算法生成的ID有64位bit,分为5部分组成：

<!-- more -->

> ​	0     00000000000000000000000000000000000000000    00000    00000    000000000000

1. 1bit位不用，为标识部分，该位主要用来保持ID的自增性，如果占用最高位，整个值将变成负数；
2. 41bit位时间戳，标识当前时间距指定开始时间的毫秒级差值，41位时间戳可以标识的时间大概为 （1L << 41） / (1000 * 60 * 60 * 24 * 365) = 69.73年；
3. 5bit位数据中心标识，可以标识 1L << 5 = 32 个数据中心；
4. 5bit位机器标识，可以标识 1L << 5 = 32 台机器；
5. 12bit位序列号，支持同毫秒内同一数据中心同一台机器生成 1L << 12 = 4096 个ID；

​        除开第一个bit位用于标识作用，其他区段的bit位都可以灵活调整，比如不需要这么多数据中心，可以少占用几个bit位，将多余的bit位分配到其他分段或者根据具体业务来自定义生成规则；



## Java实现

​		  网上Java实现的 SnowFlake 特别多，基本上都是一模一样的，在此也记录下自己造的轮子：

```java
/**
 * 雪花算法
 * 0-00000000000000000000000000000000000000000-0000000000-000000000000
 * 1) 1位，不用。二进制中最高位为1的都是负数，但是我们生成的id一般都使用整数，所以这个最高位固定是0
 * 2) 41位，用来记录时间戳（毫秒）。41位可以表示2^41−1个数字，如果只用来表示正整数（计算机中正数包含0），可以表示的数值范围是：0 至 2^41−1，
 * 减1是因为可表示的数值范围是从0开始算的，而不是1。也就是说41位可以表示2^41−1个毫秒的值，转化成单位年则是(2^41−1)/(1000∗60∗60∗24∗365)=69年
 * 3) 10位，用来记录工作机器id。可以部署在2^10=1024个节点，包括5位datacenterId和5位workerId，5位（bit）可以表示的最大正整数是2^5−1=31，
 * 即可以用0、1、2、3、....31这32个数字，来表示不同的datecenterId或workerId
 * 4) 12位，序列号，用来记录同毫秒内产生的不同id。12位（bit）可以表示的最大正整数是2^12−1=4095，即可以用0、1、2、3、....4094这4095个数字，
 * 来表示同一机器同一时间截（毫秒)内产生的4095个ID序号由于在Java中64bit的整数是long类型，所以在Java中SnowFlake算法生成的id就是long来存储的。
 * <p>
 *
 * @author TMW
 * @since 2020/10/12
 */
public class SnowFlakeUtil {
    /**
     * 起始时间戳：2020-01-01 00:00:00
     */
    private final static long START_TIMESTAMP = 1577808000000L;
    /**
     * 序列号占用的位数
     */
    private final static long SEQUENCE_BIT = 12;
    /**
     * 机器标识占用的位数
     */
    private final static long MACHINE_BIT = 5;
    /**
     * 数据中心占用的位数
     */
    private final static long DATACENTER_BIT = 5;
    /**
     * 每一部分的最大值：先进行左移运算，在进行非运算取反
     * <p>
     * 用位运算计算出最大支持的数据中心数量：31(从0开始)
     */
    private final static long MAX_DATACENTER_NUM = ~(-1L << DATACENTER_BIT);

    /**
     * 用位运算计算出最大支持的机器数量：31(从0开始)
     */
    private final static long MAX_MACHINE_NUM = ~(-1L << MACHINE_BIT);

    /**
     * 用位运算计算出12位能存储的最大正整数：4095(从0开始)
     */
    private final static long MAX_SEQUENCE = ~(-1L << SEQUENCE_BIT);
    /**
     * 机器标志较序列号的偏移量
     */
    private final static long MACHINE_LEFT = SEQUENCE_BIT;

    /**
     * 数据中心较机器标志的偏移量
     */
    private final static long DATACENTER_LEFT = MACHINE_LEFT + MACHINE_BIT;

    /**
     * 时间戳较数据中心的偏移量
     */
    private final static long TIMESTAMP_LEFT = DATACENTER_LEFT + DATACENTER_BIT;
    /**
     * 序列号
     */
    private static long sequence = 0L;
    /**
     * 上一次时间戳
     */
    private static long lastStamp = -1L;
    /**
     * 数据中心
     */
    private long datacenterId;
    /**
     * 机器标识
     */
    private long machineId;

    /**
    * 构造方法初始化数据中心ID和机器ID
    */
    public SnowFlakeUtil(long machineId, long datacenterId) {
        if (machineId > MAX_MACHINE_NUM || machineId < 0) {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", MAX_MACHINE_NUM));
        }
        if (datacenterId > MAX_DATACENTER_NUM || datacenterId < 0) {
            throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", MAX_DATACENTER_NUM));
        }
        this.machineId = machineId;
        this.datacenterId = datacenterId;
    }

    /**
     * 获取下一个id
     *
     * @return next id
     */
    public synchronized long nextId() {
        // 当前时间戳
        long currStamp = getNewStamp();
        // 当前时间戳小于上次时间戳，出现时钟回拨
        if (currStamp < lastStamp) {
            throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
        }
        // 同一毫秒内
        if (currStamp == lastStamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            // 同一毫秒的序列数已经达到最大
            if (sequence == 0L) {
                // 获取下一时间的时间戳并赋值给当前时间戳
                currStamp = getNextMill();
            }
        } else {
            // 不同毫秒内，重置序列为0
            sequence = 0L;
        }
        lastStamp = currStamp;
        // 时间戳 | 数据中心 | 机器码 | 序列号
        return ((currStamp - START_TIMESTAMP) << TIMESTAMP_LEFT)
            | (datacenterId << DATACENTER_LEFT)
            | (machineId << MACHINE_LEFT)
            | sequence;
    }

    /**
     * 获取下一个时间戳
     *
     * @return 时间戳
     */
    private static long getNextMill() {
        long mill = getNewStamp();
        while (mill <= lastStamp) {
            mill = getNewStamp();
        }
        return mill;
    }

    private static long getNewStamp() {
        return System.currentTimeMillis();
    }
```

​		  雪花算法大概原理就是这样，这个算法严重依赖于服务器时间，所以一旦服务器时间出现了回拨现象，就有可能导致生成重复的ID，网上针对SnowFlake时钟回拨问题有很多解决方案，比如[美团Leaf](https://github.com/Meituan-Dianping/Leaf/blob/master/README_CN.md)、[百度uid-generator](https://github.com/baidu/uid-generator)等。下面说下比较简单的解决方案。

## 时钟回拨

### 在一定范围内等待时钟追上当前时间

1.定义时钟回拨后等待最大值：

```java
/**
* 时钟回拨最大值 3 毫秒，不建议大于 5 毫秒
*/
private final static long MAX_BACKWARD_MS = 3;
```

2.nextId()方法判断当前时间小于最后时间时，等待时钟追上当前时间：

```java
// 当前时间戳小于上次时间戳，出现时钟回拨
if (currStamp < lastStamp) {
    // 偏移量
    long offset = lastStamp - currStamp;
    if (offset <= MAX_BACKWARD_MS) {
        // 休眠等待
        LockSupport.parkNanos(TimeUnit.MICROSECONDS.toNanos(offset));
        // 重新获取当前值
        currStamp = getNewStamp();
        // 如果仍然小于上次时间戳，可以直接抛异常或者采用扩展字段 extension
        if (currStamp < lastStamp) {
            throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
        }
    }
}
```



### 利用扩张位

​			由于SnowFlake最后序列号占用12位bit，一毫秒可以生成4096个ID，一般系统用不到这么大的并发量的的话，可以拿出几位当成时钟回拨扩展位，或者其他几部分也可以拿出几位来用于扩展。在此拿出序列号的2位用于时钟回拨的扩展。

1.定义时钟回拨占用位位数

```java
    /**
     * 序列号占用的位数，12可以每毫秒生成4096个，一般业务根本不需要用到这么大的并发，所以缩短到10位，
     * 当然也可以缩减数据中心和机器id的位数
     */
    private final static long SEQUENCE_BIT = 10;
    /**
     * 时钟回拨扩展次数，最大承受三次时钟回拨
     */
    private final static long BACK_EXTENSION_BIT = 2;
  	/**
     * 最大次数
     */
    private final static long MAX_BACKWARD_COUNT = ~(-1L << BACK_EXTENSION_BIT);
```

2.nextId()方法判断回次数

```java
if (offset <= MAX_BACKWARD_MS) {
    // 休眠等待
    LockSupport.parkNanos(TimeUnit.MICROSECONDS.toNanos(offset));
    // 重新获取当前值
    currStamp = getNewStamp();
    // 如果仍然小于上次时间戳，可以直接抛异常或者采用扩展字段 extension
    if (currStamp < lastStamp) {
        if (backwardCount < MAX_BACKWARD_COUNT) {
            backwardCount++;
            return bitOption(currStamp);
        } else {
            // 三次回拨后直接抛出异常，后续进行人为干预，处理好服务器时间
            throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
        }
    }
} else {
    if (backwardCount < MAX_BACKWARD_COUNT) {
        backwardCount++;
        return bitOption(currStamp);
    } else {
        // 三次回拨后直接抛出异常，后续进行人为干预，处理好服务器时间
        throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
    }
}

/**
* 位运算拼接
*
* @param currStamp
* @return
*/
private long bitOption(long currStamp) {
    // 时间戳 | 数据中心 | 机器码 | 序列号 | 时钟回拨次数
    return (currStamp - START_TIMESTAMP) << TIMESTAMP_LEFT
        | datacenterId << DATACENTER_LEFT
        | machineId << MACHINE_LEFT
        | sequence << SEQUENCE_LEFT
        | backwardCount;
}
```

### 用PowerMockito测试

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({System.class, SnowFlakeBackExtension.class})
public class SnowFlakeBackExtensionTest {

    @Test
    public void nextId() {
        // SnowFlakeBackExtension SnowFlake算法类
        SnowFlakeBackExtension extension = new SnowFlakeBackExtension(1, 2);
        int size = 100;
        long beginTime = System.currentTimeMillis();
        Set<Long> set = new ConcurrentHashSet<>();
        for (int i = 0; i < size; i++) {
            set.add(extension.nextId());
        }
        LockSupport.parkNanos(TimeUnit.SECONDS.toNanos(1));
        PowerMockito.mockStatic(System.class);
        PowerMockito.when(System.currentTimeMillis()).thenReturn(beginTime);
        Assertions.assertThat(System.currentTimeMillis()).isEqualTo(beginTime);

        for (int i = 0; i < size; i++) {
           // 大于三次时钟回拨后断言出现异常 
            if (i >= 3) {
                try {
                    Assertions.assertThat(extension.nextId()).isInstanceOf(RuntimeException.class);
                } catch (RuntimeException e) {
                    Assertions.assertThat(e.getMessage()).isEqualTo("Clock moved backwards.  Refusing to generate id");
                }
            } else {
                set.add(extension.nextId());
            }
        }

        MockRepository.remove(System.class);
        for (int i = 0; i < size * 120; i++) {
            set.add(extension.nextId());
        }
        System.out.println(set.size());
        // 断言生成的ID数量
        Assertions.assertThat(set.size()).isEqualTo(size * 121 + 3);
    }
}
```

​			Demo源代码地址：https://github.com/xiaYuTian11/learning_demo/tree/master/snowflake

