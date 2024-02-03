let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "pt-BR"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language=en-US`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language==en-US`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                        
                    let tags = '';
    
                    datos.genres.forEach(genre => {
                        if (genre.name != datos.genres[datos.genres.length - 1].name) {
                            tags += `${genre.name}, `
                        } else {
                            tags += datos.genres[datos.genres.length - 1].name
                        }
                    });

                    let creators = '';
    
                    datos.created_by.forEach((creator, i) => {
                        if (i == datos.created_by.length - 1){
                            creators += creator.name
                        } else{
                            creators += `${creator.name}, `

                        }
                    });
    
                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
                        <li>
                            <a href="#!" class="episode">
                                <div class="episode__img">
                                    <img src="https://image.tmdb.org/t/p/w300/${episode.still_path}" onerror="this.style='display:none';">
                                    <div class="episode__no-image"><i class="fa-regular fa-circle-play"></i></div>
                                </div>
                                <div class="epsiode__info">
                                    <h4 class="episode__info__title">${episode.episode_number}. ${episode.name}</h4>
                                    <div class="episode__info__duration">${runtime}</div>
                                </div>
                            </a>
                        </li>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = `    
<div data-post-type="serie" hidden>
  <img src="https://image.tmdb.org/t/p/w500/${datos.poster_path}" />
  <p id="tmdb-synopsis">${datos.overview}</p>
</div>
<!--more-->

<!-- Karasu.builder@v1.1/©karasu-themes -->
<div class="headline is-small mb-4">
  <h2 class="headline__title">Information</h2>
</div>

<!-- Do not touch any of the data attributes unless you know what you're doing! -->
<ul class="post-details mb-4"  data-youtube-id='trailerId)'  data-backdrop="https://image.tmdb.org/t/p/w1280/${datos.backdrop_path}" data-imdb="${datos.vote_average.toFixed(1)}">
  <li data="${datos.name}"><span>Title</span>${datos.name}</li>
  <li data-duartion="N/A"><span>Runtime</span>N/A</li>
  <li data-year="${datos.first_air_date.slice(0,4)}"><span>Ano</span>${datos.first_air_date.slice(0,4)}</li>
  <li data-duartion="${datos.id}"><span>Id Serie</span>${datos.id}</li>
  <li data-genres="${tags}"><span>Genero</span>${tags}</li>
  
</ul>


<!-- Add additional code on the next line -->

                    `;
                    
                    let seasonOnly = `
                    <ul class="caps-grid hide" id="season-${seasonNumber}">
                    ${episodeList}
                    </ul>
    
    
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    console.log(justHtml, typeof justHtml)
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=6d9fd0eceda02898513c9454f0b94ccf&language=en-US`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                console.log(datos);


                let tags = '';

                datos.genres.forEach(genre => {
                    if (genre.name != datos.genres[datos.genres.length - 1].name) {
                        tags += `${genre.name}, `
                    } else {
                        tags += datos.genres[datos.genres.length - 1].name
                    }
                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<div data-post-type="movie" hidden>
  <img src="https://image.tmdb.org/t/p/w300/${datos.poster_path}" />
  <p id="tmdb-synopsis">${datos.overview}</p>
</div>

<!-- meusite.org@templateina -->
<div class="headline is-small mb-4">
  <h2 class="headline__title">Informação</h2>
</div>
<!-- Do not touch any of the data attributes unless you know what you're doing! -->
<ul class="post-details mb-4" data-backdrop="https://image.tmdb.org/t/p/w1280/${datos.backdrop_path}" data-player-backdrop="https://image.tmdb.org/t/p/w1280/${datos.backdrop_path}" data-imdb="${datos.vote_average.toFixed(1)}">
  <li data="${datos.title}"><span>Título</span>${datos.title}</li>
  <li data-original-title="${datos.original_title}"><span>Título original</span>${datos.original_title}</li>
  <li data-duartion="${convertMinutes(datos.runtime)}"><span>Duração</span>${convertMinutes(datos.runtime)}</li>
  <li data-year="${datos.release_date.slice(0,4)}"><span>Ano</span>${datos.release_date.slice(0,4)}</li>
  <li data-release-data="${datos.release_date}"><span>Data de Lançamento:</span>${datos.release_date}</li>
  <li data-genres="${tags}"><span>Géneros</span>${tags}</li>
</ul>
 

<div class="plyer-node"></div>
<script>
const _SV_LINKS = [
{
lang: "IDIOMA",
name: "PLAYER 1",
quality: "",
url: "Player",
tagVideo: false,
},
]
</script>
`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



