package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"unblog/models"
	u "unblog/utils"
)

var GetRating = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	blogname := vars["uid"]
	postTitle := vars["title"]
	rating := &models.RatingDTO{}
	rating.Title = postTitle
	rating.Blogname = blogname
	rating.Username = ""
	u.Respond(w, rating.GetRating())
}
var GetRatingPersonal = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	blogname := vars["uid"]
	postTitle := vars["title"]
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	rating := &models.RatingDTO{}
	rating.Title = postTitle
	rating.Blogname = blogname
	rating.Username = username
	u.Respond(w, rating.GetRating())
}

var Rate = func(w http.ResponseWriter, r *http.Request) {
	rating := &models.RatingDTO{}
	err := json.NewDecoder(r.Body).Decode(rating)
	if err != nil {
		u.Respond(w, u.Message(false, "Error while decoding request body"))
		return
	}
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	rating.Username = username

	u.Respond(w, rating.Rate())
}
