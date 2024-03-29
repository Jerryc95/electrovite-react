import React from 'react';

const FPPrivacy: React.FC = () => {
  return (
    <div className='policy-container'>
      <h2 className='policy-header'>Privacy Policy</h2>
      <h3 className='policy-header-two'>Effective Date: April 1st, 2024</h3>
      <p className='policy-sub-header'>
        This Privacy Policy ("Policy") outlines the data collection, usage, and
        protection practices for Flowplanr "App" operated by Flowplanr
        ("Company" or "We" or "Us"). By using the App, you agree to the terms
        and conditions of this Policy.
      </p>
      <ul className='policy-sections'>
        <li>
          <h3 className='policy-section-header'>
            1. Data Collection and Usage
          </h3>
          <p className='policy-section-details'>
            When you create an account on the App, we collect and store the
            following information:
          </p>
          <h4 className='policy-section-sub-header'>1.1 User Authentication and Verification</h4>
          <p className='policy-section-details'>
            We require your email and password to authenticate and verify your
            identity. For security purposes, passwords are hashed before being
            stored in our database. This information is used solely for the
            purpose of granting you access to the App's features and ensuring
            the security of your account.
          </p>
          <h4 className='policy-section-sub-header'>1.2 User Data</h4>
          <p className='policy-section-details'>
            User-Generated Content: Additionally, the App collects and stores
            user-generated content, including but not limited to projects,
            tasks, contact information, bookkeeping entries, and documents
            uploaded or stored within the App. This information is necessary for
            the functionality of the App and is stored securely on our servers.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>2. Data Sharing</h3>
          <h4 className='policy-section-sub-header'>2.1 Third-Party Disclosure</h4>
          <p className='policy-section-details'>
            We do not sell, trade, or transfer your personal data, including
            your email, password, or content, to third parties for any purpose,
            including advertising.
          </p>

          <h4 className='policy-section-sub-header'>2.2 Service Providers</h4>
          <p className='policy-section-details'>
            We may engage trusted third-party service providers who assist us in
            operating the App, improving its functionality, or providing
            customer support. These service providers have access to the data
            only to the extent necessary to perform their tasks on our behalf
            and are obligated to maintain the confidentiality and security of
            the information.
          </p>

          <h4 className='policy-section-sub-header'>2.3 Payment Processing</h4>
          <p className='policy-section-details'>
            Stripe is a third-party provider utilized by the App, which is used
            solely for payment processing purposes. When you make payments
            through the App, your payment information is securely handled by
            Stripe, and we do not store any payment-related data on our servers.
          </p>

          <h4 className='policy-section-sub-header'>2.4 Legal Requirements</h4>
          <p className='policy-section-details'>
            We may disclose your personal data if required by law or in response
            to valid requests from public authorities (e.g., court orders,
            government agencies) to comply with legal obligations, protect our
            rights or the safety of others, investigate fraud, or respond to a
            government request.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>3. Data Deletion</h3>
          <p className='policy-section-details'>
            If you choose to delete your account, we will permanently remove all
            associated data, including your email, password, username, and user
            ID. Please note that this process is irreversible, and you will not
            be able to recover your account or any related information after
            deletion.
          </p>
          <h4 className='policy-section-sub-header'>3.1 Data Retention Period</h4>
          <p className='policy-section-details'>
            In addition, please be aware that your data will be retained for a
            period of 30 days after account deletion. This retention period
            allows users to potentially change their minds and recover their
            account within this timeframe. However, after the 30-day retention
            period expires, all data will be permanently deleted from our
            servers without a way to retrieve it.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>4. Data Security</h3>
          <p className='policy-section-details'>
            We implement industry-standard security measures to protect your
            personal data from unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            electronic storage is 100% secure. While we strive to use
            commercially acceptable means to protect your information, we cannot
            guarantee absolute security.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>5. Children's Privacy</h3>
          <p className='policy-section-details'>
            The App is not intended for use by individuals under the age of 13.
            We do not knowingly collect personal information from children under
            13 years of age. If you believe that we have inadvertently collected
            information from a child under 13, please contact us immediately,
            and we will take steps to delete such information.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>
            6. Changes to this Privacy Policy
          </h3>
          <p className='policy-section-details'>
            We reserve the right to update or modify this Policy at any time.
            Any changes will be effective immediately upon posting the revised
            Policy on the App. It is your responsibility to review this Policy
            periodically for any updates or modifications. Your continued use of
            the App after the posting of changes constitutes your acceptance of
            such changes.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>7. Contact Us</h3>
          <p className='policy-section-details'>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at support@flowplanr.com.
          </p>
          <p className='policy-section-details'>
            By using the App, you acknowledge that you have read and understood
            this Privacy Policy and agree to be bound by its terms and
            conditions.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default FPPrivacy;
