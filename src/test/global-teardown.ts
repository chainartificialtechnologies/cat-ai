import nock from 'nock';

export default async function globalTeardown() {
  // Clean up nock
  nock.cleanAll();
  nock.restore();

  // Close server
  if (global.app) {
    await global.app.close();
  }
} 