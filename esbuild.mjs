import esbuild from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

// Bundles the Nest app for Lambda. We use esbuild-plugin-tsc so that
// `emitDecoratorMetadata` is honored (plain esbuild strips it, which breaks
// NestJS dependency injection at runtime).
await esbuild.build({
  entryPoints: ['src/lambda.ts'],
  outfile: 'dist-lambda/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  sourcemap: true,
  // Run every .ts file through tsc so decorator metadata is emitted.
  plugins: [esbuildPluginTsc({ force: true })],
  // Optional Nest peer deps that are lazily required but not used here.
  external: [
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'class-transformer',
    'class-validator',
  ],
});

console.log('Lambda bundle written to dist-lambda/index.js');
