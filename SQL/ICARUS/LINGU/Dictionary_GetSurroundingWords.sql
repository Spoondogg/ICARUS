WITH [S] AS (
	SELECT TOP (100) 
		[id]
		,[formId]
		,[dateCreated]
		,[version]
		,[authorId]
		,[xmlResults]
		,[jsonResults]
		,[shared]
		,[sentence]
		,[LIST].[wordIdList]
	FROM [LINGU].[Sentences]
	CROSS APPLY [LINGU].[GetWordIdList]([id]) AS [LIST]
	WHERE 
)
SELECT * FROM [S]


