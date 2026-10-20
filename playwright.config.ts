import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:60000,use:{baseURL:process.env.TEST_BASE_URL||'http://127.0.0.1:3000',headless:true},reporter:[['list']],projects:[{name:'chromium',use:{browserName:'chromium',launchOptions:process.env.TEST_BROWSER_PATH?{executablePath:process.env.TEST_BROWSER_PATH}:{}}}]});

