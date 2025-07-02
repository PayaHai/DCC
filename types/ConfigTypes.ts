export interface VariablesFixValue {
    type: "fix"
    value: string
}

export interface VariablesRandomValue {
    type: "random"
    long: number
    char: string
}

export interface FeatureConfig {
    url: string
    method: "POST" | "GET"
    headers?: Record<string, string>
    body?: object | string
    cookies?: Record<string, string>
}

export interface Config {
    concurrent: number
    variables: Record<string, VariablesFixValue | VariablesRandomValue>
    feature: FeatureConfig
}