CREATE VIEW [dbo].[vwJobScope_CustomerSitesTemplate] AS
SELECT
  ID,
  CustId,
  [Site],
  Bill_Ship,
  City + ',' + [State] AS Site_Name,
  Address_Line_1,
  Address_Line_2,
  Address_Line_3,
  City,
  [State],
  Zip_Code,
  [Country],
  Attention,
  Telephone,
  '' AS Telephone_Fax,
  '' AS [FOB_POINT],
  '' AS [ROUTING],
  '' AS [TAX_1],
  '' AS [TAX_2],
  '' AS [TAX_EXEMPT_NO],
  '' AS [TAX_EXEMPT_2],
  '' AS [VAT_CODE],
  '' AS [VAT_CODE_REG]
FROM
  (
    SELECT
      ID,
      CustId,
      [Site],
      Bill_Ship,
      Site_Name,
      Address_Line_1,
      Address_Line_2,
      Address_Line_3,
      City,
CASE
        WHEN [State] = 'South Carolina' THEN 'SC'
        WHEN [State] = 'Utah' THEN 'UT'
        WHEN [State] = 'Ohio' THEN 'OH'
        WHEN [State] = 'Idaho' THEN 'ID'
        WHEN [State] = 'Wisconsin' THEN 'WI'
        WHEN [State] = 'North Carolina' THEN 'NC'
        WHEN [State] = 'Oregon' THEN 'OR'
        WHEN [State] = 'Washington' THEN 'WA'
        WHEN [State] = 'Texas' THEN 'TX'
        WHEN [State] = 'New York' THEN 'NY'
        WHEN [State] = 'Michigan' THEN 'MI'
        WHEN [State] = 'Maine' THEN 'ME'
        WHEN [State] = 'Georgia' THEN 'GA'
        WHEN [State] = 'Louisiana' THEN 'LA'
        WHEN [State] = 'Mississippi' THEN 'MS'
        WHEN [State] = 'Hawaii' THEN 'HI'
        WHEN [State] = 'California' THEN 'CA'
        ELSE [State]
      END AS [State],
      Zip_Code,
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
        WHEN [State] IN (
          'South Carolina',
          'Ohio',
          'Idaho',
          'Wisconsin',
          'North Carolina',
          'Oregon',
          'Washington',
          'Michigan',
          'Texas',
          'New York',
          'Maine',
          'Georgia',
          'Mississippi',
          'California'
        ) THEN 'US'
        WHEN [Country] = 'Poland' THEN 'PL'
        WHEN [Country] = 'Mexico' THEN 'MX'
        WHEN [State] IN ('ON', 'Quebec') THEN 'CA'
        WHEN Country = 'France' THEN 'FR'
        WHEN Country = 'Italy' THEN 'IT'
        WHEN Country = 'Brazil' THEN 'BR'
        WHEN Country = 'Malaysia' THEN 'MY'
        WHEN Country = 'MAHARASHTRA/INDIA' THEN 'IN'
        WHEN Country = 'United Kingdom' THEN 'GB'
        WHEN Country = 'Australia' THEN 'AU'
        WHEN [State] = 'Hawaii' THEN 'US'
        WHEN [State] IN ('Madrid', 'MADRID') THEN 'ES'
        WHEN [State] = 'China' THEN 'CN'
        ELSE [COUNTRY]
      END AS [Country] --**Needs to be 2 char MAX**  JobScope to send country code mapping
,
      Attention,
      Telephone = STUFF(
        (
          SELECT
            ', ' + PhoneNumber
          FROM
            (
              SELECT
                CustId + '_' + LocationID AS ID,
                Phone AS PhoneNumber
              FROM
                CYMA.dbo.SDSP_Ar_CustShip2
              WHERE
                PhoneType = 0
                AND LEN(ISNULL(Phone, '')) > 0
              UNION
              ALL
              SELECT
                CustId + '_' + LocationID AS ID,
                Phone2 AS PhoneNumber
              FROM
                CYMA.dbo.SDSP_Ar_CustShip2
              WHERE
                Phone2Type = 0
                AND LEN(ISNULL(Phone2, '')) > 0
              UNION
              ALL
              SELECT
                CustId + '_' + LocationID AS ID,
                Phone3 AS PhoneNumber
              FROM
                CYMA.dbo.SDSP_Ar_CustShip2
              WHERE
                Phone3Type = 0
                AND LEN(ISNULL(Phone3, '')) > 0
            ) b
          WHERE
            b.Id = CustLocation.ID FOR XML PATH('')
        ),
        1,
        2,
        ''
      ),
      '' AS Telephone_Fax,
      '' AS [FOB_POINT],
      '' AS [ROUTING],
      '' AS [TAX_1],
      '' AS [TAX_2],
      '' AS [TAX_EXEMPT_NO],
      '' AS [TAX_EXEMPT_2],
      '' AS [VAT_CODE],
      '' AS [VAT_CODE_REG]
    FROM
      (
        SELECT
          Customer.CustID + '_' + CustLocation.LocationID AS ID,
          Customer.CustId,
          FORMAT(
            ROW_NUMBER() OVER (
              PARTITION BY CustLocation.CustID
              ORDER BY
                CustLocation.CustID
            ),
            '000#'
          ) AS [Site],
CASE
            WHEN [Default] = 1
            AND DfltBill = 0 THEN 'S'
            WHEN [Default] = 0
            AND DfltBill = 1 THEN 'B'
            ELSE ''
          END AS Bill_Ship,
          CustLocation.LocationName AS Site_Name,
          CustLocation.Address1 AS Address_Line_1,
          CustLocation.Address2 AS Address_Line_2,
          '' AS Address_Line_3,
          CustLocation.City,
          CustLocation.[State],
          CustLocation.zip AS Zip_Code,
          CustLocation.Country,
          CustLocation.Attn AS Attention
        FROM
          CYMA.dbo.SDSP_Ar_CustShip2 CustLocation
          INNER JOIN CYMA.dbo.SDSP_Ar_Cust2 Customer ON CustLocation.CustId = Customer.CustId
        WHERE
          Customer.[Status] = 1
          AND Customer.CustId IN (
            SELECT
              CustId
            FROM
              CYMA.dbo.SDSP_Ar_Inv2
            WHERE
              InvoiceStatus = 'P'
              AND InvBal <> 0
              OR YEAR(InvDate) = 2025
            GROUP BY
              CustId
          )
      ) CustLocation
  ) CustLocation_Main