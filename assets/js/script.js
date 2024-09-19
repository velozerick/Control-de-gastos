let listaGastos = [];
let chartInstance = null; 

function clickBoton() {
    let nombreGasto = document.getElementById('nombreGasto').value;
    let valorGasto = parseFloat(document.getElementById('valorGasto').value);
    let descripcionGasto = document.getElementById('descripcionGasto').value;
    let monedaGasto = document.getElementById('monedaGasto').value;

    if (valorGasto > 150) {
        alert("Este gasto supera los $150 dólares.");
    }

    listaGastos.push({
        nombre: nombreGasto,
        valor: valorGasto,
        descripcion: descripcionGasto,
        moneda: monedaGasto
    });

    actualizarListaGastos();
    mostrarGrafico();
    limpiar();
}

function actualizarListaGastos() {
    const listaElementos = document.getElementById('listaDeGastos');
    const totalElementos = document.getElementById('totalGastos');
    let htmlLista = '';
    let totalGastos = 0;

    listaGastos.forEach((gasto, posicion) => {
        htmlLista += `<li>${gasto.nombre} - ${gasto.moneda} ${gasto.valor.toFixed(2)}
            <br><strong>Descripción:</strong> ${gasto.descripcion}
            <button onclick="editarGasto(${posicion});">Editar</button>
            <button onclick="eleminarGasto(${posicion});">Eliminar</button>
        </li>`;
        totalGastos += gasto.valor;
    });

    listaElementos.innerHTML = htmlLista;
    totalElementos.innerText = totalGastos.toFixed(2);
}

function limpiar() {
    document.getElementById('nombreGasto').value = '';
    document.getElementById('valorGasto').value = '';
    document.getElementById('descripcionGasto').value = '';
    document.getElementById('monedaGasto').value = 'USD';
}

function eleminarGasto(posicion) {
    listaGastos.splice(posicion, 1);
    actualizarListaGastos();
    mostrarGrafico();
}

function editarGasto(posicion) {
    let gasto = listaGastos[posicion];
    document.getElementById('nombreGasto').value = gasto.nombre;
    document.getElementById('valorGasto').value = gasto.valor;
    document.getElementById('descripcionGasto').value = gasto.descripcion;
    document.getElementById('monedaGasto').value = gasto.moneda;
    listaGastos.splice(posicion, 1);
    actualizarListaGastos();
    mostrarGrafico();
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const margin = 10;

    // Añadir título centralizado
    pdf.setFontSize(18);
    pdf.text("Reporte de Gastos Mensuales", 105, 15, null, null, 'center');

    let y = 30; // Iniciar contenido debajo del título

    // Detalle de gastos
    pdf.setFontSize(12);
    pdf.text("Detalle de Gastos:", margin, y);
    y += 10;

    listaGastos.forEach(gasto => {
        pdf.setFontSize(11);
        let gastoDetalle = [
            `Nombre: ${gasto.nombre}`,
            `Valor: ${gasto.moneda} ${gasto.valor.toFixed(2)}`,
            `Descripción: ${gasto.descripcion}`
        ];
        gastoDetalle.forEach(line => {
            pdf.text(line, margin + 5, y);
            y += 6;
        });
        y += 5;
    });

    // Añadir la gráfica
    html2canvas(document.getElementById("graficoGastos")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        if (y > 280) {
            pdf.addPage();
            y = 10; 
        }
        pdf.addImage(imgData, 'PNG', margin, y, 180, 60); 
        y += 70; 

        // Añadir el total de gastos al final
        if (y > 280) {
            pdf.addPage();
            y = 10;
        }
        pdf.setFontSize(12);
        pdf.text(`Total Mensual: ${document.getElementById("totalGastos").innerText}`, margin, y);

        // Guardar el PDF
        pdf.save("reporte_gastos.pdf");
    }).catch(error => {
        console.error("Error al añadir gráfica al PDF:", error);
    });
}





function mostrarGrafico() {
    const ctx = document.getElementById('graficoGastos').getContext('2d');
    const labels = listaGastos.map(gasto => gasto.nombre);
    const data = listaGastos.map(gasto => gasto.valor);

    if (chartInstance) {
        chartInstance.destroy(); // Destruye la instancia anterior
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos',
                data: data,
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
