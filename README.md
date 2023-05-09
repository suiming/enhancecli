# enhanceCLI - 增强的命令行工具

## 为什么需要该工具？

在开发过程中，常常会遇到一些需要频繁执行的操作，但是执行这些操作时需要切换不同的应用程序，从而降低了思考的连贯性。enhanceCLI旨在解决以下问题：

1. 查字典：当定义一个变量时，需要查找一个贴切的名词，需要切换到字典应用中进行查询；
2. 提交代码：现有的命令过于冗长，难以记忆，需要查阅或查找；
3. 切换到自建NPM：由于环境原因，切换到开思自建NPM很不方便，需要手动配置；
4. 设置代理：由于网络问题，需要设置代理或取消代理；
5. 存储简短重要内容：需要存储重要的简短内容，但是存储在其他地方不方便获取。

## 如何使用

enhanceCLI是一个系统级别的全局命令行工具，可以直接在IDE中使用，并且可立即触达。您可以通过以下命令安装enhanceCLI：

```
npm install -g enhancecli
ehcli import
```

enhanceCLI提供了以下命令：

### 内置能力

- `ehcli ls`: 查看所有命令和备忘录；
- `ehcli git feat "完成报价页接口联调" 10424`: 组装提交信息（入参为类型、提交信息、jiraId），需要用户手动执行提交；
- `ehcli dict <word>`: 翻译单词；
- `ehcli gpt <promote>`: 使用GPT对话。



### 内置拓展能力

- `ehcli import <jsonpath>`: 导入自定义的命令列表；
- `ehcli memo`: 显示备忘录；
- `ehcli proxy set`: 设置代理；
- `ehcli proxy clear`: 清除命令行代理；
- `ehcli work open`: 用浏览器打开工作空间；
- `ehcli search <keyword>`: 在Bing搜索引擎中搜索指定关键字。

### 自定义拓展能力

除了内置了一些常见的功能外，enhanceCLI还提供了拓展能力。您可以使用以下命令：

- `ehcli set <key> <command_string_with_$1 $2>`: 添加自定义脚本；
- `ehcli get <key> <arg1> <arg2> ...`: 获取自定义脚本；
- `ehcli run <key> <arg1> <arg2> ...`: 执行自定义脚本；
- `ehcli import <jsonpath>`: 导入命令列表。

以下是一个自定义脚本的示例：假设需要开启代理，但是每次都需要输入很长的命令。您可以使用以下命令来添加脚本：

```
ehcli setproxy "export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;export ALL_PROXY=socks5://127.0.0.1:1080"
```

然后，您可以使用以下命令来执行该脚本：

```
ehcli run setproxy
```

## 总结

enhanceCLI是一款增强的命令行工具，提供了一系列简便的功能，可以提高开发效率。如果您遇到了常见的开发问题，可以考虑使用enhanceCLI来解决。