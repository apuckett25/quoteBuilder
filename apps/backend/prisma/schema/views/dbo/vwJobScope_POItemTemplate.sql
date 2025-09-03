SELECT
  H.OrderNo AS 'PO_NUMBER',
  D.ProductId AS 'ITEM_NUMBER',
  '' AS 'STOCK_NUMBER',
  D.Job AS 'JOB_NUMBER',
  H.VendorID AS 'VENDOR_NUMBER',
  D.ExpAccount AS 'ACCOUNT',
  '' AS 'CATEGORY',
  '0' AS 'COMPLETE',
  H.ReqstDate AS 'DATE_ORIGINAL',
  '' AS 'DATE_RESCHEDULED',
  H.[Desc] AS 'DESCRIPTION',
  '' AS 'DESCRIPTION_2',
  '' AS 'DESCRIPTION_3',
  '' AS 'DESCRIPTION_4',
  D.WarehouseId AS 'LOCATION_CODE',
  D.OrderedQty AS 'QUANTITY_ORDERED',
  D.ReceivedQty AS 'QUANTITY_RECVD',
  D.UnitCost AS 'UNIT_COST',
  D.Measure AS 'UOM'
FROM
  dbo.SDSP_Po_Order AS H
  JOIN dbo.SDSP_Po_OrdLn AS D ON H.OrderNo = D.OrderNo
WHERE
  (H.bClosed = 0)
  AND (H.OrderType = 'P')
  AND (D.OpenQty <> 0);