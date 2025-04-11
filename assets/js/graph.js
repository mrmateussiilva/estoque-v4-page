      // Renderizar gráfico
      function renderChart(products) {
        const ctx = document.getElementById("stockChart").getContext("2d");
        const categories = [...new Set(products.map(p => p.category))];
        const data = categories.map(cat => {
            return products.filter(p => p.category === cat).reduce((sum, p) => sum + p.qty, 0);
        });
    
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: categories,
                datasets: [{
                    label: "Quantidade em Estoque",
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
    