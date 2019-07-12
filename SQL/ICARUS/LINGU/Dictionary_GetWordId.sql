/**
	Return WordId if given word exists in the dictionary
	EXEC [LINGU].[GetWordId] 'ryan@spoonmedia.ca', 'hello'
*/
ALTER PROCEDURE [LINGU].[GetWordId] 
	--@authorId NVARCHAR(128),
	@word VARCHAR(128)
AS BEGIN 
	SELECT MIN([id]) AS [id], [word]
	FROM [LINGU].[Dictionary]
	WHERE [word] = @word
	GROUP BY [word]
END
GO
