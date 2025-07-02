import ConfigKit from "@/src/ConfigKit.ts"
import LoggerKit from "@/src/LoggerKit.ts"
import {VariablesFixValue, VariablesRandomValue} from "@/types/ConfigTypes.ts"

const logger = new LoggerKit("VariableKit")

export default class VariableKit {
    private static loaded: boolean = false
    static variable: Record<string, VariablesFixValue | VariablesRandomValue>

    static async load() {
        logger.info("正在加载变量...")
        if (!ConfigKit.isLoaded()) {
            logger.fatal("加载变量失败：配置文件未读取")
        }

        this.variable = ConfigKit.getConfig().variables

        this.loaded = true
        logger.info(`变量加载完成，共读取到 ${Object.keys(this.variable).length} 个变量。`)
        // 添加调试信息：列出所有加载的变量名
        logger.debug(`已加载变量: ${Object.keys(this.variable).join(', ')}`)
    }

    private static generateRandom(length: number, charSet: string): string {
        let result = ''
        const chars = charSet
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length)
            result += chars[randomIndex]
        }
        return result
    }

    static replace(text: string): string {
        if (!this.loaded) {
            logger.fatal("替换变量失败：变量未加载")
        }

        const regex = /\$([^\$$]+)\$/g;
        return text.replace(regex, (match, p1) => {
            // 添加调试信息：显示实际匹配到的变量名
            logger.debug(`尝试替换变量: ${p1}`)
            
            const variable = this.variable[p1]
            if (!variable) {
                // 添加详细错误信息：列出所有可用变量
                logger.warn(`变量 ${p1} 未定义。可用变量: ${Object.keys(this.variable).join(', ') || '无'}`)
                return match
            }
            
            try {
                if (variable.type === "fix") {
                    if (typeof variable.value !== 'string') {
                        logger.warn(`固定变量 ${p1} 数据异常`)
                        return match
                    }
                    return variable.value
                } else if (variable.type === 'random') {
                    if (typeof variable.long !== 'number' || 
                        typeof variable.char !== 'string') {
                        logger.warn(`随机变量 ${p1} 数据异常`)
                        return match
                    }
                    return this.generateRandom(variable.long, variable.char)
                }
            } catch (err) {
                logger.error(`变量替换错误：${p1}`, String(err))
                return match
            }
            
            return match
        })
    }
}