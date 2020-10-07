const express = require('express');
const app = express();
const bodyparser = require('body-parser');
//const db = require('mongodb');  essa linha de código tava dando erro

const ObjectID = require ('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://rodrigo:10051998@cluster0.yrdyp.mongodb.net/CRUD?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
    db = client.db('CRUD')  //tive que declarar o db aqui

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
})

const port = 3000

app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/show', (req, res) => {
    db.collection('Funcionario').find().toArray(
        (err, results) => {
            if (err) return console.log(err)
            console.log(results)
            res.render('show', { data: results })
        }
    )
})
app.post('/show', function (req, res) {
    db.collection('Funcionario').insertOne(req.body, (err, result) => {
        if (err)
            return console.log(err);
        console.log('salvo no banco de dados');
        res.redirect('/show');
    })
})

app.route('/edit/:id').get((req, res) => {
    var id = req.params.id
    db.collection('Funcionario').findObjectId(id).toArray(
        (err, result) => {
            if (err) return console.log(err)
            res.render('edit', { data: result })
        })
})
    .post((req, res) => {
        const id = req.params.id
        const nome = req.body.nome
        const email = req.body.email
        const nascimento = req.body.nascimento
        const telefone = req.body.telefone
        const cpf = req.body.cpf
        const celular = req.body.celular
        const estado = req.body.estado
        const cep = req.body.cep

        db.collection('Funcionario').updateOne(
            {
                _id: ObjectID(id)
            },
            {
                $set: {
                    nome: nome,
                    email: email,
                    nascimento: nascimento,
                    telefone: telefone,
                    cpf: cpf,
                    celular: celular,
                    estado: estado,
                    cep: cep 
                }
            }, (err, result) => {
                if (err) return console.log(err)
                res.redirect('/views/show')
                console.log('Banco atualizado com sucesso!')
            }
        )
    })

app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id
        db.collection('Funcionario').deleteOne(
            {
                _id: ObjectID(id)
            },
            (err, result) => {
                if (err) return console.log(err)
                console.log('Valor removido com sucesso!')
                res.redirect('/views/show')
            }
        )
    })