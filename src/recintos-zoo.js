class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: { macaco: 3 } },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: {} },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: { gazela: 1 } },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: {} },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: { leão: 1 } }
        ];

        this.animais = {
            leão: { nome: 'leão', tamanho: 3, bioma: 'savana', carnívoro: true },
            leopardo: { nome: 'leopardo', tamanho: 2, bioma: 'savana', carnívoro: true },
            crocodilo: { nome: 'crocodilo', tamanho: 3, bioma: 'rio', carnívoro: true },
            macaco: { nome: 'macaco', tamanho: 1, bioma: 'savana ou floresta', carnívoro: false },
            gazela: { nome: 'gazela', tamanho: 2, bioma: 'savana', carnívoro: false },
            hipopotamo: { nome: 'hipopotamo', tamanho: 4, bioma: 'savana ou rio', carnívoro: false }
        };
    }

    validarQuantidade(quantidade) {
        return quantidade > 0 && Number.isInteger(quantidade);
    }

    analisaRecintos(animal, quantidade) {
        const animalNome = animal.toLowerCase();

        if (!this.animais[animalNome]) {
            return { erro: "Animal inválido" };
        }

        if (!this.validarQuantidade(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[animalNome];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const biomaAdequado = this.verificarBioma(animalInfo, recinto);
            if (biomaAdequado) {
                const espacoOcupado = this.calcularEspacoOcupado(recinto, animalNome, quantidade);
                const espacoLivre = recinto.tamanho - espacoOcupado;

                // Adicionar logs para depuração
                console.log(`  Recinto ${recinto.numero}:`);
                console.log(`  Espaco Ocupado: ${espacoOcupado}`);
                console.log(`  Espaco Livre: ${espacoLivre}`);

                if (espacoLivre >= 0) {
                    if (this.validarRecintoParaCarnivoro(animalInfo, recinto) && this.condicoesEspeciais(animalInfo, recinto, quantidade)) {
                        recintosViaveis.push(
                            `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`
                        );
                    }
                }
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena os recintos viáveis com base no número do recinto
        return { 
            recintosViaveis: recintosViaveis.sort((a, b) => {
                const numeroRecintoA = parseInt(a.match(/Recinto (\d+)/)[1], 10);
                const numeroRecintoB = parseInt(b.match(/Recinto (\d+)/)[1], 10);
                return numeroRecintoA - numeroRecintoB;
            }) 
        };
    }

    verificarBioma(animalInfo, recinto) {
        return recinto.bioma.includes(animalInfo.bioma) || 
               (animalInfo.bioma === 'savana ou floresta' && (recinto.bioma === 'savana' || recinto.bioma === 'floresta')) ||
               (animalInfo.bioma === 'savana ou rio' && (recinto.bioma === 'savana' || recinto.bioma === 'rio'));
    }

    calcularEspacoOcupado(recinto, animal, quantidade) {
        const tamanhoAnimal = this.animais[animal].tamanho;
        const espacoExistente = Object.entries(recinto.animais)
            .reduce((total, [animalNoRecinto, qtde]) => total + qtde * this.animais[animalNoRecinto].tamanho, 0);
        const espacoNecessario = quantidade * tamanhoAnimal;

        // Adicionar log para depuração
        console.log(`Calculando Espaco Ocupado para o recinto ${recinto.numero}:`);
        console.log(`  Espaco Existente: ${espacoExistente}`);
        console.log(`  Espaco Necessario: ${espacoNecessario}`);

        return espacoExistente + espacoNecessario;
    }

    condicoesEspeciais(animalInfo, recinto, quantidade) {
        if (animalInfo.nome === 'hipopotamo' && recinto.bioma !== 'savana e rio') {
            return false;
        }
        if (animalInfo.nome === 'macaco' && quantidade === 1) {
            return Object.keys(recinto.animais).length > 0;
        }

        return true;
    }

    validarRecintoParaCarnivoro(animalInfo, recinto) {
        if (animalInfo.carnívoro) {
            if (Object.keys(recinto.animais).length > 0) {
                return Object.keys(recinto.animais).every(
                    animalNoRecinto => this.animais[animalNoRecinto].carnívoro && animalNoRecinto === animalInfo.nome
                );
            }
        }
        return true; // Recinto vazio ou adequado para carnívoros da mesma espécie
    }
}

export { RecintosZoo };
