SELECT
  InvoiceNumber AS [Invoice Number],
  VendorID AS [Vendor Number],
  PurchaseOrder AS [PO Number],
  '' AS [Debit Account],
  APAccount AS [AP Account],
  DiscountAllowed AS [Amount Discount],
  InvoiceTotal AS [Amount Invoiced],
  '' AS [Bank Code],
  CheckNumber AS [Check Number],
  DateLastPaid AS [Date Check],
  DueDate AS [Date Due],
  InvoiceTransDate AS [Date of Invoice],
  TermsCode AS [Terms],
  InvoiceDescription AS [Description]
FROM
  CYMA.dbo.SDSP_AP_In;