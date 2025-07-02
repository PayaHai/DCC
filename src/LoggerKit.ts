export default class LoggerKit {
    protected title: string
    protected log_level: number

    protected getCurrentTimeString(): string {
        const d = new Date()
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ` +
            `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    }

    protected colorText(text: string, colorCode: number) {
        return `\x1b[${colorCode}m${text}\x1b[0m`
    }

    /**
     * 日志
     * @param title 日志头
     * @param log_level 日志等级(0~5)
     */
    constructor(title: string, log_level: number = 4) {
        this.title = title;
        this.log_level = log_level;
    }


    /**
     * 输出日志
     * @param log_level 日志等级
     * @param msg 日志内容
     */
    log(log_level: number, ...msg: string[]) {
        if (log_level <= this.log_level) {
            if (log_level === 1) {
                console.log(`${this.getCurrentTimeString()} ${this.colorText("FATAL", 41)} [${this.title}]`, ...msg)
                throw new Error(`[${this.title}] ${msg.join(" ")}`)
            } else if (log_level === 2) {
                console.log(`${this.getCurrentTimeString()} ${this.colorText("ERROR", 31)} [${this.title}]`, ...msg)
            } else if (log_level === 3) {
                console.log(`${this.getCurrentTimeString()} ${this.colorText("WARN", 33)}  [${this.title}]`, ...msg)
            } else if (log_level === 4) {
                console.log(`${this.getCurrentTimeString()} ${this.colorText("INFO", 32)}  [${this.title}]`, ...msg)
            } else if (log_level === 5) {
                console.log(`${this.getCurrentTimeString()} ${this.colorText("DEBUG", 37)} [${this.title}]`, ...msg)
            }
        }
    }

    /**
     * 输出严重错误日志
     * @param msg 日志内容
     */
    fatal(...msg: string[]) {
        this.log(1, ...msg)
    }

    /**
     * 输出错误日志
     * @param msg 日志内容
     */
    error(...msg: string[]) {
        this.log(2, ...msg)
    }

    /**
     * 输出警告日志
     * @param msg 日志内容
     */
    warn(...msg: string[]) {
        this.log(3, ...msg)
    }

    /**
     * 输出普通日志
     * @param msg 日志内容
     */
    info(...msg: string[]) {
        this.log(4, ...msg)
    }

    /**
     * 输出调试日志
     * @param msg 日志内容
     */
    debug(...msg: string[]) {
        this.log(5, ...msg)
    }
}