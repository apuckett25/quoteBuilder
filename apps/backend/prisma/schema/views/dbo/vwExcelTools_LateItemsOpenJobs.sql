SELECT
  TOP (100) PERCENT Details.Job,
  Header.OrderNo,
  Header.OrderDate,
  Header.VendorID,
  Header.VendorName,
  Header.ReqstDate,
  Details.ProductId,
  Details.[Desc],
  Details.DueDate AS SupplierCommitDate,
  Details.OrderedQty,
  Details.ReceivedQty,
  Details.OpenQty,
  DATEDIFF(DAY, Details.DueDate, GETDATE()) AS DaysLate,
  Header.BuyerId
FROM
  dbo.SDSP_Po_Order AS Header
  JOIN dbo.SDSP_Po_OrdLn AS Details ON Header.RecNo = Details.OrderRecNo
WHERE
  (Header.bClosed = 0)
  AND (Details.bClosed = 0)
  AND (Details.OpenQty <> 0)
  AND (
    Details.Job IN (
      SELECT
        Details.Job
      FROM
        dbo.SDSP_Po_Order AS Header
        JOIN dbo.SDSP_Po_OrdLn AS Details ON Header.RecNo = Details.OrderRecNo
        LEFT JOIN dbo.SDSP_Jc_Job2 AS Jobs ON Details.Job = Jobs.JobNumber
      WHERE
        (Jobs.[Open] = 1)
        AND (Jobs.EndDate IS NULL)
      GROUP BY
        Details.Job
    )
  )
ORDER BY
  DaysLate DESC,
  Header.OrderNo;