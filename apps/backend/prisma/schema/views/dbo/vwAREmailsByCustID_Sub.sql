SELECT
  CustomerId AS CustID,
  [Name] AS ContactName,
  Phone AS EmailAddress,
  PhoneDesc AS EmailType
FROM
  [CYMA].[dbo].[SDSP_Ar_CustCont]
WHERE
  [Status] = 1
  AND PhoneType = 2
  AND PhoneDesc IN ('AR', 'AR Main')
UNION
ALL
SELECT
  CustomerId AS CustID,
  [Name] AS ContactName,
  Phone2 AS EmailAddress,
  Phone2Desc AS EmailType
FROM
  [CYMA].[dbo].[SDSP_Ar_CustCont]
WHERE
  [Status] = 1
  AND Phone2Type = 2
  AND Phone2Desc IN ('AR', 'AR Main')
UNION
ALL
SELECT
  CustomerId AS CustID,
  [Name] AS ContactName,
  Phone3 AS EmailAddress,
  Phone3Desc AS EmailType
FROM
  [CYMA].[dbo].[SDSP_Ar_CustCont]
WHERE
  [Status] = 1
  AND Phone3Type = 2
  AND Phone3Desc IN ('AR', 'AR Main')
UNION
ALL
SELECT
  CustomerId AS CustID,
  [Name] AS ContactName,
  Phone4 AS EmailAddress,
  Phone4Desc AS EmailType
FROM
  [CYMA].[dbo].[SDSP_Ar_CustCont]
WHERE
  [Status] = 1
  AND Phone4Type = 2
  AND Phone4Desc IN ('AR', 'AR Main');