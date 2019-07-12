/**	Return a Paginated List of FormPosts for the given discriminator
	EXEC [FORMPOST].[ListByDataTypeCount] 'ryan@spoonmedia.ca', 'MAIN', 'metaId', 'isPublic:1'
	EXEC [FORMPOST].[ListByDataTypeCount] 'ryan@spoonmedia.ca', 'MAIN', 'metaId', 'isPublic:-1'
	http://localhost:8052/FORM/search/?page=0&pageLength=10&query=im
*/
ALTER PROCEDURE [FORMPOST].[ListByDataTypeCount] 
	@authorId NVARCHAR(128),
	@discriminator NVARCHAR(128),
	@dataType NVARCHAR(256) = 'dataId,attributesId,metaId',
	@query NVARCHAR(128) = null -- TODO: IMPLEMENT SEARCHABLE
AS BEGIN
	SELECT COUNT(*) AS [count] 
	FROM [FORMPOST].[tvf_GetByDataType](@authorId, @discriminator, @dataType);
END

	/*
	SELECT *
	--FROM [STRING].[tvf_ParseSearchString]('description:lorem') AS [Q] 
	FROM [ICARUS].[tvf_GetByDataType]('ryan@spoonmedia.ca', 'MAIN', 'metaId') AS [F] -- Get meta used in MAIN
	--CROSS APPLY [ICARUS].[tvf_SearchByDataType]('ryan@spoonmedia.ca', [Q].[key], [Q].[value]) AS [RESULT]
	--LEFT JOIN [ICARUS].[FormPosts] AS [FP] ON ([F].[postId] = [FP].[id])
	*/
