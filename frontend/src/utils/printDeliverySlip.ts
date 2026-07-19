import { Order } from '../pages/admin/admincommandes/AdminCommandes'

export const printDeliverySlip = (order: Order) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres contextuelles (pop-ups) pour imprimer le bon de livraison.")
    return
  }

  const subtotal = order.total - (order.shippingAmount ?? 0)
  const isPaid = order.statut === 'Livrée' // Assuming delivered is paid, or you can adjust logic
  
  // You can point to the real logo path here. If it's in public folder, just '/logo.png' or similar.
  // Using a placeholder text if image fails to load.
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Bon de livraison #${order.id}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body { 
                font-family: 'Inter', sans-serif; 
                color: #1f2937; 
                margin: 0; 
                padding: 40px; 
                font-size: 14px; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .header-title { text-align: center; margin-bottom: 40px; font-size: 28px; font-weight: 400; color: #111827; margin-top: 0; }
            .header-flex { display: flex; justify-content: space-between; margin-bottom: 50px; }
            .company-info { line-height: 1.6; font-size: 13px; color: #4b5563; }
            .company-info img { max-width: 140px; margin-bottom: 15px; } 
            .company-name { color: #111827; font-size: 15px; margin-bottom: 4px; }
            .slip-info { }
            .slip-info table { border-collapse: collapse; }
            .slip-info td { padding: 4px 12px; font-size: 13px; }
            .slip-info td:first-child { font-weight: 700; color: #111827; text-align: right; }
            .slip-info td:last-child { color: #111827; font-weight: 600; }
            
            .section-title { font-weight: 700; font-size: 14px; margin-bottom: 16px; color: #111827; }
            .details-container { display: flex; justify-content: space-between; margin-bottom: 50px; }
            .client-info, .payment-info { width: 48%; line-height: 1.8; font-size: 13px; color: #374151; }
            .payment-info table { border-collapse: collapse; }
            .payment-info td { padding: 2px 16px 2px 0; }
            .payment-info td:first-child { color: #4b5563; }
            
            table.items { width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px; }
            table.items th { border-bottom: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; font-weight: 700; color: #111827; }
            table.items td { border-bottom: 1px solid #f3f4f6; padding: 16px 8px; color: #374151; }
            table.items th:last-child, table.items td:last-child { text-align: right; }
            
            .totals { width: 320px; margin-left: auto; line-height: 2; font-size: 13px; }
            .totals table { width: 100%; border-collapse: collapse; }
            .totals td { padding: 6px 8px; color: #374151; font-weight: 600; }
            .totals td:last-child { text-align: right; color: #111827; }
            .totals tr:last-child td { font-size: 15px; font-weight: 700; border-top: 1px solid #e5e7eb; padding-top: 12px; }
            
            @media print {
                body { padding: 0; }
                @page { size: A4; margin: 15mm; }
            }
        </style>
    </head>
    <body>
        <h1 class="header-title">Bon de livraison</h1>
        <div class="header-flex">
            <div class="company-info">
                <img src="/logo-el-amine.png" alt="STE TAHA HOME" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div style="display:none; font-size:24px; font-weight:900; color:#db2777; margin-bottom:10px; font-style:italic;">TAHA HOME</div>
                <div class="company-name">STE TAHA HOME</div>
                008, Amilcar 5090 Bekalta<br/>
                Tel : +216 28 305 400 / +216 52 815 070
            </div>
            <div class="slip-info">
                <table>
                    <tr><td>Bon de livraison:</td><td>#${order.id}</td></tr>
                    <tr><td>Date:</td><td>${order.date}</td></tr>
                </table>
            </div>
        </div>
        
        <div class="details-container">
            <div class="client-info">
                <div class="section-title">Informations client</div>
                ${order.client} (guest)<br/>
                ${order.clientPhone ? order.clientPhone + '<br/>' : ''}
                ${order.address.replace(/, /g, '<br/>')}<br/>
            </div>
            <div class="payment-info">
                <div class="section-title">Détails de paiement</div>
                <table>
                    <tr><td>Statut de paiement:</td><td>${isPaid ? 'Payé' : 'En attente de paiement'}</td></tr>
                    <tr><td>Mode de paiement:</td><td>Paiement à la livraison</td></tr>
                    <tr><td>Devise:</td><td>TND</td></tr>
                </table>
            </div>
        </div>
        
        <table class="items">
            <thead>
                <tr>
                    <th>Boutique</th>
                    <th>ID du produit</th>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>TVA</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map((item, index) => `
                <tr>
                    <td>STE TAHA HOME</td>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.price.toFixed(2)} Dt</td>
                    <td></td>
                    <td>${(item.qty * item.price).toFixed(2)} Dt</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="totals">
            <table>
                <tr>
                    <td>Sous-total</td>
                    <td>${subtotal.toFixed(2)} Dt</td>
                </tr>
                <tr>
                    <td>Expédition</td>
                    <td>${(order.shippingAmount ?? 0).toFixed(2)} Dt</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>${order.total.toFixed(2)} Dt</td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for images to load before printing
  printWindow.onload = () => {
    printWindow.focus()
    setTimeout(() => {
        printWindow.print()
        // Optional: printWindow.close() after printing, but users might want to save to PDF
    }, 500)
  }
}
