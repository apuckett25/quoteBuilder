SELECT
  PeriodEndingDate,
  Users.LastName + ', ' + Users.FirstName AS EmployeeName,
  Details.JobNumber,
  Details.CostCode,
  Details.PlaceOfPurchase,
  ISNULL(Details.Comments, '') AS Comments,
  Details.ExpenseAmount,
  Users.Company
FROM
  EBOM.dbo.ExpenseReportDetail AS Details
  JOIN EBOM.dbo.ExpenseReportHeader AS Header ON Details.HeaderId = Header.Id
  JOIN EBOM.dbo.Users ON Header.UserId = Users.Id
WHERE
  Company IN ('SDS', 'SDSMA');