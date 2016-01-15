
if (typeof (SDK) == "undefined")
{ SDK = { __namespace: true }; }
//This will establish a more unique namespace for functions in this library. This will reduce the 
// potential for functions to be overwritten due to a duplicate name when the library is loaded.
SDK.Soap = {
    _getServerUrl: function () {
        ///<summary>
        /// Returns the URL for the Soap endpoint using the context information available in the form
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
     deleteRequest: function (Entity, Id) {
        ///<summary>
        /// Sends the delete request
        ///</summary>

        var dfd = $.Deferred();

        try {
            this._parameterCheck(Entity, "String", "The SDK.Soap.deleteRequest method Entity parameter must be a string value.");
            Entity = Entity.toLowerCase();
            ///<param name="Entity" Type="String">
            /// The Logical name of the user-owned entity. For example, 'account'.
            ///</param>
            this._parameterCheck(Id, "GUID", "The SDK.Soap.deleteRequest method Id parameter must be a string Representing a GUID value.");
            ///<param name="Id" Type="Guid">
            /// The GUID representing the id of the entity to be deleted.
            ///</param>

            //The request is simply the soap envelope captured by the SoapLogger with variables added for the 
            // values passed. All quotations must be escaped to create valid JScript strings.
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>"
            request += " <Delete xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<entityName>" + this._xmlEncode(Entity) + "</entityName>";
            request += "<id>" + this._xmlEncode(Id) + "</id>";
            request += "</Delete>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", SDK.Soap._getServerUrl(), true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Delete");

            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        dfd.resolve();
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();
        }
    },
    retrieveMultipleRequest: function (FetchXml) {
        var dfd = $.Deferred();

        try {
            ///<param name="FetchXml" Type="String">
            ///</param>
            this._parameterCheck(FetchXml, "String", "The SDK.Soap.retrieveMultipleRequest method FetchXml parameter must be a string value.");

            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>";
            request += '<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services">' +
                '<request i:type="b:RetrieveMultipleRequest" ' +
                ' xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" ' +
                ' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
                '<b:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' +
                '<b:KeyValuePairOfstringanyType>' +
                '<c:key>Query</c:key>' +
                '<c:value i:type="b:FetchExpression">' +
                '<b:Query>';

            request += this._xmlEncode(FetchXml);

            request += '</b:Query>' +
                '</c:value>' +
                '</b:KeyValuePairOfstringanyType>' +
                '</b:Parameters>' +
                '<b:RequestId i:nil="true"/>' +
                '<b:RequestName>RetrieveMultiple</b:RequestName>' +
                '</request>' +
                '</Execute>';

            request += '</s:Body></s:Envelope>';

            var req = new XMLHttpRequest();

            var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
            var serverUrl = "";
            if (typeof GetGlobalContext == "function") {
                var context = GetGlobalContext();
                serverUrl = context.getClientUrl();
            }
            else {
                if (typeof Xrm.Page.context == "object") {
                    serverUrl = Xrm.Page.context.getServerUrl();
                }
                else { throw new Error("Unable to access the server URL"); }
            }
            if (serverUrl.match(/\/$/)) {
                serverUrl = serverUrl.substring(0, serverUrl.length - 1);
            }
            var serverUrlFull =  serverUrl + OrgServicePath;

            req.open("POST", serverUrlFull, true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.responseType = 'msxml-document';
            req.onreadystatechange = function () {
                if (this.readyState === 4)
                {
                    if (this.status === 200)
                    {

                        
                        var resultXml = this.responseXML;
                        var ua = window.navigator.userAgent;
                        var msie = ua.indexOf("MSIE ");

                        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
                            //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
                        
                            {
                            
                           
                            //run code for IE 
                            resultXml.setProperty('SelectionNamespaces', 'xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"');
                            var results = resultXml.selectSingleNode("//a:Entities").childNodes;
                            //var results = req.responseXML.selectSingleNode("//a:Entities").childNodes;
                            var data = {};
                            var cookie = resultXml.selectSingleNode("//a:PagingCookie");
                            if (cookie) data.pagingcookie = cookie.text;
                            var morerecords = resultXml.selectSingleNode("//a:MoreRecords");
                            if (morerecords) data.morerecords = morerecords.text;

                            var d = new Array();
                            for (var i = 0; i < results.length; i++) {
                                d.push(SDK.Soap._xmlToJSON(results[i].xml));
                            }
                            data.d = d;
                            dfd.resolve(data);

                        }
                        else
                        {
                            //JSON DATA
                           
                            var results;
                            if (this.responseXML.documentElement.getElementsByTagName("a:Entity")[0] != undefined) {
                                results = this.responseXML.documentElement.getElementsByTagName("a:Entity")[0].children[0];
                            }
                            if (this.responseXML.documentElement.getElementsByTagName("Entity")[0] != undefined) {
                                results = this.responseXML.documentElement.getElementsByTagName("Entity")[0].children[0];
                            }


                            //var results = this.responseXML.getElementsByTagName("Entity")[0].children[0];
                            var configurationKey = results.childNodes[2].children[0].childNodes[0].data;
                            var ConfigurationValue = results.childNodes[2].children[1].childNodes[0].data;
                            var sdkmessageprocessingstep = results.childNodes[1].children[1].childNodes[0].data;
                            var data = {};
                            var d = new Array();
                            d.push({ "configuration": ConfigurationValue, "sdkmessageprocessingstepid": sdkmessageprocessingstep });

                            data.d = d;
                            dfd.resolve(data);
                        }
                       
                            

                        
                        
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null; 
            return dfd.promise();
        }
    },
    retrieveRequest: function (Entity, Id) {
        ///<summary>
        /// Sends the retrieve Request
        ///</summary>

        var dfd = $.Deferred();

        try {
            this._parameterCheck(Id, "GUID", "The SDK.Soap.retrieveRequest method Id parameter must be a string Representing a GUID value.");
            ///<param name="Assignee" Type="String">
            /// The GUID representing the  System user that the record will be assigned to.
            ///</param>
            this._parameterCheck(Entity, "String", "The SDK.Soap.retrieveRequest method Type parameter must be a string value.");
            Entity = Entity.toLowerCase();
            ///<param name="Type" Type="String">
            /// The Logical name of the user-owned entity. For example, 'account'.
            ///</param>

            //The request is simply the soap envelope captured by the SoapLogger with variables added for the 
            // values passed. All quotations must be escaped to create valid JScript strings.
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>"
            request += " <Retrieve xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<entityName>" + this._xmlEncode(Entity) + "</entityName>";
            request += "<id>" + this._xmlEncode(Id) + "</id>";
            request += "<columnSet xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            request += "<a:AllColumns>true</a:AllColumns>";
            request += "<a:Columns xmlns:b=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" />";
            request += "</columnSet>";
            request += "</Retrieve>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", SDK.Soap._getServerUrl(), true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Retrieve");
            req.responseType = 'msxml-document';
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        // var sFetchResult = req.responseXML.selectSingleNode("//RetrieveResult").xml;

                        var resultXml = this.responseXML;
                        resultXml.setProperty('SelectionNamespaces', 'xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"');
                        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(resultXml.xml);
                        var sFetchResult = xmlDoc.selectSingleNode("//RetrieveResponse/RetrieveResult").xml
                       // var sFetchResult =  req.responseXML.firstChild.firstChild.firstChild.firstChild; 
                        dfd.resolve(SDK.Soap._xmlToJSON(sFetchResult));
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();
        }
    },
    updateRequest: function (Entity, Id, data) {
        ///<summary>
        /// Sends the update request
        ///</summary>

        var dfd = $.Deferred();

        try {
            this._parameterCheck(Entity, "String", "The SDK.Soap.updateRequest method Entity parameter must be a string value.");
            Entity = Entity.toLowerCase();
            ///<param name="Type" Type="String">
            /// The Logical name of the user-owned entity. For example, 'account'.
            ///</param>
            this._parameterCheck(Id, "GUID", "The SDK.Soap.updateRequest method Id parameter must be a string Representing a GUID value.");
            ///<param name="Assignee" Type="String">
            /// The GUID representing the  System user that the record will be assigned to.
            ///</param>

            //The request is simply the soap envelope captured by the SoapLogger with variables added for the 
            // values passed. All quotations must be escaped to create valid JScript strings.
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>"
            request += " <Update xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<entity xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            request += "<a:Attributes xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            for (var key in data) {
                request += "<a:KeyValuePairOfstringanyType>";
                request += "<b:key>" + this._xmlEncode(key) + "</b:key>";

                if (Entity === "webresource" && key === "content") {
                    // if this is webresource content we have to encode the string
                    request += "<b:value i:type=\"c:" + this._xmlEncode(data[key].type) + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + SDK.Soap._encode64(data[key].value.toString()) + "</b:value>";
                } else {
                    switch (data[key].type) {
                        case "OptionSetValue":
                            request += "<b:value i:type=\"a:" + this._xmlEncode(data[key].type) + "\">";
                            request += "<a:Value>" + this._xmlEncode(data[key].value) + "</a:Value>";
                            request += "</b:value>";
                            break;
                        case "EntityReference":
                            request += "<b:value i:type=\"a:" + this._xmlEncode(data[key].type) + "\">";
                            request += "<a:Id>" + this._xmlEncode(data[key].id) + "</a:Id>";
                            request += "<a:LogicalName>" + this._xmlEncode(data[key].logicalname) + "</a:LogicalName>";
                            request += "<a:Name i:nil=\"true\" />";
                            request += "</b:value>";
                            break;
                        case "string":
                            request += "<b:value i:type=\"c:" + this._xmlEncode(data[key].type) + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(data[key].value) + "</b:value>";
                            break;
                        default:
                            request += "<b:value i:type=\"c:" + this._xmlEncode(data[key].type) + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(data[key].value) + "</b:value>";
                            break;
                    }
                }

                request += "</a:KeyValuePairOfstringanyType>";
            }
            request += "</a:Attributes>";
            request += "<a:EntityState i:nil=\"true\" />";
            request += "<a:FormattedValues xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\" />";
            request += "<a:Id>" + this._xmlEncode(Id) + "</a:Id>";
            request += "<a:LogicalName>" + this._xmlEncode(Entity) + "</a:LogicalName>";
            request += "<a:RelatedEntities xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\" />";
            request += "</entity>";
            request += "</Update>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();

            var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
            var serverUrl = "";
            if (typeof GetGlobalContext == "function") {
                var context = GetGlobalContext();
                serverUrl = context.getClientUrl();
            }
            else {
                if (typeof Xrm.Page.context == "object") {
                    serverUrl = Xrm.Page.context.getServerUrl();
                }
                else { throw new Error("Unable to access the server URL"); }
            }
            if (serverUrl.match(/\/$/)) {
                serverUrl = serverUrl.substring(0, serverUrl.length - 1);
            }
            var serverUrlFull = serverUrl + OrgServicePath;

            req.open("POST", serverUrlFull, true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Update");
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        dfd.resolve();
                       
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();

        }
    },
    createRequest: function (Entity, data) {
        ///<summary>
        /// Sends the create request
        ///</summary>

        var dfd = $.Deferred();

        try {
            this._parameterCheck(Entity, "String", "The SDK.Soap.createRequest method Entity parameter must be a string value.");
            Entity = Entity.toLowerCase();
            ///<param name="Entity" Type="String">
            /// The Logical name of the user-owned entity. For example, 'account'.
            ///</param>

            //The request is simply the soap envelope captured by the SoapLogger with variables added for the 
            // values passed. All quotations must be escaped to create valid JScript strings.
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>"
            request += " <Create xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<entity xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            request += "<a:Attributes xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            for (var key in data) {
                request += "<a:KeyValuePairOfstringanyType>";
                request += "<b:key>" + key + "</b:key>";

                switch (data[key].type) {
                    case "OptionSetValue":
                        request += "<b:value i:type=\"a:" + this._xmlEncode(data[key].type) + "\">";
                        request += "<a:Value>" + this._xmlEncode(data[key].value) + "</a:Value>";
                        request += "</b:value>";
                        break;
                    case "EntityReference":
                        request += "<b:value i:type=\"a:" + this._xmlEncode(data[key].type) + "\">";
                        request += "<a:Id>" + this._xmlEncode(data[key].id) + "</a:Id>";
                        request += "<a:LogicalName>" + this._xmlEncode(data[key].logicalname) + "</a:LogicalName>";
                        request += "<a:Name i:nil=\"true\" />";
                        request += "</b:value>";
                        break;
                    case "string":
                        request += "<b:value i:type=\"c:" + this._xmlEncode(data[key].type) + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(data[key].value) + "</b:value>";
                        break;
                    default:
                        request += "<b:value i:type=\"c:" + this._xmlEncode(data[key].type) + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + this._xmlEncode(data[key].value) + "</b:value>";
                        break;
                }

                request += "</a:KeyValuePairOfstringanyType>";
            }
            request += "</a:Attributes>";
            request += "<a:EntityState i:nil=\"true\" />";
            request += "<a:FormattedValues xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\" />";
            request += "<a:Id>00000000-0000-0000-0000-000000000000</a:Id>";
            request += "<a:LogicalName>" + this._xmlEncode(Entity) + "</a:LogicalName>";
            request += "<a:RelatedEntities xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\" />";
            request += "</entity>";
            request += "</Create>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", SDK.Soap._getServerUrl(), true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Create");
            req.responseType = 'msxml-document';
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        dfd.resolve(req.responseXML.selectSingleNode("//CreateResult").text);
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();
        }
    },
    assignRequest: function (Assignee, Target, Type) {
        ///<summary>
        /// Sends the Assign Request
        ///</summary>

        var dfd = $.Deferred();

        try {
            this._parameterCheck(Assignee, "GUID", "The SDK.Soap.assignRequest method Assignee parameter must be a string Representing a GUID value.");
            ///<param name="Assignee" Type="String">
            /// The GUID representing the  System user that the record will be assigned to.
            ///</param>
            this._parameterCheck(Target, "GUID", "The SDK.Soap.assignRequest method Target parameter must be a string Representing a GUID value.");
            ///<param name="Target" Type="String">
            /// The GUID representing the user-owned entity record that will be assigne to the Assignee.
            ///</param>
            this._parameterCheck(Type, "String", "The SDK.Soap.assignRequest method Type parameter must be a string value.");
            Type = Type.toLowerCase();
            ///<param name="Type" Type="String">
            /// The Logical name of the user-owned entity. For example, 'account'.
            ///</param>

            //The request is simply the soap envelope captured by the SoapLogger with variables added for the 
            // values passed. All quotations must be escaped to create valid JScript strings.
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>";
            request += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\"";
            request += " xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<request i:type=\"b:AssignRequest\"";
            request += " xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"";
            request += " xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
            request += "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<c:key>Target</c:key>";
            request += "<c:value i:type=\"a:EntityReference\">";
            request += "<a:Id>" + this._xmlEncode(Target) + "</a:Id>";
            request += "<a:LogicalName>" + this._xmlEncode(Type) + "</a:LogicalName>";
            request += "<a:Name i:nil=\"true\" />";
            request += "</c:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<c:key>Assignee</c:key>";
            request += "<c:value i:type=\"a:EntityReference\">";
            request += "<a:Id>" + this._xmlEncode(Assignee) + "</a:Id>";
            request += "<a:LogicalName>systemuser</a:LogicalName>";
            request += "<a:Name i:nil=\"true\" />";
            request += "</c:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "</a:Parameters>";
            request += "<a:RequestId i:nil=\"true\" />";
            request += "<a:RequestName>Assign</a:RequestName>";
            request += "</request>";
            request += "</Execute>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", SDK.Soap._getServerUrl(), true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        dfd.resolve();
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            };

            req.send(request);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();
        }
    },
    publishWebResourceRequest: function (guidID) {
        var dfd = $.Deferred();

        try {
            var requestMain = "";
            requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            requestMain += "  <s:Body>";
            requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            requestMain += "      <request i:type=\"b:PublishXmlRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
            requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>ParameterXml</c:key>";
            requestMain += "            <c:value i:type=\"d:string\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">&lt;importexportxml&gt;&lt;webresources&gt;&lt;webresource&gt;" + guidID + "&lt;/webresource&gt;&lt;/webresources&gt;&lt;/importexportxml&gt;</c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "        </a:Parameters>";
            requestMain += "        <a:RequestId i:nil=\"true\" />";
            requestMain += "        <a:RequestName>PublishXml</a:RequestName>";
            requestMain += "      </request>";
            requestMain += "    </Execute>";
            requestMain += "  </s:Body>";
            requestMain += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", SDK.Soap._getServerUrl(), true)
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        dfd.resolve();
                    }
                    else {
                        dfd.reject(SDK.Soap._getError(this.responseXML));
                    }
                }
            }

            req.send(requestMain);
        }
        catch (err) {
            dfd.reject(err);
        }
        finally
        {
            req = null;
            request = null;
            return dfd.promise();
        }
    },

    _getError: function (faultXml) {
        ///<summary>
        /// Parses the WCF fault returned in the event of an error.
        ///</summary>
        ///<param name="faultXml" Type="XML">
        /// The responseXML property of the XMLHttpRequest response.
        ///</param>
        var errorMessage = "Unknown Error (Unable to parse the fault)";
        if (typeof faultXml == "object") {
            try {
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
            catch (e) { };
        }
        return new Error(errorMessage);
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

        if (strInput.substr(0,9) === '<![CDATA[') {
            return strInput;
        }

        strInput = '' + strInput; // convert to string first to encode

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
    _xmlDecode: function (strInput) {
        var c;
        var XmlDecode = '';

        if (strInput == null) {
            return null;
        }
        if (strInput == '') {
            return '';
        }

        strInput = '' + strInput; // convert to string first to encode

        for (var cnt = 0; cnt < strInput.length; cnt++) {
            if ((strInput[cnt] === '&') && (strInput[cnt + 1] === '#')) {
                cnt = cnt + 2;
                c = '';
                while (strInput[cnt] !== ';') {
                    c = c + strInput[cnt];
                    cnt++;
                }
                XmlDecode = XmlDecode + String.fromCharCode(c);
            } else {
                XmlDecode = XmlDecode + strInput[cnt];
            }
        }

        return XmlDecode;
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
    _xmlToJSON: function (xml) {

        var resultDoc = new ActiveXObject("Microsoft.XMLDOM");
        resultDoc.async = false;
        resultDoc.loadXML(xml);

        //parse result xml into array of jsDynamicEntity objects
        var result = {};

        for (var j = 0; j < resultDoc.documentElement.childNodes.length; j++) {
            var oResultNode = resultDoc.documentElement.childNodes[j];
            switch (oResultNode.baseName) {
                case "Attributes":
                    var attr = oResultNode.childNodes;

                    for (var k = 0; k < attr.length; k++) {
                        var current = attr[k];
                        // Establish the Key for the Attribute
                        var sKey = current.firstChild.text;
                        var sType = '';

                        // Determine the Type of Attribute value we should expect
                        for (var l = 0; l < current.childNodes[1].attributes.length; l++) {
                            if (current.childNodes[1].attributes[l].baseName == 'type') {
                                sType = current.childNodes[1].attributes[l].text;
                            }
                        }

                        switch (sType) {
                            case "a:OptionSetValue":
                                result[sKey] = { value: current.childNodes[1].text, type: sType }
                                break;
                            case "a:EntityReference":
                                result[sKey] = { id: current.childNodes[1].childNodes[0].text, logicalName: current.childNodes[1].childNodes[1].text, name: current.childNodes[1].childNodes[2].text, type: sType };
                                break;
                            case "a:AliasedValue":
                                result[sKey] = current.childNodes[1].selectSingleNode("//a:Value").text; // TODO Probably should call a get field val with this node to get value type out. This works for simple types
                                break;
                            default:
                                result[sKey] = current.childNodes[1].text;
                                break;
                        }

                    }

                    break;

                //                case "Id":                                            
                //                    jDE.guid = oResultNode.childNodes[j].text;                                            
                //                    break;                                            

                //                case "LogicalName":                                            
                //                    jDE.logicalName = oResultNode.childNodes[j].text;                                            
                //                    break;                                            

                case "FormattedValues":
                    var foVal = oResultNode;

                    for (var k = 0; k < foVal.childNodes.length; k++) {
                        // Establish the Key, we are going to fill in the formatted value of the already found attribute
                        var sKey = foVal.childNodes[k].firstChild.text;

                        result[sKey].formattedValue = foVal.childNodes[k].childNodes[1].text;


                    }
                    break;
            }

        }

        return result;

    },
    _parseWebResource: function (responseXML) {
        var parsedXML;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(responseXML);
        x = xmlDoc.getElementsByTagName("a:KeyValuePairOfstringanyType");
        for (i = 0; i < x.length; i++) {
            if (x[i].childNodes[0].text == "content") {
                //we decode the base 64 contents and alert the HTML of the Iframe
                parsedXML = SDK.Soap._decode64(x[i].childNodes[1].text);
            }
        }
        return parsedXML;
    },
    _encode64: function (input) {
        var keyStr = "ABCDEFGHIJKLMNOP" +
                   "QRSTUVWXYZabcdef" +
                   "ghijklmnopqrstuv" +
                   "wxyz0123456789+/" +
                   "=";

        //input = escape(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
               keyStr.charAt(enc1) +
               keyStr.charAt(enc2) +
               keyStr.charAt(enc3) +
               keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },
    _decode64: function (input) {
        var keyStr = "ABCDEFGHIJKLMNOP" +
                   "QRSTUVWXYZabcdef" +
                   "ghijklmnopqrstuv" +
                   "wxyz0123456789+/" +
                   "=";

        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                  "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                  "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return unescape(output);
    },

    __namespace: true
};



// Converts XML to JSON
// from: http://coursesweb.net/javascript/convert-xml-json-javascript_s2
function XMLtoJSON() {
    var me = this;      // stores the object instantce

    // gets the content of an xml file and returns it in 
    me.fromFile = function (xml, rstr) {
        // Cretes a instantce of XMLHttpRequest object
        var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        // sets and sends the request for calling "xml"
        xhttp.open("GET", xml, false);
        xhttp.send(null);

        // gets the JSON string
        var json_str = jsontoStr(setJsonObj(xhttp.responseXML));

        // sets and returns the JSON object, if "rstr" undefined (not passed), else, returns JSON string
        return (typeof (rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
    }

    // returns XML DOM from string with xml content
    me.fromStr = function (xml, rstr) {
        // for non IE browsers
        if (window.DOMParser) {
            var getxml = new DOMParser();
            var xmlDoc = getxml.parseFromString(xml, "text/xml");
        }
        else {
            // for Internet Explorer
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
        }

        // gets the JSON string
        var json_str = jsontoStr(setJsonObj(xmlDoc));

        // sets and returns the JSON object, if "rstr" undefined (not passed), else, returns JSON string
        return (typeof (rstr) == 'undefined') ? JSON.parse(json_str) : json_str;
    }

    // receives XML DOM object, returns converted JSON object
    var setJsonObj = function (xml) {
        var js_obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                js_obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    js_obj["@attributes"][attribute.nodeName] = attribute.value;
                }
            }
        } else if (xml.nodeType == 3) {
            js_obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (js_obj[nodeName]) == "undefined") {
                    js_obj[nodeName] = setJsonObj(item);
                } else {
                    if (typeof (js_obj[nodeName].push) == "undefined") {
                        var old = js_obj[nodeName];
                        js_obj[nodeName] = [];
                        js_obj[nodeName].push(old);
                    }
                    js_obj[nodeName].push(setJsonObj(item));
                }
            }
        }
        return js_obj;
    }

    // converts JSON object to string (human readablle).
    // Removes '\t\r\n', rows with multiples '""', multiple empty rows, '  "",', and "  ",; replace empty [] with ""
    var jsontoStr = function (js_obj) {
        var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
        return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
    }
};
