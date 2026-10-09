import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'lrx8bnhn',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  deployment: {autoUpdates: false},
})
