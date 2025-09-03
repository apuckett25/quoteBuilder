CREATE VIEW [dbo].[vw_CrystalReports_SDSP_PTO_Sub_Report] AS
SELECT
  EmployeeId,
  CONVERT(DATETIME, FORMAT(PeriodEndingDate, 'MM-dd-yy')) AS PeriodEndingDate,
  ShortName,
  [Hours],
  [SOURCE]
FROM
  (
    SELECT
      EmployeeNumber AS EmployeeId,
      PeriodEndingDate,
      EarningsType AS ShortName,
      [Hours],
      'SDSP' AS SOURCE
    FROM
      EBOM.dbo.vwEmployee_Hours_Over_40 VW
      LEFT OUTER JOIN CYMA.dbo.SDSP_Pr_EmHr HR ON VW.EmployeeNumber = HR.EmployeeId
    WHERE
      EarningsType = 'PTO Pay'
      AND HR.CareerSts IN ('Hrly', 'Prof')
    UNION
    ALL
    SELECT
      TIPS.dbo.SDSMA_Pr_Em3.EmployeeId,
CASE
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 1 THEN DATEADD(dw, + 6, SDSMA_Pr_Time.DATE)
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 2 THEN DATEADD(dw, + 5, SDSMA_Pr_Time.DATE)
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 3 THEN DATEADD(dw, + 4, SDSMA_Pr_Time.DATE)
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 4 THEN DATEADD(dw, + 3, SDSMA_Pr_Time.DATE)
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 5 THEN DATEADD(dw, + 2, SDSMA_Pr_Time.DATE)
        WHEN DATEPART(dw, SDSMA_Pr_Time.DATE) = 6 THEN DATEADD(dw, + 1, SDSMA_Pr_Time.DATE)
        ELSE SDSMA_Pr_Time.DATE
      END AS PeriodEndingDate,
      TIPS.dbo.SDSMA_Pr_CfTy2.ShortName,
      TIPS.dbo.SDSMA_Pr_Time.Hours,
      'SDSMA' AS SOURCE
    FROM
      TIPS.dbo.SDSMA_Pr_EmHr
      INNER JOIN TIPS.dbo.SDSMA_Pr_Em3 ON TIPS.dbo.SDSMA_Pr_EmHr.EmployeeId = TIPS.dbo.SDSMA_Pr_Em3.EmployeeId
      RIGHT OUTER JOIN TIPS.dbo.SDSMA_Pr_Time
      LEFT OUTER JOIN TIPS.dbo.SDSMA_Pr_CfTy2 ON TIPS.dbo.SDSMA_Pr_Time.TypeRcdId = TIPS.dbo.SDSMA_Pr_CfTy2.TypeRcdId ON TIPS.dbo.SDSMA_Pr_Em3.EmployeeId = TIPS.dbo.SDSMA_Pr_Time.EmpId
    WHERE
      (
        TIPS.dbo.SDSMA_Pr_EmHr.CareerSts IN ('Hrly', 'Prof')
      )
      AND (TIPS.dbo.SDSMA_Pr_CfTy2.ShortName = 'PTO Pay')
  ) t1