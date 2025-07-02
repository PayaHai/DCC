import { JSONC } from 'jsonc_parser'

import {Config} from "@/types/ConfigTypes.ts"
import LoggerKit from "@/src/LoggerKit.ts"

const logger = new LoggerKit("ConfigKit")

export default class ConfigKit {
    private static loaded: boolean = false
    private static conf: Config
    private static conf_file: string = "Config.jsonc"

    private static async fileExists(path: string): Promise<boolean> {
        try {
            await Deno.stat(path);
            return true;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                return false;
            }
            throw error;
        }
    }

    public static async load() {
        logger.info("正在加载配置文件...")

        // 检查配置文件是否存在，不存在则释放
        try {
            if (!await this.fileExists(this.conf_file)) {
                logger.warn("配置文件不存在，正在释放...")
                await Deno.writeTextFile(this.conf_file, ConfigTemplate)
                logger.warn(`配置文件已释放至 "${this.conf_file}" ，请修改后重新运行！`)
                Deno.exit(1)
            }
        } catch (err) {
            logger.fatal("检查、释放配置文件时出错：", String(err))
        }

        try {
            const data = await Deno.readTextFile(this.conf_file)
            const config = JSONC.parse(data)
            this.conf = config
            logger.info("配置文件加载成功！")
        } catch (err) {
            logger.fatal("加载配置文件时出错：", String(err))
        }
        
        this.loaded = true
    }

    public static getConfig(): Config {
        if (!this.loaded) {
            logger.fatal("检测到在没有加载配置文件的情况下试图读取！")
        }

        return this.conf
    }

    public static isLoaded(): boolean {
        return this.loaded
    }
}

const ConfigTemplate =
`{
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
}`