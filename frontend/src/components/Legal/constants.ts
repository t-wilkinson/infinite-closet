// TODO: text should probably be a list of strings

const policies = {
  label: 'Privacy & Cookie Policy',
  updated: '5/17/21',
  data: [
    {
      header: 'Introduction',
      text: `
Infinite Closet Limited (“we” or “us” or “our” or “the business” or “Infinite Closet”) respects the privacy of our users “user” or “you”). This Privacy & Cookie Policy (“policy”) explains how we collect, use disclose and safeguard your information when you visit our website https://InfiniteCloset.co.uk, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”).

Please read this policy carefully. If you do not agree with the terms of this policy, please do not access the Site.
`,
      data: [
        {
          header: 'Changes to this policy',
          text: `
We reserve the right to make changes to this policy at any time and for any reason. We will alert you about any changes by updating the “Last Updated” date of this policy. Any changes or modifications will be effective immediately upon posting the updated policy on the Site, and you waive the right to receive specific notice of each such change or modification.

You are encouraged to periodically review this policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised policy by your continued use of the Site after the date such revised policy is posted.
`,
        },
        {
          header: 'What information we collect',
          text: `
We may collect information about you in a variety of ways. The information we may collect on the Site includes:
`,
        },
        {
          header: 'Personal Data',
          text: `
Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, address, and interests, that you voluntarily give to us when you make an account with the Site, or when you choose to participate in various activities related to the Site, such as online chat, forms, surveys and placing an order. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Site.
`,
        },

        {
          header: 'Derivative Data',
          text: `
The information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
`,
        },

        {
          header: 'Financial Data',
          text: `
Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processors, Stripe, Paypal, Apple Pay, and Shopify, and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
`,
        },

        {
          header: 'Mobile Device Data',
          text: `
Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.
`,
        },

        {
          header: 'Data From Competitions, Giveaways, and Surveys',
          text: `
Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.
`,
        },

        {
          header: 'Use of your information',
          text: `
Having accurate information about you permits us to provide you with a smooth, efficient, and customised experience. Specifically, we may use information collected about you via the Site to:

  ·    Administer promotions and competitions;
  ·    Assist law enforcement;
  ·    Compile statistical data and analysis for use internally or with third parties;
  ·    Create and manage your account;
  ·    Deliver targeted advertising, discount codes, newsletters, and other information regarding promotions and the Site to you;
  ·    Email you regarding your account or order;
  ·    Fulfil and manage purchases, orders, payments, and other transactions related to the Site;
  ·    Generate a personal profile about you to make future visits to the Site more personalised;
  ·    Increase the efficiency and operation of the Site;
  ·    Monitor and analyse usage and trends to improve your experience with the Site;
  ·    Notify you of updates to the Sites;
  ·    Offer new products, services, and/or recommendations to you;
  ·    Perform other business activities as needed;
  ·    Prevent fraudulent transactions, monitor against theft, and protect against criminal activity;
  ·    Process payments, exchanges, and refunds;
  ·    Request feedback and contact you about your use of the Site;
  ·    Resolve disputes and troubleshoot problems;
  ·    Respond to product and customer service requests;
  ·    To post a review with your consent
  ·    Send you an e-letter; and
  ·    Solicit support for the Site
`,
        },

        {
          header: 'Disclosure of your information',
          text: `
We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
`,
        },

        {
          header: 'By Law or to Protect Rights',
          text: `
If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.
`,
        },

        {
          header: 'Third-Party Service Providers',
          text: `
We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
`,
        },

        {
          header: 'Marketing Communications',
          text: `
With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by the General Data Protection Regulations (GDPR).
`,
        },

        {
          header: 'Online Postings',
          text: `
When you post comments, contributions, reviews or other content to the Site, your posts may be viewed by all users and may be publicly distributed outside the Site in perpetuity.
`,
        },

        {
          header: 'Third-Party Advertisers',
          text: `
We may use third-party advertising companies to serve ads when you visit the Site. These companies may use information about your visits to the Site and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.
`,
        },

        {
          header: 'Affiliates',
          text: `
We may share your information with our affiliates, in which case we will require those affiliates to honour this policy. Affiliates include any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.
`,
        },

        {
          header: 'Business Partners',
          text: `
We may share your information with our business partners to offer you certain products, services or promotions.
`,
        },

        {
          header: 'Other Third Parties',
          text: `
We may share your information with advertisers and investors for the purpose of conducting general business analysis.
`,
        },
      ],
    },
    {
      header: 'Tracking Technologies',
      text: '',
      data: [
        {
          header: 'Cookies and Web Beacons',
          text: `
We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site. You may not decline web beacons. However, they can be rendered ineffective by declining all cookies or by modifying your web browser’s settings to notify you each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.

Cookies can be “persistent” or “session” cookies. Persistent cookies remain on your personal computer, mobile or tablet device when you go offline, whilst session cookies are deleted as soon as you close your web browser. We use both session and persistent Cookies for the purposes set out below:

  ·    Necessary / essential cookies are essential to provide you with services available through the Site and to enable you to use some of its features and services. They help authenticate users and prevent fraudulent use of user accounts.
  ·    Targeting cookies record your visit to the Site, the pages you have visited and the links you have followed.
  ·    Functionality cookies allow us to remember choices you make when you see the Site, such as remembering your login details or language preference.
  ·    Analytical / performance cookies allow us to recognise and count the number of visitors and see how you move around the Site.
`,
        },

        {
          header: 'Internet-Based Advertising',
          text: `
Additionally, we may use third-party software to implement email marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimise your online experience with us.
`,
        },

        {
          header: 'Website Analytics',
          text: `
We may also partner with selected third-party vendors Cloudflare and Google Analytics to allow tracking technologies and remarketing services on the Site through the use of first party cookies and third-party cookies, to, among other things, analyse and track users’ use of the Site, determine the popularity of certain content and better understand online activity. By accessing the Site, you consent to the collection and use of your information by these third-party vendors. You are encouraged to review their privacy policy and contact them directly for responses to your questions. We do not transfer personal information to these third-party vendors. However, if you do not want any information to be collected and used by tracking technologies, you can visit the third-party vendor.

You should be aware that getting a new computer, mobile device or tablet device, installing a new browser, upgrading an existing browser, or erasing or otherwise altering your browser’s cookies files may also clear certain opt-out cookies, plug-ins, or settings.
`,
        },

        {
          header: 'Third-party websites',
          text: `
The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties, including other sites, services or applications that may be linked to or from the Site.
`,
        },

        {
          header: 'Security of your information',
          text: `
We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorised parties. Therefore, we cannot guarantee complete security if you provide personal information.
`,
        },

        {
          header: 'Policy for children’s information',
          text: `
We do not knowingly collect or solicit information from children under the age of 18. By using the Site, you represent that you are at least 18 years of age. If you become aware of any data we have collected from someone under the age of 18, please contact us by emailing info@InfiniteCloset.co.uk.
`,
        },

        {
          header: 'Options regarding your account information',
          text: `
You may at any time review or change the information in your account or terminate your account by:

  ·    Logging into your account settings and updating your account
  ·    Contacting us by emailing info@InfiniteCloset.co.uk

Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
`,
        },
      ],
    },
    {
      header: 'Emails and Communications',
      text: `
If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:

  ·    Noting your preferences at the time you register your account with the Site
  ·    Logging into your account settings and updating your preferences
  ·    Contacting us by emailing info@InfiniteCloset.co.uk

If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.
`,
      data: [
        {
          header: 'Your data protection rights',
          text: `
Under data protection law, you have rights including:

  ·    Your right of access - You have the right to ask us for copies of your personal information;
  ·    Your right to rectification - You have the right to ask us to rectify personal information you think is inaccurate. You also have the right to ask us to complete information you think is incomplete;
  ·    Your right to erasure - You have the right to ask us to erase your personal information in certain circumstances;
  ·    Your right to restriction of processing - You have the right to ask us to restrict the processing of your personal information in certain circumstances;
  ·    Your right to object to processing - You have the right to object to the processing of your personal information in certain circumstances; and
  ·    Your right to data portability - You have the right to ask that we transfer the personal information you gave us to another organisation, or to you, in certain circumstances.

You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please write to info@InfiniteCloset.co.uk.
If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
`,
        },
      ],
    },
    {
      header: 'How to complain',
      text: `
If you have any concerns about our use of your personal information, you can make a complaint to us at info@InfiniteCloset.co.uk
`,
      data: [],
    },
  ],
} as const

const terms = {
  label: 'Terms & Conditions',
  updated: '5/17/21',
  data: [
    {
      header: ``,
      text: ``,
      data: [
        {
          header: ``,
          text: `
These terms and conditions (the "Terms and Conditions") govern the use of www.InfiniteCloset.co.uk (the "Site"). This Site is owned and operated by Infinite Closet LTD. This Site is an ecommerce website.

By using this Site, you indicate that you have read and understand these Terms and Conditions and agree to abide by them at all times.

THESE TERMS AND CONDITIONS CONTAIN A DISPUTE RESOLUTION CLAUSE THAT IMPACTS YOUR RIGHTS ABOUT HOW TO RESOLVE DISPUTES. PLEASE READ IT CAREFULLY.
`,
        },
        {
          header: 'Intellectual Property',
          text: `
All content published and made available on our Site is the property of Infinite Closet LTD and the Site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our Site.
  `,
        },
        {
          header: 'User Contributions',
          text: `
Users may post the following information on our Site:

Photos;

Videos; and

Public comments.

By posting publicly on our Site, you agree not to act illegally or violate these Terms and Conditions.
`,
        },
        {
          header: 'Accounts',
          text: `
When you create an account on our Site, you agree to the following:

You are solely responsible for your account and the security and privacy of your account, including passwords or sensitive information attached to that account; and

All personal information you provide to us through your account is up to date, accurate, and truthful and that you will update your personal information if it changes.

We reserve the right to suspend or terminate your account if you are using our Site illegally or if you violate these Terms and Conditions.
  `,
        },
        {
          header: 'Sale of Goods',
          text: `
These Terms and Conditions govern the sale of goods available on our Site. The following goods are available on our Site:
Clothing; and

Accessories.

We are under a legal duty to supply goods that match the description of the good(s) you order on our Site.

These Terms and Conditions apply to all the goods that are displayed on our Site at the time you access it. This includes all products listed as being out of stock. All information, descriptions, or images that we provide about our goods are as accurate as possible. However, we are not legally bound by such information, descriptions, or images as we cannot guarantee the accuracy of all goods we provide. You agree to purchase goods from our Site at your own risk.

We reserve the right to modify, reject or cancel your order whenever it becomes necessary. If we cancel your order and have already processed your payment, we will give you a refund equal to the amount you paid. You agree that it is your responsibility to monitor your payment instrument to verify receipt of any refund.
`,
        },
        {
          header: 'User Goods and Services',
          text: `
Our Site allows users to sell goods and services. We do not assume any responsibility for the goods and services users sell on our Site. We cannot guarantee the quality or accuracy of any goods and services sold by users on our Site. However, if we are made aware that a user is violating these Terms and Conditions, we reserve the right to suspend or prohibit the user from selling goods and services on our Site.
    `,
        },
        {
          header: 'Subscriptions',
          text: `
Your subscription automatically renews and you will be automatically billed until we receive notification that you want to cancel the subscription.

To cancel your subscription, please follow these steps: No commitments. Pause or cancel anytime.
`,
        },
        {
          header: 'Payments',
          text: `
We accept the following payment methods on our Site:

Credit Card;

Debit; and

Direct Debit.

When you provide us with your payment information, you authorise our use of and access to the payment instrument you have chosen to use. By providing us with your payment information, you authorise us to charge the amount due to this payment instrument.

If we believe your payment has violated any law or these Terms and Conditions, we reserve the right to cancel or reverse your transaction.
`,
        },
        {
          header: 'Shipping and Delivery',
          text: `
When you purchase goods from our Site, the goods will be delivered through one of the following methods:

Standard delivery by post. 2-day delivery standard for free.; or

Next day delivery for orders placed before 12pm (noon). For an additional £9.95.

Delivery will take place as soon as reasonably possible, depending on the delivery method selected. Delivery times may vary due to unforseen circumstances. Please note that delivery times do not include weekends and bank holidays.

You will be required to pay delivery charges in addition to the price for the goods you purchase.

You are required to provide us with a complete and accurate delivery address, including the name of the recipient. We are not liable for the delivery of your goods to the wrong address or wrong person as a result of you providing us with inaccurate or incomplete information.
  `,
        },
        {
          header: 'Right to Cancel and Receive Reimbursement',
          text: `
If you are a customer living in the United Kingdom or the Eurpoean Union you have the right to cancel your contract to purchase goods from us within 14 days without giving notice. The cancellation period:

Will end 14 days from when you receive, or someone you nominate receives, the goods when you purchased good(s) in one order that are all delivered together;

Will end 14 days from when you receive, or someone you nominate receives, the last good when you purchased goods in one order that are delivered separately; or

Will end 14 days from when you receive, or someone you nominate receives, the first good when you purchased goods that will be regularly delivered during a defined period of time.

To exercise your right to cancel you must inform us of your decision to cancel within the cancellation period. To cancel, contact us by email at info@InfiniteCloset.co.uk or by post at 71-75 Shelton Street, London, WC2H 9JQ. You may use a copy of the Cancellation Form, found at the end of these Terms and Conditions, but you are not required to do so.

The right to cancel does not apply to:

Goods or services, other than the supply of water, gas, electricity, or district heating, where the price depends upon fluctuations in the financial market that we cannot control and that may occur during the cancellation period;

Custom or personalised goods;

Goods that will deteriorate or expire rapidly;

Alcoholic beverages where the price has been agreed upon at the time of purchase, delivery of them can only take place after 30 days, and their value is dependent on fluctuations in the market that we cannot control; and
Newspapers, magazines, or periodicals, except for subscriptions to such publications. Effects of Cancellation
If you cancel your contract with us and goods have already been sent to you, then you must return the goods to us as soon as possible after informing us of your decision to cancel. You will be responsible for the cost of returning the goods. We will not be responsible for any damage or loss to the goods that occurs before they are returned to us, including while the goods are in transit.

If you cancel your contract with us, we will reimburse to you all payments we received from you

under the contract, including the costs of delivery, except for any supplementary delivery charges resulting from your choice of a delivery type other than the least expensive type of standard delivery that we offer. Please note that we are permitted by law to reduce your reimbursement to reflect any reduction in the value of the goods that was caused by handling other than what is necessary to establish the nature, characteristics, and functioning of the goods.

We will provide the reimbursement without undue delay and no later than the earlier of 14 days after we receive back from you any goods supplied or 14 days after you provide proof that you have returned the goods. If no goods were supplied, then we will provide the reimbursement no later than 14 days after the day we were informed of your decision to cancel.

We will make the reimbursement using the same form of payment as you used for the initial purchase unless you have expressly agreed otherwise. You will not incur any fees because of the reimbursement.

This right to cancel and to reimbursement is not affected by any return or refund policy we may have.
  `,
        },
        {
          header: 'Refunds',
          text: `
Refunds for Goods

Refund requests must be made within 14 days after receipt of your goods.

We accept refund requests for goods sold on our Site for any of the following reasons:

Good is broken; or

Good does not match description. Refunds do not apply to the following goods:
Please note that if your order has already been dispatched, we will be unable to process a cancellation..
`,
        },
        {
          header: 'Returns',
          text:
            'Returns can be made by mail. To return a good by mail, follow the following procedure: Pack your goods and attach the return label that was included in your package.',
        },
        {
          header: 'Consumer Protection Law',
          text: `
Where the Sale of Goods Act 1979, the Consumer Rights Act 2015, or any other consumer protection legislation in your jurisdiction applies and cannot be excluded, these Terms and Conditions will not limit your legal rights and remedies under that legislation. These Terms and Conditions will be read subject to the mandatory provisions of that legislation. If there is a conflict between these Terms and Conditions and that legislation, the mandatory provisions of the legislation will apply.
    `,
        },
        {
          header: 'Limitation of Liability',
          text: `
Infinite Closet LTD and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the Site.
    `,
        },

        {
          header: 'Indemnity',
          text: `
Except where prohibited by law, by using this Site you indemnify and hold harmless Infinite Closet LTD and our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses, damages, liabilities and expenses including legal fees arising out of your use of our Site or your violation of these Terms and Conditions.
  `,
        },

        {
          header: 'Applicable Law',
          text: `
These Terms and Conditions are governed by the laws of the Country of England.
  `,
        },

        {
          header: 'Dispute Resolution',
          text: `
Subject to any exceptions specified in these Terms and Conditions, if you and Infinite Closet LTD are unable to resolve any dispute through informal discussion, then you and Infinite Closet LTD agree to submit the issue first before a non-binding mediator and to an arbitrator in the event that mediation fails. The decision of the arbitrator will be final and binding. Any mediator or arbitrator must be a neutral party acceptable to both you and Infinite Closet LTD. The costs of any mediation or arbitration will be shared equally between you and Infinite Closet LTD.

Notwithstanding any other provision in these Terms and Conditions, you and Infinite Closet LTD agree that you both retain the right to bring an action in small claims court and to bring an action for injunctive relief or intellectual property infringement.
    `,
        },

        {
          header: 'Severability',
          text: `
If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and Conditions. All other provisions will not be affected by the removal and the rest of these Terms and Conditions will still be considered valid.
    `,
        },

        {
          header: 'Changes',
          text: `
These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and to reflect any changes to the way we operate our Site and the way we expect users to behave on our Site. We will notify users by email of changes to these Terms and Conditions or post a notice on our Site.
  `,
        },

        {
          header: 'Contact Details',
          text: `
Please contact us if you have any questions or concerns. Our contact details are as follows:

+44 07470 709910
info@InfiniteCloset.co.uk
71-75 Shelton Street, London, WC2H 9JQ

You can also contact us through the feedback form available on our Site.

Effective Date:	day of	,          `,
        },
      ],
    },
  ],
} as const

export { policies, terms }
