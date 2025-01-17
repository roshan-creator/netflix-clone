import React, { useState, useEffect } from "react";
import axios from './axios';
import './Row.css';
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }){
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        //if [] ,run once when the row loads, and don't run again
        async function fetchData(){
            const request = await axios.get(fetchUrl); //complete movie url
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl]);


    const handleClick = (movie) => {
        if (trailerUrl) {
          setTrailerUrl("");
        } else {
          movieTrailer(movie?.name || "")
            .then((url) => {
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get("v"));
            })
            .catch((e) => console.log(e));
        }
    };
    
    console.table(movies);

    const opts = {
        height: "390",
        width: "100%",
        playerVars:{
            //
            autoplay: 1,
        },
    };

    return (
        <div className="row">
            <h2>{title}</h2>
            
            <div className={`row__posters ${isLargeRow} && row__posterLarge `}>
                {movies.map(movie =>(
                   <img
                    key={movie.id}
                    onClick={() => handleClick(movie)} 
                    className="row__poster"
                    src={`${base_url}${ isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} 
                    />  
                ))}

            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

        </div>

    )
}

export default Row