CREATE VIEW [dbo].[vwJobScope_VendorContactTemplate] AS
SELECT
  VendorId AS [Vendor Number],
  '' AS [Salutation],
.dbo.[SplitsByIndex](' ', [ContactName], 1) AS [First Name],
.dbo.[SplitsByIndex](' ', [ContactName], 2) AS [Last Name],
  [Title] AS [Title],
CASE
    WHEN [PHONE] LIKE '%@%' THEN ''
    ELSE [PHONE]
  END AS [Telephone],
  '' AS [Fax],
CASE
    WHEN [PHONE] LIKE '%@%' THEN dbo.fn_RemoveInvalidChars(PHONE)
    WHEN [PHONE2] LIKE '%@%' THEN dbo.fn_RemoveInvalidChars(PHONE2)
    WHEN [PHONE3] LIKE '%@%' THEN dbo.fn_RemoveInvalidChars(PHONE3)
    ELSE ''
  END AS [Email],
  '' AS [Primary?],
  '' AS [IsActive],
  '' AS [MobilePhone],
  '' AS [Position],
  '' AS [ContactMethod],
  '' AS [IsAPContact],
  '' AS [IsPurchasingContact],
  '' AS [IsACHContact]
FROM
  [CYMA].[CYMASDSP]..[Ap_Cont] C