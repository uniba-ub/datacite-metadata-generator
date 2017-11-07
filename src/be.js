/*
 * MIT License
 *
 * Copyright (c) 2017 University Library of Bamberg, Cornelius Matějka
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/*
 * =============================== Configuration ===============================
 */

var applicationName = "DataCite Metadata Generator for OPUS"
var version = "v0.2.0"
var date = "2017-10-27"

// OPUS LOGIN URL
var organization = "Bamberg"
var opusLoginUrl = "https://opus4.kobv.de/opus4-bamberg/auth/login/rmodule/home/rcontroller/index/raction/index"

// OPUS URL - the respective OPUS URL with '{ID}' as placeholder
var opusUrl = "https://opus4.kobv.de/opus4-bamberg/export/index/index/docId/{ID}/export/xml/stylesheet/example_doi/searchtype/id"

// DOI prefix
var doiPrefix = "10.20378/irbo-"

// Filename when saving as XML where {OPUSID} will be replaced with the actual OPUS ID
var filename = 'doi_' + doiPrefix + '{OPUSID}.xml'

// Mandatory fields as of DataCite Kernel v4.0
// Indentifier, Creator, Title, Publisher, PublicationYear, ResourceType (with mandatory general Type description)
var mandatoryFields = ["identifier", "creatorName", "title", "publisher", "publicationYear", "resourceType", "resourceTypeGeneral"]

// Additional fields (custom)
var additionalFields = ["relatedIdentifierType", "relatedIdentifier", "relationType", "language"]

/*
 * =============================== Initializer ===============================
 */

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results===null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

$(document).ready(function() {
    log("Version: " + version + "; Date: " + date)
    initValidator()

    filename = slugify(filename.toString().replace(/{OPUSID}/g, $.urlParam('opusid')))

    $("input:visible").each(function(i, v) {
        $(v).val("")
    })

    $("#opuslogin").text($("#opuslogin").text().replace("[ORG]", organization))

    $("#opuslogin").bind("click", function(event) {
        event.preventDefault()
        var win = window.open(opusLoginUrl, '_blank')
        win.focus()
    })

    $("#opusid").keypress(function(key) {
        if(key.which == 13) {
            key.preventDefault()
            startOPUS()
        }
    })
    $("#opusopen").bind("click", function(event) {
        event.preventDefault();
        startOPUS();
    })

    $("#opusreset").bind("click", function(event) {
        event.preventDefault();
        var url ='?opusid=';
        window.open(url,"_self");
    })

    var urlOpusId = $.urlParam('opusid');
    if(urlOpusId){
        $('#opusid').val(urlOpusId);
        openOPUS();
    }

})

/*
 * =============================== Utilities ===============================
 */

var iso6392ToIso6391 = {
    "ara": "aa",
    "baq": "eu",
    "cat": "ca",
    "chi": "zh",
    "deu": "de",
    "dut": "nl",
    "ell": "el",
    "eng": "en",
    "eus": "eu",
    "fra": "fr",
    "fre": "fr",
    "ger": "de",
    "gre": "el",
    "hrv": "hr",
    "hun": "hu",
    "ita": "it",
    "jpn": "ja",
    "lat": "la",
    "mul": "mu",
    "nld": "nl",
    "pol": "pl",
    "por": "pt",
    "ron": "ro",
    "rum": "ro",
    "rus": "ru",
    "spa": "es",
    "tur": "tr",
    "zho": "zh"
}

var relationType = {
    "doi": "IsSupplementTo",
    "isbn": "IsPartOf",
    "issn": "IsPartOf",
    "url": "IsCitedBy",
    "urn": "IsSupplementTo"
}

var resourceTypeGeneral = {
    "article": "Text",
    "articlecollection": "Text",
    "book": "Text",
    "bookpart": "Text",
    "conferenceobject": "Text",
    "doctoralthesis": "Text",
    "habilitation": "Text",
    "masterthesis": "Text",
    "movingimage": "Audiovisual",
    "other": "Text",
    "periodicalpart": "Text",
    "preprint": "Text",
    "report": "Text",
    "review": "Text",
    "sound": "Sound",
    "workingpaper": "Text"
}

function log(msg) {
    console.log("%c[" + applicationName + "] " + msg, "color:black")
}

function showError(msg) {
    $("#be-error").html("&#9888; " + msg)
}

function escapeChars(xml) {
    return xml.replace(/&/g, "&amp;");
}

function startOPUS(){
     var id = $('#opusid').val()
     var url ='?opusid=' + id;
     window.open(url,"_self");
}

function openOPUS() {
    var id = $('#opusid').val()
    if(id && !isNaN(id)) {
        $.post('src/get_opus_xml.php', { url: opusUrl.replace("{ID}", id) }, function(data) {
            parseOpusXml(data)
        });
        $("#opusiderror").hide()
    } else {
        $("#opusiderror").show()
        log("Invalid OPUS ID: " + id)
        showError("Invalid OPUS ID: Must be a numeric")
    }
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\//g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .trim()
}

/*
 * =============================== Parser ===============================
 */

function parseOpusXml(xml) {
    if(!xml) { return }

    try {
        var xml = escapeChars(xml)
        var $xml = $($.parseXML(xml))

        var doc_node = $xml.find('doc')
        var opus_document_node = doc_node.find('Opus_Document')

        var id = opus_document_node.attr('Id') ? doiPrefix + opus_document_node.attr('Id').trim() : ""
        var publisher = opus_document_node.attr('PublisherName') ? opus_document_node.attr('PublisherName').trim() : ""
        var language = opus_document_node.attr('Language') ? opus_document_node.attr('Language').trim() : ""
        var title = doc_node.find('TitleMain[language=' + language + ']').attr('Value') ? doc_node.find('TitleMain[language=' + language + ']').attr('Value').trim() : ""
        var $creatorNames = doc_node.find('PersonAuthor')
        var resourceType = opus_document_node.attr('Type') ? opus_document_node.attr('Type').trim() : ""
        var publicationYear = opus_document_node.attr('PublishedYear') ? opus_document_node.attr('PublishedYear') : (opus_document_node.attr('CompletedYear') ? opus_document_node.attr('CompletedYear') : "")
        var $relatedIdentifiers = $xml.find('Identifier')

        log("Attributes found:" +
            " id:" + id +
            "; title:" + title +
            "; creatorNames:" + $creatorNames.map(function(i, v) { return $(v).attr('LastName') }).get().join() +
            "; publisher:" + publisher +
            "; publicationYear:" + publicationYear +
            "; relatedIdentifier:" + $relatedIdentifiers.map(function(i, v) { return $(v).attr('type') }).get().join() +
            "; language:" + language)

        $('input[title=identifier]').val(id)
        $('input[title=title]').val(title)
        $('input[title=publisher]').val(publisher)
        $('input[title=publicationYear]').val(publicationYear)
        $('input[title=resourceType]').val(resourceType)
        $('select[title=resourceTypeGeneral]').val(resourceTypeGeneral[resourceType])
        $('input[title=language]').val(getLanguageCode(language))

        $creatorNames.each(function(i, v) {
            $('input[title=creatorName]').each(function(j, n) {
                var $node = $(n)
                if(!$node.val()) {
                    $v = $(v)
                    $node.val($v.attr('LastName') + ", " + $v.attr('FirstName'))
                    if(j != ($creatorNames.length - 1)) {
                        $('div[title=creators]>button.add.group').trigger('click')
                    }
                }
            })
        })

        $relatedIdentifiers.each(function(i, v) {
            $('input[title=relatedIdentifier]').each(function(j, n) {
                var $node = $(n)
                if(!$node.val() || (!$node.next('select[title=relatedIdentifierType]').val() && !$node.next().next('select[title=relationType]').val())) {
                    $v = $(v)
                    $node.val($v.attr('Value'))
                    var type = $v.attr('type')
                    $node.next('select[title=relatedIdentifierType]').val(type.toUpperCase())
                    $node.next().next('select[title=relationType]').val(relationType[type])
                    if(j != ($relatedIdentifiers.length -1)) {
                        $('div[title=relatedIdentifiers]>button.add.group').trigger('click')
                    }
                }
            })
        })

        if ($(document).find('h3.recommended').next('div').is(':hidden')) {
            $(document).find('h3.recommended').trigger('click')
        }
        if ($(document).find('h3.other').next('div').is(':hidden')) {
            $(document).find('h3.other').trigger('click')
        }

        validateMandatoryFields()
        validateAdditionalFields()

        $("input[title=title]").trigger('keyup')
        $("#opusxmlerror").hide()

    } catch(error) {
        $("#opusxmlerror").show()
        log("Unable to parse given XML")
        showError("Invalid XML: Press F12 for more information")
        throw error
    }
}

/*
 * =============================== Getter ===============================
 */

function getLanguageCode(code) {
    if(code.length == 3) {
        return iso6392ToIso6391[code]
    } else if(code.length == 2) {
        return code
    } else {
        return "";
    }
}

/*
 * =============================== Validator ===============================
 */

function validateMandatoryFields() {
    var $node = $('#mandatoryFields')
    $node.empty()
    mandatoryFields.forEach(function(entry) {
        var $input = $('input[title=' + entry +'], select[title=' + entry + ']')
        if($input.val()) {
            $input.css({backgroundColor: "lightgreen"})
            $node.append("<span style='color:green'>&#9989; " + entry + " </span>")
        } else {
            $input.css({backgroundColor: "darkorange"})
            $node.append("<span style='color:red'>&#10062; " + entry + " </span>")
        }
    })
}

function validateAdditionalFields() {
    var $node = $('#additionalFields')
    $node.empty()
    additionalFields.forEach(function(entry) {
        var $input = $('input[title=' + entry +'], select[title=' + entry + ']')
        if($input.val()) {
            $input.css({backgroundColor: "lightgreen"})
            $node.append("<span style='color:green'>&#9989; " + entry + " </span>")
        } else {
            $input.css({backgroundColor: "lightsteelblue"})
            $node.append("<span style='color:red'>&#10062; " + entry + " </span>")
        }
    })
}

function initValidator() {
    var $mandatoryFields = $('#mandatoryFields')
    var $additionalFields = $('#additionalFields')
    mandatoryFields.forEach(function(entry) {
            $mandatoryFields.append("<span style='color:lightgrey'>" + entry + " </span>")
    })
    additionalFields.forEach(function(entry) {
            $additionalFields.append("<span style='color:lightgrey'>" + entry + " </span>")
    })
}
