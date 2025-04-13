
const API_URL = "https://estoque-v4.onrender.com"; // URL da API FastAPI



async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    return await response.json();
}

async function fetchSuppliers() {
    const response = await fetch(`${API_URL}/suppliers`);
    return await response.json();
}

// Renderizar tabela de estoque
async function renderTable() {
    const products = await fetchProducts();
    const tableBody = document.getElementById("stockTableBody");
    tableBody.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${product.name}</td>
                  <td>${product.qty}</td>
                  <td>R$ ${product.price.toFixed(2)}</td>
                  <td>${product.category}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="removeProduct(${product.id})"><i class="bi bi-trash"></i> Remover</button></td>
              `;
        tableBody.appendChild(row);
    });
    updateProductSelects();
    // renderChart(products);
}

// Adicionar produto
async function addProduct() {
    const product = {
        name: document.getElementById("productName").value,
        qty: parseInt(document.getElementById("productQty").value),
        qtyMin: parseFloat(document.getElementById("productQtyMinima").value),
        category: document.getElementById("productCategory").value
    };
    await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    renderTable();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
    modal.hide();
    document.getElementById("addProductForm").reset();
}

// Remover produto
async function removeProduct(id) {
    if (confirm("Tem certeza que deseja remover este produto?")) {
        await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
        renderTable();
    }
}

// Pesquisa
document.getElementById("searchInput").addEventListener("input", async function () {
    const query = this.value.toLowerCase();
    const products = await fetchProducts();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    const tableBody = document.getElementById("stockTableBody");
    tableBody.innerHTML = "";
    filtered.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${product.name}</td>
                  <td>${product.qty}</td>
                  <td>${product.qtyMin}</td>
                  <td>${product.category}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="removeProduct(${product.id})"><i class="bi bi-trash"></i> Remover</button></td>
              `;
        tableBody.appendChild(row);
    });
});

// Atualizar selects de produtos
async function updateProductSelects() {
    const products = await fetchProducts();
    const selects = ["entryProduct", "exitProduct", "orderProduct"];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = "<option value='' disabled selected>Selecione um produto</option>";
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
    });
}

// Entrada de mercadoria
async function addStockEntry() {
    const productId = parseInt(document.getElementById("entryProduct").value);
    const qty = parseInt(document.getElementById("entryQty").value);
    await fetch(`${API_URL}/stock/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, qty })
    });
    renderTable();
    document.getElementById("entryForm").reset();
}

// Saída de mercadoria
async function removeStockExit() {
    const productId = parseInt(document.getElementById("exitProduct").value);
    const qty = parseInt(document.getElementById("exitQty").value);
    const response = await fetch(`${API_URL}/stock/exit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, qty })
    });
    if (response.ok) {
        renderTable();
        document.getElementById("exitForm").reset();
    } else {
        alert("Quantidade insuficiente em estoque!");
    }
}

// Cadastro de fornecedor
async function addSupplier() {
    const supplier = {
        name: document.getElementById("supplierName").value,
        contact: document.getElementById("supplierContact").value
    };
    await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier)
    });
    renderSuppliers();
    updateSupplierSelect();
    document.getElementById("supplierForm").reset();
}

// Renderizar fornecedores
async function renderSuppliers() {
    const suppliers = await fetchSuppliers();
    const tableBody = document.getElementById("supplierTableBody");
    tableBody.innerHTML = "";
    suppliers.forEach(supplier => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${supplier.name}</td><td>${supplier.contact}</td>`;
        tableBody.appendChild(row);
    });
}

// Atualizar select de fornecedores
async function updateSupplierSelect() {
    const suppliers = await fetchSuppliers();
    const supplierSelect = document.getElementById("orderSupplier");
    supplierSelect.innerHTML = "<option value='' disabled selected>Selecione um fornecedor</option>";
    suppliers.forEach(supplier => {
        const option = document.createElement("option");
        option.value = supplier.id;
        option.textContent = supplier.name;
        supplierSelect.appendChild(option);
    });
}

// Gerar pedido
async function generateOrder() {
    const order = {
        supplier_id: parseInt(document.getElementById("orderSupplier").value),
        product_id: parseInt(document.getElementById("orderProduct").value),
        qty: parseInt(document.getElementById("orderQty").value)
    };
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });
    const result = await response.json();
    document.getElementById("orderResult").innerHTML = `
              <div class="alert alert-success">
                  Pedido gerado!<br>
                  Fornecedor: ${result.supplier_name}<br>
                  Produto: ${result.product_name}<br>
                  Quantidade: ${order.qty}<br>
                  Total: R$ ${result.total.toFixed(2)}
              </div>
          `;
    document.getElementById("orderForm").reset();
}

const category = document.getElementById("productCategory");
const formTinta = document.getElementById("form-tinta");
const formPapel = document.getElementById("form-papel");

category.addEventListener("change", () => {
    // Esconde todos os formulários
    formTinta.classList.add("hidden-form");
    formPapel.classList.add("hidden-form");

    // Mostra o formulário correspondente
    if (category.value === "tinta") {
        formTinta.classList.remove("hidden-form");
    } else if (category.value === "papel") {
        formPapel.classList.remove("hidden-form");
    }
});


// Mostrar/esconder seções

// Toggle sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
    await renderTable();
    await renderSuppliers();
    await updateSupplierSelect();
});
