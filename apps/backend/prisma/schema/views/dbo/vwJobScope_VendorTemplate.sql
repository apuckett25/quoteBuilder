CREATE VIEW [dbo].[vwJobScope_VendorTemplate] AS --NOTES:
--Buy From = Physical
--Janet -  Payroll under custom fields
SELECT
  V.VendorID AS [Vendor Number],
  [Name] AS [Vendor Buy From Name],
  V.Address1 AS [Buy 'From Address Line 1],
  V.Address2 AS [Buy From Address Line 2],
  '' AS [Buy From Address Line 3],
  V.City AS [Buy From City],
  V.[State] AS [Buy From State],
  V.Zip AS [Buy From Zip Code],
  V.Country AS [Buy From Country],
  '01' AS [Company Code],
CASE
    WHEN LEFT(TermCode, 3) = 'NET' THEN 'N' + SUBSTRING(TermCode, 4, 10)
    ELSE [TermCode]
  END AS [Terms],
  'USD' AS [Currency Code],
  '' AS [Bank Code],
  V.Phone AS [Telephone],
  V.Phone2 AS [Fax],
  '' AS [Email Address],
  '' AS [VendorContactId1],
  '' AS [VendorContactId2],
  V.VendorType AS [VENDOR_CLASS],
  V.[Name] AS [Vendor Pay To Name],
CASE
    WHEN R.Address1 IS NULL THEN V.Address1
  END AS [Pay To Address Line 1],
CASE
    WHEN R.Address2 IS NULL THEN V.Address2
  END AS [Pay To Address Line 2],
  '' AS [Pay To Address Line 3],
CASE
    WHEN R.City IS NULL THEN V.City
  END AS [Pay to City],
CASE
    WHEN R.[State] IS NULL THEN V.[State]
  END AS [Pay to State],
CASE
    WHEN R.Zip IS NULL THEN V.Zip
  END AS [Pay to Zip],
CASE
    WHEN R.Country IS NULL THEN V.Country
  END AS [Pay to Country] --2 char
,
CASE
    WHEN R.Phone IS NULL THEN V.Phone
  END AS [Pay to Telephone],
CASE
    WHEN R.Phone2 IS NULL THEN V.Phone2
  END AS [Pay to Fax],
  '' AS [Pay To Email],
  '' AS [Discount Percent],
  '' AS [Payment Type],
  '' AS [SHIPPING_TIME],
  '' AS [Tax Exempt #],
  '' AS [Tax Exempt # 2],
  TaxID AS [Tax ID],
  '' AS [VENDOR_HOLD],
CASE
    WHEN LEN(ISNULL(v.[1099Type], '')) > 0 THEN 1
    ELSE 0
  END AS [Tax 1099],
  '' AS [COMMENT],
  '' AS [Default GL Account] --Look this up in CYMA
FROM
  CYMA.dbo.SDSP_Ap_Vend3 V
  LEFT OUTER JOIN [CYMA].[CYMASDSP]..[Ap_Remit] R ON V.VendorID = R.VendorID
WHERE
  V.[Status] = 1