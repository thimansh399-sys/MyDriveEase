import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateInvoicePDF(booking) {
  const doc = new jsPDF();
  // Try to load logo if available
  let logoImg = null;
  try {
    logoImg = new window.Image();
    logoImg.src = require('../assets/logo.png');
    await new Promise((resolve) => { logoImg.onload = resolve; });
    doc.addImage(logoImg, 'PNG', 10, 10, 40, 20);
  } catch (e) {
    // fallback: no logo
  }

  const invoiceHtml = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #16a34a;">DriveEase Ride Invoice</h2>
      <hr />
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Date:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
      <p><strong>Pickup:</strong> ${booking.pickup?.address}</p>
      <p><strong>Drop:</strong> ${booking.drop?.address}</p>
      <p><strong>Distance:</strong> ${booking.distance} km</p>
      <p><strong>Fare:</strong> ₹${booking.fare?.total}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
      <hr />
      <p><strong>Driver:</strong> ${booking.driverId?.name || ''}</p>
      <p><strong>Vehicle:</strong> ${booking.driverId?.vehicle?.type || ''}</p>
      <p><strong>Phone:</strong> ${booking.driverId?.phone || ''}</p>
      <hr />
      <p style="font-size: 12px; color: #888;">Thank you for riding with DriveEase!</p>
    </div>
  `;

  // Create a temporary element for html2canvas
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = invoiceHtml;
  tempDiv.style.width = '400px';
  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv, { backgroundColor: '#fff', scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 10, logoImg ? 35 : 10, 190, 0);

  document.body.removeChild(tempDiv);
  doc.save(`DriveEase_Invoice_${booking._id}.pdf`);
}
