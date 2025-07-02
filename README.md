# DCC
> 自动化 HTTP 压测工具

### 介绍
DDC 是一个自动化 HTTP 压测工具。您可以手动设置其`并发数`，支持 `GET` 和 `POST` 请求类型，允许指定`请求头`、`请求体`和 `Cookie`。  
DDC 还允许您提前指定变量并应用在任意文本中。支持`固定变量`和`随机变量`，并指定`随机变量`的`长度`和`随机字符`。

### 使用教程
1. 前往 [Releases](https://github.com/PayaHai/DCC/releases) 页面，下载您的操作系统的最新版本可执行文件。
2. 使用 `Shell` 执行下载的可执行文件。
3. 首次执行后程序会自动释放配置文件 `Config.jsonc`。
4. 根据配置文件中的注释修改配置文件.
5. 再次运行程序，软件即可自动压测。

### 默认配置文件
``` JSONC
{
    "concurrent": 1024,  // 并发数
    "variables": {  // 变量，使用$包裹使用
        "username": {
            "type": "fix",  // 类型： fix(固定变量)、random(随机变量)
            "value": "admin"  // 固定值
        },
        "password": {
            "type": "random",  // 类型： fix(固定变量)、random(随机变量)
            "long": 8,  // 随机长度
            "char": "abcdefghijklmnopqrstuvwxyz0123456789"  // 随机字符
        }
    },
    "feature": {  // 攻击对象特征
        "url": "https://****.******.com",  // 攻击对象 URL
        "method": "POST",  // 请求方法，可选：POST、GET
        "headers": {  // 请求头
            "Content-Type": "application/json"
        },
        "body": {  // 请求体，类型： object、 string
            "username": "$username$",
            "password": "$password$"
        },
        "cookies": {  //  Cookie
        }
    }
}
```
