SELECT
  LEFT(ProdID, 20) AS PartNumber,
  LEFT([Description], 40) AS [Description 1],
  '' AS [Description 2],
  '' AS [Description 3],
  '' AS [Description 4],
  'Material' AS [Category],
  'P' AS [PSM Code],
  CASE
    WHEN Measure = 'BAG' THEN 'BG'
    WHEN Measure = 'PKT' THEN 'PT'
    WHEN Measure = 'PKG' THEN 'PG'
    WHEN Measure = 'CART' THEN 'CT'
    WHEN Measure = 'LOT' THEN 'LT'
    ELSE LEFT(Measure, 2)
  END AS [UOM],
  UnitCost AS [UNIT COST],
  VendId AS [VENDOR 1],
  '' AS [VENDOR 2],
  '' AS [Buyer],
  '' AS [Class],
  '' AS [Subclass],
  '' AS [Manufacturers Name],
  ManufID AS [Manufacturer Part Number],
  '' AS [Location Code],
  '' AS [Account],
  '' AS [MFS],
  '' AS [Std or Avg Cost],
  '' AS [Avg Actual Cost],
  '' AS [Quantity on Hand],
  '' AS [Extended Total],
  '' AS [Last Unit Cost],
  '' AS [Bin Location],
  '' AS [Cycle Count],
  '' AS [Minimum],
  '' AS [Required],
  '' AS [ABC Code],
  '' AS [Purchasing UOM],
  '' AS [Conversion],
  '' AS [Control Method],
  '' AS [Last Vendor],
  '' AS [Lead Time],
  '' AS [Manufacturing Hours],
  '' AS [Quantity to Reorder],
  '' AS [Tax Code],
  '' AS [Unit Weight],
  '' AS [UserText],
  '' AS [Inspect],
  CreatedDate
FROM
  CYMA.dbo.SDSP_Sm_Prod3 AS p
WHERE
  ProdID IN (
    SELECT
      ProductId AS ProdID
    FROM
      CYMA.dbo.SDSP_Po_OrdLn
    WHERE
      CreatedDate > DATEADD(YEAR, -2, GETDATE())
    GROUP BY
      ProductId
  )
  AND [Status] = 1;