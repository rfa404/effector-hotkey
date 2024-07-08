import { defineConfig, UserConfigExport } from 'vitest/config'


const config: UserConfigExport =
    {
        plugins: [],
        test: {
            globals: true,
            environment: 'jsdom',
        }
    }

export default defineConfig(config)