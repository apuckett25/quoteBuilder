SELECT
  TOP (100) PERCENT dbo.SDSP_Jc_Job2.JobNumber AS SDSPJobNumber,
  TIPS.dbo.sdsma_Jc_Job2.JobNumber AS SDSMAJobNumber
FROM
  dbo.SDSP_Jc_Job2 FULL
  JOIN TIPS.dbo.sdsma_Jc_Job2 ON dbo.SDSP_Jc_Job2.JobNumber = TIPS.dbo.sdsma_Jc_Job2.JobNumber
WHERE
  (dbo.SDSP_Jc_Job2.JobNumber IS NULL)
  AND (TIPS.dbo.sdsma_Jc_Job2.[Open] = 1)
ORDER BY
  SDSMAJobNumber;