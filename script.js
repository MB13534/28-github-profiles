const APIURL = 'https://api.github.com/users/'

form = document.getElementById('form');
search = document.getElementById('search');
main = document.getElementById('main');

async function getUser(username) {
    try {
        const { data } = await axios.get(APIURL + username);
        createUserCard(data);
        getRepos(username, data.name)
    } catch(err){
        if(err.response.status == 404){
            createErrorCard('No profile with this user name was found');
        }
    }  
    
}

async function getRepos(username){
    try {
        const { data } = await axios.get(APIURL + username + '/repos');
        addReposToCard(data)
            } catch(err){
        if(err){
            createErrorCard('Problem fetching repos');
        }
    }  
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos.slice(0,10)
    .forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;

        reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = '';
    }
    
})

function createUserCard(user) {
    const cardHTML = `
    <div class="card" id="${user.name}">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>
            ${user.bio}
          </p>

          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div id="repos">

          </div>
        </div>
      </div>
    `
    main.innerHTML = cardHTML;
}

function createErrorCard(m) {
    const cardHTML = `
    <div class='card'>
    <h1>${m}</h1>
    </div>
    `
    main.innerHTML = cardHTML;
}