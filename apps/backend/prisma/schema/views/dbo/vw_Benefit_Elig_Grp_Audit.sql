SELECT
  dbo.SDSP_Pr_Em3.EmployeeId,
  dbo.SDSP_Pr_Em3.FirstName + ' ' + dbo.SDSP_Pr_Em3.LastName AS EmployeeName,
  dbo.SDSP_Pr_Em3.HireDate,
  dbo.SDSP_Pr_EmHr.RehireDate,
  dbo.SDSP_Pr_EmHr.CareerSts,
  dbo.SDSP_Pr_Em3.DepartmentId,
  dbo.SDSP_Hr_EmpEligGrp.EligGrpId,
  CASE
    WHEN dbo.SDSP_Pr_Em3.TimeStatus = 1 THEN 'FULL-TIME'
    WHEN dbo.SDSP_Pr_Em3.TimeStatus = 2 THEN 'PART-TIME'
    ELSE ''
  END AS TimeStatus
FROM
  dbo.SDSP_Pr_EmHr
  JOIN dbo.SDSP_Pr_Em3 ON dbo.SDSP_Pr_EmHr.EmployeeId = dbo.SDSP_Pr_Em3.EmployeeId
  LEFT JOIN dbo.SDSP_Hr_EmpEligGrp ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Hr_EmpEligGrp.EmpId
WHERE
  (dbo.SDSP_Hr_EmpEligGrp.EligGrpId IS NULL)
  AND (LEFT(dbo.SDSP_Pr_Em3.EmployeeId, 1) <> 'Z')
  AND (dbo.SDSP_Pr_Em3.Status = 0)
  OR (LEFT(dbo.SDSP_Pr_Em3.EmployeeId, 1) <> 'Z')
  AND (dbo.SDSP_Pr_Em3.Status = 0)
  AND (LEN(dbo.SDSP_Pr_EmHr.CareerSts) = 0)
  OR (dbo.SDSP_Pr_Em3.TimeStatus = 0)
  AND (LEFT(dbo.SDSP_Pr_Em3.EmployeeId, 1) <> 'Z')
  AND (dbo.SDSP_Pr_Em3.Status = 0);