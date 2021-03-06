import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { MovieContext } from "./contexts/MovieContext";
import { UserContext } from "./contexts/UserContext";
import DefaultMoviePoster from "../resources/images/default_movie_poster.jpg";
import Axios from "axios";
import {message} from "antd";

const useCardStyles = makeStyles({
  root: {
    maxWidth: 250,
    margin: 40,
  },
});

const Movie = (props) => {
  const {
    addMovieToWatchList,
    addMovieToWatchListDb,
    getCurrentUser,
  } = useContext(UserContext);
  const {
    movieVideo,
    setMovieVideo,
    setMovieDialogOpenStatus,
    setMovieId,
  } = useContext(MovieContext);
  const cardClasses = useCardStyles();

  useEffect(() => {
    let watchbtn = document.getElementById(props.originalId);
    watchbtn.addEventListener("click", handleOpen);

    function handleOpen() {
      Axios.get(
        `https://api.themoviedb.org/3/movie/${this.id}/videos?api_key=bc3417b21d3ce5c6f51a602d8422eff9&language=en-US`
      ).then((resp) => {
        console.log(movieVideo);
        resp.data.results.length > 0
          ? setMovieVideo(resp.data.results[0].key)
          : setMovieVideo("unknown");
        setMovieDialogOpenStatus(true);
      });
    }
    return () => {
      watchbtn.removeEventListener("click", handleOpen);
    };
  }, [
    movieVideo,
    props.id,
    props.originalId,
    setMovieDialogOpenStatus,
    setMovieVideo,
  ]);

  const clickedOnWatchlistBtn = (event) => {
    if(getCurrentUser()) {
      addMovieToWatchList(event, props);
      addMovieToWatchListDb({
        userId: getCurrentUser().id,
        movieId: props.id,
        token: getCurrentUser().token,
      });
    } else {
      message.warning("You are not logged in!")
    }
  };

  const clickedOnMovieCard = () => {
    setMovieId(props.id);
  };

  return (
    <React.Fragment>
      <Card className={cardClasses.root}>
        <CardActionArea>
          <Link
            to={{
              pathname: `/movie/${props.id}`,
            }}
            onClick={clickedOnMovieCard}
          >
            {props.poster.length > 0 ? (
              <CardMedia
                component="img"
                alt={props.title}
                image={`https://image.tmdb.org/t/p/w500${props.poster}`}
                title={props.title}
              />
            ) : (
              <CardMedia
                component="img"
                alt={props.title}
                image={DefaultMoviePoster}
                title={props.title}
              />
            )}
          </Link>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <LocalActivityIcon></LocalActivityIcon>
              {props.voteAvg}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: "center" }}>
          <Button id={props.originalId} variant="contained" color="default">
            Watch trailer
          </Button>
          <Button
            name={props.title}
            onClick={clickedOnWatchlistBtn}
            variant="contained"
            color="default"
          >
            <PlaylistAddIcon></PlaylistAddIcon>
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

export default Movie;
