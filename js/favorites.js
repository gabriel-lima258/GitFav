import { GitHubUser } from './GitHubUser.js'

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('github-favorites:')) || []
    }

    save() {
        localStorage.setItem('github-favorites:' , JSON.stringify(this.entries))
    }

    async add(username) {

        try {
            const existUser = this.entries.find(entry => entry.login === username)

            if(existUser) {
                throw new Error('Usuário já cadastrado!')
            }

            const user = await GitHubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }

        catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const removeEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = removeEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const favoriteBt = this.root.querySelector('.search')

        window.document.onkeyup = event => {
            if(event.key === "Enter"){ 
              const { value } = this.root.querySelector('.search input')
              this.add(value)
            }
        }

        favoriteBt.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {

        this.emptyState()
        
        this.removeAllUser()
        
        this.entries.forEach( user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.remove').onclick = () => {
                const isConfirm = confirm('Deseja mesmo remover este usuário?')
                if(isConfirm) {
                    this.delete(user)
                }
            }
            
            this.tbody.append(row)
        })
        
    }

    createRow() {
        
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/gabriel-lima258.png" alt="imagem de gabriel">
            <a href="https://github.com/gabriel-lima258">
                <p>Gabriel Lima</p>
                <span>gabriel-lima258</span>
            </a>
        </td>
        <td class="repositories">
            100
        </td>
        <td class="followers">
            2432
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
        `

        return tr
    }

    removeAllUser() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

    emptyState() {
        if (this.entries.length === 0) {
            this.root.querySelector('.empty-block').classList.remove('hide')
        } else {
            this.root.querySelector('.empty-block').classList.add('hide')
        }
    }

    clearMessage() {

    }

}

