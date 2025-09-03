SELECT
  Header.CustId AS [Customer Number],
  Header.InvNo AS [Invoice Number],
  Header.Job AS [Job Number],
  Header.ARAccount AS [AR Account],
  '' AS [Credit Account],
  Header.AmtPaid AS [Amount Paid],
  Header.FreightAmt AS [Amount Freight],
  Header.TaxAmt AS [Amount Tax 1],
  '' AS [Amount Tax 2],
  Header.DiscAmt AS [Amount Discount],
  '' AS [Bill Code],
  Header.InvDate AS [Date of Invoice],
  Header.DueDate AS [Date Due],
  Header.PaidInFullDate AS [Date Paid],
  Header.InvTotal AS [Amount Billed],
  Header.InvDesc AS [Comment],
  Details.Quantity AS [Quantity],
  Details.Price AS [Unit Price],
  Details.ProductID AS [Part Number]
FROM
  CYMA.dbo.SDSP_Ar_Inv2 AS Header
  JOIN CYMA.dbo.SDSP_Ar_InvoiceLn5 AS Details ON Header.RecNo = Details.RecNo;