#!/usr/bin/env node

const yargs = require('yargs');
const { exec } = require('child_process');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { argv } = require('process');
const { Configuration, OpenAIApi } = require('openai');
const os = require('os');
const userHomeDir = os.homedir();


const getMethod = (argv, willExec) => {
    const {key, args} = argv;
    
    console.log(argv);

    const shFilePath = path.join(userHomeDir, 'sh.json');
    let shData = {};

    if (fs.existsSync(shFilePath)) {
      // 如果 sh.json 文件存在，则读取其中的数据
      const shFileContent = fs.readFileSync(shFilePath, 'utf-8');
      shData = JSON.parse(shFileContent);
    } else {
      console.log('---您未配置命令');
      return;
    }
    const command = shData[key];
    if (!command) {
      console.log(`---key ${key} 对应的命令不存在`);
      return;
    }
    // 按顺序，用 arg{i} 替换 第${i}参数
    const replacedCommand = args.reduce((prev, curr, index) => {
      const tobereplace = `$${index + 1}`;
      // console.log('tobereplace:', tobereplace, curr, prev);
      return prev.replace(tobereplace, curr + '');
    }, command);

    console.log(`---待执行命令: \x1b[31m ${replacedCommand} \x1b[0m`);
    if (willExec) {
      exec(replacedCommand, (err, stdout, stderr) => {
        if (err) {
          console.error('\x1b[31m' + err + '\x1b[0m');
          return;
        }
        console.log('\x1b[31m' + stdout + '\x1b[0m');
        console.log('---命令执行完毕');
      });
    }
}

const getValueForKey = (key) => {
  const shFilePath = path.join(userHomeDir, 'sh.json');
  let shData = {};

  if (fs.existsSync(shFilePath)) {
    // 如果 sh.json 文件存在，则读取其中的数据
    const shFileContent = fs.readFileSync(shFilePath, 'utf-8');
    shData = JSON.parse(shFileContent);
    return shData[key];
  } else {
    return undefined;
  }
}

async function callOpenAI(prompt) {
  if (prompt && prompt.length <= 0 ) {
    return;
  }
  
  const apiKey = getValueForKey('gptkey');
  if (!apiKey || apiKey.length <= 0) {
    console.log("\x1b[31m 1. 请先使用 ehcli set gptkey 'sk-...';\n2. 并配置好代理如:export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890 \x1b[0m");
  }
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 400,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\"\"\""],
    });
    console.log(" 返回结果如下 \x1b[0m");
    console.log('\x1b[31m' + response.data.choices[0].text + '\x1b[0m');
  } catch (error) {
    console.log("\x1b[31m 请确保配置了命令行代理 \x1b[0m");
    console.log(error);
  }
}


yargs
  .command('set <key> <kvalue>', '设置key', (yargs) => {
    yargs.positional('key', {
      describe: '命令key',
      type: 'string',
      default: ''
    });
    yargs.positional('kvalue', {
        describe: '命令value',
        type: 'string',
        default: ''
      });
  }, (argv) => {
    const {key, kvalue} = argv;
    console.log('key', key, 'value', kvalue)
    
    // 读取当前目录的 sh.json 文件，如果不存在，则新建一个； 按 key-kvalue 的形式，保存到 sh.json中
    const shFilePath = path.join(userHomeDir, 'sh.json');
    let shData = {};

    if (fs.existsSync(shFilePath)) {
      // 如果 sh.json 文件存在，则读取其中的数据
      const shFileContent = fs.readFileSync(shFilePath, 'utf-8');
      shData = JSON.parse(shFileContent);
    } else {
      fs.writeFileSync(shFilePath, '{}', 'utf-8');
    }

    // 将新的 key-value 保存到 shData 中
    shData[key] = kvalue;

    // 将 shData 写入 sh.json 文件中
    fs.writeFileSync(shFilePath, JSON.stringify(shData), 'utf-8');
    console.log("最新的脚本列表如下:\n", shData);
    })
  .command('get <key> [args..]', '获取 key 对应的值, 并自动替换', 
    (yargs) => {
      yargs.positional('key', {
        describe: '命令key',
        type: 'string',
        default: ''
      });
      yargs.positional('args', {
          describe: '命令value',
          type: 'array',
          default: []
        });
    }, (argv)=>{
      getMethod(argv, false);
    })
  .command('run <key> [args..]', '执行 key 对应的命令', (yargs) => {
    yargs.positional('key', {
      describe: '命令key',
      type: 'string',
      default: ''
    });
    yargs.positional('args', {
        describe: '命令value',
        type: 'array',
        default: []
      });
  }, (argv)=>{
    getMethod(argv, true);
  })
  .command('git <type> <message> <id>', '组装提交信息', (yargs) => {
    yargs.positional('type', {
      describe: 'feat/fix/hotfix',
      type: 'string',
      default: 'feat'
    });
    yargs.positional('id', {
        describe: 'id',
        type: 'number',
        default: '1024'
      });
    yargs.positional('message', {
        describe: '提交信息',
        type: 'string',
        default: '提交的信息'
    });
  }, (argv) => {
    const type = argv.type;
    const id = argv.id;
    const message = argv.message;
    const domain = getValueForKey("domain");
    let commitMessage = `git commit -m "${type}:${message} [EC-${id}](https://jira.${domain}.com/browse/EC-${id})"`
    console.log(commitMessage);

    let branch = "提交分支名称";
    exec(`git symbolic-ref --short -q HEAD`, (err, stdout, stderr) => {
      if (err) {
          console.error(err);
          return;
      }
      if (stdout) {
        branch = stdout.trim();
      }
      let pushMessage = `git push origin HEAD:refs/for/${branch} --no-thin`
      console.log(pushMessage);
      });
  })

  .command('dict [word]', '翻译word', (yargs) => {
    yargs.positional('word', {
      describe: '翻译文字',
      type: 'string',
      default: 'computer'
    })
  }, (argv) => {
    // 发起请求
    const word = argv.word;
    axios.get(`http://fanyi.youdao.com/openapi.do?keyfrom=wufeifei&key=716426270&type=data&doctype=json&version=1.1&q=${word}`)
    .then(response => {
        const result = response.data;
        const soundStr = _.get(result, 'basic.phonetic');
        _.get(result, 'basic.phonetic');
        const explains = _.get(result, 'basic.explains');
        const translations = _.get(result, 'translation');
        let showString = '';
        if (soundStr) {
            showString += '音标:' + soundStr + '\n';
        }
        if (explains) {
            showString += '解释:\n' + explains.join(';\n');
        } else if (translations) {
            showString += '解释:\n' + translations.join(';\n');
        }
        if (showString.length == 0) {
            showString = "暂无翻译";
        }
        
        console.log('\x1b[31m', '###————————————————————————###', '\x1b[0m');
        console.log(showString);
        console.log('\x1b[31m', '###————————————————————————###', '\x1b[0m');
    })
    .catch(error => {
        console.error(error);
    });
  })
  .command('gpt <promote>', '查询',  (yargs)=> {
    yargs.positional('promote', {
      describe: '',
      type: 'string',
      default: ''
    });
  },(argv) => {
    const {promote} = argv; 
    callOpenAI(promote);
  })
  .command('ls', '举例', () => {
    const shFilePath = path.join(userHomeDir, 'sh.json');
    let shData = {};

    console.log('\x1b[31m', '###————————————————————————###', '\x1b[0m');
    const innerSample = `
    内置功能
    ehcli ls                                  # 查看所有的命令
    ehcli gpt "请提供一个Node.js 网络请求的模板"  # 使用GPT查看
    ehcli git feat "完成报价页接口联调" 10424     # 组装提交信息（入参为类型、jiraId、提交信息）,因为是关键操作，需要用户手动执行提交
    ehcli dict 依赖                            # 翻译word(传入待翻译的中文和英文)
    
    `
    console.log(innerSample);

    console.log('\x1b[31m', '###————————————————————————###', '\x1b[0m');
    const extra = `
    自定义模板
    ehcli set <key> <kvalue>         设置key
    ehcli get <key> [args..]         获取 key 对应的值, 并自动替换
    ehcli run <key> [args..]         执行 key 对应的命令
    拓展举例详见README.md
    `
    console.log(extra);

    if (fs.existsSync(shFilePath)) {
      // 如果 sh.json 文件存在，则读取其中的数据
      const shFileContent = fs.readFileSync(shFilePath, 'utf-8');
      shData = JSON.parse(shFileContent);
      let printArr = [];
      for (let key in shData) {
        printArr.push("\x1b[31m" + key + "\x1b[0m:  " + shData[key]);
      }
      console.log('\x1b[31m', '###————————————————————————###', '\x1b[0m');
      console.log("自定义拓展");
      console.log(printArr.join('\n'));
    }
  })
  .command('import <jsonpath>', '批量插入',  (yargs)=> {
    yargs.positional('jsonpath', {
      describe: '',
      type: 'string',
      default: ''
    });
  },(argv) => {
    const shFilePath = path.join(userHomeDir, 'sh.json');
    let shData = {};
    if (fs.existsSync(shFilePath)) {
      const shFileContent = fs.readFileSync(shFilePath, 'utf-8');
      shData = JSON.parse(shFileContent);
    } else {
      fs.writeFileSync(shFilePath, '{}', 'utf-8');
    }

    const {jsonpath} = argv; 
    const outContent = fs.readFileSync(jsonpath, 'utf-8');
    outData = JSON.parse(outContent);
    // 合并
    for (let key in outData) {
      shData[key] = outData[key];
    }
    fs.writeFileSync(shFilePath, JSON.stringify(shData), 'utf-8');
  })
  .help()
  .argv;