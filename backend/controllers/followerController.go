package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"unblog/models"
	u "unblog/utils"
)

var GetFollower = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	blogname := vars["id"]
	u.Respond(w, models.GetFollower(blogname, ""))
}
var GetFollowerPersonal = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	blogname := vars["id"]
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	u.Respond(w, models.GetFollower(blogname, username))
}

var Follow = func(w http.ResponseWriter, r *http.Request) {
	follow := &models.Follower{}
	vars := mux.Vars(r)
	blogname := vars["id"]
	err := json.NewDecoder(r.Body).Decode(follow)
	if err != nil {
		u.Respond(w, u.Message(false, "Error while decoding request body"))
		return
	}
	if len(follow.Username) <= 1 || len(follow.Blogname) <= 1 {
		u.Respond(w, u.Message(false, "Username and Blogname cannot be empty"))
		return
	}
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	follow.Username = username
	follow.Blogname = blogname
	u.Respond(w, follow.Follow())
}
