// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    site: 'https://mskian.github.io',
    base: 'cricket',
    output: 'static',
});
