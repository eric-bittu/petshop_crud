import express from 'express'
import db from './db.js'
import upload from './uploadConfig.js'
import fs from 'fs'
import path from 'path'
import authRoutes from './routes/authroutes.js'


const router = express.Router()
router.use(authRoutes)


router.post('/agendamentos', upload.single('image'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem enviada" });
        }

        const { name: nome, raca, data_agendamento, descricao: observacoes } = req.body;
        

        if (!nome || !data_agendamento) {
            return res.status(400).json({ error: "Nome e data são obrigatórios" });
        }

        await db.execute(
            "INSERT INTO agendamento (nome, raca, data_agendamento, observacoes, filename) VALUES (?, ?, ?, ?, ?)",
            [nome, raca, data_agendamento, observacoes, req.file.filename]
        );

        res.status(201).json({ message: "Agendamento criado!" });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

router.get('/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM agendamento WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro interno ao buscar agendamento" });
    }
});
router.get('/agendamentos', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM agendamento");
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ error: "Erro interno ao listar agendamentos" });
    }
});

router.put('/agendamentos/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params
        const { nome, raca, data_agendamento, observacoes } = req.body

        // Buscar agendamento antigo
        const [old] = await db.execute("SELECT filename FROM agendamento WHERE id = ?", [id])
        if (old.length === 0) return res.status(404).json({ error: "Agendamento não encontrado" })
        
        const filename = req.file?.filename || oldFilename
        // Atualizar no banco
        await db.execute(
            "UPDATE agendamento SET nome = ?, raca = ?, data_agendamento = ?, observacoes = ?, filename = ? WHERE id = ?",
            [nome, raca, data_agendamento, observacoes, filename, id]
        )

        // Remover imagem antiga do disco
        fs.unlink(path.join('uploads', old[0].filename), (err) => {
            if (err) console.warn("Erro ao remover imagem antiga:", err)
        })

        res.json({ message: "Agendamento atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params

        // Buscar agendamento
        const [rows] = await db.execute("SELECT filename FROM agendamento WHERE id = ?", [id])
        if (rows.length === 0) return res.status(404).json({ error: "Agendamento não encontrado" })

        // Remover do banco
        await db.execute("DELETE FROM agendamento WHERE id = ?", [id])

        // Remover imagem do disco
        fs.unlink(path.join('uploads', rows[0].filename), (err) => {
            if (err) console.warn("Erro ao remover imagem do disco:", err)
        })

        res.json({ message: "Agendamento excluído com sucesso!" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
