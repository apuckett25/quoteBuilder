SELECT
  dbo.SDSP_Pr_Em3.EmployeeId,
  dbo.SDSP_Pr_Em3.FirstName + ' ' + dbo.SDSP_Pr_Em3.LastName AS EmployeeFullName,
  dbo.SDSP_Pr_Em3.HireDate,
  dbo.SDSP_Pr_EmHr.CareerSts AS CareerStatus,
  dbo.SDSP_Pr_Ck3.PrdEndDate AS PeriodEndingDate,
  dbo.SDSP_Pr_CfTy2.ShortName,
  SUM(dbo.SDSP_Pr_CkLn4.Hours) AS Hours,
  'SDSP' AS SOURCE
FROM
  dbo.SDSP_Pr_CkLn4
  JOIN dbo.SDSP_Pr_Ck3 ON dbo.SDSP_Pr_CkLn4.ChkRcdId = dbo.SDSP_Pr_Ck3.ChkRcdId
  LEFT JOIN dbo.SDSP_Pr_CfTy2 ON dbo.SDSP_Pr_CkLn4.TypeRcdId = dbo.SDSP_Pr_CfTy2.TypeRcdId
  LEFT JOIN dbo.SDSP_Pr_Em3
  JOIN dbo.SDSP_Pr_EmHr ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Pr_EmHr.EmployeeId;