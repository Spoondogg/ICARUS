﻿# ICARUS
A Single Page Application Sandbox.

> 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a live system.

### Stack

  - C# ASP.NET MVC5 using Entity 6 on SQL Server 2017
  - HTML5, CSS3, JavaScript (ES6) and Bootstrap 3.3.7

### Prerequisites

In a perfect world, there would be no dependencies...

* MVC.NET 4.7.2
* JQuery
* Bootstrap 3.3.7
* Sass
* Razor
* Entity 6
* SQL Server

### Compatibility

Primarily tested in WebKit 

* Chrome Canary

### Known Issues

Limited DIALOG support will need to be corrected in future builds

### Install

Clone repo and create the required credentials

#### App Settings

Create AppSettings.config in the same directory as Web.config
~~~~
<appSettings>
  <add key="version" value="0.0.0" />
  <add key="toEmail" value="XXX@YYY.ZZZ" />
  <add key="fromEmail" value="XXX@YYY.ZZZ" />
  <add key="googleClientId" value="XXXXXXXXXXX" />
  <add key="googleClientSecret" value="XXXXXXXXXXX" />
</appSettings>
~~~~

#### Connection Strings

Create ConnectionStrings.config in the same directory as Web.config
~~~~
<connectionStrings>
	<add name="DefaultConnection"
		providerName="System.Data.SqlClient"
		connectionString="Data Source=127.0.0.1;Initial Catalog=XXX;Integrated Security=False;User Id=XXX@YYY.ZZ;Password=XXX;MultipleActiveResultSets=True"
	/>
</connectionStrings>
~~~~

#### Mail Settings

Create MailSettings.config in the same directory as Web.config
~~~~
<smtp from="XXX@YYY.ZZZ">        
	<network host="smtp.xxxx.com"
		port="XXX"
		userName="XXX@YYY.ZZZ"
		password="XXXX"
		enableSsl="true"
	/>
</smtp>
~~~~

## Test

Testing in Gulp using Mocha, Chai and Puppeteer

### Lint

See [EsLint](https://github.com/Spoondogg/ICARUS/blob/master/config/eslint.json) for details

## Build

* [Gulp](https://gulpjs.com/) - Build and Deploy
* [Node.js](https://nodejs.org) - Build
* [NPM](https://www.npmjs.com/) - Dependency Management
* VS2017 - IDE

## Contribute

Please read [CONTRIBUTING](https://github.com/Spoondogg/ICARUS/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Spoondogg/ICARUS/tags). 

## Authors

* **Ryan Dunphy** - *Initial work* - [Spoondogg](https://github.com/Spoondogg)

See also the list of [contributors](https://github.com/Spoondogg/ICARUS/contributors) who participated in this project.

## License

This project is licensed under the MIT License 

## Acknowledgments

* Cara & Colin
* The old man and the pup
