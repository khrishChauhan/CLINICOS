export interface PACSAdapter {
  /**
   * Initiates the transfer of an Imaging Study to the PACS server.
   * @param studyUid The DICOM StudyInstanceUID
   * @returns true if initiated successfully
   */
  sendStudy(studyUid: string): Promise<boolean>

  /**
   * Queries the current sync status of the study from the PACS.
   * @param studyUid The DICOM StudyInstanceUID
   * @returns The status (e.g. Completed, Failed, InProgress)
   */
  queryStatus(studyUid: string): Promise<string>

  /**
   * Retries a failed transfer.
   * @param studyUid The DICOM StudyInstanceUID
   * @returns true if retry initiated successfully
   */
  retryTransfer(studyUid: string): Promise<boolean>
}
