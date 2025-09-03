SELECT
  CustId,
  CustName,
  SUM(InvTotal) AS TotalInvoiceAmt
FROM
  SDSP_Ar_Inv2
WHERE
  (InvoiceStatus <> 'V')
  AND (YEAR(InvDate) = 2024)
GROUP BY
  CustId,
  CustName;