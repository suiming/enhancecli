# enhanceCLI
 增强的命令行工具

# Why?
开发过程中有些动作不太连贯；   
1. 查字典: 如定义一个变量，查字典去找一个贴切的名词；  
2. 提交代码: 现在的命令很长，记不住需要查阅或者找  
3. 因为环境原因，切换到开思自建 NPM 很不方便，需要手动配置一遍。
4. 因为网络问题，需要设置了代理，或者取消代理。
5. 重要的简短的内容，放在其他地方，不方便获取和存储。  

以上几个问题，开发会需要切换不同的应用程序，降低了思考的连贯性。

# 如何使用
做了一个系统级别的全局命令行工具，命令行一般都集成在IDE中，并且可立即触达
提供了如下命令给大家，

安装方法
```
npm install -g ehcli
```


使用功能方法如下：

```
#内置能力
ehcli ls                                  # 查看所有的命令，查看备忘
ehcli git feat "完成报价页接口联调" 10424    # 组装提交信息（入参为类型、提交信息、jiraId）,因为是关键操作，需要用户手动执行提交
ehcli dict <word>                         # 翻译word(传入待翻译的中文和英文)
ehcli gpt <promote>                       # 使用gpt对话

# 拓展
ehcli import <jsonpath>                   # 导入命令列表
ehcli get normalmemo                      # 获取备忘录
ehcli run setcassnpm                      # 设置cass npm
ehcli run setproxy                        # clash的设置代理
ehcli run noproxy                         # 清除命令行代理
ehcli run openworkurls                    # 用浏览器打开工作空间
ehcli run search "some-keyword"           # 打开链接并使用bing搜索 "some-keyword"

```

# 拓展能力
除了内置了一些常见的功能外，提供了拓展能力
```
ehcli set <key> <commonds_string_with_$1 $2>>
ehcli get <key> <arg1> <arg2> ...
ehcli run <key> <arg1> <arg2> ...
ehcli import <jsonpath>

```
拓展举例如下(和 alias 一致)， alis需要手动把命令写到 ~/.zsh_profile文件中，我们这里直接用set run 方法去做，用$1代表第一个入参...
假设开启了代理，端口号未定，每次都要打下面这么长的命令
"export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;export ALL_PROXY=socks5://127.0.0.1:1080"

我们则可以这么做

```
// 添加脚本
ehcli setproxy "export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;export ALL_PROXY=socks5://127.0.0.1:1080"
// 执行脚本
ehcli run setproxy

```