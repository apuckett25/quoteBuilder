SELECT
  Hours_Worked.*
FROM
  EBOM.dbo.tmpJobCost_Hours_Rates AS Hours_Worked
WHERE
  EmployeeID NOT IN (
    SELECT
      Emp.EmployeeId
    FROM
      CYMA.dbo.SDSP_Pr_Em3 AS Emp
  );