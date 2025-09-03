CREATE VIEW [dbo].[vwAREmailsByCustID] AS
SELECT
  CustID,
  EmailAddress = STUFF(
    (
      SELECT
        ';' + EmailAddress
      FROM
        [vwAREmailsByCustID_Sub] Sub1
      WHERE
        (EmailType = 'AR Main')
        AND (Sub1.CustID = Main.CustID) FOR XML PATH ('')
    ),
    1,
    1,
    ''
  ),
  CCEmailAddress = STUFF(
    (
      SELECT
        ';' + EmailAddress
      FROM
        [vwAREmailsByCustID_Sub] Sub2
      WHERE
        (EmailType = 'AR')
        AND (Sub2.CustID = Main.CustID) FOR XML PATH ('')
    ),
    1,
    1,
    ''
  )
FROM
  [vwAREmailsByCustID_Sub] Main
GROUP BY
  CustID