# ICARUS
A mobile-friendly, sandbox-ish, restful, wiki-like, single-page web application / blog-type framework-ey thing for making all the things with.
***
or: *how I learned to stop using so many damn frameworks and just write it in vanilla*

> 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a live system.

### Stack

  - C# ASP.NET MVC5 using Entity 6 on SQL Server 2017
  - HTML5, CSS3, JavaScript (ES6) and a little Bootstrap 3.3.7

### Prerequisites

These are the things I use to build the things.  

* MVC.NET 4.7.2
* JQuery (Phasing out where possible)
* Bootstrap 3.3.7 (Phasing out where possible)
* Sass
* Razor
* Entity 6
* SQL Server
* Gulp

### Compatibility

Primarily tested in WebKit and on an iPhone using Safari and Chrome

* Chrome Canary

### Known Issues

Limited DIALOG support will need to be corrected in future builds

### Install

Clone repo and create the required credentials.

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

Please read [CONTRIBUTING](https://github.com/Spoondogg/ICARUS/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Spoondogg/ICARUS/tags). 

### Branches
See [here](https://nvie.com/posts/a-successful-git-branching-model/)

Git branches are based on [Git Branches and Naming](https://stackoverflow.com/questions/273695/what-are-some-examples-of-commonly-used-practices-for-naming-git-branches), and more specifically this article on [git branching models](https://nvie.com/posts/a-successful-git-branching-model/)

It breaks down as follows:
- *master* branch containing merged release candidates
  - *develop* branch off of *master*
    - *feature* branch off of *develop*
      - Name based on the name of the feature and related issue id. *ie: Feature_Scrollbar_123*
      - Merges into **develop**  *(Not into the master or release branches)*
  - *release* branch off of *master* to hold candidate releases
    - Typical name *ie: rc1.1*
    - Merges into **master**
      - *bugfix* branch off of *release* **(No new features)**
        - Name based on release candidate and related issue id. *ie: Bugfix_rc1.1_123*
  - *hotfix* branch off of *master*
    - Contains short-lived branches for changes that come from *master*
    - Merges into *master* *(Without *develop* branch being involved)*

## Authors

* **Ryan Dunphy** - *Initial work* - [Spoondogg](https://github.com/Spoondogg)

See also the list of [contributors](https://github.com/Spoondogg/ICARUS/contributors) who participated in this project.

## License

This project is licensed under the MIT License 

## Acknowledgments

* Cara & Colin
* The old man and the pup
