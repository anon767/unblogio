package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"unblog/models"
	u "unblog/utils"
)

var Comment = func(w http.ResponseWriter, r *http.Request) {
	comment := &models.Comment{}
	err := json.NewDecoder(r.Body).Decode(comment)
	if err != nil {
		u.Respond(w, u.Message(false, "Error while decoding request body"))
		return
	}
	username := models.GetUser(r.Context().Value("user").(uint)).Username
	comment.Username = username
	comment.Likes = 0
	u.Respond(w, comment.Comment())
}

var GetAllComments = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	title := vars["title"]
	blogname := vars["uid"]
	post := models.GetPost(blogname, title)
	resp := u.Message(true, "success")
	resp["data"] = models.GetComments(post)
	u.Respond(w, resp)
}

var Like = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	comment := vars["id"]
	resp := u.Message(models.Like(comment), "")
	u.Respond(w, resp)
}
