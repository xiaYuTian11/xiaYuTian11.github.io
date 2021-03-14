---
title: 基于 freemarker 的代码生成器
tags:
  - freemarker
  - 代码生成器
abbrlink: 407a3a38
date: 2021-03-11 19:44:20
---

##  概述

​		最近在搭建新项目的时候，发现很多基础的业务代码都很相识，而基础的增删改查相信大家都写得很无趣，故参考github，利用freemarker写了一个代码生成器，模版框架是mybatis-plus,只需要稍微改改模版就可以在其他工程里面使用了。

​	<!-- more -->

​		代码生成器所生成的代码包括，controller,service,serviceImpl,api,mapper,xml,entity,dto,vo,converter
  以及单表的增删改查及列表查询5个接口。



​		**前提**：有个可连接的数据库，里面有一张表，会基本的JDBC方式连接数据库并进行基础的查询，会制造freemarker模版；



## 代码实现

pom.xml

```xml
		<dependency>
            <groupId>org.freemarker</groupId>
            <artifactId>freemarker</artifactId>
            <version>2.3.30</version>
		</dependency>
		<dependency>
            <groupId>com.kingbase8</groupId>
            <artifactId>jdbc42</artifactId>
            <version>8.2.0</version>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.5.8</version>
        </dependency>
```





CodeGenerateUtils.java

```java
/**
 * 代码生成器启动类
 *
 * @author TMW
 * @date 2021/2/25 17:45
 */
public class CodeGenerateUtils {

    private static final String URL = "jdbc:kingbase8://127.0.0.1:54321/FRONT?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8";
    private static final String DRIVER = "com.kingbase8.Driver";
    private static final String USER = "SYSTEM";
    private static final String PASSWORD = "123456";
    private final String showTablesSql = "select tablename from sys_tables WHERE \"schemaname\" = 'PUBLIC';";

    private final String basePath = "C:\\Users\\tmw\\Desktop\\test";
    private final String basePackageName = "com.zenith.front";
    private final String AUTHOR = "TMW";
    private final String mapperXmlPath = "mapper";
    private final String daoPath = "dao";
    private final String dtoPath = "domain/dto";
    private final String voPath = "domain/vo";
    private final String entityPath = "domain/entity";
    private final String servicePath = "api";
    private final String serviceImplPath = "service";
    private final String controllerPath = "controller";
    private final String converterPath = "converter";
    private final String modelPath = "domain/entity";
    // 优先
    private final Set<String> includeSet = new HashSet<String>() {{
        add("t_dct_info_group");
        add("t_dct_info_item");
        add("t_dct_info_set");
    }};
    private final Set<String> excludeSet = new HashSet<String>() {{
        // add("String");
    }};

    private final List<ColumnClass> columnClassList = new ArrayList<>();
    private String tableName;
    private String primaryKeyColumnName;
    private String changeTableName;

    public static void main(String[] args) throws Exception {
        CodeGenerateUtils codeGenerateUtils = new CodeGenerateUtils();
        codeGenerateUtils.generate();
    }

    public Connection getConnection() throws Exception {
        Class.forName(DRIVER);
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public void generate() throws Exception {
        Connection connection = null;
        try {
            connection = getConnection();
            Set<String> tables = findTables(connection);
            final Set<String> lowerCaseSet = includeSet.stream().map(String::toLowerCase).collect(Collectors.toSet());
            if (lowerCaseSet.size() > 0) {
                tables = tables.stream().filter(lowerCaseSet::contains).collect(Collectors.toSet());
            }
            if (excludeSet.size() > 0) {
                tables = tables.stream().filter(tableNameStr -> !excludeSet.contains(tableNameStr)).collect(Collectors.toSet());
            }
            if (tables.size() < 1) {
                throw new RuntimeException("未发现可生成表");
            }
            for (String tableNameStr : tables) {
                tableName = tableNameStr;
                changeTableName = replaceUnderLineAndUpperCase(tableName);
                columnClassList.clear();
                DatabaseMetaData databaseMetaData = connection.getMetaData();
                ResultSet resultSet = databaseMetaData.getColumns(null, "%", tableName, "%");
                final ResultSet primaryKeys = databaseMetaData.getPrimaryKeys(null, null, tableName);
                while (primaryKeys.next()) {
                    primaryKeyColumnName = primaryKeys.getString("COLUMN_NAME");
                }
                //生成Mapper文件
                generateMapperFile(resultSet);
                //生成Dao文件
                generateDaoFile(resultSet);
                //生成Repository文件
                // generateRepositoryFile(resultSet);
                //生成服务层接口文件
                generateServiceInterfaceFile(resultSet);
                //生成服务实现层文件
                generateServiceImplFile(resultSet);
                //生成Controller层文件
                generateControllerFile(resultSet);
                //生成DTO文件
                generateDTOFile(resultSet);
                //生成ListDTO文件
                generateListDTOFile(resultSet);
                //生成VO文件
                generateVOFile(resultSet);
                //生成Model文件
                generateModelFile(resultSet);
                // 生成Converter文件
                generateConverterFile(resultSet);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    public Set<String> findTables(Connection connection) throws SQLException {
        Set<String> set = new HashSet<>();
        PreparedStatement ps = connection.prepareStatement(showTablesSql);
        final ResultSet resultSet = ps.executeQuery();
        while (resultSet.next()) {
            final String tableName = resultSet.getString(1);
            set.add(tableName);
        }
        if (set.size() <= 0) {
            throw new RuntimeException("未在指定数据库中发现可用表！");
        }
        return set;
    }

    private String getCreatePath(String filePath, String suffix) {
        return basePath + File.separator + filePath + File.separator + changeTableName + suffix;
    }

    private String getSuffixPackageName(String packagePath) {
        if (packagePath == null) {
            return basePackageName;
        }
        StringBuilder sb = new StringBuilder();
        if (packagePath.contains("/")) {
            final String[] split = packagePath.split("/");
            for (String str : split) {
                sb.append(str).append(".");
            }
            return basePackageName + "." + sb.substring(0, sb.length() - 1);
        }
        return basePackageName + "." + packagePath;
    }

    private void generateModelFile(ResultSet resultSet) throws Exception {
        final String suffix = ".java";
        String path = getCreatePath(modelPath, suffix);
        final String templateName = "Model.ftl";
        File mapperFile = new File(path);
        this.checkFilePath(mapperFile);
        generateModelAndDTOAndVoFile(resultSet, templateName, mapperFile, modelPath);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + ".java 完成 >>>>>>>>>>>");
    }

    private void generateModelAndDTOAndVoFile(ResultSet resultSet, String templateName, File createFile, String packageName) throws Exception {
        if (columnClassList.size() < 1) {
            ColumnClass columnClass = null;
            while (resultSet.next()) {
                //id字段略过
                // if (StrUtil.equalsAny(templateName, "Model.ftl")) {
                //     if (StrUtil.equalsAny(resultSet.getString("COLUMN_NAME"), "id", "is_delete")) {
                //         continue;
                //     }
                // }
                columnClass = new ColumnClass();
                //获取字段名称
                final String columnName = resultSet.getString("COLUMN_NAME");
                columnClass.setColumnName(columnName);
                //获取字段类型
                columnClass.setColumnType(resultSet.getString("TYPE_NAME").toLowerCase());
                //转换字段名称，如 sys_name 变成 SysName
                columnClass.setChangeColumnName(replaceUnderLineAndUpperCase(columnName));
                //字段在数据库的注释
                columnClass.setColumnComment(resultSet.getString("REMARKS"));
                columnClass.setPrimaryKey(StrUtil.equals(columnName, primaryKeyColumnName));
                columnClassList.add(columnClass);
            }
        }
        List<ColumnClass> relColumnClassList;
        if (StrUtil.equalsAny(templateName, "Model.ftl")) {
            relColumnClassList = columnClassList.stream().filter(entity -> !StrUtil.equalsAny(entity.getColumnName(), "is_delete"))
                    .collect(Collectors.toList());
        } else {
            relColumnClassList = new ArrayList<>(columnClassList);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("model_column", relColumnClassList);
        generateFileByTemplate(templateName, packageName, createFile, dataMap);
    }

    private void generateListDTOFile(ResultSet resultSet) throws Exception {
        final String suffix = "ListDTO.java";
        String path = getCreatePath(dtoPath, suffix);
        final String templateName = "ListDTO.ftl";
        File mapperFile = new File(path);
        this.checkFilePath(mapperFile);
        generateModelAndDTOAndVoFile(resultSet, templateName, mapperFile, dtoPath);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "ListDTO.java 完成 >>>>>>>>>>>");
    }

    private void generateVOFile(ResultSet resultSet) throws Exception {
        final String suffix = "VO.java";
        String path = getCreatePath(voPath, suffix);
        final String templateName = "VO.ftl";
        File mapperFile = new File(path);
        this.checkFilePath(mapperFile);
        generateModelAndDTOAndVoFile(resultSet, templateName, mapperFile, voPath);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "VO.java 完成 >>>>>>>>>>>");
    }

    private void generateDTOFile(ResultSet resultSet) throws Exception {
        final String suffix = "DTO.java";
        String path = getCreatePath(dtoPath, suffix);
        final String templateName = "DTO.ftl";
        File mapperFile = new File(path);
        this.checkFilePath(mapperFile);
        generateModelAndDTOAndVoFile(resultSet, templateName, mapperFile, dtoPath);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "DTO.java 完成 >>>>>>>>>>>");
    }

    private void generateConverterFile(ResultSet resultSet) throws Exception {
        final String suffix = "Converter.java";
        String path = getCreatePath(converterPath, suffix);
        final String templateName = "Converter.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, converterPath, mapperFile, dataMap);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "Converter.java 完成 >>>>>>>>>>>");
    }

    private void generateControllerFile(ResultSet resultSet) throws Exception {
        final String suffix = "Controller.java";
        String path = getCreatePath(controllerPath, suffix);
        final String templateName = "Controller.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, controllerPath, mapperFile, dataMap);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "Controller.java 完成 >>>>>>>>>>>");
    }

    private void generateServiceImplFile(ResultSet resultSet) throws Exception {
        final String suffix = "ServiceImpl.java";
        String path = getCreatePath(serviceImplPath, suffix);
        final String templateName = "ServiceImpl.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, serviceImplPath, mapperFile, dataMap);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "ServiceImpl.java 完成 >>>>>>>>>>>");
    }

    private void generateServiceInterfaceFile(ResultSet resultSet) throws Exception {
        final String suffix = "Service.java";
        String path = getCreatePath(servicePath, suffix);
        final String templateName = "Service.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, servicePath, mapperFile, dataMap);
    }

    private void generateRepositoryFile(ResultSet resultSet) throws Exception {
        final String suffix = "Repository.java";
        final String path = basePath + changeTableName + suffix;
        final String templateName = "Repository.ftl";
        File mapperFile = new File(path);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, mapperFile, dataMap);
    }

    /**
     * Mapper.java
     */
    private void generateDaoFile(ResultSet resultSet) throws Exception {
        final String suffix = "Mapper.java";
        String path = getCreatePath(daoPath, suffix);
        final String templateName = "Mapper.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, daoPath, mapperFile, dataMap);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "Mapper.java 完成 >>>>>>>>>>>");
    }

    /**
     * Mapper.xml
     */
    private void generateMapperFile(ResultSet resultSet) throws Exception {
        final String suffix = "Mapper.xml";
        String path = getCreatePath(mapperXmlPath, suffix);
        final String templateName = "Mapper.xml.ftl";
        File mapperFile = new File(path);
        checkFilePath(mapperFile);
        Map<String, Object> dataMap = new HashMap<>();
        generateFileByTemplate(templateName, mapperFile, dataMap);
        System.out.println("<<<<<<<<<<<< 生成 " + changeTableName + "Mapper.xml 完成 >>>>>>>>>>>");
    }

    private void generateFileByTemplate(final String templateName, File file, Map<String, Object> dataMap) throws Exception {
        this.generateFileByTemplate(templateName, null, file, dataMap);
    }

    private void generateFileByTemplate(final String templateName, String packagePath, File file, Map<String, Object> dataMap) throws Exception {
        Template template = FreeMarkerTemplateUtils.getTemplate(templateName);
        FileOutputStream fos = new FileOutputStream(file);
        dataMap.put("serialVersionUID", getSerialVersionUID());
        dataMap.put("table_name_small", tableName);
        dataMap.put("table_name", changeTableName);
        dataMap.put("lower_table_name", StrUtil.lowerFirst(changeTableName));
        dataMap.put("author", AUTHOR);
        dataMap.put("date", DateUtil.formatDateTime(new Date()));
        dataMap.put("dto_package_name", getSuffixPackageName(dtoPath));
        dataMap.put("vo_package_name", getSuffixPackageName(voPath));
        dataMap.put("entity_package_name", getSuffixPackageName(entityPath));
        dataMap.put("package_name", getSuffixPackageName(packagePath));
        dataMap.put("api_package_name", getSuffixPackageName(servicePath));
        dataMap.put("service_package_name", getSuffixPackageName(serviceImplPath));
        dataMap.put("converter_package_name", getSuffixPackageName(converterPath));
        dataMap.put("dao_package_name", getSuffixPackageName(daoPath));
        // dataMap.put("table_annotation", tableAnnotation);
        Writer out = new BufferedWriter(new OutputStreamWriter(fos, StandardCharsets.UTF_8), 10240);
        template.process(dataMap, out);
    }

    private void checkFilePath(File file) {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
        }
    }

    /**
     * 生成serialVersionUID
     */
    protected String getSerialVersionUID() {
        return String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits())) + "L";
    }

    public String replaceUnderLineAndUpperCase(String str) {
        return StrUtil.upperFirst(StrUtil.toCamelCase(str));
    }
}
```



ColumnClass.java

```java
/**
 * 数据库字段封装类
 *
 * @author TMW
 * @date 2021/2/26 14:55
 */
public class ColumnClass {

    /**
     * 数据库字段名称
     **/
    private String columnName;
    /**
     * 数据库字段类型
     **/
    private String columnType;
    /**
     * 数据库字段首字母小写且去掉下划线字符串
     **/
    private String changeColumnName;
    /**
     * 数据库字段注释
     **/
    private String columnComment;
    /***
     * 数据库主键
     */
    private boolean primaryKey;

    public boolean isPrimaryKey() {
        return primaryKey;
    }

    public ColumnClass setPrimaryKey(boolean primaryKey) {
        this.primaryKey = primaryKey;
        return this;
    }

    public String getColumnComment() {
        return columnComment;
    }

    public void setColumnComment(String columnComment) {
        this.columnComment = columnComment;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }

    public String getChangeColumnName() {
        return changeColumnName;
    }

    public void setChangeColumnName(String changeColumnName) {
        this.changeColumnName = changeColumnName;
    }
}

```



FreeMarkerTemplateUtils.java

```java
import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.NullCacheStorage;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;

import java.io.IOException;

/**
 * @author TMW
 * @date 2021/2/26 14:54
 */
public class FreeMarkerTemplateUtils {

    private FreeMarkerTemplateUtils(){}
    private static final Configuration CONFIGURATION = new Configuration(Configuration.VERSION_2_3_30);

    static{
        //这里比较重要，用来指定加载模板所在的路径
        CONFIGURATION.setTemplateLoader(new ClassTemplateLoader(FreeMarkerTemplateUtils.class, "/templates"));
        CONFIGURATION.setDefaultEncoding("UTF-8");
        CONFIGURATION.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        CONFIGURATION.setCacheStorage(NullCacheStorage.INSTANCE);
    }

    public static Template getTemplate(String templateName) throws IOException {
        try {
            return CONFIGURATION.getTemplate(templateName);
        } catch (IOException e) {
            throw e;
        }
    }

    public static void clearCache() {
        CONFIGURATION.clearTemplateCache();
    }
}

```



## 模版

Model.ftl

```java
package ${package_name};

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
* @author ${author}
* @date ${date}
*/
@Data
@TableName("${table_name_small}")
public class ${table_name} implements Serializable {

    private static final long serialVersionUID = ${serialVersionUID};

<#if model_column??>
    <#list model_column as model>
    /**
    *${model.columnComment!}
    */
<#if (model.primaryKey = true)>
    @TableId("${model.columnName}")
    private String ${model.changeColumnName?uncap_first};
<#else>
    @TableField("${model.columnName}")
    <#if (model.columnType = 'varchar' || model.columnType = 'text')>
    private String ${model.changeColumnName?uncap_first};
    </#if>
    <#if model.columnType = 'timestamp' >
    private Date ${model.changeColumnName?uncap_first};
    </#if>
    <#if model.columnType = 'smallint' || model.columnType = 'int2'>
    private Integer ${model.changeColumnName?uncap_first};
    </#if>
</#if>
    </#list>
</#if>

    @TableLogic
    @TableField(value = "is_delete", fill = FieldFill.INSERT)
    private Integer isDelete;
}

```



VO.ftl

```java
package ${package_name};

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
* @author ${author}
* @date ${date}
*/
@Data
@EqualsAndHashCode(callSuper = true)
public class ${table_name}VO extends BaseVO {

    private static final long serialVersionUID = ${serialVersionUID};

<#if model_column??>
<#list model_column as model>
    /**
    *${model.columnComment!}
    */
    <#if (model.columnType = 'BIGINT' || model.columnType = 'int8')>
    private Long ${model.changeColumnName?uncap_first};
    </#if>
    <#if (model.columnType = 'varchar' || model.columnType = 'text')>
    private String ${model.changeColumnName?uncap_first};
    </#if>
    <#if model.columnType = 'timestamp' >
    private Date ${model.changeColumnName?uncap_first};
    </#if>
    <#if model.columnType = 'smallint' || model.columnType = 'int2'>
    private Integer ${model.changeColumnName?uncap_first};
    </#if>
</#list>
</#if>
}

```



​		模版就贴两个仅供参考，由于时间仓促，代码就没有一键生成到对应的包下面，只有自己稍微调整下路径实现即可；

源码地址含本工程全部模版文件：https://github.com/xiaYuTian11/freemarker-generator