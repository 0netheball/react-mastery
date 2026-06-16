import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // In order tests to work
    globals: true, // In order tests to work
    setupFiles: './setupTests.js',
  }
});

/*
All of this code is setup code. 
*/