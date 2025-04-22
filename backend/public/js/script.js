document.addEventListener('DOMContentLoaded', function() {
    const API_URL = "http://localhost:3000/api/agendamentos";
    const uploadForm = document.getElementById('uploadForm');
    const gallery = document.getElementById('gallery');

    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const formData = new FormData(uploadForm);
            const imageId = document.getElementById('imageId').value;

            // Verifica se há imagem (exceto em atualizações)
            if (!imageId && !uploadForm.elements.image.files[0]) {
                throw new Error('Selecione uma imagem!');
            }

            const method = imageId ? 'PUT' : 'POST';
            const url = imageId ? `${API_URL}/${imageId}` : API_URL;

            const response = await fetch(url, {
                method,
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar agendamento');
            }

            alert(imageId ? 'Agendamento atualizado!' : 'Agendamento criado!');
            uploadForm.reset();
            loadAgendamentos();
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Imagem';
        }
    });

    async function loadAgendamentos() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao carregar agendamentos');
            }

            renderGallery(data);
        } catch (error) {
            console.error('Erro ao carregar:', error);
            gallery.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    function renderGallery(agendamentos) {
        gallery.innerHTML = agendamentos.map(agendamento => `
            <div class="card">
                <img src="/uploads/${agendamento.filename}" alt="${agendamento.nome}">
                <div>
                    <h3>${agendamento.nome}</h3>
                    <p>Raça: ${agendamento.raca}</p>
                    <p>Data: ${new Date(agendamento.data_agendamento).toLocaleString()}</p>
                    <p>${agendamento.observacoes}</p>
                    <div class="button-group">
                        <button onclick="editAgendamento('${agendamento.id}')">Editar</button>
                        <button onclick="deleteAgendamento('${agendamento.id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.editAgendamento = async function(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao carregar agendamento');
            }

            // Preenche o formulário
            document.getElementById('name').value = data.nome;
            document.getElementById('raca').value = data.raca;
            document.getElementById('descricao').value = data.observacoes;
            document.getElementById('imageId').value = data.id;
            
            // Formata data
            const date = new Date(data.data_agendamento);
            document.querySelector('input[name="data_agendamento"]').value = 
                date.toISOString().slice(0, 16);
            
            alert('Edite os dados e clique em Enviar');
        } catch (error) {
            console.error('Erro ao editar:', error);
            alert(error.message);
        }
    };

    window.deleteAgendamento = async function(id) {
        if (!confirm('Confirmar exclusão?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao excluir');
            }

            alert('Excluído com sucesso!');
            loadAgendamentos();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert(error.message);
        }
    };

    // Carrega inicialmente
    loadAgendamentos();
    
});
function logout() {
    window.location.href = '/login.html'   
  }
  