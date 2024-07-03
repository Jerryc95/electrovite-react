import React from 'react';

import '../../styles/policies.scss';

const FpEULA: React.FC = () => {
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };
  return (
    <div className='policy-container'>
      <h2 className='policy-header'>End-User License Agreement (EULA)</h2>
      <p className='policy-sub-header'>
        This End-User License Agreement ("Agreement") is a legal agreement
        between you ("User") and Flowplanr ("Company") governing the use of the
        application ("App"). By accessing or using the App, you agree to be
        bound by the terms and conditions of this Agreement.
      </p>
      <ul className='policy-sections'>
        <li>
          <h3 className='policy-section-header'>1. Grant of License:</h3>
          <p className='policy-section-details'>
            Subject to the terms and conditions of this Agreement, Company
            grants User a non-exclusive, non-transferable license to use the App
            solely for personal, non-commercial purposes. User shall not sell,
            transmit, host, or commercially exploit the service, copy or modify
            the App, or reverse compile or engineer it.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>2. Restrictions:</h3>
          <p className='policy-section-details'>
            You may not:
            <ol>
              <li>Reverse engineer, decompile, or disassemble the software.</li>
              <li>
                Modify, adapt, or create derivative works from the software.
              </li>
              <li>
                Remove any copyright or proprietary notices from the software.
              </li>
              <li>Transfer the software to another person or entity.</li>
            </ol>
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>3. Payment Processing</h3>
          <p className='policy-section-details'>
            Flowplanr utilizes Stripe as its payment processor. By using
            Flowplanr, you agree to be bound by Stripe's{' '}
            <span onClick={() => handleOpenLink('https://stripe.com/legal')}>
              Terms of Service
            </span>{' '}
            and{' '}
            <span onClick={() => handleOpenLink('https://stripe.com/privacy')}>
              Privacy Policy
            </span>
            . Your payment information, such as credit card details, is securely
            handled by Stripe. Flowplanr does not store or directly process any
            payment information.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>4. Regular Updates:</h3>
          <p className='policy-section-details'>
            Company may release regular updates to improve the functionality,
            features, and security of the App. User acknowledges and agrees that
            these updates may be necessary for optimal use of the App and agrees
            to promptly install and use the latest version provided by Company.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>
            5. Feedback and Suggestions:
          </h3>
          <p className='policy-section-details'>
            User acknowledges that any feedback or suggestions provided to
            Company regarding the App may be used by Company without any
            obligation to compensate User. Company shall have the right to
            incorporate such feedback or suggestions into its products or
            services without any restrictions.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>6. Intellectual Property:</h3>
          <p className='policy-section-details'>
            Flowplanr retains all rights, title, and interest in and to the
            software, including all intellectual property rights. This Agreement
            does not grant you any rights to patents, copyrights, trade secrets,
            or trademarks owned by Flowplanr.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>7. Use of Data:</h3>
          <p className='policy-section-details'>
            User acknowledges and agrees that Company may collect and use data
            for the purpose of user authentication and providing in-app content.
            Company shall handle User's data in accordance with its Privacy
            Policy, which is incorporated by reference into this Agreement.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>8. Limitation of Liability:</h3>
          <p className='policy-section-details'>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            COMPANY OR ITS EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
            ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE APP.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>9. Disclaimer of Warranty:</h3>
          <p className='policy-section-details'>
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF
            ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, COMPANY
            DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, AND NON-INFRINGEMENT. COMPANY DOES NOT WARRANT THAT THE APP
            WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF HARMFUL COMPONENTS.
            COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE ACCURACY,
            COMPLETENESS, OR RELIABILITY OF ANY CONTENT, INFORMATION, OR
            MATERIALS PROVIDED THROUGH THE APP. USER ACKNOWLEDGES AND AGREES
            THAT ANY USE OF THE APP IS AT THEIR SOLE RISK, AND THEY WILL BE
            SOLELY RESPONSIBLE FOR ANY DAMAGE TO THEIR DEVICE OR LOSS OF DATA
            THAT RESULTS FROM THE USE OF THE APP. SOME JURISDICTIONS DO NOT
            ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO THE ABOVE LIMITATIONS
            OR EXCLUSIONS MAY NOT APPLY TO EVERY USER.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>10. Termination:</h3>
          <p className='policy-section-details'>
            This Agreement is effective until terminated by either party. User
            may terminate this Agreement by ceasing all use of the App. Company
            may terminate this Agreement at any time without prior notice if
            User fails to comply with any terms or conditions of this Agreement.
            Upon termination, User must cease all use of the App and delete any
            copies in their possession.
          </p>
        </li>

        <li>
          <h3 className='policy-section-header'>11. Governing Law:</h3>
          <p className='policy-section-details'>
            This Agreement shall be governed by and construed in accordance with
            the laws of New York. Any disputes arising out of or relating to
            this Agreement shall be subject to the exclusive jurisdiction of the
            courts located in New York.
          </p>
          <p>
            By accessing or using the App, User acknowledges that they have
            read, understood, and agreed to be bound by this EULA. If User does
            not agree with any provision of this Agreement, they should not use
            the App.
          </p>
          <p className='policy-section-details'>
            This Agreement constitutes the entire agreement between User and
            Company regarding the App and supersedes all prior agreements and
            understandings.
          </p>
        </li>
        <li>
          <h3 className='policy-section-header'>12. Contact Us:</h3>
          <p className='policy-section-details'>
            For any inquiries or support related to the App, User may contact
            Company via email at{' '}
            <a href='mailto:support@flowplanr.com'>support@flowplanr.com</a>.
            Company will make reasonable efforts to respond to User's inquiries
            within a reasonable timeframe.
          </p>
        </li>
        <p className='policy-section-details'>
          By using Flowplanr, you agree to the terms outlined in this End-User
          License Agreement.
        </p>
        <p className='policy-section-details'>Flowplanr</p>
      </ul>
    </div>
  );
};

export default FpEULA;
