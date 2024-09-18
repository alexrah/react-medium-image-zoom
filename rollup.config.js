import ts from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' with { type: 'json' }

export default (async () => ([
  {
    input: './source/index.ts',
    output: { file: pkg.main, format: 'es', banner: `'use client';` },
    external: isExternal,
    plugins: [ts({
      tsconfig: './tsconfig.json',
      compilerOptions: { declarationDir: './types' },
    })],
  },
  {
    input: './dist/types/index.d.ts',
    output: { file: pkg.types, format: 'es' },
    plugins: [dts(), rmOnWrite('./dist/types')],
  },
]))()

function isExternal (id) {
  return !id.startsWith('.') && !id.startsWith('/')
}

function rmOnWrite (dir) {
  return {
    name: 'rollup-plugin-rm-on-write',
    writeBundle: {
      sequential: true,
      order: 'post',
      async handler() {
        return (await import('node:fs/promises')).rm(dir, { force: true, recursive: true })
      },
    },
  }
}
