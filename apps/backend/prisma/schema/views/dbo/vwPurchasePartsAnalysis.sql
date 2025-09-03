SELECT
  PurchaseParts.ProductID,
  PurchaseParts.ProdDescription,
  ISNULL(VC.VendorCount, 0) AS VendorCount,
  ISNULL(JC.JobCount, 0) AS JobCount,
  ISNULL(OC.OrderCount, 0) AS OrderCount,
  ISNULL(NumOrd.NumberOrdered, 0) AS NumberOrdered,
  ROUND(ISNULL(MinUC.MinUnitCost, 0), 2) AS MinUnitCost,
  ROUND(ISNULL(MaxUC.MaxUnitCost, 0), 2) AS MaxUnitCost,
  ROUND(ISNULL(AUC.AverageUnitCost, 0), 2) AS AverageUnitCost
FROM
  (
    SELECT
      ProdID AS ProductID,
      [Description] AS ProdDescription
    FROM
      CYMA.dbo.SDSP_Sm_Prod3
    UNION
    SELECT
      ProdID AS ProductID,
      [Description] AS ProdDescription
    FROM
      TIPS.dbo.SDSMA_Sm_Prod3
  ) AS PurchaseParts
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      COUNT(DISTINCT VendorID) AS VendorCount
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS VC ON PurchaseParts.ProductID = VC.ProductID
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      COUNT(DISTINCT JobNumber) AS JobCount
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS JC ON PurchaseParts.ProductID = JC.ProductId
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      COUNT(DISTINCT PurchaseOrder) AS OrderCount
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS OC ON PurchaseParts.ProductID = OC.ProductId
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      SUM(ISNULL(UnitCount, 0)) AS NumberOrdered
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS NumOrd ON PurchaseParts.ProductID = NumOrd.ProductId
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      CASE
        WHEN SUM(ISNULL(UnitCount, 0)) = 0 THEN 0
        ELSE SUM(ISNULL(UnitExtCost_Actual, 0)) / SUM(ISNULL(UnitCount, 0))
      END AS AverageUnitCost
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS AUC ON PurchaseParts.ProductID = AUC.ProductId
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      MIN(ISNULL(UnitCost_Actual, 0)) AS MinUnitCost
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS MinUC ON PurchaseParts.ProductID = MinUC.ProductId
  LEFT JOIN (
    SELECT
      PartNumber AS ProductID,
      MAX(ISNULL(UnitCost_Actual, 0)) AS MaxUnitCost
    FROM
      EBOM.dbo.tmpJobCost_MaterialCost
    GROUP BY
      PartNumber
  ) AS MaxUC ON PurchaseParts.ProductID = MaxUC.ProductId;