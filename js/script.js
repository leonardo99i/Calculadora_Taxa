// Função para obter a taxa de câmbio do dólar
async function obterTaxaCambioDolar() {
    try {
        const resposta = await fetch('https://economia.awesomeapi.com.br/json/USD-BRL');
        const dados = await resposta.json();
        return parseFloat(dados[0].bid);
    } catch (erro) {
        console.error('Erro ao obter a taxa de câmbio do dólar:', erro);
        return null;
    }
}

// Função para calcular o imposto
async function calcularImposto() {
    const valorCompraBRL = parseFloat(document.getElementById("valorCompra").value);
    const valorFreteBRL = parseFloat(document.getElementById("valorFrete").value);

    if (isNaN(valorCompraBRL) || isNaN(valorFreteBRL)) {
        alert("Por favor, insira valores válidos.");
        return;
    }

    // Obter a taxa de câmbio mais recente
    const taxaCambio = await obterTaxaCambioDolar();

    if (taxaCambio !== null) {
        const valorCompraUSD = valorCompraBRL / taxaCambio;
        const valorFreteUSD = valorFreteBRL / taxaCambio;
        const valorTotalUSD = valorCompraUSD + valorFreteUSD;

        let imposto;
        if (valorTotalUSD <= 50) {
            // Imposto de 17% (ICMS) sobre o valor total em reais
            imposto = (valorCompraBRL + valorFreteBRL) * 0.17;
        } else {
            // Imposto de 17% (ICMS) sobre o valor total em reais
            imposto = (valorCompraBRL + valorFreteBRL) * 0.17;

            // Taxa adicional de 60% sobre o valor em reais após o ICMS
            imposto += (valorCompraBRL + valorFreteBRL + imposto) * 0.60;
        }

        // Valor total da compra com imposto em reais
        const valorTotalCompraComImpostoBRL = valorCompraBRL + valorFreteBRL + imposto;

        const elementoResultado = document.getElementById("resultado");
        elementoResultado.textContent = `Imposto de Importação em BRL: R$ ${(imposto).toFixed(2)}`;

        const elementoValorComImposto = document.getElementById("valorComImposto");
        elementoValorComImposto.value = valorTotalCompraComImpostoBRL.toFixed(2);
    } else {
        alert("Não foi possível obter a taxa de câmbio. Verifique a conexão com a internet.");
    }

    atualizarDataECotacao();
}

// Função para atualizar a data e a cotação do dólar
function atualizarDataECotacao() {
    const elementoData = document.getElementById("dataAtualizada");
    const elementoCotacao = document.getElementById("cotacaoDolar");

    async function atualizarCotacao() {
        const taxaCambio = await obterTaxaCambioDolar();
        if (taxaCambio !== null) {
            const taxaCambioNumerica = parseFloat(taxaCambio);
            elementoCotacao.textContent = `1 USD = ${taxaCambioNumerica.toFixed(2)} BRL`;
        } else {
            elementoCotacao.textContent = "N/A";
        }
    }

    function atualizarHora() {
        const agora = new Date();
        const dataFormatada = agora.toLocaleString("pt-BR");
        elementoData.textContent = `Última atualização em: ${dataFormatada}`;
    }

    // Atualizar a hora a cada segundo
    setInterval(atualizarHora, 1000);

    // Chamada inicial para atualizar a cotação do dólar
    atualizarCotacao();

    // Atualizar a cotação a cada 10 minutos (em milissegundos)
    setInterval(atualizarCotacao, 600000);
}

// Chamada inicial para atualizar a data e a cotação do dólar
atualizarDataECotacao();
