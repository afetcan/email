import type { FastifyBaseLogger } from '@afetcan/service-common'
import type { Job } from 'bullmq'
import type { EmailInput } from './shapes'

export interface Context {
  logger: FastifyBaseLogger
  errorHandler(message: string, error: Error, logger?: FastifyBaseLogger | undefined): void
  schedule(input: EmailInput): Promise<Job<any, any, string>>
}
