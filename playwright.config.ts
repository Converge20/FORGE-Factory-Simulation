import { defineConfig } from '@playwright/test';
export default defineConfig({timeout:120000,testDir:'tests',testMatch:'*.spec.ts',workers:1,use:{baseURL:process.env.FORGE_TEST_URL??'http://127.0.0.1:5173',viewport:{width:1440,height:1000},launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']}}});
