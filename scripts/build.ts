const build_dir = "build"
const { version } = JSON.parse(await Deno.readTextFile("deno.json"))
const targets = {
    "x86_64-pc-windows-msvc": "DCC-win_x86",
    "x86_64-apple-darwin": "DCC-mac_x86",
    "aarch64-apple-darwin": "DCC-mac_arm",
    "x86_64-unknown-linux-gnu": "DCC-linux_x86",
    "aarch64-unknown-linux-gnu": "DCC-linux_arm",
}

console.log(`开始编译 DCC v${version} ...`)

await Deno.remove(build_dir, { recursive: true }).catch(() => {})

async function build(target: string, output: string) {
    return await new Deno.Command("deno", {
        args: ["compile", "--cached-only", "--allow-all", "--target", target, "-o", `${build_dir}/${output}-${version}`, "src/main.ts"],
        stdout: "piped",
        stderr: "piped",
    }).output()

}

let SuccessNum = 0

for (const [target, output] of Object.entries(targets)) {
    const { success, stdout, stderr } = await build(target, output)

    if (success) {
        SuccessNum ++
        console.log(`版本${version} 编译成功：${new TextDecoder().decode(stderr)}`)
    } else {
        console.log(`版本${version} 编译失败：${new TextDecoder().decode(stderr)}`)
    }
}

console.log(`DCC v${version} 编译完毕，共 ${Object.keys(targets).length} 个，成功 ${SuccessNum} 个，失败 ${Object.keys(targets).length - SuccessNum} 个。`)