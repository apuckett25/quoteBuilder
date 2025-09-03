SELECT
  Header.OrderNo AS PONumber,
  Header.OrderDate,
  Header.VendorName,
  CASE
    WHEN LEN(ISNULL(Job, '')) = 0 THEN 'OVER10000'
    ELSE Job
  END AS JobNumber,
  CASE
    WHEN LEN(ISNULL(CostCode, '')) = 0 THEN 'ALL'
    ELSE CostCode
  END AS CostCode,
  SUM(
    (
      ISNULL(Details.OrderedQty, 0) - ISNULL(Details.ReceivedQty, 0)
    ) * ISNULL(Details.UnitCost, 0)
  ) AS TotalOpenPOAmount
FROM
  dbo.SDSP_Po_Order AS Header
  JOIN dbo.SDSP_Po_OrdLn AS Details ON Header.RecNo = Details.OrderRecNo
WHERE
  (Header.bClosed = 0)
  AND (Details.bClosed = 0)
  AND (Details.OrderedQty <> Details.ReceivedQty)
GROUP BY
  Header.OrderNo,
  Header.VendorName,
  CASE
    WHEN LEN(ISNULL(Job, '')) = 0 THEN 'OVER10000'
    ELSE Job
  END,
  CASE
    WHEN LEN(ISNULL(CostCode, '')) = 0 THEN 'ALL'
    ELSE CostCode
  END,
  Header.OrderDate;