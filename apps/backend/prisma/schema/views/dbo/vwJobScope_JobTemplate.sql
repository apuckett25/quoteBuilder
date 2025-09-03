SELECT
  j.JobNumber AS JOB_NUMBER,
  j.Ref2 AS CUST_PO_NUMBER,
  j.CustId AS CUSTOMER_NUMBER,
  '' AS JOB_TITLE,
  j.Manager AS PROJECT_MANAGER,
  j.SellerId AS SALESMAN1,
  c.[Address] AS ADDRESS_LINE_1,
  c.Address2 AS ADDRESS_LINE_2,
  '' AS ADDRESS_LINE_3,
  '' AS COMPANY_CODE,
  'TypeId?' AS BILL_CODE,
  c.City AS CITY,
  c.Country AS COUNTRY,
  j.CustName AS CUSTOMER_NAME,
  j.StartDate AS DATE_BEGUN,
  '' AS DATE_COMPLETE,
  '' AS DATE_DUE,
  '' AS DATE_PO,
  j.[Desc] AS DESCRIPTION,
  j.ContractVal AS SellingPrice,
  '' AS TotalBudget,
  c.[STATE] AS STATE,
  c.TermsCode AS TERMS,
  j.CostToDate AS TotalCost,
  c.Zip AS ZIP_CODE,
  s.LocationName AS ShipToName,
  s.Address1 AS ShipAddress1,
  s.Address2 AS ShipAddress2,
  '' AS ShipAddress3,
  s.City AS ShipCity,
  s.Country AS ShipCountry,
  s.[STATE] AS ShipState,
  s.Zip AS ShipZip
FROM
  dbo.SDSP_Jc_Job2 AS j
  JOIN dbo.SDSP_Ar_Cust2 AS c ON j.CustId = c.CustId
  JOIN dbo.SDSP_Ar_CustShip2 AS s ON j.CustId = s.CustId
  AND j.LocationId = s.LocationID
WHERE
  (j.EndDate IS NULL);