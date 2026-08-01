import type { PACSAdapter } from './PACSAdapter'

/**
 * Mock PACS Adapter for local development and testing.
 * Simulates a DICOM transfer by returning success after a short delay.
 */
export class MockPACSAdapter implements PACSAdapter {
  
  async sendStudy(studyUid: string): Promise<boolean> {
    console.log(`[MockPACS] Initiating transfer for Study UID: ${studyUid}`)
    return new Promise((resolve) => setTimeout(() => resolve(true), 1500))
  }

  async queryStatus(studyUid: string): Promise<string> {
    console.log(`[MockPACS] Querying status for Study UID: ${studyUid}`)
    // Simulate a successful completion 90% of the time, failure 10%
    const isSuccess = Math.random() > 0.1
    return new Promise((resolve) => setTimeout(() => resolve(isSuccess ? 'Completed' : 'Failed'), 500))
  }

  async retryTransfer(studyUid: string): Promise<boolean> {
    console.log(`[MockPACS] Retrying transfer for Study UID: ${studyUid}`)
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000))
  }
}
