CREATE VIEW [dbo].[vwJobScope_CustomerContactTemplate] AS --**Get Danny the customer template for staffing to load in contacts**
SELECT
  CustomerNumber,
  FirstName,
  LastName,
  EmailAddres = STUFF(
    (
      SELECT
        ', ' + EmailAddress
      FROM
        (
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone AS EmailAddress
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            PhoneType = 2
            AND LEN(ISNULL(Phone, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone2 AS EmailAddress
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone2Type = 2
            AND LEN(ISNULL(Phone2, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone3 AS EmailAddress
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone3Type = 2
            AND LEN(ISNULL(Phone3, '')) > 0
        ) a
      WHERE
        a.Id = CustContact.ID FOR XML PATH('')
    ),
    1,
    2,
    ''
  ),
  PhoneNumber = STUFF(
    (
      SELECT
        ', ' + PhoneNumber
      FROM
        (
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone AS PhoneNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            PhoneType = 0
            AND LEN(ISNULL(Phone, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone2 AS PhoneNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone2Type = 0
            AND LEN(ISNULL(Phone2, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone3 AS PhoneNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone3Type = 0
            AND LEN(ISNULL(Phone3, '')) > 0
        ) b
      WHERE
        b.Id = CustContact.ID FOR XML PATH('')
    ),
    1,
    2,
    ''
  ),
  '' AS MobileNumber,
  FaxNumber = STUFF(
    (
      SELECT
        ', ' + FaxNumber
      FROM
        (
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone AS FaxNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            PhoneType = 3
            AND LEN(ISNULL(Phone, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone2 AS FaxNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone2Type = 3
            AND LEN(ISNULL(Phone2, '')) > 0
          UNION
          ALL
          SELECT
            CustomerId + '_' + ContactId AS ID,
            CustomerID,
            [Name],
            Title,
            Phone3 AS FaxNumber
          FROM
            CYMA.dbo.SDSP_Ar_CustCont
          WHERE
            Phone3Type = 3
            AND LEN(ISNULL(Phone3, '')) > 0
        ) c
      WHERE
        c.Id = CustContact.ID FOR XML PATH('')
    ),
    1,
    2,
    ''
  ),
  0 AS InActive,
  Title,
  '' AS Postion
FROM
  (
    SELECT
      CustomerId + '_' + ContactId AS ID,
      CustomerId AS [CustomerNumber],
      dbo.[SplitsByIndex](' ', CustContact.[Name], 1) AS [FirstName],
      dbo.[SplitsByIndex](' ', CustContact.[Name], 2) AS [LASTNAME],
      Title
    FROM
      CYMA.dbo.SDSP_Ar_CustCont CustContact
      INNER JOIN CYMA.dbo.SDSP_Ar_Cust2 Customer ON CustContact.CustomerId = Customer.CustId
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
  ) CustContact