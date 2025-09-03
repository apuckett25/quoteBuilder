SELECT
  CASE
    WHEN Employee.EmployeeID = '110859' THEN '11128'
    ELSE Employee.EmployeeId
  END AS [EMPLOYEE_NUMBER],
  Employee.FirstName AS [FIRST_NAME],
  Employee.MiddleInitial AS [MiddleName],
  Employee.LastName AS [LAST_NAME],
  '' AS [LOCATION_CODE],
  10 AS [HOURLY_RATE],
  DepartmentId AS [DEPT],
  '' AS [CATEGORY],
  Hr.StartDate AS [DATE_OF_HIRE],
  Employee.BirthDate AS [DATE_OF_BIRTH],
  '' AS [DATE_TERMINATED],
  Hr.EMailAddress AS [EmailAddress],
  '' AS [Telephone],
  Employee.HomePhoneNum AS [HomePhone],
  Employee.Phone1 AS [MobilePhone],
  Address1 AS [AddressLine1],
  Address2 AS [AddressLine2],
  '' AS [AddressLine3],
  City AS [City],
  [State] AS [State],
  '' AS [Country],
  Zip AS [PostalCode],
  '' AS [EmailSignature],
  '' AS [Photo],
  '' AS [EmergencyContact],
  '' AS [EmergencyContactPhone],
  '' AS [ACCOUNT],
  '' AS [COMMENT],
  '' AS [IDLE_ACCOUNT],
  '' AS [INSURANCE],
  '' AS [LEVEL_CODE],
  '' AS [PAY_TYPE],
  CASE
    WHEN Employee.Race = 2 THEN 'A'
    WHEN Employee.Race = 5 THEN 'H'
    ELSE 'W'
  END AS [RACE],
  CASE
    WHEN Employee.Gender = 1 THEN 'M'
    ELSE 'F'
  END AS [SEX],
  '' AS [SOCIAL_SECURITY],
  '' AS [Inspector],
  '' AS [InspectorPassword],
  '' AS [SupervisorId],
  '' AS [NormalWorkShift],
  '' AS [IsSupervisor]
FROM
  CYMA.dbo.SDSP_Pr_Em3 AS Employee
  JOIN CYMA.dbo.SDSP_Pr_EmHr AS HR ON Employee.EmployeeId = HR.EmployeeId
WHERE
  [Status] = 0
UNION
ALL
SELECT
  EmployeeNumber,
  FirstName,
  '' AS MiddleName,
  LastName,
  '' AS [LOCATION_CODE],
  10 AS [HOURLY_RATE],
  '901' AS [DEPT],
  '' AS [CATEGORY],
  '' AS [DATE_OF_HIRE],
  '' AS [DATE_OF_BIRTH],
  '' AS [DATE_TERMINATED],
  '' AS [EmailAddress],
  '' AS [Telephone],
  '' AS [HomePhone],
  '' AS [MobilePhone],
  '' AS [AddressLine1],
  '' AS [AddressLine2],
  '' AS [AddressLine3],
  '' AS [City],
  '' AS [State],
  '' AS [Country],
  '' AS [PostalCode],
  '' AS [EmailSignature],
  '' AS [Photo],
  '' AS [EmergencyContact],
  '' AS [EmergencyContactPhone],
  '' AS [ACCOUNT],
  '' AS [COMMENT],
  '' AS [IDLE_ACCOUNT],
  '' AS [INSURANCE],
  '' AS [LEVEL_CODE],
  '' AS [PAY_TYPE],
  '' AS [RACE],
  'M' AS [SEX],
  '' AS [SOCIAL_SECURITY],
  '' AS [Inspector],
  '' AS [InspectorPassword],
  '' AS [SupervisorId],
  '' AS [NormalWorkShift],
  '' AS [IsSupervisor]
FROM
  EBOM.dbo.Users
WHERE
  EmployeeNumber LIKE '9%'
  AND [Disabled] = 0;