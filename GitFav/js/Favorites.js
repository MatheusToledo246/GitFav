import { GithubUser } from "./GithubUser.js"

export class Favorites {

    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    checkUser() {
        const hide = this.root.querySelector(".backgroundStar")
        
        if (this.entries.length === 0) {
            hide.classList.remove("hidden")
        } else {
            hide.classList.add("hidden")
        }
      }

    load() {
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário ja cadastrado')
            }

            const user = await GithubUser.search(username)
            
            
            if(user.login === undefined) {
                throw new Error('Usúario não encontrado!')
            }   

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => 
            entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
        this.checkUser()
    }
}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

       this.update()
       this.onadd()
    }
    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
    

            this.add(value)
        }

        
    }

    update() {
       this.removeAllTr()
      
      this.entries.forEach( user => {
        const row = this.createRow()


        row.querySelector('.user img').src = `https://github.com//${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha?')
            if(isOk) {
                this.delete(user)
            }
        }

        
        this.tbody.append(row)
        this.checkUser()
    })
    
}

    createRow() {
        const tr = document.createElement('tr')


        const content = `
        <td class="user">
            <img src="https://github.com/matheustoledo246.png" alt="Imagem de Matheus Toledo">
            <a href="https://github.com/matheustoledo246">
                <p>Matheus Toledo</p>
                <span>/matheustoledo246</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            54464
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
     `

     tr.innerHTML = content

     return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tbody tr').forEach((tr) => {
            tr.remove()
        })
    }

    

}

