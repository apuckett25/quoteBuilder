SELECT
  TOP (100) PERCENT Invoice.RecNo AS Vendor_Invoice_Header_ID,
  CAST(Vendor.VendorID AS VARCHAR) AS Vendor_ID,
  Vendor.Name AS Vendor_Name,
  Invoice.InvoiceNumber AS Vendor_Invoice_Number,
  Invoice.InvoiceTransDate AS Vendor_Invoice_Date,
  Vendor.TermCode AS Vendor_Terms,
  Invoice.TermsCode AS Invoice_Terms,
  FORMAT(
    DATEADD(
      wk,
      1,
      DATEADD(
        DAY,
        0 - DATEPART(
          WEEKDAY,
          DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
        ),
        DATEDIFF(
          dd,
          0,
          DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
        )
      )
    ),
    'MM-dd-yyyy'
  ) AS Invoice_Due_Date,
  FORMAT(Invoice.InvoiceTotal, 'C') AS Vendor_Invoice_Total,
  FORMAT(Invoice.InvoiceBalance, 'C') AS Invoice_Balance,
  CASE
    WHEN DATEDIFF(
      DAY,
      DATEADD(
        wk,
        1,
        DATEADD(
          DAY,
          0 - DATEPART(WEEKDAY, GETDATE()),
          DATEDIFF(dd, 0, GETDATE())
        )
      ),
      DATEADD(
        wk,
        1,
        DATEADD(
          DAY,
          0 - DATEPART(
            WEEKDAY,
            DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
          ),
          DATEDIFF(
            dd,
            0,
            DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
          )
        )
      )
    ) < 0 THEN 0
    ELSE (
      DATEDIFF(
        DAY,
        DATEADD(
          wk,
          1,
          DATEADD(
            DAY,
            0 - DATEPART(WEEKDAY, GETDATE()),
            DATEDIFF(dd, 0, GETDATE())
          )
        ),
        DATEADD(
          wk,
          1,
          DATEADD(
            DAY,
            0 - DATEPART(
              WEEKDAY,
              DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
            ),
            DATEDIFF(
              dd,
              0,
              DATEADD(DAY, Terms.DueDays, Invoice.InvoiceTransDate)
            )
          )
        )
      )
    ) / 7
  END AS Projected_Weeks,
  FORMAT(
    DATEADD(
      wk,
      1,
      DATEADD(
        DAY,
        0 - DATEPART(WEEKDAY, GETDATE()),
        DATEDIFF(dd, 0, GETDATE())
      )
    ),
    'MM-dd-yyyy'
  ) AS Period_Ending_Current_Day
FROM
  dbo.SDSP_Ap_Vend3 AS Vendor
  JOIN dbo.SDSP_AP_In AS Invoice ON Vendor.VendorID = Invoice.VendorID
  AND Vendor.TermCode <> Invoice.TermsCode
  JOIN dbo.SDSP_Sm_Term2 AS Terms ON Vendor.TermCode = Terms.TermsCode
WHERE
  (Invoice.InvoiceBalance <> 0)
  AND (Invoice.VendorID NOT IN ('Firs01', 'syno01'))
ORDER BY
  Projected_Weeks,
  Vendor_ID,
  Vendor_Invoice_Number;