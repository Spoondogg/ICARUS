WITH [WORDLIST] AS (
	SELECT MIN([id]) AS [id], [word], COUNT(*) AS [count]
	FROM [ICARUS].[LINGU].[Dictionary-Full]
	GROUP BY [word]
	HAVING COUNT(*) > 1
	
)

SELECT [DF].[id], [DF].[word] FROM [WORDLIST] 
LEFT JOIN [LINGU].[Dictionary-Full] AS [DF] ON (
	[DF].[word] = [WORDLIST].[word]
	AND [DF].[id] > [WORDLIST].[id]
) 
ORDER BY [count] DESC
