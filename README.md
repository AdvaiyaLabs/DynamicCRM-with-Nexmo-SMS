#Dynamic CRM With Nexmo SMS

<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image1.png" width=200>


##Introduction

Dynamic CRM with Nexmo SMS solution for Microsoft Dynamic CRM integrates Nexmo SMS APIs with the platform and allows users to enable SMS functionality in the platform. The app will send a predefined SMS whenever a new opportunity is created, updated or a lead qualifies into an opportunity on the CRM platform. User can define the threshold for the budget amount and an SMS will be sent in case the opportunity’s budget amount is more than the threshold value.

##Use Case

1.  Sales Executive adds a new opportunity or qualifies a lead into an opportunity, and adds the expected budget amount to that opportunity, the app will send an SMS to the respective Sales Manager if the opportunity budget value is above the threshold amount.

	SMS that will be sent to the Sales Manager: “**A new opportunity &lt;&lt;Title&gt;&gt; for &lt;&lt;Account&gt;&gt; with probable value &lt;Budget value&gt; has been added**.”

2.  Sales Executive updates the budget amount of any opportunity, the app will send an SMS to the respective Sales Manager if the opportunity budget value is above the threshold amount.

	SMS that will be sent to the Sales Manager: “**An opportunity &lt;&lt;Title&gt;&gt; for &lt;&lt;Account name&gt;&gt; has been updated with probable value &lt; Budget value&gt;**.”

##Prerequisite

-   Nexmo subscription and corresponding Nexmo API key and Secret key to consume Nexmo services. To access the Nexmo’s API keys, see appendix section

-   On Microsoft Dynamic CRM, phone number should be in international format.

-   Each salesperson should have an assigned manager.

-   Each assigned manager should have a mobile number updated in the CRM System.

##Features

-   Send SMS to the respective manager when the opportunity’s budget amount is more than the threshold value.

-   The app allows to enable and disable SMS functionality.

-   SMS will be delivered when user updates any existing CRM Opportunity.

-   No SMS will be delivered if the respective manager doesn’t have a mobile number updated in the CRM System.

-   Opportunity creation process will not be impacted in case SMS sending fails.

##Steps to install Dynamic CRM with Nexmo SMS App

1.	Visit the target Git repository using the [ URL ] (https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Package/DynamicCRMwithNexmoSMS_1_0_0_0_managed.zip).

2.  Click on **Raw** as shown, app's zip file will get downloaded.

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image-raw.png" width="300">

1.  Login to Dynamic CRM Online

2.  Dynamic CRM dashboard will appear as below:

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image4.png" width=600>

3.  On the dashboard, click on menu <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image5.png" width=600> icon. Select ***Settings &gt; Solutions*** for package installation as shown in the image below:

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image6.png" width=600>

4.  On ***All Solutions*** screen, click on **Import** button to import solution package.

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image7.png" width=600>

5.  On **Import Solution** wizard, click on the **Choose file** button to choose the file to be uploaded.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image8.png" width=600>

6.  Select ZIP file “**DynamicCRMwithNexmoSMS\_1\_0\_0\_0\_managed.zip**” stored on local system and click on **Open** button.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image9.png" width=600>

7.  The selected zip file will be added in the wizard, click on **Next**.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image10.png" width=600>

8.  Review the Solution information and click on **Next** button

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image11.png" width=600>

9.  Click on **Import** button, file uploading process starts.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image12.png" width=600>

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image13.png" width=600>

10.  Click on **Close** button after successful installation of the solution .

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image14.png" width=600>

11.  The installed package will be added in **All solutions**.

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image15.png" width=600>

12.  Click on the **Package name**, it will open configuration form for Nexmo setting.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image16.png" width=600>

13.  Provide the following details:

    1.  Nexmo Key

    2.  Nexmo Secret

    3.  Threshold Amount

14.  Check Enable SMS checkbox to allow the app to send SMS and click on **Save.**

15.  Click on the **Close** button from the top.

16.  On **All Solutions** screen, select **DynamicCRMwithNexmoSMS** solution and click on **Publish All Customizations** button.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image17.png" width=600><span id="_Toc440550378" class="anchor"></span>

##Steps to use the Dynamic CRM with Nexmo SMS 

1.  Click on the <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image5.png" width=600> icon, select **Sales** tab and click on **Opportunities** to create an opportunity.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image18.png" width=600>

2.  Click on the **New** button to add a new opportunity.

    <img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image19.png" width=600>

3.  Fill the opportunity details with at least these mandatory fields (Topic, Account and Budget) and click on **Save and Close** button.

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image20.png" width=600>

4.  New opportunity is created and the SMS is delivered to the manager if the budget value is greater than the defined threshold value.

5.  Manager will receive an SMS as per the following format:

    “**A new opportunity &lt;&lt;*Title*&gt;&gt; for &lt;&lt;*Account*&gt;&gt; with probable value &lt;&lt;*Budget value*&gt; has been added**.”

##Appendix

Nexmo API Keys
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-   To access Nexmo keys, go to <https://www.nexmo.com/> and Sign-in

-   On the top right corner, click on the “**Api Settings**”

-   Key and Secret will display in the top bar as shown in the below image:

	<img src="https://github.com/AdvaiyaLabs/DynamicCRM-with-Nexmo-SMS/blob/master/Docs/image21.png" width=600>
