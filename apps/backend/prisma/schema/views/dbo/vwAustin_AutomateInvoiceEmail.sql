CREATE VIEW [dbo].[vwAustin_AutomateInvoiceEmail] AS
SELECT
  t1.JobNumber,
  InvoiceNumber,
  PONumber,
  Manager,
  PMEmail,
  AccountManager,
  AcctMgr.EmailAddress AS AcctEmail,
  t1.OrderedBy,
  t1.CustEmail,
  Format(InvoiceTotal, 'c') AS InvoiceTotal
FROM
  (
    SELECT
      Header.InvNo AS InvoiceNumber,
      Job.JobNumber,
      Job.Ref2 AS PONumber,
      Job.Manager,
      PM.EmailAddress AS PMEmail,
      PM.AccountManagerID,
      Job.SellerId,
CASE
        WHEN LEN(ISNULL(Job.SellerID, '')) = 0 THEN PM.AccountManagerID
        ELSE Job.SellerId
      END AS AccountManager,
      Header.OrderedBy,
      Contact.Phone AS CustEmail,
      Header.InvTotal AS InvoiceTotal
    FROM
      [CYMA].[CYMASDSP]..[Jc_Job2] AS Job
      INNER JOIN dbo.tblUser AS PM ON Job.Manager = PM.ProjectManagerID
      LEFT OUTER JOIN [CYMA].[CYMASDSP]..[Ar_Inv2] AS Header ON Job.JobNumber = Header.Job
      LEFT OUTER JOIN [CYMA].[CYMASDSP]..[Ar_InvoiceLn5] AS Detail ON Header.InvNo = Detail.InvNo
      LEFT OUTER JOIN [CYMA].[CYMASDSP]..[Ar_CustCont] AS Contact ON Header.CustId = Contact.CustomerId
      AND Header.OrderedBy = Contact.[Name]
    GROUP BY
      Job.JobNumber,
      Job.Ref2,
      Job.Manager,
      PM.EmailAddress,
      Job.SellerId,
      PM.AccountManagerID,
      Header.EMailAddress,
      Header.InvNo,
      Header.OrderedBy,
      Contact.Phone,
      Header.InvTotal
  ) AS t1
  LEFT OUTER JOIN dbo.SDSP_Ar_SalesRep2 AS AcctMgr ON t1.AccountManager = AcctMgr.SellerId