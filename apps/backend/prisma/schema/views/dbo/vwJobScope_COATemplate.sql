SELECT
  GLAccount.[Account] AS [ACCOUNT],
  GLAccount.[Description] AS [DESCRIPTION],
  CASE
    WHEN Glaccount.AccountType = 320 THEN 'CS'
    WHEN GLAccount.ClassType = 'A' THEN 'AS'
    WHEN Glaccount.ClassType = 'E' THEN 'EX'
    WHEN Glaccount.ClassType = 'I' THEN 'IN'
    WHEN Glaccount.ClassType = 'L' THEN 'LI'
    WHEN Glaccount.ClassType = 'Q' THEN 'EQ'
  END AS [TYPE],
  '01' AS [COMPANY_CODE],
  '00' AS [DIVISION],
  '00' AS [DEPARTMENT],
  'USD' AS [CURRENCY_CODE],
  '' AS [ACCOUNT GROUP],
  '' AS [SubGroup],
  LEFT(CONVERT(VARCHAR(2), AccountType), 2) AS [ACCT_CATEGORY],
  '10' AS [LEVEL_CODE],
  'D' AS [FUNCTION_CODE],
  TheJoin.TotalAmount AS [ACCOUNT_TOTAL]
FROM
  CYMA.dbo.SDSP_Gl_Acct AS GLAccount
  JOIN (
    SELECT
      [Account],
      SUM([Amount]) AS TotalAmount
    FROM
      (
        SELECT
          *
        FROM
          CYMA.dbo.SDSP_GL_Trx3
        UNION
        ALL
        SELECT
          *
        FROM
          CYMA.dbo.SDSP_GL_Trx3H
      ) AS t1
    GROUP BY
      [Account]
  ) AS TheJoin ON GLAccount.Account = TheJoin.Account;