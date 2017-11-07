**Fork of [DataCite Metadata Generator - Kernel 4.0](https://github.com/mpaluch/datacite-metadata-generator)**

# DataCite Metadata Generator for OPUS (DMGO) <br/> - visit on [Github](https://github.com/uniba-ub/datacite-metadata-generator-for-opus) [![GitHub tag](https://img.shields.io/github/tag/datacite-metadata-generator-for-opus/datacite-metadata-generator-for-opus.svg)](https://github.com/uniba-ub/datacite-metadata-generator-for-opus) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/uniba-ub/datacite-metadata-generator-for-opus)

[![docker](https://img.shields.io/docker/stars/unibaub/datacite-metadata-generator-for-opus.svg)
![docker](https://img.shields.io/docker/pulls/unibaub/datacite-metadata-generator-for-opus.svg)
![docker](https://img.shields.io/docker/automated/unibaub/datacite-metadata-generator-for-opus.svg)
![docker](https://img.shields.io/docker/build/unibaub/datacite-metadata-generator-for-opus.svg)](https://hub.docker.com/r/unibaub/datacite-metadata-generator-for-opus)

This fork of [DataCite Metadata Generator](https://github.com/mpaluch/datacite-metadata-generator) enhances the basic functionality of creating DataCite Metadata Kernel 4.0 XML via forms by automatically fetching and parsing XML data of your [OPUS-Publikationsserver](http://www.kobv.de/entwicklung/software/opus-4/).

![](https://raw.githubusercontent.com/uniba-ub/datacite-metadata-generator-for-opus/master/screenshot.png)

**NOTE: In the current state DMGO does only work with Bamberg's specific XSLT when exporting data from OPUS.**


# How To Use With Docker:

### Requirements
- [Docker](https://docs.docker.com/engine/installation/)
- [docker-compose](https://docs.docker.com/compose/install/)

**Requesites:** customize the configuration section in `src/be.js`

### On your local machine or on your server
```
docker-compose up
```

### On your local machine with mounted host directory for testing purposes
```
docker-compose -f docker-compose.dev.yml up
```
DMGO is now accessible under http://localhost/datacite_metadata_generator.html.


# How To Use Without Docker

### Requirements
- Web server with PHP

**Requesites:** customize the configuration section in `src/be.js`

Copy `datacite_metadata_generator.html` and the `src/` directory to your web server.

# Development

**Branches:**
- Releases: *master*
- Developement: *develop*


**Create New Feature Branch**
```
git checkout -b <feature_name> develop
```

**Merge Feature into Developement Branch**
```
git checkout develop
git merge -e --no-ff <feature_name>
```

**Delete Feature Branch**
```
git branch -d <feature_name>
```

**Create New Release**
```
git checkout master
git merge -e --no-ff develop
git tag <version>
git push origin master
git push --tags
```

[Source](http://nvie.com/posts/a-successful-git-branching-model/)
