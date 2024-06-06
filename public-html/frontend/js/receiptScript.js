async function generateReceipt() {
    const { jsPDF } = window.jspdf;

    // Platzhalter (vorerst)
    const companyAddress = "Feel Good Inc. & Co KG\nHochstädtplatz 6\n1200 Wien\nAUSTRIA"; //unsere Adresse ist immer gleich
    const buyerAddress = "BUYER NAME\nBUYER STREET\nBUYER CITY"; //sollte durch Name und Adresse vom bestellenden Kunden ersetzt werden
    const invoiceNumber = 1; // fortlaufende nummer von bestellungen, sollte von datenbank id übernommen werden
    const products = [//Zeigt alle bestellten produkte an, also Produktname, menge und Preis so wie sie bestellt wurden
        { name: "Product 1", price: 10.0, quantity: 2 }, 
        { name: "Product 2", price: 20.0, quantity: 1 },
    ];

    // neue jsPDF instanz
    const doc = new jsPDF();

    // firmenadresse, rechtsbündig
    const pageWidth = doc.internal.pageSize.getWidth();
    const lines = companyAddress.split('\n');
    lines.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - textWidth - 10, 10 + (index * 10));
    });

    // kundenadresse
    doc.setFont('helvetica', 'bold');
    doc.text("BILLED TO:", 10, 50);
    doc.setFont('helvetica', 'normal');
    const buyerLines = buyerAddress.split('\n');
    buyerLines.forEach((line, index) => {
        doc.text(line, 10, 60 + (index * 10));
    });

    // Rechnungsnummer, wieder rechtsbündig
    const invoiceText = `Invoice Number: ${invoiceNumber}`;
    const invoiceTextWidth = doc.getTextWidth(invoiceText);
    doc.text(invoiceText, pageWidth - invoiceTextWidth - 10, 90);

    // Produktliste
    let y = 120;
    let total = 0;
    products.forEach(product => {
        const totalProductPrice = product.price * product.quantity;
        doc.text(`${product.name}: $${product.price} x ${product.quantity} = $${totalProductPrice.toFixed(2)}`, 10, y);
        y += 10;
        total += totalProductPrice;
    });

    // gesamtpreis
    doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

    // lädt die datei für den client runter
    doc.save(`ZenMonkey_receiptNr${invoiceNumber}.pdf`);

    // speichert die datei im server verzeichnis
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `ZenMonkey_receiptNr${invoiceNumber}.pdf`);
    await fetch('../../backend/logic/saveReceipts.php', { //ruft php script auf
        method: 'POST',
        body: formData
    });
}
