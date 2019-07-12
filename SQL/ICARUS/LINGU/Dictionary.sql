/**
	Contains a list of unique words and their associated Ids.
	Uses the earliest appearance of this word as its id.
*/
ALTER VIEW [LINGU].[Dictionary] WITH SCHEMABINDING AS 
	SELECT 
		MIN([id]) AS [id], 
		[word], 
		COUNT([id]) AS [count]
	FROM [LINGU].[Dictionary-Full]
	GROUP BY [word]