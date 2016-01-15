
$(document).ready(function () {
    document.getElementById('progressSpinner').style.display = 'none';
    GetSdkMessageProcessingStep("PostOpportunityCreate").pipe(function (data) {
        if (data.d[0] === undefined || data.d[0] === null) {
            return $.Deferred().reject("The step: " + stepName + " could not be found.");
        }
        var configSetting = data.d[0].configuration;
        var $doc = $.parseXML(configSetting);
        var APIKey = $($doc).find('settings').attr('APIKey');
        var APISecret = $($doc).find('settings').attr('APISecret');
        var Threshold = $($doc).find('settings').attr('Threshold');
        var EnableSMS = $($doc).find('settings').attr('EnableNexmoSMS');
        console.log(EnableSMS);
        if (EnableSMS == "false") {
            document.getElementById("EnableSMS").checked = false;
        }
        else {
            document.getElementById("EnableSMS").checked = true;
        }

        $("#NKey").val(APIKey);
        $("#NSecret").val(APISecret);
        $("#NThreshold").val(Threshold);

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"

        });

        $("#ConfigForm").validate({
            rules: {
                NThreshold: {
                    required: true,
                    digits: true
                },
                NKey:
                    {
                        required: true,
                    },
                NSecret:
                 {
                     required: true,
                 },
            },
            messages: {
                "NKey": {
                    required: "Please enter the Nexmo Key"
                },  
                "NSecret": {
                    required: "Please enter the Nexmo Secret"
                },
                "NThreshold": {
                    required: "Please enter the Threshold value",
                    digits: "Please enter a valid Threshold"
                    
                }
            },
            submitHandler: function () { SaveSettings(); }

        });



        document.getElementById('progressSpinner').style.display = 'none';
    });

});








function SaveSettings() {

    var $progressSpinner = $('#progressSpinner');

    // Add a center function for progress spinner
    //$.fn.center = function (zIndex) {
    //    this.css("position", "absolute");
    //    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    //    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    //    this.css("z-index", zIndex);
    //    return this;
    //}

    $progressSpinner.find("p").text('Saving Configurations...');
    document.getElementById('progressSpinner').style.display = 'block';

    var config = "<settings APIKey='" + $("#NKey").val() + "' APISecret='" + $("#NSecret").val();
    config += "' Threshold='" + $("#NThreshold").val();
    config += "' EnableNexmoSMS='" + $("#EnableSMS").is(':checked');
    config += "' />"

    UpdatePluginStep("PostOpportunityCreate", config);
    UpdatePluginStep("PostOpportunityUpdate", config);



}

function GetSdkMessageProcessingStep(stepName) {
    var fetchxml = "";
    fetchxml = "<fetch distinct='false' mapping='logical'>";
    fetchxml += "<entity name='sdkmessageprocessingstep'>";
    fetchxml += "<attribute name='name' />";
    fetchxml += "<attribute name='sdkmessageprocessingstepid' />";
    fetchxml += "<attribute name='configuration' />";
    fetchxml += "<filter type='and'>";
    fetchxml += "<condition attribute='name' operator='eq' value='" + stepName + "'></condition>";
    fetchxml += "</filter>";
    fetchxml += "</entity>";
    fetchxml += "</fetch>";

    return SDK.Soap.retrieveMultipleRequest(fetchxml);
}

function UpdatePluginStep(stepName, configuration) {
    /// <summary>
    /// Update the plugin step configuration.
    /// </summary>

    GetSdkMessageProcessingStep(stepName).pipe(function (data) {
        if (data.d[0] === undefined || data.d[0] === null) {
            return $.Deferred().reject("The step: " + stepName + " could not be found.");
        }

        var sdkStep = {
            configuration: {
                type: "string",
                value: "<![CDATA[" + configuration + "]]>"
            }
        };

        SDK.Soap.updateRequest('sdkmessageprocessingstep', data.d[0].sdkmessageprocessingstepid, sdkStep).done(function () { document.getElementById('progressSpinner').style.display = 'none'; })
    .fail(ErrorHandler).always(function () { document.getElementById('progressSpinner').style.display = 'none'; });

        return;
    });


}


function ErrorHandler(error) {
    if (error.message !== undefined && error.message !== null) {
        alert(error.message);
    } else if (error.responseText !== undefined && error.responseText !== null) {
        alert(error.responseText);
    } else {
        alert(error);
    }
    $progressSpinner.hide();
}





