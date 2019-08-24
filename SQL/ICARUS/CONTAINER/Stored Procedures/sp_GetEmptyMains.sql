/**	Get MAIN Containers without any children that are beyond
	the minimum age (10 days)
	@returns A list of Containers without any children
	EXEC [ICARUS].[GetEmptyMains] 0
*/
ALTER PROCEDURE [ICARUS].[GetEmptyMains] 
	@minAge INT = 10 -- days old
AS BEGIN
	WITH [EMPTY] AS (
		SELECT [id], [Discriminator], [dateCreated], [dateLastModified], 
			DATEDIFF("D", [dateLastModified], GETDATE()) AS [age],
			[label], [status], [authorId], [subsections]
		FROM [ICARUS].[Containers]
		WHERE DATEDIFF("D", [dateLastModified], GETDATE()) > @minAge
		AND [Discriminator] = 'Main'
		AND [subsections] = '0'
	)
	SELECT * FROM [EMPTY]
END
GO