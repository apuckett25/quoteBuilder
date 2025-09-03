SELECT
  DISTINCT InvoiceNumber,
  LineNumber,
  VendorName,
  JobNumber,
  CostCode,
  PartNumber AS ProductID,
  PartDescription AS Description,
  UnitCount AS OrderedQty,
  UnitCount AS InvoicedQty,
  UnitCost_Actual AS UnitCost,
  UnitExtCost_Actual AS ExtUnitCost,
  DataSource,
  QuerySource,
  PurchaseOrder AS OrderNo,
  dbo.fnFormatDateTime(OrderDate, 'MM/DD/YYYY') AS OrderDate,
  VendorID
FROM
  EBOM.dbo.tmpJobCost_MaterialCost
WHERE
  (UnitCount <> 0)
  OR (
    unitCount = 0
    AND DataSource = 'E2'
  );