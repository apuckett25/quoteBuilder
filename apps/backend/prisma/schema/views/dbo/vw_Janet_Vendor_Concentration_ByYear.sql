SELECT
  VendorID,
  VendorName,
  SUM(InvoiceTotal) AS InvoiceTotal
FROM
  CYMA.dbo.SDSP_AP_In
WHERE
  (YEAR(InvoiceTransDate) = 2024)
GROUP BY
  VendorID,
  VendorName
UNION
ALL
SELECT
  VendorID,
  VendorName,
  SUM(InvoiceTotal) AS InvoiceTotal
FROM
  CYMA.dbo.sdspa_AP_In
WHERE
  (YEAR(InvoiceTransDate) = 2024)
GROUP BY
  VendorID,
  VendorName;