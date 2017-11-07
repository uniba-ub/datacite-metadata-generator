<?xml version="1.0" encoding="utf-8"?>
<!--
/**
 * This file is part of OPUS. The software OPUS has been originally developed
 * at the University of Stuttgart with funding from the German Research Net,
 * the Federal Department of Higher Education and Research and the Ministry
 * of Science, Research and the Arts of the State of Baden-Wuerttemberg.
 *
 * OPUS 4 is a complete rewrite of the original OPUS software and was developed
 * by the Stuttgart University Library, the Library Service Center
 * Baden-Wuerttemberg, the North Rhine-Westphalian Library Service Center,
 * the Cooperative Library Network Berlin-Brandenburg, the Saarland University
 * and State Library, the Saxon State Library - Dresden State and University
 * Library, the Bielefeld University Library and the University Library of
 * Hamburg University of Technology with funding from the German Research
 * Foundation and the European Regional Development Fund.
 *
 * LICENCE
 * OPUS is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the Licence, or any later version.
 * OPUS is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with OPUS; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 *
 * @category    Application
 * @package     Module_Export
 * @author      Sascha Szott <szott@zib.de>
 * @copyright   Copyright (c) 2011, OPUS 4 development team
 * @license     http://www.gnu.org/licenses/gpl.html General Public License
 * @version     $Id: example.xslt 9495 2011-12-22 12:32:57Z sszott $
 *
 * Anpassungen UBG für DataCite MetadataGenerator V4.0 Stand 18.08.2017 /UW
 */

-->

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <xsl:output method="xml" indent="yes" encoding="utf-8"/>

    <!--
    Suppress output for all elements that don't have an explicit template.
    -->
    <xsl:template match="*"/>

    <xsl:template match="/">
        <xsl:element name="export-example">
            <xsl:apply-templates select="Documents"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="Documents">
        <xsl:apply-templates select="Opus_Document"/>
    </xsl:template>

    <xsl:template match="Opus_Document">
        <xsl:element name="doc">
			<xsl:copy use-attribute-sets="OpDocument"/>
            <xsl:apply-templates select="TitleMain"/>
            <xsl:apply-templates select="Identifier"/>
			<xsl:for-each select="PersonAuthor">
				<xsl:copy use-attribute-sets="OpPerson"/>
			</xsl:for-each>

        </xsl:element>
    </xsl:template>

	<xsl:attribute-set name="OpDocument">
		<xsl:attribute name="{'Id'}">
			<xsl:value-of select="@Id"/></xsl:attribute>
		<xsl:attribute name="{'CompletedYear'}">
			<xsl:value-of select="@CompletedYear"/></xsl:attribute>
		<xsl:attribute name="{'PublishedYear'}">
			<xsl:value-of select="@PublishedYear"/></xsl:attribute>
		<xsl:attribute name="{'Language'}">
			<xsl:value-of select="@Language"/></xsl:attribute>
		<xsl:attribute name="{'PublisherName'}">
			<xsl:value-of select="@PublisherName"/></xsl:attribute>
		<xsl:attribute name="{'Type'}">
			<xsl:value-of select="@Type"/></xsl:attribute>
	</xsl:attribute-set>

    <xsl:template match="TitleMain">
        <xsl:element name="TitleMain">
            <xsl:attribute name="Id"><xsl:value-of select="@Id"/></xsl:attribute>
			<xsl:attribute name="language"><xsl:value-of select="@Language"/></xsl:attribute>
            <xsl:attribute name="Value"><xsl:value-of select="@Value"/></xsl:attribute>
        </xsl:element>
    </xsl:template>

    <xsl:template match="Identifier[@Type !='opus3-id']">
        <xsl:element name="Identifier">
           <xsl:attribute name="type"><xsl:value-of select="@Type"/></xsl:attribute>
           <xsl:attribute name="Value"><xsl:value-of select="@Value"/></xsl:attribute>
        </xsl:element>
    </xsl:template>

	<xsl:attribute-set name="OpPerson">
		<xsl:attribute name="{'Id'}">
			<xsl:value-of select="@Id"/></xsl:attribute>
		<xsl:attribute name="{'FirstName'}">
			<xsl:value-of select="@FirstName"/></xsl:attribute>
		<xsl:attribute name="{'LastName'}">
			<xsl:value-of select="@LastName"/></xsl:attribute>
	</xsl:attribute-set>

</xsl:stylesheet>
