import 'server-only'

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../project'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
  useCdn: false,
  timeout: 5000,
  maxRetries: 0,
})
