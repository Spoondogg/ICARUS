USE [ICARUS];

WITH [LOGINS] AS (
	SELECT [LoginProvider], [ProviderKey], [UserId]
	FROM [ICARUS].[AspNetUserLogins] AS [LOGINS]
), [USERS] AS (
	SELECT 
		[Id]
		,[Email]
		,[EmailConfirmed]
		,[PasswordHash]
		,[SecurityStamp]
		,[PhoneNumber]
		,[PhoneNumberConfirmed]
		,[TwoFactorEnabled]
		,[LockoutEndDateUtc]
		,[LockoutEnabled]
		,[AccessFailedCount]
		,[UserName]
	FROM [ICARUS].[AspNetUsers]
)
SELECT * FROM [LOGINS]
LEFT JOIN [USERS] ON ([LOGINS].[UserId] = [USERS].[Id])