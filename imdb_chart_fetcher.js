const cheerio = require('cheerio')
const fetch = require('isomorphic-unfetch')



const chart_url = process.argv[2]
const items_count=process.argv[3]
const Ids = []
const movies = []
const movieUrl = 'https://www.imdb.com/title/'

allMovies()

async function allMovies(){
     await searchMovies()
     for(var i=1;i<=Ids.length;i++){
        await searchMoviesDetails(Ids[i],i)
        if(i==items_count){
            return movies
        }
        
     }
     getDetails()
}

function getDetails(){
    console.log(movies);
}

function searchMovies(){
    return fetch(chart_url)
    .then(response => response.text())
    .then(body=>{
        const $ = cheerio.load(body)
        $('tr').each(function(i,element){

            const $element = $(element)
            const $imdbID = $element.find('.wlb_ribbon')
            var ID = $imdbID.attr('data-tconst')
            Ids[i]=ID              
        })
        return Ids
        
    }) 
    
}


function searchMoviesDetails(imdbID,i){
    
    return fetch(`${movieUrl}${imdbID}`)
    .then(response=> response.text())
    .then(body=>{
        const $ = cheerio.load(body)
        const $title = $('.cMYixt h1')
        const title = $title.first().contents().filter(function(){
                return this.type === 'text'
            }).text()
        const $year = $('.kqWovI').first()
        const year = $year.text().slice(0,4)
        const $rating = $('.jGRxWM')
        const rating = $rating.first().contents().filter(function(){
                return this.type === 'text'
            }).text()
        const $summary = $('.kgphFu')
        const summary = $summary.first().contents().filter(function(){
                return this.type === 'text'
            }).text()
        const $duration = $('.ipc-inline-list__item').map(function(){
            return $(this).text()
        }).get()
        const duration = $duration[5]
        const $genre = $('.ipc-chip-list')
        const genre = $genre.text().split(/(?=[A-Z])/)
        const movie = {
            title: title,
            year: year,
            imdb_rating: rating,
            summary:summary,
            duration:duration,
            genre:genre
            
        }
        movies[i]=movie
        if(i==items_count){

            console.log(movies);
        }
       
    })
   
}


