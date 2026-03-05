// Firestore seeder for document templates
// Run this ONCE in the browser console or as a temporary component

import { db } from '../backend/firebase';
import { collection, addDoc } from 'firebase/firestore';

const documentTemplates = [
    {
        name: 'Non-Disclosure Agreement (NDA)',
        slug: 'nda',
        category: 'business',
        description: 'Protect confidential information shared between parties with a legally binding NDA.',
        fields: [
            { key: 'effectiveDate', label: 'When will this agreement become effective?', type: 'date', helpText: 'The effective date should be a date that precedes disclosure of confidential information.', placeholder: '' },
            { key: 'disclosingParty', label: 'Who is the disclosing party?', type: 'text', helpText: 'Enter the full legal name of the person or company sharing confidential information.', placeholder: 'e.g., Lawarna Aree' },
            { key: 'disclosingAddress', label: 'Address of the disclosing party?', type: 'text', helpText: '', placeholder: 'e.g., Kathmandu, Ward 10, Nepal' },
            { key: 'receivingParty', label: 'Who is the receiving party?', type: 'text', helpText: 'Enter the full legal name of the person or company receiving confidential information.', placeholder: 'e.g., Suman Shrestha' },
            { key: 'receivingAddress', label: 'Address of the receiving party?', type: 'text', helpText: '', placeholder: 'e.g., Pokhara, Ward 5, Nepal' },
            { key: 'purpose', label: 'What is the purpose of sharing confidential information?', type: 'textarea', helpText: 'Describe the business reason for sharing confidential information.', placeholder: 'e.g., To evaluate a potential business partnership...' },
            { key: 'duration', label: 'How long should confidentiality obligations last?', type: 'select', helpText: '', options: ['1 Year', '2 Years', '3 Years', '5 Years', 'Indefinitely'] },
        ],
        templateText: `<h2>Non-Disclosure Agreement (NDA)</h2>
<p>This Non-Disclosure Agreement ("Agreement") is made effective as of <strong>{{effectiveDate}}</strong>.</p>
<p><strong>Between:</strong></p>
<p><strong>Disclosing Party:</strong> {{disclosingParty}}, residing at {{disclosingAddress}}</p>
<p><strong>Receiving Party:</strong> {{receivingParty}}, residing at {{receivingAddress}}</p>
<p><strong>Purpose:</strong> {{purpose}}</p>
<p>The Disclosing Party has requested, and the Receiving Party has agreed, to protect any confidential materials the Disclosing Party may share. Therefore, the parties agree as follows:</p>
<p><strong>1. Definition of Confidential Information:</strong> "Confidential Information" means any data or information, oral or written, that is disclosed by the Disclosing Party to the Receiving Party and is designated as confidential or reasonably should be understood to be confidential.</p>
<p><strong>2. Obligations of Receiving Party:</strong> The Receiving Party shall hold and maintain the Confidential Information in strict confidence and shall not disclose any Confidential Information to any third parties without prior written consent.</p>
<p><strong>3. Duration:</strong> This Agreement shall remain in effect for a period of <strong>{{duration}}</strong> from the effective date.</p>
<p><strong>4. Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the laws of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Disclosing Party:</strong> _________________________ ({{disclosingParty}})</p>
<p><strong>Receiving Party:</strong> _________________________ ({{receivingParty}})</p>
<p><strong>Date:</strong> {{effectiveDate}}</p>`
    },
    {
        name: 'Rent Agreement',
        slug: 'rent-agreement',
        category: 'property',
        description: 'Create a comprehensive rental agreement between landlord and tenant under Nepal law.',
        fields: [
            { key: 'landlordName', label: 'Full name of the landlord?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'landlordAddress', label: 'Address of the landlord?', type: 'text', helpText: '', placeholder: 'e.g., Lalitpur, Ward 8' },
            { key: 'tenantName', label: 'Full name of the tenant?', type: 'text', helpText: '', placeholder: 'e.g., Rabin Adhikari' },
            { key: 'tenantAddress', label: 'Permanent address of the tenant?', type: 'text', helpText: '', placeholder: 'e.g., Gorkha, Ward 3' },
            { key: 'propertyAddress', label: 'Full address of the rental property?', type: 'text', helpText: 'Include ward number, street, and city.', placeholder: 'e.g., House No. 45, Pulchowk, Lalitpur' },
            { key: 'monthlyRent', label: 'Monthly rent amount (NPR)?', type: 'text', helpText: '', placeholder: 'e.g., 25,000' },
            { key: 'securityDeposit', label: 'Security deposit amount (NPR)?', type: 'text', helpText: '', placeholder: 'e.g., 50,000' },
            { key: 'startDate', label: 'Lease start date?', type: 'date', helpText: '', placeholder: '' },
            { key: 'duration', label: 'Lease duration?', type: 'select', helpText: '', options: ['6 Months', '1 Year', '2 Years', '3 Years'] },
        ],
        templateText: `<h2>Rent Agreement (भाडा सम्झौता)</h2>
<p>This Rent Agreement is executed on <strong>{{startDate}}</strong> between the following parties:</p>
<p><strong>Landlord:</strong> {{landlordName}}, residing at {{landlordAddress}} (hereinafter referred to as "Landlord")</p>
<p><strong>Tenant:</strong> {{tenantName}}, permanent address {{tenantAddress}} (hereinafter referred to as "Tenant")</p>
<p><strong>Property:</strong> The Landlord hereby agrees to rent the property located at <strong>{{propertyAddress}}</strong> to the Tenant.</p>
<p><strong>1. Rent:</strong> The monthly rent shall be NPR <strong>{{monthlyRent}}</strong>, payable on or before the 5th of each month.</p>
<p><strong>2. Security Deposit:</strong> The Tenant shall pay a security deposit of NPR <strong>{{securityDeposit}}</strong>, refundable upon termination of this agreement subject to deductions for any damage.</p>
<p><strong>3. Duration:</strong> This agreement shall be valid for a period of <strong>{{duration}}</strong> commencing from {{startDate}}.</p>
<p><strong>4. Maintenance:</strong> The Tenant shall maintain the property in good condition and shall not make any structural changes without the Landlord's written consent.</p>
<p><strong>5. Termination:</strong> Either party may terminate this agreement by providing 30 days written notice.</p>
<p><strong>6. Governing Law:</strong> This agreement shall be governed by the laws of Nepal, including the House and Land Rent Control Act, 2023 B.S.</p>
<p style="margin-top: 2rem;"><strong>Landlord:</strong> _________________________ ({{landlordName}})</p>
<p><strong>Tenant:</strong> _________________________ ({{tenantName}})</p>
<p><strong>Date:</strong> {{startDate}}</p>
<p><strong>Witness 1:</strong> _________________________</p>
<p><strong>Witness 2:</strong> _________________________</p>`
    },
    {
        name: 'Power of Attorney (मुख्तियारनामा)',
        slug: 'power-of-attorney',
        category: 'family',
        description: 'Authorize someone to act on your behalf for legal, financial, or property matters.',
        fields: [
            { key: 'principalName', label: 'Full name of the principal (you)?', type: 'text', helpText: 'The person granting the authority.', placeholder: 'e.g., Lawarna Aree' },
            { key: 'principalAddress', label: 'Address of the principal?', type: 'text', helpText: '', placeholder: 'e.g., Bhaktapur, Ward 12' },
            { key: 'principalCitizenship', label: 'Citizenship number of the principal?', type: 'text', helpText: '', placeholder: 'e.g., 12-34-56789' },
            { key: 'agentName', label: 'Full name of the attorney-in-fact (agent)?', type: 'text', helpText: 'The person being given authority to act.', placeholder: 'e.g., Binod Kumar Thapa' },
            { key: 'agentAddress', label: 'Address of the agent?', type: 'text', helpText: '', placeholder: 'e.g., Kathmandu, Ward 15' },
            { key: 'agentCitizenship', label: 'Citizenship number of the agent?', type: 'text', helpText: '', placeholder: 'e.g., 45-67-89012' },
            { key: 'powers', label: 'What powers are being granted?', type: 'textarea', helpText: 'List the specific actions the agent is authorized to perform.', placeholder: 'e.g., To sell the property located at..., to sign documents on my behalf...' },
            { key: 'effectiveDate', label: 'Effective date?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Power of Attorney (मुख्तियारनामा)</h2>
<p>I, <strong>{{principalName}}</strong>, residing at {{principalAddress}}, Citizenship No. {{principalCitizenship}}, being of sound mind and body, do hereby appoint and authorize:</p>
<p><strong>{{agentName}}</strong>, residing at {{agentAddress}}, Citizenship No. {{agentCitizenship}}</p>
<p>as my true and lawful Attorney-in-Fact ("Agent") effective from <strong>{{effectiveDate}}</strong>, to act on my behalf with the following powers:</p>
<p><strong>Granted Powers:</strong></p>
<p>{{powers}}</p>
<p><strong>Terms and Conditions:</strong></p>
<p>1. The Agent shall act in good faith and in the best interest of the Principal at all times.</p>
<p>2. The Agent shall not delegate the powers granted herein to any third party without the written consent of the Principal.</p>
<p>3. This Power of Attorney may be revoked by the Principal at any time by providing written notice to the Agent.</p>
<p>4. This document shall be governed by the laws of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Principal:</strong> _________________________ ({{principalName}})</p>
<p><strong>Agent:</strong> _________________________ ({{agentName}})</p>
<p><strong>Date:</strong> {{effectiveDate}}</p>
<p><strong>Witness 1:</strong> _________________________</p>
<p><strong>Witness 2:</strong> _________________________</p>`
    },
    {
        name: 'Partnership Deed',
        slug: 'partnership-deed',
        category: 'business',
        description: 'Formalize a business partnership with clear terms for profit sharing, responsibilities, and dissolution.',
        fields: [
            { key: 'firmName', label: 'Name of the partnership firm?', type: 'text', helpText: '', placeholder: 'e.g., Himalaya Trading Co.' },
            { key: 'partner1Name', label: 'Full name of Partner 1?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'partner1Address', label: 'Address of Partner 1?', type: 'text', helpText: '', placeholder: 'e.g., Kathmandu, Ward 3' },
            { key: 'partner2Name', label: 'Full name of Partner 2?', type: 'text', helpText: '', placeholder: 'e.g., Kiran Thapa' },
            { key: 'partner2Address', label: 'Address of Partner 2?', type: 'text', helpText: '', placeholder: 'e.g., Pokhara, Ward 8' },
            { key: 'businessNature', label: 'Nature of business?', type: 'text', helpText: '', placeholder: 'e.g., Import and export of goods' },
            { key: 'capitalContribution', label: 'Total capital contribution (NPR)?', type: 'text', helpText: '', placeholder: 'e.g., 10,00,000' },
            { key: 'profitRatio', label: 'Profit sharing ratio?', type: 'text', helpText: '', placeholder: 'e.g., 50:50 or 60:40' },
            { key: 'effectiveDate', label: 'Partnership start date?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Partnership Deed (साझेदारी सम्झौता)</h2>
<p>This Partnership Deed is made on <strong>{{effectiveDate}}</strong> between:</p>
<p><strong>Partner 1:</strong> {{partner1Name}}, residing at {{partner1Address}}</p>
<p><strong>Partner 2:</strong> {{partner2Name}}, residing at {{partner2Address}}</p>
<p>The parties hereby agree to carry on business in partnership under the following terms:</p>
<p><strong>1. Firm Name:</strong> {{firmName}}</p>
<p><strong>2. Nature of Business:</strong> {{businessNature}}</p>
<p><strong>3. Capital:</strong> The total capital contribution shall be NPR <strong>{{capitalContribution}}</strong>.</p>
<p><strong>4. Profit Sharing:</strong> Profits and losses shall be shared in the ratio of <strong>{{profitRatio}}</strong>.</p>
<p><strong>5. Management:</strong> Both partners shall have equal rights in managing the business unless otherwise agreed.</p>
<p><strong>6. Banking:</strong> The firm's bank account shall be operated jointly by both partners.</p>
<p><strong>7. Dissolution:</strong> The partnership may be dissolved by mutual consent of all partners with 3 months notice.</p>
<p><strong>8. Governing Law:</strong> This deed shall be governed by the Partnership Act of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Partner 1:</strong> _________________________ ({{partner1Name}})</p>
<p><strong>Partner 2:</strong> _________________________ ({{partner2Name}})</p>
<p><strong>Date:</strong> {{effectiveDate}}</p>`
    },
    {
        name: 'Employment Contract',
        slug: 'employment-contract',
        category: 'business',
        description: 'Create a formal employment agreement outlining duties, compensation, and terms of employment.',
        fields: [
            { key: 'employerName', label: 'Name of the employer/company?', type: 'text', helpText: '', placeholder: 'e.g., TechNepal Pvt. Ltd.' },
            { key: 'employerAddress', label: 'Address of the employer?', type: 'text', helpText: '', placeholder: '' },
            { key: 'employeeName', label: 'Full name of the employee?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'employeeAddress', label: 'Address of the employee?', type: 'text', helpText: '', placeholder: 'e.g., Lalitpur, Ward 4' },
            { key: 'position', label: 'Job title/position?', type: 'text', helpText: '', placeholder: 'e.g., Software Developer' },
            { key: 'salary', label: 'Monthly salary (NPR)?', type: 'text', helpText: '', placeholder: 'e.g., 80,000' },
            { key: 'startDate', label: 'Employment start date?', type: 'date', helpText: '', placeholder: '' },
            { key: 'probation', label: 'Probation period?', type: 'select', helpText: '', options: ['1 Month', '3 Months', '6 Months', 'No Probation'] },
        ],
        templateText: `<h2>Employment Contract (रोजगार सम्झौता)</h2>
<p>This Employment Contract is made on <strong>{{startDate}}</strong>.</p>
<p><strong>Employer:</strong> {{employerName}}, located at {{employerAddress}}</p>
<p><strong>Employee:</strong> {{employeeName}}, residing at {{employeeAddress}}</p>
<p>The Employer hereby agrees to employ the Employee under the following terms:</p>
<p><strong>1. Position:</strong> {{position}}</p>
<p><strong>2. Compensation:</strong> Monthly salary of NPR <strong>{{salary}}</strong> (inclusive of all applicable taxes).</p>
<p><strong>3. Probation:</strong> The initial probation period shall be <strong>{{probation}}</strong>.</p>
<p><strong>4. Working Hours:</strong> Standard working hours shall be 8 hours per day, 6 days a week, as per the Labour Act of Nepal.</p>
<p><strong>5. Leave:</strong> The Employee shall be entitled to public holidays and leave as prescribed by Nepal Labour Act, 2074.</p>
<p><strong>6. Termination:</strong> Either party may terminate this contract by providing 30 days written notice.</p>
<p><strong>7. Confidentiality:</strong> The Employee agrees to maintain confidentiality of all proprietary business information.</p>
<p style="margin-top: 2rem;"><strong>Employer:</strong> _________________________ ({{employerName}})</p>
<p><strong>Employee:</strong> _________________________ ({{employeeName}})</p>
<p><strong>Date:</strong> {{startDate}}</p>`
    },
    {
        name: 'Service Agreement',
        slug: 'service-agreement',
        category: 'business',
        description: 'Define the terms and scope of services provided between a service provider and client.',
        fields: [
            { key: 'providerName', label: 'Name of the service provider?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'clientName', label: 'Name of the client?', type: 'text', helpText: '', placeholder: 'e.g., Creative Media Ltd.' },
            { key: 'serviceDescription', label: 'Description of services?', type: 'textarea', helpText: '', placeholder: 'Describe the services to be provided...' },
            { key: 'fee', label: 'Service fee (NPR)?', type: 'text', helpText: '', placeholder: '' },
            { key: 'startDate', label: 'Start date?', type: 'date', helpText: '', placeholder: '' },
            { key: 'duration', label: 'Duration of agreement?', type: 'select', helpText: '', options: ['3 Months', '6 Months', '1 Year', 'Project-based'] },
        ],
        templateText: `<h2>Service Agreement (सेवा सम्झौता)</h2>
<p>This Service Agreement is entered into on <strong>{{startDate}}</strong>.</p>
<p><strong>Service Provider:</strong> {{providerName}}</p>
<p><strong>Client:</strong> {{clientName}}</p>
<p><strong>1. Scope of Services:</strong> {{serviceDescription}}</p>
<p><strong>2. Compensation:</strong> The Client agrees to pay NPR <strong>{{fee}}</strong> for the services rendered.</p>
<p><strong>3. Duration:</strong> {{duration}}</p>
<p><strong>4. Termination:</strong> Either party may terminate with 15 days written notice.</p>
<p><strong>5. Governing Law:</strong> This agreement is governed by the laws of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Provider:</strong> _________________________ ({{providerName}})</p>
<p><strong>Client:</strong> _________________________ ({{clientName}})</p>
<p><strong>Date:</strong> {{startDate}}</p>`
    },
    {
        name: 'Land Sale Deed',
        slug: 'land-sale-deed',
        category: 'property',
        description: 'Document the sale and transfer of land ownership between parties.',
        fields: [
            { key: 'sellerName', label: 'Full name of the seller?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'buyerName', label: 'Full name of the buyer?', type: 'text', helpText: '', placeholder: 'e.g., Sandeep Kumar' },
            { key: 'landLocation', label: 'Location of the land?', type: 'text', helpText: 'Include district, municipality, and ward.', placeholder: '' },
            { key: 'plotNumber', label: 'Plot/Kitta number?', type: 'text', helpText: '', placeholder: '' },
            { key: 'area', label: 'Land area (in Ropani/Aana/Bigha)?', type: 'text', helpText: '', placeholder: '' },
            { key: 'salePrice', label: 'Sale price (NPR)?', type: 'text', helpText: '', placeholder: '' },
            { key: 'saleDate', label: 'Date of sale?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Land Sale Deed (जग्गा बिक्री लिखत)</h2>
<p>This deed of sale is executed on <strong>{{saleDate}}</strong>.</p>
<p><strong>Seller:</strong> {{sellerName}}</p>
<p><strong>Buyer:</strong> {{buyerName}}</p>
<p><strong>Property Details:</strong></p>
<p>Location: {{landLocation}} | Plot No: {{plotNumber}} | Area: {{area}}</p>
<p><strong>Sale Price:</strong> NPR <strong>{{salePrice}}</strong></p>
<p>The Seller hereby transfers all rights, title, and interest in the above-described property to the Buyer.</p>
<p><strong>Governing Law:</strong> Land Revenue Act of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Seller:</strong> _________________________ ({{sellerName}})</p>
<p><strong>Buyer:</strong> _________________________ ({{buyerName}})</p>
<p><strong>Date:</strong> {{saleDate}}</p>
<p><strong>Witness 1:</strong> _________________________</p>
<p><strong>Witness 2:</strong> _________________________</p>`
    },
    {
        name: 'Lease Agreement',
        slug: 'lease-agreement',
        category: 'property',
        description: 'Create a formal lease agreement for commercial or residential property.',
        fields: [
            { key: 'lessorName', label: 'Name of the lessor (owner)?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'lesseeName', label: 'Name of the lessee (tenant)?', type: 'text', helpText: '', placeholder: 'e.g., Anita Poudel' },
            { key: 'propertyAddress', label: 'Address of the property?', type: 'text', helpText: '', placeholder: '' },
            { key: 'monthlyRent', label: 'Monthly lease amount (NPR)?', type: 'text', helpText: '', placeholder: '' },
            { key: 'startDate', label: 'Lease start date?', type: 'date', helpText: '', placeholder: '' },
            { key: 'leaseTerm', label: 'Lease term?', type: 'select', helpText: '', options: ['1 Year', '2 Years', '3 Years', '5 Years'] },
        ],
        templateText: `<h2>Lease Agreement (पट्टा सम्झौता)</h2>
<p>This Lease Agreement is made on <strong>{{startDate}}</strong>.</p>
<p><strong>Lessor:</strong> {{lessorName}}</p>
<p><strong>Lessee:</strong> {{lesseeName}}</p>
<p><strong>Property:</strong> {{propertyAddress}}</p>
<p><strong>1. Lease Term:</strong> {{leaseTerm}} from {{startDate}}</p>
<p><strong>2. Monthly Rent:</strong> NPR <strong>{{monthlyRent}}</strong></p>
<p><strong>3. Use:</strong> The property shall be used solely for the purpose agreed upon.</p>
<p><strong>4. Maintenance:</strong> Lessee shall maintain the property in good and habitable condition.</p>
<p><strong>5. Governing Law:</strong> This lease is governed by the laws of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Lessor:</strong> _________________________ ({{lessorName}})</p>
<p><strong>Lessee:</strong> _________________________ ({{lesseeName}})</p>
<p><strong>Date:</strong> {{startDate}}</p>`
    },
    {
        name: 'Property Transfer Deed',
        slug: 'property-transfer',
        category: 'property',
        description: 'Formally transfer property ownership from one party to another.',
        fields: [
            { key: 'transferorName', label: 'Name of the transferor?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'transfereeName', label: 'Name of the transferee?', type: 'text', helpText: '', placeholder: 'e.g., Manoj Shrestha' },
            { key: 'propertyDescription', label: 'Description of the property?', type: 'textarea', helpText: '', placeholder: '' },
            { key: 'transferDate', label: 'Date of transfer?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Property Transfer Deed (सम्पत्ति हस्तान्तरण लिखत)</h2>
<p>This deed of transfer is executed on <strong>{{transferDate}}</strong>.</p>
<p><strong>Transferor:</strong> {{transferorName}}</p>
<p><strong>Transferee:</strong> {{transfereeName}}</p>
<p><strong>Property:</strong> {{propertyDescription}}</p>
<p>The Transferor hereby transfers all rights, title, and interest in the above-described property to the Transferee.</p>
<p style="margin-top: 2rem;"><strong>Transferor:</strong> _________________________ ({{transferorName}})</p>
<p><strong>Transferee:</strong> _________________________ ({{transfereeName}})</p>
<p><strong>Date:</strong> {{transferDate}}</p>`
    },
    {
        name: 'Last Will & Testament',
        slug: 'will-testament',
        category: 'family',
        description: 'Create a legally valid will to distribute your assets and appoint guardians.',
        fields: [
            { key: 'testatorName', label: 'Your full name (testator)?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'testatorAddress', label: 'Your address?', type: 'text', helpText: '', placeholder: 'e.g., Kathmandu, Nepal' },
            { key: 'testatorCitizenship', label: 'Your citizenship number?', type: 'text', helpText: '', placeholder: 'e.g., 678-90-12345' },
            { key: 'executorName', label: 'Name of the executor?', type: 'text', helpText: 'The person responsible for carrying out the terms of your will.', placeholder: 'e.g., Pukar Thapa' },
            { key: 'beneficiaries', label: 'List your beneficiaries and their shares?', type: 'textarea', helpText: '', placeholder: 'e.g., Son Rajesh - 50%, Daughter Sita - 50%' },
            { key: 'willDate', label: 'Date of this will?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Last Will & Testament (अन्तिम इच्छापत्र)</h2>
<p>I, <strong>{{testatorName}}</strong>, residing at {{testatorAddress}}, Citizenship No. {{testatorCitizenship}}, being of sound mind and body, do hereby declare this to be my Last Will and Testament, revoking all previous wills.</p>
<p><strong>Executor:</strong> I appoint <strong>{{executorName}}</strong> as the Executor of this Will.</p>
<p><strong>Distribution of Assets:</strong></p>
<p>{{beneficiaries}}</p>
<p><strong>General Provisions:</strong></p>
<p>1. All debts and obligations shall be settled before distribution.</p>
<p>2. The Executor shall have full authority to manage the estate.</p>
<p>3. This Will is governed by the laws of Nepal.</p>
<p style="margin-top: 2rem;"><strong>Testator:</strong> _________________________ ({{testatorName}})</p>
<p><strong>Date:</strong> {{willDate}}</p>
<p><strong>Witness 1:</strong> _________________________</p>
<p><strong>Witness 2:</strong> _________________________</p>`
    },
    {
        name: 'Divorce Settlement Agreement',
        slug: 'divorce-settlement',
        category: 'family',
        description: 'Outline the terms of a mutual divorce including property division and custody.',
        fields: [
            { key: 'spouse1Name', label: 'Full name of Spouse 1?', type: 'text', helpText: '', placeholder: 'e.g., Lawarna Aree' },
            { key: 'spouse2Name', label: 'Full name of Spouse 2?', type: 'text', helpText: '', placeholder: 'e.g., Sameer Adhikari' },
            { key: 'marriageDate', label: 'Date of marriage?', type: 'date', helpText: '', placeholder: '' },
            { key: 'propertyDivision', label: 'Property division agreement?', type: 'textarea', helpText: '', placeholder: 'Describe how property will be divided...' },
            { key: 'childCustody', label: 'Child custody arrangement (if applicable)?', type: 'textarea', helpText: 'Leave blank if not applicable.', placeholder: '' },
            { key: 'settlementDate', label: 'Date of this settlement?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Divorce Settlement Agreement (सम्बन्ध विच्छेद सम्झौता)</h2>
<p>This Divorce Settlement Agreement is made on <strong>{{settlementDate}}</strong>.</p>
<p><strong>Spouse 1:</strong> {{spouse1Name}}</p>
<p><strong>Spouse 2:</strong> {{spouse2Name}}</p>
<p><strong>Marriage Date:</strong> {{marriageDate}}</p>
<p>Both parties mutually agree to dissolve their marriage under the following terms:</p>
<p><strong>1. Property Division:</strong> {{propertyDivision}}</p>
<p><strong>2. Child Custody:</strong> {{childCustody}}</p>
<p><strong>3. Governing Law:</strong> This settlement is governed by the National Civil Code of Nepal, 2074.</p>
<p style="margin-top: 2rem;"><strong>Spouse 1:</strong> _________________________ ({{spouse1Name}})</p>
<p><strong>Spouse 2:</strong> _________________________ ({{spouse2Name}})</p>
<p><strong>Date:</strong> {{settlementDate}}</p>`
    },
    {
        name: 'Affidavit (शपथ पत्र)',
        slug: 'affidavit',
        category: 'family',
        description: 'Create a sworn statement for legal or official purposes.',
        fields: [
            { key: 'deponentName', label: 'Full name of the deponent?', type: 'text', helpText: 'The person making the sworn statement.', placeholder: 'e.g., Lawarna Aree' },
            { key: 'deponentAddress', label: 'Address of the deponent?', type: 'text', helpText: '', placeholder: '' },
            { key: 'deponentCitizenship', label: 'Citizenship number?', type: 'text', helpText: '', placeholder: '' },
            { key: 'statement', label: 'What is the sworn statement?', type: 'textarea', helpText: 'Write the facts you are declaring under oath.', placeholder: '' },
            { key: 'purpose', label: 'Purpose of this affidavit?', type: 'text', helpText: '', placeholder: 'e.g., For passport application, name correction...' },
            { key: 'affidavitDate', label: 'Date?', type: 'date', helpText: '', placeholder: '' },
        ],
        templateText: `<h2>Affidavit (शपथ पत्र)</h2>
<p>I, <strong>{{deponentName}}</strong>, residing at {{deponentAddress}}, Citizenship No. {{deponentCitizenship}}, do hereby solemnly affirm and declare as follows:</p>
<p><strong>Statement:</strong></p>
<p>{{statement}}</p>
<p><strong>Purpose:</strong> This affidavit is made for the purpose of {{purpose}}.</p>
<p>I hereby declare that the above statements are true and correct to the best of my knowledge and belief.</p>
<p style="margin-top: 2rem;"><strong>Deponent:</strong> _________________________ ({{deponentName}})</p>
<p><strong>Date:</strong> {{affidavitDate}}</p>
<p><strong>Before:</strong> _________________________ (Notary Public / Justice of Peace)</p>`
    },
];

export const seedDocumentTemplates = async () => {
    const col = collection(db, 'documentTemplates');
    let count = 0;
    for (const template of documentTemplates) {
        await addDoc(col, template);
        count++;
        console.log(`Seeded: ${template.name} (${count}/${documentTemplates.length})`);
    }
    console.log('✅ All document templates seeded!');
    return count;
};

export default documentTemplates;
