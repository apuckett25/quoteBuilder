SELECT
  TOP (100) PERCENT dbo.SDSP_Pr_EmTy4.EmpId,
  dbo.SDSP_Pr_Em3.LastName,
  dbo.SDSP_Pr_Em3.FirstName,
  dbo.SDSP_Pr_Em3.MiddleInitial,
  dbo.SDSP_Pr_EmTy4.TypeRcdId,
  dbo.SDSP_Pr_EmTy4.TypeId,
  dbo.SDSP_Pr_CfTy2.ShortName,
  dbo.SDSP_Pr_CfTy2.LongName,
  dbo.SDSP_Pr_EmTy4.CalcMethod,
  'Change Calculation Method to Enter Each Period' AS ChgCalc,
  'Change Rate to $0.0001' AS ChgRate
FROM
  dbo.SDSP_Pr_Em3
  JOIN dbo.SDSP_Pr_EmTy4 ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Pr_EmTy4.EmpId
  JOIN dbo.SDSP_Pr_CfTy2 ON dbo.SDSP_Pr_EmTy4.TypeRcdId = dbo.SDSP_Pr_CfTy2.TypeRcdId
WHERE
  (dbo.SDSP_Pr_EmTy4.TypeId = 14)
  AND (dbo.SDSP_Pr_EmTy4.CalcMethod <> 5);