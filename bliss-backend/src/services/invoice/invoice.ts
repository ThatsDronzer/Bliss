import { invoiceEmail } from '@constants/email.constants';
import { generateInvoiceNumberInDB } from '@repository/payment/payment.repository';
import { capitalize } from '@utils/Core.utils';
import { poppinsBoldFont } from '@utils/PoppinsBold';
import { poppinsRegularfont } from '@utils/PoppinsRegular';
import { Buffer } from 'node:buffer';
import { sendEmail } from 'services/email/email.service';
import { uploadFileToGoogleDrive } from 'services/googleDrive/googleDrive.service';

export async function createInvoicePDF({ clientName, clientEmail, clientPhone, invoiceDate, invoiceNumber, companyName, amount, productName, currency, state, hsnCode }) {
	const { default: jsPDF } = await import('jspdf');
	const doc = new jsPDF({
		orientation: 'p',
		unit: 'mm',
		format: 'a4',
	});

	doc.addFileToVFS('Poppins-Bold.ttf', poppinsBoldFont);
	doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');

	doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegularfont);
	doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');

	// Constants for layout
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 10;
	const lineHeight = 7;
	const lineHeightSmall = 5;
	const isIGST = state !== 'Delhi';

	// Calculate amounts
	const taxRate = 0.18;
	const unitPrice = Number.parseFloat(((amount * 100) / 118).toFixed(2));
	const taxAmount = Number.parseFloat((unitPrice * taxRate).toFixed(2));

	// Company Information
	doc.setFontSize(11);
	doc.setFont('Poppins', 'bold');
	doc.text(companyName, margin, margin + 20);
	doc.setFont('Poppins', 'normal');
	doc.text('House No 206/15 A', margin, margin + 25);
	doc.text('3rd Flr, Sadar Bazar Delhi Cantt', margin, margin + 30);
	doc.text('South West Delhi, Delhi- 110010', margin, margin + 35);
	doc.text('GSTIN: 07AADCW6794M1ZH', margin, margin + 40);

	// Invoice Header
	doc.setFontSize(22);
	doc.setFont('Poppins', 'bold');
	doc.text('INVOICE', pageWidth - margin, margin + lineHeightSmall + 5, { align: 'right' });

	doc.setFontSize(11);
	doc.setFont('Poppins', 'bold');
	// Invoice Number and Date
	doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - margin, margin + lineHeightSmall * 4, { align: 'right' });
	doc.setFont('Poppins', 'normal');
	doc.text(`Date: ${invoiceDate}`, pageWidth - margin, margin + lineHeightSmall * 5, { align: 'right' });
	doc.text(`HSN: ${hsnCode}`, pageWidth - margin, margin + lineHeightSmall * 6, { align: 'right' });

	// Draw line
	doc.setDrawColor(211, 211, 211);
	doc.setLineWidth(0.5);
	doc.line(margin, margin + 45, pageWidth - margin, margin + 45);

	// Client Information
	doc.setFontSize(11);
	doc.setFont('Poppins', 'bold');
	doc.text('Bill To:', margin, margin + 55);
	doc.setFont('Poppins', 'normal');
	clientName && doc.text(clientName, margin, margin + 62);
	doc.text(clientEmail, margin, margin + 67);
	clientPhone && doc.text(clientPhone, margin, margin + 72);
	doc.text(state, margin, margin + 77);

	// Amount Box on the right of Bill To
	const amountBoxWidth = 30; // width of the amount box
	const amountBoxHeight = 15; // height of the amount box
	const amountBoxX = pageWidth - margin - amountBoxWidth; // X position
	const amountBoxY = margin + 55; // Y position

	doc.setLineWidth(0.5);
	// Draw the amount box
	doc.rect(amountBoxX, amountBoxY, amountBoxWidth, amountBoxHeight);
	// Set font for 'Amount'
	doc.setFontSize(11);
	doc.setFont('Poppins', 'normal');
	// Calculate the center for the text
	const amountTextX = amountBoxX + amountBoxWidth / 2;
	const amountTextY = amountBoxY + amountBoxHeight / 2 - 2; // Adjusted for vertical centering
	// Adding 'Amount' text centered in the box
	doc.text('Amount:', amountTextX, amountBoxY + 5, { align: 'center' });
	// Set font for the amount value
	doc.setFont('Poppins', 'bold');
	doc.setFontSize(14);
	// Adding the amount value centered in the box
	doc.text(`${currency} ${amount.toLocaleString('en-IN')}`, amountTextX, amountTextY + 7, { align: 'center' }); // Adjusting Y position for visual centering

	// Draw line
	doc.setDrawColor(211, 211, 211);
	doc.setLineWidth(0.5);
	doc.line(margin, margin + lineHeight * 12, pageWidth - margin, margin + lineHeight * 12);

	// Product Information and Amounts Table
	doc.setFontSize(11);
	doc.setFont('Poppins', 'bold');
	doc.text('Description', margin, margin + lineHeight * 13);
	doc.text('Qty', margin + 60, margin + lineHeight * 13);
	doc.text('Unit Price', margin + 90, margin + lineHeight * 13);
	doc.text('Tax', margin + 130, margin + lineHeight * 13);
	doc.text('Amount', pageWidth - margin, margin + lineHeight * 13, { align: 'right' });

	// Product Name and Details
	doc.setFont('Poppins', 'normal');
	const splitTitle = doc.splitTextToSize(productName, 50);
	splitTitle.forEach((line, index) => {
		doc.text(line, margin, margin + lineHeight * 14 + 5 * index);
	});
	doc.text('1', margin + 60, margin + lineHeight * 14);
	doc.text(`${currency} ${unitPrice.toLocaleString('en-IN')}`, margin + 90, margin + lineHeight * 14);
	doc.text(`${(taxRate * 100).toFixed(0)}%`, margin + 130, margin + lineHeight * 14);
	doc.setFont('Poppins', 'normal');
	doc.text(`${currency} ${unitPrice.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 14, {
		align: 'right',
	});

	// Drawing lines to close the bottom of the table
	doc.line(margin, margin + lineHeight * 15 + 10, pageWidth - margin, margin + lineHeight * 15 + 10);

	// Subtotal, Tax and Total
	doc.text('Subtotal', margin + 100, margin + lineHeight * 18);
	doc.setFont('Poppins', 'normal');
	doc.text(`${currency} ${unitPrice.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 18, {
		align: 'right',
	});

	if (isIGST) {
		doc.text(`IGST - India (18% on ${currency} ${unitPrice.toLocaleString('en-IN')})`, margin + 100, margin + lineHeight * 19);
		doc.setFont('Poppins', 'normal');
		doc.text(`${currency} ${taxAmount.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 19, {
			align: 'right',
		});
		doc.setFont('Poppins', 'bold');
		doc.text('Total Amount', margin + 100, margin + lineHeight * 20);
		doc.text(`${currency} ${amount.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 20, {
			align: 'right',
		});
	} else {
		// CGST and SGST
		const cgst = taxAmount / 2;
		const sgst = taxAmount / 2;
		doc.text(`CGST (9% on ${currency} ${unitPrice.toLocaleString('en-IN')})`, margin + 100, margin + lineHeight * 19);
		doc.setFont('Poppins', 'normal');
		doc.text(`${currency} ${cgst.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 19, {
			align: 'right',
		});
		doc.text(`SGST (9% on ${currency} ${unitPrice.toLocaleString('en-IN')})`, margin + 100, margin + lineHeight * 20);
		doc.setFont('Poppins', 'normal');
		doc.text(`${currency} ${sgst.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 20, {
			align: 'right',
		});
		// Total Amount
		doc.setFont('Poppins', 'bold');
		doc.text('Total Amount', margin + 100, margin + lineHeight * 21);
		doc.text(`${currency} ${amount.toLocaleString('en-IN')}`, pageWidth - margin, margin + lineHeight * 21, {
			align: 'right',
		});
	}

	// Signature
	doc.setFontSize(11);
	doc.setFont('Poppins', 'normal');
	doc.text('*This is a computer generated invoice, no signature is required.', pageWidth / 4 - margin, pageHeight - margin);

	const arrayBuffer = doc.output('arraybuffer');
	const buffer = Buffer.from(arrayBuffer);
	return buffer;
}

export async function sendEmailInvoice(payload: {
	clientName: string;
	clientEmail: string;
	clientPhone: string;
	invoiceDate: string;
	amount: number;
	productName: string;
	companyName: string;
	currency: string;
	state: string;
	hsnCode: string;
	folderId: string;
	shouldSendEmail?: boolean;
}) {
	try {
		const shouldSendEmail = payload.shouldSendEmail ?? true;
		const invoiceNumber = await generateInvoiceNumberInDB(payload.companyName);
		const pdfBytes = await createInvoicePDF({ ...payload, invoiceNumber, currency: payload.currency === 'INR' ? '₹' : '$' });
		// Send email with the PDF attachment
		if (shouldSendEmail) {
			await sendEmail({
				email: payload.clientEmail,
				subject: `Your Payment Receipt - Transaction Successful, Invoice #${invoiceNumber}`,
				html: invoiceEmail({
					amount: payload.amount,
					companyName: capitalize(payload.companyName),
					invoiceNumber,
					clientName: payload.clientName,
					invoiceDate: payload.invoiceDate,
					productName: payload.productName,
					currency: payload.currency === 'INR' ? '₹' : '$',
				}).html,
				from: 'Major Richik From NxtJob <hello@nxtjob.ai>',
				attachments: [
					{
						filename: `${invoiceNumber}.pdf`,
						content: pdfBytes,
					},
				],
			});
		}
		const fileId = await uploadFileToGoogleDrive({
			fileName: `${invoiceNumber}.pdf`,
			mimeType: 'application/pdf',
			fileContent: pdfBytes,
			folderId: payload.folderId,
		});
		return {
			invoiceNumber,
			driveLink: fileId ? `https://drive.google.com/file/d/${fileId}/view?usp=sharing` : 'FAILED',
		};
	} catch (error) {
		console.log(error);
	}
}

// export async function generateInvoices() {
// 	const results = [];
// 	for (const invoice of invoicesToGenerate) {
// 		const hsnCode = invoice.Category === 'Software' ? '9983' : '999293';
// 		const folderId = invoice.Category === 'Software' ? softwareFolderId : coachingFolderId;
// 		const result = await sendEmailInvoice({
// 			clientName: invoice.Name,
// 			clientEmail: invoice.Email,
// 			clientPhone: invoice.Phone.toString(),
// 			invoiceDate: invoice.Date,
// 			amount: invoice.Amount,
// 			productName: invoice.Description,
// 			companyName: invoice.Company,
// 			currency: 'INR',
// 			state: invoice.State,
// 			hsnCode,
// 			folderId,
// 			invoiceNumber: invoice['Invoice Number'],
// 		});
// 		results.push(result);
// 	}
// 	return results;
// }

// const invoicesToGenerate = []
