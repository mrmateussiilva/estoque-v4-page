


const formTinta = `
    <div class="mb-3"><label for="typeColor" class="form-label">Categoria</label>
        <select class="form-select" id="typeColor" required>
            <option value="" disabled selected>Selecione a Cor</option>
            <option value="cyan">Cyan</option>
            <option value="magenta">Magenta</option>
            <option value="yellow">Yellow</option>
            <option value="black">Black</option>
            <option value="liquid-limpeza">Liquido de Limpeza</option>
        </select>
    </div>

    <div class="mb-3"><label for="typeTinta" class="form-label">Tipo de Tinta</label>
        <select class="form-select" id="typeTinta" required>
            <option value="" disabled selected>Selecione o Tipo</option>
            <option value="sublimacao">Sublimação</option>
            <option value="solvente">Solvente</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="productName" class="form-label"></label>
        <input type="text" class="form-control" id="productName" required>
    </div>
    <div class="mb-3">
        <label for="productQty" class="form-label">Quantidade</label>
        <input type="number" class="form-control" id="productQty" min="0" required>
    </div>
    <div class="mb-3">
        <label for="productQtyMinima" class="form-label">Quantidade Mínima</label>
        <input type="number" step="0.01" class="form-control" id="productQtyMinima" min="0" required>
    </div>


`


export default formTinta;