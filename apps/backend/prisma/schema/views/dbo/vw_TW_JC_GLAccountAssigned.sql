SELECT
  dbo.SDSP_JC_JACCT.Job,
  CASE
    dbo.SDSP_Jc_Job2.ChargeCost
    WHEN 0 THEN 'COGS'
    ELSE 'WIP'
  END AS ChargeCostType,
  dbo.SDSP_JC_JACCT.Type,
  dbo.SDSP_JC_JACCT.Acct,
  dbo.SDSP_JC_JACCT.CreatedBy,
  dbo.SDSP_JC_JACCT.CreatedDate,
  dbo.SDSP_JC_JACCT.UpdatedBy,
  ISNULL(
    CONVERT(VARCHAR(50), dbo.SDSP_JC_JACCT.UpdatedDate, 120),
    ''
  ) AS UpdatedDate,
  dbo.SDSP_JC_JACCT.Unused,
  dbo.SDSP_Jc_Job2.[Open],
  dbo.SDSP_Jc_Job2.TypeId,
  CASE
    WHEN dbo.SDSP_JC_JACCT.Acct = '61211ZZ000' THEN CASE
      WHEN dbo.SDSP_Jc_Job2.TypeId <> 'Hourly' THEN '51210ZZ000'
      ELSE '52210ZZ000'
    END
    WHEN dbo.SDSP_JC_JACCT.Acct = '51300SC000' THEN CASE
      WHEN dbo.SDSP_Jc_Job2.TypeId = 'Hourly' THEN '52300SC000'
      ELSE '51300SC000'
    END
    WHEN dbo.SDSP_JC_JACCT.Acct = '51210ZZ000' THEN CASE
      WHEN dbo.SDSP_Jc_Job2.TypeId = 'Hourly' THEN '52210ZZ000'
      ELSE '51210ZZ000'
    END
    ELSE dbo.SDSP_JC_JACCT.Acct
  END AS ChangeTo,
  dbo.SDSP_JC_JACCT.ChargeCost,
  dbo.SDSP_Jc_Job2.ChargeCost AS ChargeCost2
FROM
  dbo.SDSP_JC_JACCT
  JOIN dbo.SDSP_Jc_Job2 ON dbo.SDSP_JC_JACCT.Job = dbo.SDSP_Jc_Job2.JobNumber;