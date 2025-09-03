SELECT
  [Source],
  SSNLast4,
  EmployeeId,
  FirstName,
  MiddleInitial,
  LastName,
  Address1,
  Address2,
  City,
  [State],
  Zip,
  HomePhoneNum,
  HireDate,
  [Status],
  CareerSts,
  Exempt,
  WorkState,
  CellPhone,
  EmailAddress,
  EmailAddress2,
  DepartmentId,
  TaxReportingClass
FROM
  (
    SELECT
      'SDSP' AS [Source],
      emp.SSNLast4,
      emp.EmployeeId,
      emp.FirstName,
      emp.MiddleInitial,
      LastName,
      Address1,
      Address2,
      City,
      emp.[State],
      Zip,
      HomePhoneNum,
      HireDate,
      [Status],
      Hr.CareerSts,
      Hr.Exempt,
      WorkState,
      Phone1 AS CellPhone,
      Phone3 AS EmailAddress,
      EmailAddress AS EmailAddress2,
      DepartmentId,
      Hr.AnnualIncomeAmt,
      Hr.AnnualIncomeAmt / (52 * 40) AS HourlyRate,
      CASE
        WHEN emp.ReportingClass = 1 THEN '1099'
        ELSE 'W2'
      END AS TaxReportingClass
    FROM
      CYMA.dbo.SDSP_Pr_EmHr AS Hr
      JOIN CYMA.dbo.SDSP_Pr_Em3 AS Emp ON Hr.EmployeeId = Emp.EmployeeId
    UNION
    ALL
    SELECT
      'SDSP Admin' AS [Source],
      emp.SSNLast4,
      emp.EmployeeId,
      emp.FirstName,
      emp.MiddleInitial,
      LastName,
      Address1,
      Address2,
      City,
      emp.[State],
      Zip,
      HomePhoneNum,
      HireDate,
      [Status],
      Hr.CareerSts,
      Hr.Exempt,
      WorkState,
      Phone1 AS CellPhone,
      Phone3 AS EmailAddress,
      EmailAddress AS EmailAddress2,
      DepartmentId,
      Hr.AnnualIncomeAmt,
      Hr.AnnualIncomeAmt / (52 * 40) AS HourlyRate,
      CASE
        WHEN emp.ReportingClass = 1 THEN '1099'
        ELSE 'W2'
      END AS TaxReportingClass
    FROM
      CYMA.dbo.SDSPA_Pr_EmHr AS Hr
      JOIN CYMA.dbo.SDSPA_Pr_Em3 AS Emp ON Hr.EmployeeId = Emp.EmployeeId
  ) AS t1
WHERE
  (STATUS = 0);