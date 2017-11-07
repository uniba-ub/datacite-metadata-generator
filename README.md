**Fork of [DataCite Metadata Generator - Kernel 4.0](https://github.com/mpaluch/datacite-metadata-generator)**

# DataCite Metadata Generator for OPUS (DMGO)
on [GitHub](https://github.com/uniba-ub/datacite-metadata-generator-for-opus) [![GitHub tag](https://img.shields.io/github/tag/datacite-metadata-generator-for-opus/datacite-metadata-generator-for-opus.svg)](https://github.com/uniba-ub/datacite-metadata-generator-for-opus) [![GitHub license](https://img.shields.io/github/license/uniba-ub/datacite-metadata-generator-for-opus.svg)](https://github.com/uniba-ub/datacite-metadata-generator-for-opus/blob/master/LICENSE.md)

on [Docker Hub](https://hub.docker.com/r/unibaub/datacite-metadata-generator-for-opus) ![docker](https://img.shields.io/docker/stars/unibaub/datacite-metadata-generator-for-opus.svg) ![docker](https://img.shields.io/docker/pulls/unibaub/datacite-metadata-generator-for-opus.svg) ![docker](https://img.shields.io/docker/automated/unibaub/datacite-metadata-generator-for-opus.svg)
![docker](https://img.shields.io/docker/build/unibaub/datacite-metadata-generator-for-opus.svg)

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
