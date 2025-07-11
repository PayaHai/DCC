import ConfigKit from "./ConfigKit.ts"
import LoggerKit from "./LoggerKit.ts"
import VariableKit from "./VariableKit.ts"
import AttackKit from "./AttackKit.ts"

const logger = new LoggerKit("Main")

logger.warn("本程序仅供学习，请勿随意攻击他人服务器！")
logger.info("DCC 压测器，正在启动...")

await ConfigKit.load()

await VariableKit.load()

logger.info("启动完成。")

await AttackKit.startContinuousAttack()



