SELECT
  PeriodEndingDate,
  EmployeeName,
  CustId,
  CustName,
  JobNumber,
  CostCode,
  JobType,
  DepartmentNumber,
  HoursWorked,
  EarningsType,
  ISNULL(Skills.BillingRate, 0) AS BillingRate,
  WorkDescription
FROM
  (
    SELECT
      CYMA.dbo.fnFormatDateTime(Time_Header.PeriodEndingDate, 'MM/DD/YYYY') AS PeriodEndingDate,
      Users.FirstName + ' ' + Users.LastName AS EmployeeName,
      Jobs.CustId,
      Jobs.CustName,
      Time_Details.JobNumber,
      Time_Details.CostCode,
      CASE
        WHEN JobType.Internal = 0 THEN Jobs.TypeId
        ELSE 'Overhead'
      END AS JobType,
      Emp.DepartmentId AS DepartmentNumber,
      Time_Hours.[Hours] AS HoursWorked,
      Time_Details.EarningsType,
      Time_Details.[Description] AS WorkDescription,
      EBOM.dbo.fnGetSM_Skill(
        Time_Details.Skill,
        Users.EmployeeNumber,
        Jobs.CustId,
        Jobs.JobNumber,
        Time_Header.PeriodEndingDate,
        ''
      ) + LEFT(Time_Details.EarningsType, 1) AS SkillID
    FROM
      EBOM.dbo.TimeRecordHeader AS Time_Header
      JOIN EBOM.dbo.Users ON Time_Header.UserId = Users.Id
      JOIN EBOM.dbo.TimeRecordDetail AS Time_Details ON Time_Header.Id = Time_Details.HeaderId
      JOIN EBOM.dbo.TimeRecordHours AS Time_Hours ON Time_Details.Id = Time_Hours.DetailId
      JOIN EBOM.dbo.Jobs ON Time_Details.JobNumber = Jobs.JobNumber
      LEFT JOIN CYMA.dbo.SDSP_Pr_Em3 AS Emp ON EBOM.dbo.Users.EmployeeNumber = Emp.EmployeeId
      LEFT JOIN CYMA.dbo.SDSP_Jc_JType AS JobType ON Jobs.TypeId = JobType.TypeId
  ) AS HoursWorked
  LEFT JOIN CYMA.dbo.SDSP_Sm_Skill AS Skills ON HoursWorked.SkillID = Skills.TypeCode;