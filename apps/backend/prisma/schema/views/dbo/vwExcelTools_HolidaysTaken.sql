SELECT
  EmployeeId,
  FirstName,
  LastName,
  EarningsType,
  SUM(HoursWorked) AS TotalHoursTaken
FROM
  (
    SELECT
      Employee.EmployeeId,
      Employee.FirstName,
      Employee.LastName,
      Earnings.ShortName AS EarningsType,
      Details.Hours AS HoursWorked
    FROM
      dbo.SDSP_Pr_Ck3 AS Header
      JOIN dbo.SDSP_Pr_CkLn4 AS Details ON Header.ChkRcdId = Details.ChkRcdId
      JOIN dbo.SDSP_Pr_CfTy2 AS Earnings ON Details.TypeRcdId = Earnings.TypeRcdId
      JOIN dbo.SDSP_Pr_Em3 AS Employee ON Header.EmpId = Employee.EmployeeId
    WHERE
      (Earnings.ShortName IN ('HolPay'))
      AND (YEAR(Header.PrdEndDate) = YEAR(GETDATE()))
  ) AS t1
GROUP BY
  EmployeeId,
  FirstName,
  LastName,
  EarningsType
HAVING
  (SUM(HoursWorked) > 0);