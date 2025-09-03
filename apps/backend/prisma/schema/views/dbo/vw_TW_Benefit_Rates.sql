SELECT
  EmployeeId,
  EmployeeName,
  HireDate,
  RehireDate,
  CareerSts,
  DepartmentId,
  TimeStatus,
  EligGrpId,
  BenefitID,
  CovTypeID,
  EnrollDate,
  Benefit_Status,
  ISNULL(Ben_Rate.Value, 0) AS Accrual_Rate
FROM
  (
    SELECT
      dbo.SDSP_Pr_Em3.EmployeeId,
      dbo.SDSP_Pr_Em3.FirstName + ' ' + dbo.SDSP_Pr_Em3.LastName AS EmployeeName,
      dbo.SDSP_Pr_Em3.HireDate,
      dbo.SDSP_Pr_EmHr.RehireDate,
      dbo.SDSP_Pr_EmHr.CareerSts,
      dbo.SDSP_Pr_Em3.DepartmentId,
      CASE
        WHEN dbo.SDSP_Pr_Em3.TimeStatus = 1 THEN 'FULL-TIME'
        WHEN dbo.SDSP_Pr_Em3.TimeStatus = 2 THEN 'PART-TIME'
        ELSE ''
      END AS TimeStatus,
      dbo.SDSP_Hr_EmpEligGrp.EligGrpId,
      dbo.SDSP_Hr_EmpBen.BenefitID,
      dbo.SDSP_Hr_EmpBen.CovTypeID,
      dbo.SDSP_Hr_EmpBen.EnrollDate,
      dbo.SDSP_Hr_EmpBen.STATUS AS Benefit_Status
    FROM
      dbo.SDSP_Pr_Em3
      JOIN dbo.SDSP_Pr_EmHr ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Pr_EmHr.EmployeeId
      LEFT JOIN dbo.SDSP_Hr_EmpEligGrp ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Hr_EmpEligGrp.EmpId
      LEFT JOIN dbo.SDSP_Hr_EmpBen ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Hr_EmpBen.EmpID
    WHERE
      (dbo.SDSP_Pr_Em3.STATUS = 0)
  ) AS t1
  LEFT JOIN (
    SELECT
      [LineRecNo],
      [TableID],
      [RowID],
      [ColID],
      [Value],
      [UpdatedBy],
      [UpdatedDate],
      [DlgType],
      [Unused]
    FROM
      CYMA.dbo.SDSP_Hr_RateLn
    WHERE
      TableID = 'STFHOL'
  ) AS Ben_Rate ON t1.CovTypeID = Ben_Rate.RowID
UNION
ALL
SELECT
  EmployeeId,
  EmployeeName,
  HireDate,
  RehireDate,
  CareerSts,
  DepartmentId,
  TimeStatus,
  EligGrpId,
  BenefitID,
  CovTypeID,
  EnrollDate,
  Benefit_Status,
  ISNULL(Ben_Rate.Value, 0) AS Accrual_Rate
FROM
  (
    SELECT
      dbo.SDSP_Pr_Em3.EmployeeId,
      dbo.SDSP_Pr_Em3.FirstName + ' ' + dbo.SDSP_Pr_Em3.LastName AS EmployeeName,
      dbo.SDSP_Pr_Em3.HireDate,
      dbo.SDSP_Pr_EmHr.RehireDate,
      dbo.SDSP_Pr_EmHr.CareerSts,
      dbo.SDSP_Pr_Em3.DepartmentId,
      CASE
        WHEN dbo.SDSP_Pr_Em3.TimeStatus = 1 THEN 'FULL-TIME'
        WHEN dbo.SDSP_Pr_Em3.TimeStatus = 2 THEN 'PART-TIME'
        ELSE ''
      END AS TimeStatus,
      dbo.SDSP_Hr_EmpEligGrp.EligGrpId,
      dbo.SDSP_Hr_EmpBen.BenefitID,
      dbo.SDSP_Hr_EmpBen.CovTypeID,
      dbo.SDSP_Hr_EmpBen.EnrollDate,
      dbo.SDSP_Hr_EmpBen.STATUS AS Benefit_Status
    FROM
      dbo.SDSP_Pr_Em3
      JOIN dbo.SDSP_Pr_EmHr ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Pr_EmHr.EmployeeId
      LEFT JOIN dbo.SDSP_Hr_EmpEligGrp ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Hr_EmpEligGrp.EmpId
      LEFT JOIN dbo.SDSP_Hr_EmpBen ON dbo.SDSP_Pr_Em3.EmployeeId = dbo.SDSP_Hr_EmpBen.EmpID
    WHERE
      (dbo.SDSP_Pr_Em3.STATUS = 0)
      AND EligGrpID = 'STAFF'
      AND BenefitID = 'STFVAC'
  ) AS t2
  LEFT JOIN (
    SELECT
      [LineRecNo],
      [TableID],
      [RowID],
      [ColID],
      [Value],
      [UpdatedBy],
      [UpdatedDate],
      [DlgType],
      [Unused]
    FROM
      CYMA.dbo.SDSP_Hr_RateLn
    WHERE
      TableID = 'STFVAC'
  ) AS Ben_Rate ON t2.CovTypeID = Ben_Rate.RowID;