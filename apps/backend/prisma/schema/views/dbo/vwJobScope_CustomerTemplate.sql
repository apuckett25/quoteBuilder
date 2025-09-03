SELECT
  CASE
    WHEN CustId IN ('INTE02', 'INTE4', 'INTE06') THEN 'INTE02'
    WHEN CustId IN ('OWEN03', 'OWEN01') THEN 'OWEN01'
    WHEN CustId IN ('WEYE19', 'WEYE23', 'WEYE01') THEN 'WEYE01'
    ELSE CustID
  END AS ParentCustomer,
  CustId AS [CustomerNumber],
  [Name] AS [CustomerName],
  [Address] AS [AddressLine1],
  Address2 AS [AddressLine2],
  '' AS [AddressLine3],
  City AS [CITY],
  CASE
    WHEN [State] = 'Washington' THEN 'WA'
    WHEN [State] = 'Louisiana' THEN 'LA'
    ELSE [State]
  END AS [StateCode],
  [Zip] AS [PostalCode],
  CASE
    WHEN Country = 'USA' THEN 'US'
    WHEN [State] IN (
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
      'Washington',
      'Louisiana'
    ) THEN 'US'
    WHEN [Country] = 'Poland' THEN 'PL'
    WHEN [Country] = 'Mexico' THEN 'MX'
    WHEN [State] IN ('ON', 'Quebec') THEN 'CA'
    ELSE [COUNTRY]
  END AS [Country],
  '' AS [ABBREVIATION],
  CASE
    WHEN Phone LIKE '%@%' THEN ''
    ELSE Phone
  END AS [PhoneNumber],
  CASE
    WHEN Phone2 LIKE '%@%' THEN ''
    WHEN ISNUMERIC(Phone2) = 0 THEN ''
    ELSE Phone2
  END AS [FaxNumber],
  CreditLimit AS [CreditLimit],
  CASE
    WHEN LEFT(TermsCode, 3) = 'NET' THEN 'N' + SUBSTRING(
      TermsCode
      FROM
        4 FOR 10
    )
    ELSE [TermsCode]
  END AS [PaymentTermsCode],
  'USD' AS [CURRENCYCODE],
  '' AS [SalesAgent1],
  '' AS [FOBPoint],
  '' AS [IndustryType],
  '' AS [BillCode],
  '' AS [WipCode],
  '' AS [COUNTRY_ORIG],
  '' AS [IsPrepaid?],
  '' AS [ProjectManager],
  '' AS [TaxExemptNumber1]
FROM
  CYMA.dbo.SDSP_Ar_Cust2
WHERE
  [Status] = 1
  AND CustID IN (
    SELECT
      CustId
    FROM
      CYMA.dbo.SDSP_Ar_Inv2
    WHERE
      InvoiceStatus = 'P'
      AND YEAR(InvDate) = 2025
    GROUP BY
      CustId
  );