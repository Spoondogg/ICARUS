/**
	Retrieves a collection of unique words in this dictionary, 
	along with their ID and usage
	EXEC [ICARUS].[GetDistinctWords]

	TODO:  Procedure to retrieve all sentences (by id) to create a 
	unique value for that vocabulary as a baseline

*/
CREATE PROCEDURE [LINGU].[GetDistinctWords] AS BEGIN
	SELECT 
		MIN([id]) AS [id], 
		[word], 
		COUNT([id]) AS [count]
	FROM [LINGU].[Dictionary]
	GROUP BY [word]
	ORDER BY [word], [id] DESC
	--ORDER BY [count] DESC
END 
GO