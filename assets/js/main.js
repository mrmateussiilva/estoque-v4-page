// const API_URL = "https://estoque-v4.onrender.com";s
const category = document.getElementById("productCategory");
const formTinta = document.getElementById("form-tinta");
const formPapel = document.getElementById("form-papel");
const formTecido = document.getElementById("form-tecido");
const formTecidoCortado = document.getElementById("form-tecido-cortado");

// Paper type mapping
const paperTypeMap = {
    papel1: "Art 45gr 160x250",
    papel2: "Art 45gr 180x400",
    papel3: "Art 45gr 160x1000",
    papel4: "Coldenhove 40gr 162x400",
    papel5: "Seda 20gr 160x1000",
    papel6: "Kraft 35gr 160x500"
};

// Fetch data
async function fetchTinta() {
    try {
        const response = await fetch(`${API_URL}/products-tinta`);
        if (!response.ok) throw new Error("Failed to fetch tintas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchPapel() {
    try {
        const response = await fetch(`${API_URL}/products-papel`);
        if (!response.ok) throw new Error("Failed to fetch papéis");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchTecido() {
    try {
        const response = await fetch(`${API_URL}/products-tecido`);
        if (!response.ok) throw new Error("Failed to fetch tecidos");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchTecidoCortado() {
    try {
        const response = await fetch(`${API_URL}/products-tecido-cortado`);
        if (!response.ok) throw new Error("Failed to fetch tecidos cortados");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchSuppliers() {
    try {
        const response = await fetch(`${API_URL}/suppliers`);
        if (!response.ok) throw new Error("Failed to fetch suppliers");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Render tables
async function renderTintaTable() {
    const tintas = await fetchTinta();
    const tableBody = document.getElementById("tintaTableBody");
    tableBody.innerHTML = "";
    tintas.forEach(tinta => {
        const totalLitros = (tinta.productQty * tinta.productQtyLitros).toFixed(2);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tinta.color}</td>
            <td>${tinta.type}</td>
            <td>${tinta.productQty}</td>
            <td>${tinta.productQtyLitros}</td>
            <td>${totalLitros}</td>
            <td>${tinta.qtyMin || 0}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tinta', ${tinta.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct('tinta', ${tinta.id})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function renderPapelTable() {
    const papeis = await fetchPapel();
    const tableBody = document.getElementById("papelTableBody");
    tableBody.innerHTML = "";
    papeis.forEach(papel => {
        const displayName = paperTypeMap[papel.type] || papel.type;
        const totalMetros = papel.qtyUnit * papel.qtyMetros;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${displayName}</td>
            <td>${papel.qtyUnit}</td>
            <td>${papel.qtyMetros}</td>
            <td>${totalMetros}</td>
            <td>${papel.qtyMin || 0}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="editProduct('papel', ${papel.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct('papel', ${papel.id})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function renderTecidoTable() {
    const tecidos = await fetchTecido();
    const tableBody = document.getElementById("tecidoTableBody");
    tableBody.innerHTML = "";
    tecidos.forEach(tecido => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tecido.type}</td>
            <td>${tecido.qtyMetros}</td>
            <td>${tecido.width}</td>
            <td>${tecido.qtyMin || 0}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tecido', ${tecido.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct('tecido', ${tecido.id})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function renderTecidoCortadoTable() {
    const tecidosCortados = await fetchTecidoCortado();
    const tableBody = document.getElementById("tecidoCortadoTableBody");
    tableBody.innerHTML = "";
    tecidosCortados.forEach(tecidoCortado => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tecidoCortado.type}</td>
            <td>${tecidoCortado.quantity}</td>
            <td>${tecidoCortado.measurement}</td>
            <td>${tecidoCortado.qtyMin || 0}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tecido-cortado', ${tecidoCortado.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeProduct('tecido-cortado', ${tecidoCortado.id})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function renderSuppliers() {
    const suppliers = await fetchSuppliers();
    const tableBody = document.getElementById("suppliersTableBody");
    tableBody.innerHTML = "";
    suppliers.forEach(supplier => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.email}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeSupplier(${supplier.id})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Prepare modal for adding a new product
function prepareAddProduct() {
    document.getElementById("addProductModalLabel").textContent = "Adicionar Produto";
    document.getElementById("saveProductButton").textContent = "Salvar";
    document.getElementById("editProductId").value = "";
    document.getElementById("addProductForm").reset();
    category.value = "";
    category.dispatchEvent(new Event("change"));
}

// Edit product
async function editProduct(categoryName, id) {
    try {
        let product, endpoint;
        if (categoryName === "tinta") {
            const response = await fetch(`${API_URL}/products-tinta/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch tinta: ${response.status} ${response.statusText}`);
            product = await response.json();
            endpoint = `${API_URL}/products-tinta/${id}`;
        } else if (categoryName === "papel") {
            const response = await fetch(`${API_URL}/products-papel/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch papel: ${response.status} ${response.statusText}`);
            product = await response.json();
            endpoint = `${API_URL}/products-papel/${id}`;
        } else if (categoryName === "tecido") {
            const response = await fetch(`${API_URL}/products-tecido/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch tecido: ${response.status} ${response.statusText}`);
            product = await response.json();
            endpoint = `${API_URL}/products-tecido/${id}`;
        } else if (categoryName === "tecido-cortado") {
            const response = await fetch(`${API_URL}/products-tecido-cortado/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch tecido cortado: ${response.status} ${response.statusText}`);
            product = await response.json();
            endpoint = `${API_URL}/products-tecido-cortado/${id}`;
        }

        document.getElementById("addProductModalLabel").textContent = `Editar ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' ')}`;
        document.getElementById("saveProductButton").textContent = "Atualizar";
        document.getElementById("editProductId").value = id;

        category.value = categoryName;
        category.dispatchEvent(new Event("change"));

        if (categoryName === "tinta") {
            document.getElementById("typeColor").value = product.color;
            document.getElementById("typeTinta").value = product.type;
            document.getElementById("productQty").value = product.productQty;
            document.getElementById("productQtyLitros").value = product.productQtyLitros;
            document.getElementById("productQtyMin").value = product.qtyMin || 0;
        } else if (categoryName === "papel") {
            document.getElementById("typePapel").value = product.type;
            document.getElementById("productQtyUnit").value = product.qtyUnit;
            document.getElementById("productQtyMetros").value = product.qtyMetros;
            document.getElementById("productQtyMin").value = product.qtyMin || 0;
        } else if (categoryName === "tecido") {
            document.getElementById("typeTecido").value = product.type;
            document.getElementById("productQtyMetrosTecido").value = product.qtyMetros;
            document.getElementById("productWidth").value = product.width;
            document.getElementById("productQtyMin").value = product.qtyMin || 0;
        } else if (categoryName === "tecido-cortado") {
            document.getElementById("typeTecidoCortado").value = product.type;
            document.getElementById("productQtyTecidoCortado").value = product.quantity;
            const [largura, altura] = product.measurement.split('x');
            document.getElementById("productMedidaLargura").value = largura;
            document.getElementById("productMedidaAltura").value = altura;
            document.getElementById("productQtyMin").value = product.qtyMin || 0;
        }

        const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
        modal.show();
    } catch (error) {
        console.error(error);
        alert(`Erro ao carregar ${categoryName.replace('-', ' ')} para edição: ${error.message}`);
    }
}

// Save product (add or edit)
async function saveProduct() {
    try {
        let product, endpoint, categoryName, method;
        const editProductId = document.getElementById("editProductId").value;

        if (category.value === "tinta") {
            const color = document.getElementById("typeColor").value;
            const type = document.getElementById("typeTinta").value;
            const productQty = parseInt(document.getElementById("productQty").value);
            const productQtyLitros = parseFloat(document.getElementById("productQtyLitros").value);
            const qtyMin = parseFloat(document.getElementById("productQtyMin").value) || 0;

            if (!color || !type) throw new Error("Cor e tipo de tinta são obrigatórios");
            if (isNaN(productQty) || productQty <= 0) throw new Error("Quantidade deve ser um número positivo");
            if (isNaN(productQtyLitros) || productQtyLitros <= 0) throw new Error("Litros por frasco deve ser um número positivo");
            if (qtyMin < 0) throw new Error("Quantidade mínima não pode ser negativa");

            product = { color, type, productQty, productQtyLitros, qtyMin };
            endpoint = editProductId ? `${API_URL}/products-tinta/${editProductId}` : `${API_URL}/products-tinta`;
            method = editProductId ? "PUT" : "POST";
            categoryName = "tinta";
        } else if (category.value === "papel") {
            const type = document.getElementById("typePapel").value;
            const qtyUnit = parseInt(document.getElementById("productQtyUnit").value);
            const qtyMetros = parseInt(document.getElementById("productQtyMetros").value);
            const qtyMin = parseFloat(document.getElementById("productQtyMin").value) || 0;

            if (!type) throw new Error("Tipo de papel é obrigatório");
            if (isNaN(qtyUnit) || qtyUnit <= 0) throw new Error("Quantidade de rolos deve ser um número positivo");
            if (isNaN(qtyMetros) || qtyMetros <= 0) throw new Error("Metros por rolo deve ser um número positivo");
            if (qtyMin < 0) throw new Error("Quantidade mínima não pode ser negativa");

            product = { type, qtyUnit, qtyMetros, qtyMin };
            endpoint = editProductId ? `${API_URL}/products-papel/${editProductId}` : `${API_URL}/products-papel`;
            method = editProductId ? "PUT" : "POST";
            categoryName = "papel";
        } else if (category.value === "tecido") {
            const type = document.getElementById("typeTecido").value;
            const qtyMetros = parseFloat(document.getElementById("productQtyMetrosTecido").value);
            const width = parseFloat(document.getElementById("productWidth").value);
            const qtyMin = parseFloat(document.getElementById("productQtyMin").value) || 0;

            if (!type) throw new Error("Tipo de tecido é obrigatório");
            if (isNaN(qtyMetros) || qtyMetros <= 0) throw new Error("Quantidade de metros deve ser um número positivo");
            if (isNaN(width) || width <= 0) throw new Error("Largura deve ser um número positivo");
            if (qtyMin < 0) throw new Error("Quantidade mínima não pode ser negativa");

            product = { type, qtyMetros, width, qtyMin };
            endpoint = editProductId ? `${API_URL}/products-tecido/${editProductId}` : `${API_URL}/products-tecido`;
            method = editProductId ? "PUT" : "POST";
            categoryName = "tecido";
        } else if (category.value === "tecido-cortado") {
            const type = document.getElementById("typeTecidoCortado").value;
            const quantity = parseInt(document.getElementById("productQtyTecidoCortado").value);
            const largura = parseFloat(document.getElementById("productMedidaLargura").value);
            const altura = parseFloat(document.getElementById("productMedidaAltura").value);
            const measurement = `${largura}x${altura}`;
            const qtyMin = parseFloat(document.getElementById("productQtyMin").value) || 0;

            if (!type) throw new Error("Tipo de tecido cortado é obrigatório");
            if (isNaN(quantity) || quantity <= 0) throw new Error("Quantidade deve ser um número positivo");
            if (isNaN(largura) || largura <= 0) throw new Error("Largura deve ser um número positivo");
            if (isNaN(altura) || altura <= 0) throw new Error("Altura deve ser um número positivo");
            if (qtyMin < 0) throw new Error("Quantidade mínima não pode ser negativa");

            product = { type, quantity, measurement, qtyMin };
            endpoint = editProductId ? `${API_URL}/products-tecido-cortado/${editProductId}` : `${API_URL}/products-tecido-cortado`;
            method = editProductId ? "PUT" : "POST";
            categoryName = "tecido-cortado";
        } else {
            throw new Error("Por favor, selecione uma categoria válida");
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Falha ao ${editProductId ? "atualizar" : "adicionar"} ${categoryName.replace('-', ' ')}`);
        }

        document.getElementById("addProductForm").reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        modal.hide();

        if (categoryName === "tinta") await renderTintaTable();
        else if (categoryName === "papel") await renderPapelTable();
        else if (categoryName === "tecido") await renderTecidoTable();
        else if (categoryName === "tecido-cortado") await renderTecidoCortadoTable();

        await updateProductSelects();

        alert(`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' ')} ${editProductId ? "atualizado" : "adicionado"} com sucesso!`);
    } catch (error) {
        console.error(error);
        alert(`Erro ao ${document.getElementById("editProductId").value ? "atualizar" : "adicionar"} ${category.value.replace('-', ' ')}: ${error.message}`);
    }
}

// Remove product
async function removeProduct(category, id) {
    if (confirm(`Tem certeza que deseja remover este ${category.replace('-', ' ')}?`)) {
        try {
            const endpoint = `${API_URL}/products-${category}/${id}`;
            const response = await fetch(endpoint, { method: "DELETE" });
            if (!response.ok) throw new Error(`Failed to delete ${category}`);
            if (category === "tinta") await renderTintaTable();
            else if (category === "papel") await renderPapelTable();
            else if (category === "tecido") await renderTecidoTable();
            else if (category === "tecido-cortado") await renderTecidoCortadoTable();
            await updateProductSelects();
        } catch (error) {
            console.error(error);
            alert(`Erro ao remover ${category.replace('-', ' ')}: ${error.message}`);
        }
    }
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", async function () {
    const query = this.value.toLowerCase();
    const activeTab = document.querySelector("#stockTabs .nav-link.active").id;
    if (activeTab === "tinta-tab") {
        const tintas = await fetchTinta();
        const filtered = tintas.filter(tinta => 
            tinta.color.toLowerCase().includes(query) || 
            tinta.type.toLowerCase().includes(query)
        );
        const tableBody = document.getElementById("tintaTableBody");
        tableBody.innerHTML = "";
        filtered.forEach(tinta => {
            const totalLitros = (tinta.productQty * tinta.productQtyLitros).toFixed(2);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tinta.color}</td>
                <td>${tinta.type}</td>
                <td>${tinta.productQty}</td>
                <td>${tinta.productQtyLitros}</td>
                <td>${totalLitros}</td>
                <td>${tinta.qtyMin || 0}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tinta', ${tinta.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeProduct('tinta', ${tinta.id})">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else if (activeTab === "papel-tab") {
        const papeis = await fetchPapel();
        const filtered = papeis.filter(papel => 
            (paperTypeMap[papel.type] || papel.type).toLowerCase().includes(query)
        );
        const tableBody = document.getElementById("papelTableBody");
        tableBody.innerHTML = "";
        filtered.forEach(papel => {
            const displayName = paperTypeMap[papel.type] || papel.type;
            const totalMetros = papel.qtyUnit * papel.qtyMetros;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${displayName}</td>
                <td>${papel.qtyUnit}</td>
                <td>${papel.qtyMetros}</td>
                <td>${totalMetros}</td>
                <td>${papel.qtyMin || 0}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct('papel', ${papel.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeProduct('papel', ${papel.id})">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else if (activeTab === "tecido-tab") {
        const tecidos = await fetchTecido();
        const filtered = tecidos.filter(tecido => 
            tecido.type.toLowerCase().includes(query)
        );
        const tableBody = document.getElementById("tecidoTableBody");
        tableBody.innerHTML = "";
        filtered.forEach(tecido => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tecido.type}</td>
                <td>${tecido.qtyMetros}</td>
                <td>${tecido.width}</td>
                <td>${tecido.qtyMin || 0}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tecido', ${tecido.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeProduct('tecido', ${tecido.id})">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else if (activeTab === "tecido-cortado-tab") {
        const tecidosCortados = await fetchTecidoCortado();
        const filtered = tecidosCortados.filter(tecidoCortado => 
            tecidoCortado.type.toLowerCase().includes(query) ||
            tecidoCortado.measurement.toLowerCase().includes(query)
        );
        const tableBody = document.getElementById("tecidoCortadoTableBody");
        tableBody.innerHTML = "";
        filtered.forEach(tecidoCortado => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tecidoCortado.type}</td>
                <td>${tecidoCortado.quantity}</td>
                <td>${tecidoCortado.measurement}</td>
                <td>${tecidoCortado.qtyMin || 0}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct('tecido-cortado', ${tecidoCortado.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeProduct('tecido-cortado', ${tecidoCortado.id})">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
});

// Update product selects
async function updateProductSelects() {
    const tintas = await fetchTinta();
    const papeis = await fetchPapel();
    const tecidos = await fetchTecido();
    const tecidosCortados = await fetchTecidoCortado();
    const selects = ["entryProduct", "exitProduct", "orderProduct"];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = "<option value='' disabled selected>Selecione um produto</option>";
        tintas.forEach(tinta => {
            const option = document.createElement("option");
            option.value = `tinta_${tinta.id}`;
            option.textContent = `Tinta: ${tinta.color} (${tinta.type})`;
            select.appendChild(option);
        });
        papeis.forEach(papel => {
            const option = document.createElement("option");
            option.value = `papel_${papel.id}`;
            option.textContent = `Papel: ${paperTypeMap[papel.type] || papel.type}`;
            select.appendChild(option);
        });
        tecidos.forEach(tecido => {
            const option = document.createElement("option");
            option.value = `tecido_${tecido.id}`;
            option.textContent = `Tecido: ${tecido.type}`;
            select.appendChild(option);
        });
        tecidosCortados.forEach(tecidoCortado => {
            const option = document.createElement("option");
            option.value = `tecido-cortado_${tecidoCortado.id}`;
            option.textContent = `Tecido Cortado: ${tecidoCortado.type} (${tecidoCortado.measurement})`;
            select.appendChild(option);
        });
    });
}

// Supplier functions
async function addSupplier(event) {
    event.preventDefault();
    try {
        const name = document.getElementById("supplierName").value;
        const phone = document.getElementById("supplierPhone").value;
        const email = document.getElementById("supplierEmail").value;

        if (!name || !phone || !email) throw new Error("Todos os campos são obrigatórios");

        const response = await fetch(`${API_URL}/suppliers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to add supplier");
        }

        document.getElementById("addSupplierForm").reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addSupplierModal"));
        modal.hide();
        await renderSuppliers();
        await updateSupplierSelect();
        alert("Fornecedor adicionado com sucesso!");
    } catch (error) {
        console.error(error);
        alert(`Erro ao adicionar fornecedor: ${error.message}`);
    }
}

async function removeSupplier(id) {
    if (confirm("Tem certeza que deseja remover este fornecedor?")) {
        try {
            const response = await fetch(`${API_URL}/suppliers/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete supplier");
            await renderSuppliers();
            await updateSupplierSelect();
        } catch (error) {
            console.error(error);
            alert(`Erro ao remover fornecedor: ${error.message}`);
        }
    }
}

async function updateSupplierSelect() {
    const suppliers = await fetchSuppliers();
    const selects = ["entrySupplier", "orderSupplier"];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = "<option value='' disabled selected>Selecione um fornecedor</option>";
        suppliers.forEach(supplier => {
            const option = document.createElement("option");
            option.value = supplier.id;
            option.textContent = supplier.name;
            select.appendChild(option);
        });
    });
}

// Entry and Exit functions
async function addEntry(event) {
    event.preventDefault();
    try {
        const productSelect = document.getElementById("entryProduct").value;
        const quantity = parseFloat(document.getElementById("entryQuantity").value);
        const supplierId = parseInt(document.getElementById("entrySupplier").value);

        if (!productSelect) throw new Error("Selecione um produto");
        if (isNaN(quantity) || quantity <= 0) throw new Error("Quantidade deve ser um número positivo");
        if (!supplierId) throw new Error("Selecione um fornecedor");

        const [category, productId] = productSelect.split('_');

        const entry = {
            category: category,
            product_id: parseInt(productId),
            quantity: quantity,
            supplier_id: supplierId
        };

        const response = await fetch(`${API_URL}/entries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to register entry");
        }

        document.getElementById("entryForm").reset();
        if (category === "tinta") await renderTintaTable();
        else if (category === "papel") await renderPapelTable();
        else if (category === "tecido") await renderTecidoTable();
        else if (category === "tecido-cortado") await renderTecidoCortadoTable();

        alert("Entrada registrada com sucesso!");
    } catch (error) {
        console.error(error);
        alert(`Erro ao registrar entrada: ${error.message}`);
    }
}

async function addExit(event) {
    event.preventDefault();
    try {
        const productSelect = document.getElementById("exitProduct").value;
        const quantity = parseFloat(document.getElementById("exitQuantity").value);

        if (!productSelect) throw new Error("Selecione um produto");
        if (isNaN(quantity) || quantity <= 0) throw new Error("Quantidade deve ser um número positivo");

        const [category, productId] = productSelect.split('_');

        const exit = {
            category: category,
            product_id: parseInt(productId),
            quantity: quantity
        };

        const response = await fetch(`${API_URL}/exits`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exit)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to register exit");
        }

        document.getElementById("exitForm").reset();
        if (category === "tinta") await renderTintaTable();
        else if (category === "papel") await renderPapelTable();
        else if (category === "tecido") await renderTecidoTable();
        else if (category === "tecido-cortado") await renderTecidoCortadoTable();

        alert("Saída registrada com sucesso!");
    } catch (error) {
        console.error(error);
        alert(`Erro ao registrar saída: ${error.message}`);
    }
}

// Form visibility
category.addEventListener("change", () => {
    const forms = [formTinta, formPapel, formTecido, formTecidoCortado];
    forms.forEach(form => {
        if (form) form.classList.add("hidden-form");
    });

    if (category.value === "tinta" && formTinta) {
        formTinta.classList.remove("hidden-form");
    } else if (category.value === "papel" && formPapel) {
        formPapel.classList.remove("hidden-form");
    } else if (category.value === "tecido" && formTecido) {
        formTecido.classList.remove("hidden-form");
    } else if (category.value === "tecido-cortado" && formTecidoCortado) {
        formTecidoCortado.classList.remove("hidden-form");
    }
});

// Tab change handling
document.getElementById("stockTabs").addEventListener("shown.bs.tab", async function (event) {
    const target = event.target.id;
    if (target === "tinta-tab") {
        await renderTintaTable();
    } else if (target === "papel-tab") {
        await renderPapelTable();
    } else if (target === "tecido-tab") {
        await renderTecidoTable();
    } else if (target === "tecido-cortado-tab") {
        await renderTecidoCortadoTable();
    }
});

// UI functions
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.style.display = "none");
    document.getElementById(`${sectionId}Section`).style.display = "block";
    if (sectionId === "stock") {
        renderTintaTable();
    }
    if (window.innerWidth <= 768) toggleSidebar();
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
    await renderTintaTable();
    await renderSuppliers();
    await updateSupplierSelect();
    await updateProductSelects();
    showSection("stock");

    document.getElementById("addSupplierForm").addEventListener("submit", addSupplier);
    document.getElementById("entryForm").addEventListener("submit", addEntry);
    document.getElementById("exitForm").addEventListener("submit", addExit);
});
