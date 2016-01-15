// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================
// <snippetSDK.MetaData.js>
if (typeof (SDK) == "undefined")
{ SDK = { __namespace: true }; }
// Namespace container for functions in this library.
SDK.MetaData = {
    _ServerUrl: function () {///<summary>
        ///<summary>
        /// Returns the URL for the SOAP endpoint using the context information available in the form
        /// or HTML Web resource.
        ///</summary

        var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
        var serverUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            serverUrl = context.getServerUrl();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                serverUrl = Xrm.Page.context.getServerUrl();
            }
            else
            { throw new Error("Unable to access the server URL"); }
        }
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }
        return serverUrl + OrgServicePath;
    },
    RetrieveAllEntitiesAsync: function (EntityFilters, RetrieveAsIfPublished, successCallBack, errorCallBack) {
        ///<summary>
        /// Sends an asynchronous RetrieveAllEntities Request to retrieve all entities in the system
        ///</summary>
        ///<returns>entityMetadataCollection</returns>
        ///<param name="EntityFilters" type="String">
        /// SDK.MetaData.EntityFilters provides dictionary for the filters available to filter which data is retrieved.
        /// Alternatively a string consisting of the values 'Entity Attributes Relationships Privileges' can be used directly.
        /// Include only those elements of the entity you want to retrieve. Retrieving all parts of all entitities may take significant time.
        ///</param>
        this._parameterCheck(EntityFilters, "EntityFilters", "The SDK.MetaData.RetrieveAllEntitiesAsync method EntityFilters parameter must be a SDK.MetaData.EntityFilters reference.");
        ///<param name="RetrieveAsIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        this._parameterCheck(RetrieveAsIfPublished, "Boolean", "The SDK.MetaData.RetrieveAllEntitiesAsync method RetrieveAsIfPublished parameter must be a Boolean value.");
        ///<param name="successCallBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function must accept the entityMetadataCollection as a parameter.
        ///</param>
        this._parameterCheck(successCallBack, "Function", "The SDK.MetaData.RetrieveAllEntitiesAsync method successCallBack parameter must be a Function.");
        ///<param name="errorCallBack" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        ///</param>
        this._parameterCheck(errorCallBack, "Function", "The SDK.MetaData.RetrieveAllEntitiesAsync method errorCallBack parameter must be a Function.");
        var request = "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        request += "<request i:type=\"a:RetrieveAllEntitiesRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        request += "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>EntityFilters</b:key>";
        request += "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + this._xmlEncode(EntityFilters) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>RetrieveAsIfPublished</b:key>";
        request += "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(RetrieveAsIfPublished.toString()) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "</a:Parameters>";
        request += "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAllEntities</a:RequestName></request>";
        request += "</Execute>";
        request = this._getSOAPWrapper(request);

        var req = new XMLHttpRequest();
        req.open("POST", this._ServerUrl(), true);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", this._Action.Execute);
        req.onreadystatechange = function () { SDK.MetaData._returnAllEntities(req, successCallBack, errorCallBack) };
        req.responseType = 'msxml-document';
        req.send(request);
    },
    _returnAllEntities: function (resp, successCallBack, errorCallBack) {
        ///<summary>
        /// Private function that processes the response from SDK.MetaData.RetrieveAllEntitiesAsync
        ///</summary>
        ///<param name="resp" type="XMLHttpRequest">
        /// The XMLHttpRequest representing the response.
        ///</param>
        ///<param name="successCallBack" type="Function">
        /// The function passed through to be executed when a successful retrieval is complete.
        ///</param>
        ///<param name="errorCallBack" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        ///</param>
        if (resp.readyState == 4 /* complete */) {
            if (resp.status == 200) {
                //Success
                 var resultXml =  resp.responseXML;
                resultXml.setProperty("SelectionNamespaces","xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata\' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts\' ");
                var entityMetadataNodes = resultXml.selectNodes("//c:EntityMetadata");
                var entityMetadataCollection = [];
                for (var i = 0; i < entityMetadataNodes.length; i++) {
                    var entityMetadata = new SDK.MetaData._entityMetaData(entityMetadataNodes[i])
                    entityMetadataCollection.push(entityMetadata);
                }
                entityMetadataCollection.sort();
                successCallBack(entityMetadataCollection);

            }
            else {

                errorCallBack(SDK.MetaData._getError(resp));

            }

        }
    },
    RetrieveEntityAsync: function (EntityFilters, LogicalName, MetadataId, RetrieveAsIfPublished, successCallBack, errorCallBack) {
        ///<summary>
        /// Sends an asynchronous RetrieveEntity Request to retrieve a specific entity
        ///</summary>
        ///<returns>entityMetadata</returns>
        ///<param name="EntityFilters" type="String">
        /// SDK.MetaData.EntityFilters provides dictionary for the filters available to filter which data is retrieved.
        /// Alternatively a string consisting of the values 'Entity Attributes Relationships Privileges' can be used directly.
        /// Include only those elements of the entity you want to retrieve.
        ///</param>
        this._parameterCheck(EntityFilters, "EntityFilters", "The SDK.MetaData.RetrieveEntityAsync method EntityFilters parameter must be a SDK.MetaData.EntityFilters reference.");
        ///<param name="LogicalName" optional="true" type="String">
        /// The logical name of the entity requested. A null value may be used if a MetadataId is provided.
        ///</param>
        if (LogicalName == null && MetadataId == null) {
            throw new Error("SDK.MetaData.RetrieveEntityAsync requires either the LogicalName or MetadataId parameter not be null.");
        }
        if (LogicalName != null)
            this._parameterCheck(LogicalName, "String", "The SDK.MetaData.RetrieveEntityAsync method LogicalName parameter must be a string value.");
        ///<param name="MetadataId" optional="true" type="String">
        /// A null value or an empty guid may be passed if a LogicalName is provided.
        ///</param>
        if (MetadataId != null && LogicalName == null) {
            this._parameterCheck(MetadataId, "GUID", "The SDK.MetaData.RetrieveEntityAsync method MetadataId parameter must be a string Representing a GUID value.");
        }
        else {
            MetadataId = "00000000-0000-0000-0000-000000000000";
        }
        ///<param name="RetrieveAsIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        this._parameterCheck(RetrieveAsIfPublished, "Boolean", "The SDK.MetaData.RetrieveEntityAsync method RetrieveAsIfPublished parameter must be a Boolean value.");
        ///<param name="successCallBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function must accept the entityMetadata as a parameter.
        ///</param>
        this._parameterCheck(successCallBack, "Function", "The SDK.MetaData.RetrieveEntityAsync method successCallBack parameter must be a Function.");
        ///<param name="errorCallBack" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        ///</param>
        this._parameterCheck(errorCallBack, "Function", "The SDK.MetaData.RetrieveEntityAsync method errorCallBack parameter must be a Function.");

        var request = "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        request += "<request i:type=\"a:RetrieveEntityRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        request += "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>EntityFilters</b:key>";
        request += "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + this._xmlEncode(EntityFilters) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>MetadataId</b:key>";
        request += "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + this._xmlEncode(MetadataId) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>RetrieveAsIfPublished</b:key>";
        request += "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(RetrieveAsIfPublished.toString()) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>LogicalName</b:key>";
        if (LogicalName == null) {
            request += "<b:value i:nil=\"true\" />";
        }
        else {
            request += "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(LogicalName.toLowerCase()) + "</b:value>";
        }
        request += "</a:KeyValuePairOfstringanyType>";
        request += "</a:Parameters>";
        request += "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveEntity</a:RequestName></request>";
        request += "</Execute>";
        request = this._getSOAPWrapper(request);

        var req = new XMLHttpRequest();
        req.open("POST", this._ServerUrl(), true);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", this._Action.Execute);
        req.onreadystatechange = function () { SDK.MetaData._returnEntity(req, successCallBack, errorCallBack) };
        req.responseType = 'msxml-document';
        req.send(request);
    },
    _returnEntity: function (resp, successCallBack, errorCallBack) {
        ///<summary>
        /// Private function that processes the response from SDK.MetaData.RetrieveEntityAsync
        ///</summary>
        ///<param name="resp" type="XMLHttpRequest">
        /// The XMLHttpRequest representing the response.
        ///</param>
        ///<param name="successCallBack" type="Function">
        /// The function passed through to be executed when a successful retrieval is complete.
        ///</param>
        ///<param name="errorCallBack" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        ///</param>
        if (resp.readyState == 4 /* complete */) {
            if (resp.status == 200) {
                //Success
                var resultXml = resp.responseXML; 
                resultXml.setProperty("SelectionNamespaces", "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts\'  xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic\'  xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata\' ");
                var entityMetadata = new SDK.MetaData._entityMetaData(resultXml.selectSingleNode("//b:value"));

                successCallBack(entityMetadata);

            }
            else {
                //Failure
                errorCallBack(SDK.MetaData._getError(resp));
            }
        }

    },
    RetrieveAttributeAsync: function (EntityLogicalName, LogicalName, MetadataId, RetrieveAsIfPublished, successCallBack, errorCallBack) {
        ///<summary>
        /// Sends an asynchronous RetrieveAttribute Request to retrieve a specific entity
        ///</summary>
        ///<returns>AttributeMetadata</returns>
        ///<param name="EntityLogicalName"  optional="true" type="String">
        /// The logical name of the entity for the attribute requested. A null value may be used if a MetadataId is provided.
        ///</param>
        if (EntityLogicalName == null && LogicalName == null && MetadataId == null) {
            throw new Error("SDK.MetaData.RetrieveAttributeAsync requires either the EntityLogicalName and LogicalName  parameters or the MetadataId parameter not be null.");
        }
        if (EntityLogicalName != null)
            this._parameterCheck(EntityLogicalName, "String", "The SDK.MetaData.RetrieveAttributeAsync method EntityLogicalName parameter must be string value.");
        ///<param name="LogicalName" optional="true" type="String">
        /// The logical name of the attribute requested. 
        ///</param>
        if (LogicalName != null)
            this._parameterCheck(LogicalName, "String", "The SDK.MetaData.RetrieveAttributeAsync method LogicalName parameter must be string value.");
        ///<param name="MetadataId" optional="true" type="String">
        /// A null value may be passed if an EntityLogicalName and LogicalName is provided.
        ///</param>
        if (MetadataId != null && LogicalName == null && EntityLogicalName == null) {
            this._parameterCheck(MetadataId, "GUID", "The SDK.MetaData.RetrieveAttributeAsync method MetadataId parameter must be a string Representing a GUID value.");
        }
        else {
            MetadataId = "00000000-0000-0000-0000-000000000000";
        }
        ///<param name="RetrieveAsIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        this._parameterCheck(RetrieveAsIfPublished, "Boolean", "The SDK.MetaData.RetrieveAttributeAsync method RetrieveAsIfPublished parameter must be a Boolean value.");
        ///<param name="successCallBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function must accept the entityMetadata as a parameter.
        ///</param>
        this._parameterCheck(successCallBack, "Function", "The SDK.MetaData.RetrieveAttributeAsync method successCallBack parameter must be a Function.");
        ///<param name="errorCallBack" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        ///</param>
        this._parameterCheck(errorCallBack, "Function", "The SDK.MetaData.RetrieveAttributeAsync method errorCallBack parameter must be a Function.");

        var request = "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        request += "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        request += "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>EntityLogicalName</b:key>";
        if (EntityLogicalName == null)
        { request += "<b:value i:nil=\"true\" />"; }
        else
        { request += "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(EntityLogicalName.toLowerCase()) + "</b:value>"; }
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>MetadataId</b:key>";
        request += "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + this._xmlEncode(MetadataId) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>RetrieveAsIfPublished</b:key>";
        request += "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(RetrieveAsIfPublished.toString()) + "</b:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<b:key>LogicalName</b:key>";
        if (LogicalName == null) {
            request += "<b:value i:nil=\"true\" />";
        }
        else {
            request += "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(LogicalName.toLowerCase()) + "</b:value>";
        }

        request += "</a:KeyValuePairOfstringanyType>";
        request += "</a:Parameters>";
        request += "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAttribute</a:RequestName></request>";
        request += "</Execute>";
        request = this._getSOAPWrapper(request);

        var req = new XMLHttpRequest();
        req.open("POST", this._ServerUrl(), true);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", this._Action.Execute);
        req.onreadystatechange = function () { SDK.MetaData._returnAttribute(req, successCallBack, errorCallBack) };
        req.send(request);
    },
    _returnAttribute: function (resp, successCallBack, errorCallBack) {
        if (resp.readyState == 4 /* complete */) {
            if (resp.status == 200) {
                //Success				
                //var attributeMetadata = new SDK.MetaData._attributeMetadata(resp.responseXML.selectSingleNode("//b:value"));

                var resultXml = resp.responseXML;
              

                var attributeData = resp.responseXML.selectSingleNode("//b:value");
                var attributeType = attributeData.selectSingleNode("c:AttributeType").text;
                var attribute = {};
                switch (attributeType) {
                    case "BigInt":
                        attribute = new SDK.MetaData._bigIntAttributeMetadata(attributeData);
                        break;
                    case "Boolean":
                        attribute = new SDK.MetaData._booleanAttributeMetadata(attributeData);
                        break;
                    case "CalendarRules":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "Customer":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "DateTime":
                        attribute = new SDK.MetaData._dateTimeAttributeMetadata(attributeData);
                        break;
                    case "Decimal":
                        attribute = new SDK.MetaData._decimalAttributeMetadata(attributeData);
                        break;
                    case "Double":
                        attribute = new SDK.MetaData._doubleAttributeMetadata(attributeData);
                        break;
                    case "EntityName":
                        attribute = new SDK.MetaData._entityNameAttributeMetadata(attributeData);
                        break;
                    case "Integer":
                        attribute = new SDK.MetaData._integerAttributeMetadata(attributeData);
                        break;
                    case "Lookup":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "ManagedProperty":
                        attribute = new SDK.MetaData._managedPropertyAttributeMetadata(attributeData);
                        break;
                    case "Memo":
                        attribute = new SDK.MetaData._memoAttributeMetadata(attributeData);
                        break;
                    case "Money":
                        attribute = new SDK.MetaData._moneyAttributeMetadata(attributeData);
                        break;
                    case "Owner":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "PartyList":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "Picklist":
                        attribute = new SDK.MetaData._picklistAttributeMetadata(attributeData);
                        break;
                    case "State":
                        attribute = new SDK.MetaData._stateAttributeMetadata(attributeData);
                        break;
                    case "Status":
                        attribute = new SDK.MetaData._statusAttributeMetadata(attributeData);
                        break;
                    case "String":
                        attribute = new SDK.MetaData._stringAttributeMetadata(attributeData);
                        break;
                    case "Uniqueidentifier":
                        attribute = new SDK.MetaData._attributeMetadata(attributeData);
                        break;
                    case "Virtual": //Contains the text value of picklist fields
                        attribute = new SDK.MetaData._attributeMetadata(attributeData);

                        break;
                }


                successCallBack(attribute);

            }
            else {
                //Failure
                errorCallBack(SDK.MetaData._getError(resp));
            }
        }
    },
    _getError: function (resp) {
        ///<summary>
        /// Private function that attempts to parse errors related to connectivity or WCF faults.
        ///</summary>
        ///<param name="resp" type="XMLHttpRequest">
        /// The XMLHttpRequest representing failed response.
        ///</param>

        //Error descriptions come from http://support.microsoft.com/kb/193625
        if (resp.status == 12029)
        { return new Error("The attempt to connect to the server failed."); }
        if (resp.status == 12007)
        { return new Error("The server name could not be resolved."); }
        var faultXml = resp.responseXML;
        var errorMessage = "Unknown (unable to parse the fault)";
        if (typeof faultXml == "object") {

            var bodyNode = faultXml.firstChild.firstChild;

            //Retrieve the fault node
            for (var i = 0; i < bodyNode.childNodes.length; i++) {
                var node = bodyNode.childNodes[i];

                //NOTE: This comparison does not handle the case where the XML namespace changes
                if ("s:Fault" == node.nodeName) {
                    for (var j = 0; j < node.childNodes.length; j++) {
                        var faultStringNode = node.childNodes[j];
                        if ("faultstring" == faultStringNode.nodeName) {
                            errorMessage = faultStringNode.text;
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return new Error(errorMessage);

    },
    EntityFilters: {
        All: "Entity Attributes Relationships Privileges",
        Default: "Entity Attributes Relationships Privileges",
        Attributes: "Attributes",
        Entity: "Entity",
        Privileges: "Privileges",
        Relationships: "Relationships"
    },
    _Action: {
        Execute: "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute"
    },
    _getSOAPWrapper: function (request) {
        ///<summary>
        /// Private function that wraps a soap envelope around a request.
        ///</summary>
        var SOAP = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body>";
        SOAP += request;
        SOAP += "</soapenv:Body></soapenv:Envelope>";
        return SOAP;
    },
    _associatedMenuConfiguration: function (node) {
        ///<summary>
        /// Private function that parses xml data describing AssociatedMenuConfiguration
        ///</summary>
        var orderValue;
        if (isNaN(parseInt(node.selectSingleNode("c:Order").text, 10)))
        { orderValue = null; }
        else
        { orderValue = parseInt(node.selectSingleNode("c:Order").text, 10); }
        return {
            Behavior: node.selectSingleNode("c:Behavior").text,
            Group: node.selectSingleNode("c:Group").text,
            Label: new SDK.MetaData._label(node.selectSingleNode("c:Label")),
            Order: orderValue
        };
    },
    _oneToManyRelationshipMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing OneToManyRelationshipMetadata
        ///</summary>
        return { OneToManyRelationshipMetadata: {
            MetadataId: node.selectSingleNode("c:MetadataId").text,
            IsCustomRelationship: (node.selectSingleNode("c:IsCustomRelationship").text == "true") ? true : false,
            IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
            IsManaged: (node.selectSingleNode("c:IsManaged").text == "true") ? true : false,
            IsValidForAdvancedFind: (node.selectSingleNode("c:IsValidForAdvancedFind").text == "true") ? true : false,
            SchemaName: node.selectSingleNode("c:SchemaName").text,
            SecurityTypes: node.selectSingleNode("c:SecurityTypes").text,
            AssociatedMenuConfiguration: new SDK.MetaData._associatedMenuConfiguration(node.selectSingleNode("c:AssociatedMenuConfiguration")),
            CascadeConfiguration: {
                Assign: node.selectSingleNode("c:CascadeConfiguration/c:Assign").text,
                Delete: node.selectSingleNode("c:CascadeConfiguration/c:Delete").text,
                Merge: node.selectSingleNode("c:CascadeConfiguration/c:Merge").text,
                Reparent: node.selectSingleNode("c:CascadeConfiguration/c:Reparent").text,
                Share: node.selectSingleNode("c:CascadeConfiguration/c:Share").text,
                Unshare: node.selectSingleNode("c:CascadeConfiguration/c:Unshare").text
            },
            ReferencedAttribute: node.selectSingleNode("c:ReferencedAttribute").text,
            ReferencedEntity: node.selectSingleNode("c:ReferencedEntity").text,
            ReferencingAttribute: node.selectSingleNode("c:ReferencingAttribute").text,
            ReferencingEntity: node.selectSingleNode("c:ReferencingEntity").text
        }
        };
    },
    _manyToManyRelationshipMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing ManyToManyRelationshipMetadata
        ///</summary>
        return { ManyToManyRelationshipMetadata: {
            MetadataId: node.selectSingleNode("c:MetadataId").text,
            IsCustomRelationship: (node.selectSingleNode("c:IsCustomRelationship").text == "true") ? true : false,
            IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
            IsManaged: (node.selectSingleNode("c:IsManaged").text == "true") ? true : false,
            IsValidForAdvancedFind: (node.selectSingleNode("c:IsValidForAdvancedFind").text == "true") ? true : false,
            SchemaName: node.selectSingleNode("c:SchemaName").text,
            SecurityTypes: node.selectSingleNode("c:SecurityTypes").text,
            Entity1AssociatedMenuConfiguration: new SDK.MetaData._associatedMenuConfiguration(node.selectSingleNode("c:Entity1AssociatedMenuConfiguration")),
            Entity1IntersectAttribute: node.selectSingleNode("c:Entity1IntersectAttribute").text,
            Entity1LogicalName: node.selectSingleNode("c:Entity1LogicalName").text,
            Entity2AssociatedMenuConfiguration: new SDK.MetaData._associatedMenuConfiguration(node.selectSingleNode("c:Entity2AssociatedMenuConfiguration")),
            Entity2IntersectAttribute: node.selectSingleNode("c:Entity2IntersectAttribute").text,
            Entity2LogicalName: node.selectSingleNode("c:Entity2LogicalName").text,
            IntersectEntityName: node.selectSingleNode("c:IntersectEntityName").text
        }
        };
    },
    _entityMetaData: function (node) {
        ///<summary>
        /// Private function that parses xml data describing EntityMetaData
        ///</summary>
        //Check for Attributes and add them if they are included.
        var attributes = [];
        var attributesData = node.selectSingleNode("c:Attributes")
        if (attributesData.childNodes.length > 0) {
            //There are attributes
            for (var i = 0; i < attributesData.childNodes.length; i++) {
                var attributeData = attributesData.childNodes[i];
                var attributeType = attributeData.selectSingleNode("c:AttributeType").text;
                var attribute = {};
                switch (attributeType) {
                    case "BigInt":
                        attribute = new SDK.MetaData._bigIntAttributeMetadata(attributeData);
                        break;
                    case "Boolean":
                        attribute = new SDK.MetaData._booleanAttributeMetadata(attributeData);
                        break;
                    case "CalendarRules":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "Customer":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "DateTime":
                        attribute = new SDK.MetaData._dateTimeAttributeMetadata(attributeData);
                        break;
                    case "Decimal":
                        attribute = new SDK.MetaData._decimalAttributeMetadata(attributeData);
                        break;
                    case "Double":
                        attribute = new SDK.MetaData._doubleAttributeMetadata(attributeData);
                        break;
                    case "EntityName":
                        attribute = new SDK.MetaData._entityNameAttributeMetadata(attributeData);
                        break;
                    case "Integer":
                        attribute = new SDK.MetaData._integerAttributeMetadata(attributeData);
                        break;
                    case "Lookup":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "ManagedProperty":
                        attribute = new SDK.MetaData._managedPropertyAttributeMetadata(attributeData);
                        break;
                    case "Memo":
                        attribute = new SDK.MetaData._memoAttributeMetadata(attributeData);
                        break;
                    case "Money":
                        attribute = new SDK.MetaData._moneyAttributeMetadata(attributeData);
                        break;
                    case "Owner":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "PartyList":
                        attribute = new SDK.MetaData._lookupAttributeMetadata(attributeData);
                        break;
                    case "Picklist":
                        attribute = new SDK.MetaData._picklistAttributeMetadata(attributeData);
                        break;
                    case "State":
                        attribute = new SDK.MetaData._stateAttributeMetadata(attributeData);
                        break;
                    case "Status":
                        attribute = new SDK.MetaData._statusAttributeMetadata(attributeData);
                        break;
                    case "String":
                        attribute = new SDK.MetaData._stringAttributeMetadata(attributeData);
                        break;
                    case "Uniqueidentifier":
                        attribute = new SDK.MetaData._attributeMetadata(attributeData);
                        break;
                    case "Virtual": //Contains the text value of picklist fields
                        attribute = new SDK.MetaData._attributeMetadata(attributeData);

                        break;
                }
                attributes.push(attribute);

            }
            attributes.sort();
        }

        //Check for Privileges and add them if they are included.
        var privileges = [];
        var privilegesData = node.selectSingleNode("c:Privileges");
        if (privilegesData.childNodes.length > 0) {
            for (var i = 0; i < privilegesData.childNodes.length; i++) {
                var privilegeData = privilegesData.childNodes[i];
                var securityPrivilegeMetadata = {
                    SecurityPrivilegeMetadata: {
                        CanBeBasic: (privilegeData.selectSingleNode("c:CanBeBasic").text == "true") ? true : false,
                        CanBeDeep: (privilegeData.selectSingleNode("c:CanBeDeep").text == "true") ? true : false,
                        CanBeGlobal: (privilegeData.selectSingleNode("c:CanBeGlobal").text == "true") ? true : false,
                        CanBeLocal: (privilegeData.selectSingleNode("c:CanBeLocal").text == "true") ? true : false,
                        Name: privilegeData.selectSingleNode("c:Name").text,
                        PrivilegeId: privilegeData.selectSingleNode("c:PrivilegeId").text,
                        PrivilegeType: privilegeData.selectSingleNode("c:PrivilegeType").text
                    }
                };
                privileges.push(securityPrivilegeMetadata);
            }
        }

        //Check for Relationships and add them if they are included.
        var manyToManyRelationships = [];
        var manyToManyRelationshipsData = node.selectSingleNode("c:ManyToManyRelationships");
        if (manyToManyRelationshipsData.childNodes.length > 0) {
            for (var i = 0; i < manyToManyRelationshipsData.childNodes.length; i++) {
                var manyToManyRelationshipMetadataData = manyToManyRelationshipsData.childNodes[i];

                var manyToManyRelationshipMetadata = new SDK.MetaData._manyToManyRelationshipMetadata(manyToManyRelationshipMetadataData);
                manyToManyRelationships.push(manyToManyRelationshipMetadata);
            }
        }

        var manyToOneRelationships = [];
        var manyToOneRelationshipsData = node.selectSingleNode("c:ManyToOneRelationships");
        if (manyToOneRelationshipsData.childNodes.length > 0) {

            for (var i = 0; i < manyToOneRelationshipsData.childNodes.length; i++) {
                var manyToOneRelationshipMetadata = new SDK.MetaData._oneToManyRelationshipMetadata(manyToOneRelationshipsData.childNodes[i]);

                manyToOneRelationships.push(manyToOneRelationshipMetadata);

            }

        }

        var oneToManyRelationships = [];
        var oneToManyRelationshipsData = node.selectSingleNode("c:OneToManyRelationships");
        if (oneToManyRelationshipsData.childNodes.length > 0) {
            for (var i = 0; i < oneToManyRelationshipsData.childNodes.length; i++) {
                var oneToManyRelationshipMetadata = new SDK.MetaData._oneToManyRelationshipMetadata(oneToManyRelationshipsData.childNodes[i]);
                oneToManyRelationships.push(oneToManyRelationshipMetadata);
            }
        }


        return {
            ActivityTypeMask: SDK.MetaData._nullableInt(node.selectSingleNode("c:ActivityTypeMask")),
            Attributes: attributes,
            AutoRouteToOwnerQueue: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:AutoRouteToOwnerQueue")),
            CanBeInManyToMany: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanBeInManyToMany")),
            CanBePrimaryEntityInRelationship: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanBePrimaryEntityInRelationship")),
            CanBeRelatedEntityInRelationship: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanBeRelatedEntityInRelationship")),
            CanCreateAttributes: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanCreateAttributes")),
            CanCreateCharts: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanCreateCharts")),
            CanCreateForms: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanCreateForms")),
            CanCreateViews: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanCreateViews")),
            CanModifyAdditionalSettings: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanModifyAdditionalSettings")),
            CanTriggerWorkflow: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:CanTriggerWorkflow")),
            Description: new SDK.MetaData._label(node.selectSingleNode("c:Description")),
            DisplayCollectionName: new SDK.MetaData._label(node.selectSingleNode("c:DisplayCollectionName")),
            DisplayName: new SDK.MetaData._label(node.selectSingleNode("c:DisplayName")),
            IconLargeName: node.selectSingleNode("c:IconLargeName").text,
            IconMediumName: node.selectSingleNode("c:IconMediumName").text,
            IconSmallName: node.selectSingleNode("c:IconSmallName").text,
            IsActivity: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsActivity")),
            IsActivityParty: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsActivityParty")),
            IsAuditEnabled: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsAuditEnabled")),
            IsAvailableOffline: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsAvailableOffline")),
            IsChildEntity: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsChildEntity")),
            IsConnectionsEnabled: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsConnectionsEnabled")),
            IsCustomEntity: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsCustomEntity")),
            IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
            IsDocumentManagementEnabled: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsDocumentManagementEnabled")),
            IsDuplicateDetectionEnabled: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsDuplicateDetectionEnabled")),
            IsEnabledForCharts: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsEnabledForCharts")),
            IsImportable: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsImportable")),
            IsIntersect: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsIntersect")),
            IsMailMergeEnabled: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsMailMergeEnabled")),
            IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsManaged")),
            IsMappable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsMappable")),
            IsReadingPaneEnabled: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsReadingPaneEnabled")),
            IsRenameable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsRenameable")),
            IsValidForAdvancedFind: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsValidForAdvancedFind")),
            IsValidForQueue: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsValidForQueue")),
            IsVisibleInMobile: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsVisibleInMobile")),
            LogicalName: node.selectSingleNode("c:LogicalName").text,
            ManyToManyRelationships: manyToManyRelationships,
            ManyToOneRelationships: manyToOneRelationships,
            MetadataId: node.selectSingleNode("c:MetadataId").text,
            ObjectTypeCode: SDK.MetaData._nullableInt(node.selectSingleNode("c:ObjectTypeCode")),
            OneToManyRelationships: oneToManyRelationships,
            OwnershipType: node.selectSingleNode("c:OwnershipType").text,
            PrimaryIdAttribute: node.selectSingleNode("c:PrimaryIdAttribute").text,
            PrimaryNameAttribute: node.selectSingleNode("c:PrimaryNameAttribute").text,
            Privileges: privileges,
            RecurrenceBaseEntityLogicalName: node.selectSingleNode("c:RecurrenceBaseEntityLogicalName").text,
            ReportViewName: node.selectSingleNode("c:ReportViewName").text,
            SchemaName: node.selectSingleNode("c:SchemaName").text,
            // So the LogicalName property will be used for an array.sort().
            toString: function () { return this.LogicalName }
        };


    },
    _nullableInt: function (node) {
        ///<summary>
        /// Private function that parses xml data describing nullable Integer values
        ///</summary>
        if (node.text == "")
        { return null; }
        else
        { return parseInt(node.text, 10); }

    },
    _nullableBoolean: function (node) {
        ///<summary>
        /// Private function that parses xml data describing nullable Boolean values
        ///</summary>
        if (node.text == "")
        { return null; }
        if (node.text == "true")
        { return true; }
        else
        { return false; }
    },
    _booleanManagedProperty: function (node) {
        ///<summary>
        /// Private function that parses xml data describing BooleanManagedProperty 
        ///</summary>
        return {
            CanBeChanged: (node.selectSingleNode("a:CanBeChanged").text == "true") ? true : false,
            ManagedPropertyLogicalName: node.selectSingleNode("a:ManagedPropertyLogicalName").text,
            Value: (node.selectSingleNode("a:Value").text == "true") ? true : false
        };

    },
    _requiredLevelManagedProperty: function (node) {
        ///<summary>
        /// Private function that parses xml data describing AttributeRequiredLevelManagedProperty  
        ///</summary>
        return {
            CanBeChanged: (node.selectSingleNode("a:CanBeChanged").text == "true") ? true : false,
            ManagedPropertyLogicalName: node.selectSingleNode("a:ManagedPropertyLogicalName").text,
            Value: node.selectSingleNode("a:Value").text
        };

    },
    _label: function (node) {
        ///<summary>
        /// Private function that parses xml data describing Label 
        ///</summary>
        if (node.text == "") {
            return {
                LocalizedLabels: [],
                UserLocalizedLabel: null
            };
        }
        else {
            var locLabels = node.selectSingleNode("a:LocalizedLabels");
            var userLocLabel = node.selectSingleNode("a:UserLocalizedLabel");
            var arrLocLabels = [];
            for (var i = 0; i < locLabels.childNodes.length; i++) {
                var LocLabelNode = locLabels.childNodes[i];
                var locLabel = {
                    LocalizedLabel: {
                        IsManaged: (LocLabelNode.selectSingleNode("a:IsManaged").text == "true") ? true : false,
                        Label: LocLabelNode.selectSingleNode("a:Label").text,
                        LanguageCode: parseInt(LocLabelNode.selectSingleNode("a:LanguageCode").text, 10)
                    }
                };
                arrLocLabels.push(locLabel);
            }

            return {
                LocalizedLabels: arrLocLabels,
                UserLocalizedLabel: {
                    IsManaged: (userLocLabel.selectSingleNode("a:IsManaged").text == "true") ? true : false,
                    Label: userLocLabel.selectSingleNode("a:Label").text,
                    LanguageCode: parseInt(userLocLabel.selectSingleNode("a:LanguageCode").text, 10)
                }
            };

        }


    },
    _options: function (node) {
        ///<summary>
        /// Private function that parses xml data describing OptionSetMetadata Options 
        ///</summary>
        var optionMetadatas = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var optionMetadata = node.childNodes[i];
            var option;
            if (optionMetadata.attributes.getNamedItem("i:type") != null && optionMetadata.attributes.getNamedItem("i:type").value == "c:StatusOptionMetadata") {

                option = { StatusOptionMetadata:
			   { MetadataId: optionMetadata.selectSingleNode("c:MetadataId").text,
			       Description: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Description")),
			       IsManaged: SDK.MetaData._nullableBoolean(optionMetadata.selectSingleNode("c:IsManaged")),
			       Label: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Label")),
			       Value: parseInt(optionMetadata.selectSingleNode("c:Value").text, 10),
			       State: parseInt(optionMetadata.selectSingleNode("c:State").text, 10)

			   }
                };
            }
            else {
                if (optionMetadata.attributes.getNamedItem("i:type") != null && optionMetadata.attributes.getNamedItem("i:type").value == "c:StateOptionMetadata") {

                    option = { StateOptionMetadata:
			   { MetadataId: optionMetadata.selectSingleNode("c:MetadataId").text,
			       Description: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Description")),
			       IsManaged: SDK.MetaData._nullableBoolean(optionMetadata.selectSingleNode("c:IsManaged")),
			       Label: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Label")),
			       Value: parseInt(optionMetadata.selectSingleNode("c:Value").text, 10),
			       DefaultStatus: parseInt(optionMetadata.selectSingleNode("c:DefaultStatus ").text, 10),
			       InvariantName: optionMetadata.selectSingleNode("c:InvariantName").text

			   }
                    };
                }
                else {
                    option = { OptionMetadata:
			    { MetadataId: optionMetadata.selectSingleNode("c:MetadataId").text,
			        Description: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Description")),
			        IsManaged: SDK.MetaData._nullableBoolean(optionMetadata.selectSingleNode("c:IsManaged")),
			        Label: new SDK.MetaData._label(optionMetadata.selectSingleNode("c:Label")),
			        Value: parseInt(optionMetadata.selectSingleNode("c:Value").text, 10)

			    }
                    };
                }
            }


            optionMetadatas.push(option);

        }
        return optionMetadatas;
    },
    _booleanOptionSet: function (node) {
        ///<summary>
        /// Private function that parses xml data describing BooleanOptionSetMetadata 
        ///</summary>
        if (node.childNodes.length == 0)
        { return null; }
        else {
            return {
                MetadataId: node.selectSingleNode("c:MetadataId").text,
                Description: new SDK.MetaData._label(node.selectSingleNode("c:Description")),
                DisplayName: new SDK.MetaData._label(node.selectSingleNode("c:DisplayName")),
                IsCustomOptionSet: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsCustomOptionSet")),
                IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
                IsGlobal: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsGlobal")),
                IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsManaged")),
                Name: node.selectSingleNode("c:Name").text,
                OptionSetType: node.selectSingleNode("c:OptionSetType").text,
                FalseOption: {
                    MetadataId: node.selectSingleNode("c:FalseOption/c:MetadataId").text,
                    Description: new SDK.MetaData._label(node.selectSingleNode("c:FalseOption/c:Description")),
                    IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:FalseOption/c:IsManaged")),
                    Label: new SDK.MetaData._label(node.selectSingleNode("c:FalseOption/c:Label")),
                    Value: parseInt(node.selectSingleNode("c:FalseOption/c:Value").text, 10)
                },
                TrueOption: {
                    MetadataId: node.selectSingleNode("c:TrueOption/c:MetadataId").text,
                    Description: new SDK.MetaData._label(node.selectSingleNode("c:TrueOption/c:Description")),
                    IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:TrueOption/c:IsManaged")),
                    Label: new SDK.MetaData._label(node.selectSingleNode("c:TrueOption/c:Label")),
                    Value: parseInt(node.selectSingleNode("c:TrueOption/c:Value").text, 10)
                }
            };
        }


    },
    _optionSet: function (node) {
        ///<summary>
        /// Private function that parses xml data describing OptionSetMetadata 
        ///</summary>
        if (node.childNodes.length == 0)
        { return null; }
        else {
            return {
                MetadataId: node.selectSingleNode("c:MetadataId").text,
                Description: new SDK.MetaData._label(node.selectSingleNode("c:Description")),
                DisplayName: new SDK.MetaData._label(node.selectSingleNode("c:DisplayName")),
                IsCustomOptionSet: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsCustomOptionSet")),
                IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
                IsGlobal: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsGlobal")),
                IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsManaged")),
                Name: node.selectSingleNode("c:Name").text,
                OptionSetType: node.selectSingleNode("c:OptionSetType").text,
                Options: new SDK.MetaData._options(node.selectSingleNode("c:Options"))
            };
        }


    },
    _attributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing AttributeMetadata 
        ///</summary>
        return {
            AttributeOf: node.selectSingleNode("c:AttributeOf").text,
            AttributeType: node.selectSingleNode("c:AttributeType").text,
            CanBeSecuredForCreate: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:CanBeSecuredForCreate")),
            CanBeSecuredForRead: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:CanBeSecuredForRead")),
            CanBeSecuredForUpdate: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:CanBeSecuredForUpdate")),
            CanModifyAdditionalSettings: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:CanModifyAdditionalSettings")),
            ColumnNumber: SDK.MetaData._nullableInt(node.selectSingleNode("c:ColumnNumber")),
            DeprecatedVersion: node.selectSingleNode("c:DeprecatedVersion").text,
            Description: new SDK.MetaData._label(node.selectSingleNode("c:Description")),
            DisplayName: new SDK.MetaData._label(node.selectSingleNode("c:DisplayName")),
            EntityLogicalName: node.selectSingleNode("c:EntityLogicalName").text,
            ExtensionData: null, //No node for ExtensionData
            IsAuditEnabled: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsAuditEnabled")),
            IsCustomAttribute: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsCustomAttribute")),
            IsCustomizable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsCustomizable")),
            IsManaged: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsManaged")),
            IsPrimaryId: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsPrimaryId")),
            IsPrimaryName: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsPrimaryName")),
            IsRenameable: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsRenameable")),
            IsSecured: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsSecured")),
            IsValidForAdvancedFind: new SDK.MetaData._booleanManagedProperty(node.selectSingleNode("c:IsValidForAdvancedFind")),
            IsValidForCreate: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsValidForCreate")),
            IsValidForRead: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsValidForRead")),
            IsValidForUpdate: SDK.MetaData._nullableBoolean(node.selectSingleNode("c:IsValidForUpdate")),
            LinkedAttributeId: node.selectSingleNode("c:LinkedAttributeId").text,
            LogicalName: node.selectSingleNode("c:LogicalName").text,
            MetadataId: node.selectSingleNode("c:MetadataId").text,
            RequiredLevel: new SDK.MetaData._requiredLevelManagedProperty(node.selectSingleNode("c:RequiredLevel")),
            SchemaName: node.selectSingleNode("c:SchemaName").text,
            toString: function ()
            { return this.LogicalName; }
        };
    },
    _enumAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing EnumAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        //FIXED: DefaultFormValue was using _nullableBoolean. 
        attributeMetadata.DefaultFormValue = SDK.MetaData._nullableInt(node.selectSingleNode("c:DefaultFormValue")),
		attributeMetadata.OptionSet = new SDK.MetaData._optionSet(node.selectSingleNode("c:OptionSet"));

        return attributeMetadata;

    },
    _stateAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing StateAttributeMetadata 
        ///</summary>
        var enumAttributeMetadata = new SDK.MetaData._enumAttributeMetadata(node);

        return enumAttributeMetadata;
    },
    _stringAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing StringAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);

        attributeMetadata.Format = node.selectSingleNode("c:Format").text;
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text;
        attributeMetadata.MaxLength = parseInt(node.selectSingleNode("c:MaxLength").text, 10);
        attributeMetadata.YomiOf = node.selectSingleNode("c:YomiOf").text;

        return attributeMetadata;

    },
    _managedPropertyAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing ManagedPropertyAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.ManagedPropertyLogicalName = node.selectSingleNode("c:ManagedPropertyLogicalName").text;
        attributeMetadata.ParentAttributeName = node.selectSingleNode("c:ParentAttributeName").text;
        attributeMetadata.ParentComponentType = SDK.MetaData._nullableInt(node.selectSingleNode("c:ParentComponentType"));
        attributeMetadata.ValueAttributeTypeCode = node.selectSingleNode("c:ValueAttributeTypeCode").text;

        return attributeMetadata;

    },
    _bigIntAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing BigIntAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.MaxValue = node.selectSingleNode("c:MaxValue").text;
        attributeMetadata.MinValue = node.selectSingleNode("c:MaxValue").text;

        return attributeMetadata;

    },
    _booleanAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing BooleanAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.DefaultValue = SDK.MetaData._nullableBoolean(node.selectSingleNode("c:DefaultValue"));
        attributeMetadata.OptionSet = new SDK.MetaData._booleanOptionSet(node.selectSingleNode("c:OptionSet"));

        return attributeMetadata;
    },
    _dateTimeAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing DateTimeAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.Format = node.selectSingleNode("c:Format").text;
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text;


        return attributeMetadata;
    },
    _decimalAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing DecimalAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text;
        attributeMetadata.MaxValue = node.selectSingleNode("c:MaxValue").text;
        attributeMetadata.MinValue = node.selectSingleNode("c:MinValue").text;
        attributeMetadata.Precision = parseInt(node.selectSingleNode("c:Precision").text, 10);

        return attributeMetadata;
    },
    _doubleAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing DoubleAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text,
		attributeMetadata.MaxValue = node.selectSingleNode("c:MaxValue").text;
        attributeMetadata.MinValue = node.selectSingleNode("c:MinValue").text;
        attributeMetadata.Precision = parseInt(node.selectSingleNode("c:Precision").text, 10);

        return attributeMetadata;
    },
    _entityNameAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing EntityNameAttributeMetadata 
        ///</summary>
        var _enumAttributeMetadata = new SDK.MetaData._enumAttributeMetadata(node);

        return _enumAttributeMetadata;
    },
    _integerAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing IntegerAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.Format = node.selectSingleNode("c:Format").text;
        attributeMetadata.MaxValue = parseInt(node.selectSingleNode("c:MaxValue").text, 10);
        attributeMetadata.MinValue = parseInt(node.selectSingleNode("c:MinValue").text, 10);

        return attributeMetadata;
    },
    _picklistAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing PicklistAttributeMetadata 
        ///</summary>
        var enumAttributeMetadata = new SDK.MetaData._enumAttributeMetadata(node);

        return enumAttributeMetadata;
    },
    _statusAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing StatusAttributeMetadata 
        ///</summary>
        var enumAttributeMetadata = new SDK.MetaData._enumAttributeMetadata(node);


        return enumAttributeMetadata;
    },
    _memoAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing MemoAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.Format = node.selectSingleNode("c:Format").text;
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text;
        attributeMetadata.MaxLength = parseInt(node.selectSingleNode("c:MaxLength").text, 10);

        return attributeMetadata;
    },
    _moneyAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing MoneyAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        attributeMetadata.CalculationOf = node.selectSingleNode("c:CalculationOf").text;
        attributeMetadata.ImeMode = node.selectSingleNode("c:ImeMode").text;
        attributeMetadata.MaxValue = node.selectSingleNode("c:MaxValue").text;
        attributeMetadata.MinValue = node.selectSingleNode("c:MinValue").text;
        attributeMetadata.Precision = parseInt(node.selectSingleNode("c:Precision").text, 10);
        attributeMetadata.PrecisionSource = SDK.MetaData._nullableInt(node.selectSingleNode("c:PrecisionSource"));

        return attributeMetadata;
    },
    _lookupAttributeMetadata: function (node) {
        ///<summary>
        /// Private function that parses xml data describing LookupAttributeMetadata 
        ///</summary>
        var attributeMetadata = new SDK.MetaData._attributeMetadata(node);
        var targetsNode = node.selectSingleNode("c:Targets");
        var arrTargets = [];
        for (var i = 0; i < targetsNode.childNodes.length; i++) {
            arrTargets.push(targetsNode.childNodes[i].text);
        }
        attributeMetadata.Targets = arrTargets;

        return attributeMetadata;
    },
    _xmlEncode: function (strInput) {
        var c;
        var XmlEncode = '';

        if (strInput == null) {
            return null;
        }
        if (strInput == '') {
            return '';
        }

        for (var cnt = 0; cnt < strInput.length; cnt++) {
            c = strInput.charCodeAt(cnt);

            if (((c > 96) && (c < 123)) ||
			((c > 64) && (c < 91)) ||
			(c == 32) ||
			((c > 47) && (c < 58)) ||
			(c == 46) ||
			(c == 44) ||
			(c == 45) ||
			(c == 95)) {
                XmlEncode = XmlEncode + String.fromCharCode(c);
            }
            else {
                XmlEncode = XmlEncode + '&#' + c + ';';
            }
        }

        return XmlEncode;
    },
    _parameterCheck: function (parameter, type, errorMessage) {
        switch (type) {
            case "String":
                if (typeof parameter != "string") {
                    throw new Error(errorMessage);
                }
                break;
            case "Function":
                if (typeof parameter != "function") {
                    throw new Error(errorMessage);
                }
                break;
            case "EntityFilters":
                var found = false;
                for (x in this.EntityFilters) {
                    if (this.EntityFilters[x] == parameter) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(errorMessage);
                }
                break;
            case "Boolean":
                if (typeof parameter != "boolean") {
                    throw new Error(errorMessage);
                }
                break;
            case "GUID":
                var re = new RegExp("[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}");
                if (!(typeof parameter == "string" && re.test(parameter))) {
                    throw new Error(errorMessage);
                }

                break;
            default:
                throw new Error("An invalid type parameter value was passed to the SDK.MetaData._parameterCheck function.");
                break;
        }
    },
    __namespace: true
};
// </snippetSDK.MetaData.js>
